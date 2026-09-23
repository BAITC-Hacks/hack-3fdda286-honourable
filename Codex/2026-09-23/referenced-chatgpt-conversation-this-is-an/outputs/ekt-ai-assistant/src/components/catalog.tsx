"use client";

import { useEffect, useState } from "react";
import { ProductSummary } from "@/lib/types";
import { ProductCard } from "./product-card";

export function Catalog() {
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/catalog").then(async (response) => {
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setItems(body.items);
  }).catch((cause) => setError(cause.message)); }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Каталог EKT</p><h2 className="mt-1 text-2xl font-bold">Популярные товары</h2></div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Данные из API ekt.kz</span>
      </div>
      {error && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Каталог временно недоступен: {error}</p>}
      {!error && !items.length && <p className="py-12 text-center text-slate-500">Загружаем товары…</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.slice(0, 8).map((item) => <ProductCard product={item} key={item.id} />)}</div>
    </section>
  );
}
