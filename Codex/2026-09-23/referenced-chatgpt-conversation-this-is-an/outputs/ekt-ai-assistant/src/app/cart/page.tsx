"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = { id: number; name: string; article: string | null; price: number | null; image: string | null; quantity: number };
const CART_KEY = "ekt-demo-cart-v1";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(JSON.parse(localStorage.getItem(CART_KEY) || "[]")), []);

  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eff8f0,#edf2ee_35%,#e7efe8_100%)]">
      <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-pill rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">EKT</span>
            <span className="text-lg font-black text-emerald-900">ЭЛЕКТРОКОМПЛЕКТ</span>
          </Link>
          <span className="text-sm text-slate-500">Демонстрационная корзина</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Корзина</h1>

        {!items.length ? (
          <div className="mt-6 rounded-[28px] border border-emerald-100 bg-white/80 p-8 text-center shadow-sm">
            <p className="text-slate-500">Корзина пока пуста.</p>
            <Link href="/" className="mt-5 inline-block rounded-full bg-emerald-700 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-900/10">
              Продолжить покупки
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map((item) => (
                <article className="flex items-center gap-4 rounded-[24px] border border-emerald-100 bg-white/85 p-4 shadow-sm" key={item.id}>
                  {item.image && <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl border border-emerald-100 bg-emerald-50 object-contain p-2" />}
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Арт.: {item.article || "не указан"} · {item.quantity} шт.</p>
                  </div>
                  <p className="text-lg font-black text-emerald-800">{((item.price ?? 0) * item.quantity).toLocaleString("ru-RU")} ₸</p>
                </article>
              ))}
            </div>

            <div className="cart-summary mt-6 flex items-center justify-between rounded-[28px] p-5 text-white shadow-lg shadow-emerald-900/10">
              <span className="font-semibold">Итого</span>
              <span className="text-2xl font-black">{total.toLocaleString("ru-RU")} ₸</span>
            </div>

            <Link href="/" className="mt-5 inline-block text-sm font-bold uppercase tracking-[0.12em] text-emerald-800 underline-offset-4 hover:underline">
              Продолжить покупки
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
