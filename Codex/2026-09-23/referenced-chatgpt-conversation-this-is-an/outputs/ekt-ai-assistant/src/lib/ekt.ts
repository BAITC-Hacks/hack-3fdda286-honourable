import "server-only";
import { ProductDetails, ProductSummary } from "./types";

const API_ROOT = "https://ekt.kz/api/products";
const cache = new Map<number, { expires: number; items: ProductSummary[] }>();

function credentials() {
  const user = process.env.EKT_API_USER;
  const password = process.env.EKT_API_PASSWORD;
  if (!user || !password) throw new Error("Не настроены EKT_API_USER и EKT_API_PASSWORD.");
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

async function ektFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { Authorization: credentials(), Accept: "application/json" },
    next: { revalidate: 120 }
  });
  if (!response.ok) throw new Error(`Каталог ekt.kz недоступен: ${response.status}.`);
  return response.json() as Promise<T>;
}

function summary(raw: Record<string, unknown>): ProductSummary {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? "Без названия"),
    article: raw.article ? String(raw.article) : null,
    price: typeof raw.price === "number" ? raw.price : null,
    image: typeof raw.image === "string" ? raw.image : null,
    url: typeof raw.url === "string" ? raw.url : null
  };
}

export async function getCatalogPage(page = 1) {
  const saved = cache.get(page);
  if (saved && saved.expires > Date.now()) return saved.items;
  const raw = await ektFetch<{ items?: Record<string, unknown>[] }>(page > 1 ? `?page=${page}` : "");
  const items = (raw.items ?? []).map(summary);
  cache.set(page, { items, expires: Date.now() + 120_000 });
  return items;
}

export async function searchProducts(query: string, limit = 3): Promise<ProductSummary[]> {
  const normalized = query.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  if (!normalized) return [];
  const words = normalized.split(/\s+/).filter((word) => word.length > 1);
  const pages = Math.min(Math.max(Number(process.env.EKT_MAX_PAGES ?? 8), 1), 25);
  const batches = await Promise.all(Array.from({ length: pages }, (_, index) => getCatalogPage(index + 1)));
  const all = batches.flat();
  return all
    .map((item) => {
      const haystack = `${item.article ?? ""} ${item.name}`.toLowerCase();
      const exact = haystack.includes(normalized) ? 20 : 0;
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 3 : 0), 0) + exact;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export async function getProductDetails(id: number): Promise<ProductDetails> {
  const raw = await ektFetch<Record<string, unknown>>(`/detail?id=${encodeURIComponent(id)}`);
  const base = summary(raw);
  const storesRaw = Array.isArray(raw.stores) ? raw.stores : [];
  return {
    ...base,
    description: typeof raw.description === "string" ? raw.description : null,
    quantity: typeof raw.quantity === "number" ? raw.quantity : null,
    stores: storesRaw.map((store) => {
      const value = store as Record<string, unknown>;
      return { id: Number(value.id), name: String(value.name ?? "Склад"), quantity: Number(value.quantity ?? 0) };
    }),
    properties: raw.properties && typeof raw.properties === "object" ? raw.properties as Record<string, unknown> : {}
  };
}

export async function findAnalogs(productId: number) {
  const source = await getProductDetails(productId);
  const terms = source.name.toLowerCase().split(/[^\p{L}\p{N}]+/gu).filter((term) => term.length > 3).slice(0, 4);
  const candidates = await searchProducts(terms.join(" "), 8);
  const details = await Promise.all(candidates.filter((item) => item.id !== productId).map((item) => getProductDetails(item.id)));

  return details
    .filter((item) => (item.quantity ?? 0) > 0)
    .slice(0, 3)
    .map((item) => ({
      ...item,
      reason: `Близкий по назначению вариант: по названию и техническим параметрам совпадает с ${source.name}. Проверьте критические характеристики перед покупкой.`
    }));
}

export const purchaseTerms = {
  text: "Для физлиц доступны оплата картой онлайн, наличными при получении и оплата при самовывозе. Для юрлиц — оплата по счёту или наличными при самовывозе. По Алматы доставка согласованного товара обычно выполняется в течение 48 часов; для других городов срок и стоимость согласовываются с менеджером. Минимальную партию уточните у менеджера.",
  source: "https://ekt.kz/checkout-delivery/"
};
