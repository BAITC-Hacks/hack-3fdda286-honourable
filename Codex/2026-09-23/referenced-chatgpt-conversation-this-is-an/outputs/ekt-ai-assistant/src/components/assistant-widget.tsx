"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CartOffer, ChatResult, ProductSummary } from "@/lib/types";
import { ProductCard } from "./product-card";

type CartItem = { id: number; name: string; article: string | null; price: number | null; image: string | null; quantity: number };
type Message = { role: "assistant" | "user"; text: string; products?: ProductSummary[]; offer?: CartOffer };
const CART_KEY = "ekt-demo-cart-v1";

function addItem(item: CartItem) {
  const current: CartItem[] = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const exists = current.find((entry) => entry.id === item.id);
  if (exists) exists.quantity += item.quantity; else current.push(item);
  localStorage.setItem(CART_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("cart-updated"));
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Здравствуйте! Помогу найти товар, проверить наличие, подобрать аналог и собрать демонстрационную корзину." }]);
  const confirmed = useRef(new Set<string>());

  async function submit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    setMessages((list) => [...list, { role: "user", text: message }]); setInput(""); setBusy(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const body = await response.json() as ChatResult & { error?: string };
      if (!response.ok) throw new Error(body.error || "Не удалось получить ответ.");
      setMessages((list) => [...list, { role: "assistant", text: body.reply, products: body.products, offer: body.offer }]);
    } catch (error) { setMessages((list) => [...list, { role: "assistant", text: error instanceof Error ? error.message : "Попробуйте ещё раз." }]); }
    finally { setBusy(false); }
  }

  async function confirm(offer: CartOffer) {
    if (confirmed.current.has(offer.id)) return;
    confirmed.current.add(offer.id);
    try {
      const response = await fetch("/api/cart/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(offer) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Не удалось подтвердить наличие.");
      addItem(body.item);
      setMessages((list) => [...list, { role: "assistant", text: `Готово: ${body.item.name} — ${body.item.quantity} шт. добавлено в демонстрационную корзину.` }]);
    } catch (error) {
      confirmed.current.delete(offer.id);
      setMessages((list) => [...list, { role: "assistant", text: error instanceof Error ? error.message : "Добавление не выполнено." }]);
    }
  }

  return <>
    <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-700 px-5 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-emerald-800" aria-label="Открыть ИИ-помощника">✦ Спросить ИИ</button>
    {open && <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/20 p-3 sm:p-5" onClick={() => setOpen(false)}>
      <section onClick={(event) => event.stopPropagation()} className="flex h-[min(720px,calc(100vh-24px))] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-emerald-700 px-5 py-4 text-white"><div><p className="font-bold">EKT AI-консультант</p><p className="text-xs text-emerald-100">Каталог и остатки — из ekt.kz</p></div><button onClick={() => setOpen(false)} className="text-2xl leading-none" aria-label="Закрыть">×</button></header>
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">{messages.map((message, index) => <div key={index} className={message.role === "user" ? "ml-10" : "mr-4"}>
          <p className={`rounded-2xl px-4 py-3 text-sm leading-5 ${message.role === "user" ? "bg-emerald-700 text-white" : "bg-white text-slate-700 shadow-sm"}`}>{message.text}</p>
          {message.products?.map((product) => <div className="mt-2" key={product.id}><ProductCard product={product} compact /></div>)}
          {message.offer && <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950"><p className="font-bold">Подтверждение добавления</p><p className="mt-1">{message.offer.name}</p><p>{message.offer.requestedQuantity} шт. · {message.offer.price?.toLocaleString("ru-RU") ?? "Цена по запросу"} ₸ · доступно: {message.offer.availableQuantity ?? "уточняется"}</p><button onClick={() => confirm(message.offer!)} className="mt-3 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Подтвердить добавление</button></div>}
        </div>)}{busy && <p className="w-fit rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">Проверяю каталог…</p>}</div>
        <form onSubmit={submit} className="flex gap-2 border-t border-slate-200 p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Например: есть ли 027228?" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-emerald-600"/><button disabled={busy} className="rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-50">Отправить</button></form>
        <div className="px-4 pb-3 text-center"><Link href="/cart" className="text-xs font-semibold text-emerald-700 underline">Открыть демонстрационную корзину</Link></div>
      </section>
    </div>}
  </>;
}
