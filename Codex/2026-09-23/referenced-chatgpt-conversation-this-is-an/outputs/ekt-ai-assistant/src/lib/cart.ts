import { CartOffer } from "./types";

export async function verifyCartOffer(offer: CartOffer) {
  const { getProductDetails } = await import("./ekt");
  const product = await getProductDetails(offer.productId);
  const available = product.quantity;
  if (available === null) return { ok: false as const, message: "Остаток товара сейчас не указан, поэтому добавление остановлено." };
  if (offer.requestedQuantity > available) return { ok: false as const, message: `Доступно только ${available} шт. Подтвердите новое количество.` };
  return { ok: true as const, product, quantity: offer.requestedQuantity };
}
