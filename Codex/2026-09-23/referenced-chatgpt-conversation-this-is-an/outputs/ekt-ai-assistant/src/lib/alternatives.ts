import { AlternativeProduct, ProductDetails } from "./types";

export function buildAlternativeSummary(product: AlternativeProduct | ProductDetails): string {
  const price = product.price === null ? "цена уточняется" : `${product.price.toLocaleString("ru-RU")} ₸`;
  const quantityText = product.quantity !== null && product.quantity > 0
    ? `В наличии: ${product.quantity} шт.`
    : "Количество уточняйте у менеджера.";

  const reason = product.reason || "Близкий по назначению вариант; перед покупкой проверьте критичные характеристики.";

  return `${product.name}${product.article ? ` (${product.article})` : ""} — ${price}. ${reason} ${quantityText}`;
}
