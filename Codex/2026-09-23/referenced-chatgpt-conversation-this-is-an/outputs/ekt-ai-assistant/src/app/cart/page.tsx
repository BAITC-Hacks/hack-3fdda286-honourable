"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = { id: number; name: string; article: string | null; price: number | null; image: string | null; quantity: number };
const CART_KEY = "ekt-demo-cart-v1";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(JSON.parse(localStorage.getItem(CART_KEY) || "[]")), []);
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  return <main className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><Link href="/" className="text-lg font-black text-emerald-800">ЭЛЕКТРОКОМПЛЕКТ · демо</Link><span className="text-sm text-slate-500">Демонстрационная корзина</span></div></header><section className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-3xl font-black">Корзина</h1>{!items.length ? <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm"><p className="text-slate-500">Корзина пока пуста.</p><Link href="/" className="mt-4 inline-block rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white">Продолжить покупки</Link></div> : <><div className="mt-6 space-y-3">{items.map((item) => <article className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm" key={item.id}>{item.image && <img src={item.image} alt="" className="h-16 w-16 rounded-xl object-contain"/>}<div className="flex-1"><p className="font-bold">{item.name}</p><p className="text-sm text-slate-500">Арт.: {item.article || "не указан"} · {item.quantity} шт.</p></div><p className="font-bold text-emerald-700">{((item.price ?? 0) * item.quantity).toLocaleString("ru-RU")} ₸</p></article>)}</div><div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-950 p-5 text-white"><span className="font-semibold">Итого</span><span className="text-2xl font-black">{total.toLocaleString("ru-RU")} ₸</span></div><Link href="/" className="mt-5 inline-block font-bold text-emerald-700 underline">Продолжить покупки</Link></>}</section></main>;
}
