import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { findAnalogs, getProductDetails, purchaseTerms, searchProducts } from "@/lib/ekt";
import { CartOffer, ProductSummary } from "@/lib/types";

const instructions = `Ты — консультант EKT для электротехнического каталога. Отвечай на русском, кратко и дружелюбно. Для данных товара всегда вызывай инструменты. Не выдумывай цену, наличие, характеристики, сертификат или совместимость. Если товар отсутствует, предложи кандидатов-аналогов с предупреждением о проверке технических параметров. Никогда не сообщай, что товар добавлен в корзину: вызови prepare_cart_offer, чтобы пользователь отдельно подтвердил действие. При противоречии характеристик и названия предупреди пользователя.`;

const tools: OpenAI.Responses.FunctionTool[] = [
  { type: "function", name: "search_products", description: "Найти до трёх товаров по артикулу, названию или ключевым словам.", strict: true, parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false } },
  { type: "function", name: "get_product_details", description: "Получить актуальную цену, остаток и характеристики товара по внутреннему ID.", strict: true, parameters: { type: "object", properties: { id: { type: "integer" } }, required: ["id"], additionalProperties: false } },
  { type: "function", name: "find_analogs", description: "Найти кандидатов-аналогов в наличии для товара с отсутствующим остатком.", strict: true, parameters: { type: "object", properties: { productId: { type: "integer" } }, required: ["productId"], additionalProperties: false } },
  { type: "function", name: "get_purchase_terms", description: "Получить проверенную справку об оплате, доставке и минимальной партии.", strict: true, parameters: { type: "object", properties: {}, required: [], additionalProperties: false } },
  { type: "function", name: "prepare_cart_offer", description: "Подготовить предложение добавить конкретное количество товара. Не добавляет его в корзину.", strict: true, parameters: { type: "object", properties: { productId: { type: "integer" }, quantity: { type: "integer" } }, required: ["productId", "quantity"], additionalProperties: false } }
];

function makeOffer(product: Awaited<ReturnType<typeof getProductDetails>>, quantity: number): CartOffer | null {
  if (!Number.isInteger(quantity) || quantity < 1) return null;
  if (product.quantity !== null && quantity > product.quantity) return null;
  return { id: crypto.randomUUID(), productId: product.id, name: product.name, article: product.article, price: product.price, requestedQuantity: quantity, availableQuantity: product.quantity, image: product.image };
}

async function runTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "search_products": return { result: await searchProducts(String(args.query)), products: await searchProducts(String(args.query)) };
    case "get_product_details": {
      const product = await getProductDetails(Number(args.id));
      return { result: product, products: [product] };
    }
    case "find_analogs": {
      const products = await findAnalogs(Number(args.productId));
      return { result: products, products };
    }
    case "get_purchase_terms": return { result: purchaseTerms, products: [] as ProductSummary[] };
    case "prepare_cart_offer": {
      const product = await getProductDetails(Number(args.productId));
      const offer = makeOffer(product, Number(args.quantity));
      const error = product.quantity !== null && Number(args.quantity) > product.quantity
        ? `Доступно только ${product.quantity} шт. Запросите новое количество.`
        : "Количество должно быть положительным целым числом.";
      return { result: offer ?? { error }, offer, products: [product] };
    }
    default: return { result: { error: "Неизвестный инструмент." }, products: [] as ProductSummary[] };
  }
}

async function fallback(message: string) {
  const lower = message.toLowerCase();
  if (/достав|оплат|самовывоз|минимальн/.test(lower)) return { reply: `${purchaseTerms.text} Источник: ${purchaseTerms.source}`, products: [] as ProductSummary[] };
  const quantity = Number(lower.match(/\b(\d+)\s*(шт|штук|шт\.)?/u)?.[1] ?? 1);
  const products = await searchProducts(message);
  if (!products.length) return { reply: "Я не нашёл товар в загруженной части каталога. Укажите артикул или точное название.", products };
  const product = await getProductDetails(products[0].id);
  if (/добав|корзин|положи/.test(lower)) {
    const offer = makeOffer(product, quantity);
    return { reply: offer ? `Подготовил предложение: ${product.name}, ${quantity} шт. Подтвердите добавление кнопкой ниже.` : "Укажите корректное количество.", products: [product], offer };
  }
  const availability = product.quantity === null ? "остаток не указан" : product.quantity > 0 ? `в наличии: ${product.quantity} шт.` : "сейчас нет в наличии";
  return { reply: `${product.name}. Цена: ${product.price?.toLocaleString("ru-RU") ?? "не указана"} ₸; ${availability}. Откройте карточку ниже для характеристик.`, products: [product] };
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json() as { message?: string };
    if (!message?.trim()) return NextResponse.json({ error: "Введите сообщение." }, { status: 400 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json(await fallback(message));

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let response = await client.responses.create({ model: "gpt-4.1-mini", instructions, input: message, tools, parallel_tool_calls: false, store: false });
    const shown = new Map<number, ProductSummary>();
    let offer: CartOffer | undefined;
    for (let round = 0; round < 4; round += 1) {
      const calls = response.output.filter((item) => item.type === "function_call");
      if (!calls.length) break;
      const outputs = [];
      for (const call of calls) {
        const tool = await runTool(call.name, JSON.parse(call.arguments) as Record<string, unknown>);
        tool.products.forEach((product) => shown.set(product.id, product));
        if (tool.offer) offer = tool.offer;
        outputs.push({ type: "function_call_output" as const, call_id: call.call_id, output: JSON.stringify(tool.result) });
      }
      response = await client.responses.create({ model: "gpt-4.1-mini", previous_response_id: response.id, input: outputs, tools, parallel_tool_calls: false, store: false });
    }
    return NextResponse.json({ reply: response.output_text || "Я подготовил данные по вашему запросу.", products: [...shown.values()].slice(0, 3), offer });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка ИИ-помощника." }, { status: 500 });
  }
}
