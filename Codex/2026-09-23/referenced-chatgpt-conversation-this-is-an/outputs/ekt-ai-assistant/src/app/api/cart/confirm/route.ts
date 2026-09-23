import { NextRequest, NextResponse } from "next/server";
import { verifyCartOffer } from "@/lib/cart";
import { CartOffer } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const offer = await request.json() as CartOffer;
    if (!offer || !Number.isInteger(offer.productId) || !Number.isInteger(offer.requestedQuantity) || offer.requestedQuantity < 1) {
      return NextResponse.json({ error: "Некорректное предложение корзины." }, { status: 400 });
    }
    const verified = await verifyCartOffer(offer);
    if (!verified.ok) return NextResponse.json(verified, { status: 409 });
    return NextResponse.json({ ok: true, item: {
      id: verified.product.id,
      name: verified.product.name,
      article: verified.product.article,
      price: verified.product.price,
      image: verified.product.image,
      quantity: verified.quantity
    } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Не удалось подтвердить товар." }, { status: 500 });
  }
}
