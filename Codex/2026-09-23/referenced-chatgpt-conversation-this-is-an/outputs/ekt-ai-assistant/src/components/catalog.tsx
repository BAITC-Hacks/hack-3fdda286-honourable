"use client";

import { useEffect, useState } from "react";
import { ProductSummary } from "@/lib/types";
import { ProductCard } from "./product-card";

export function Catalog() {
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/catalog")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        setItems(body.items);
      })
      .catch((cause) => setError(cause.message));
  }, []);

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Каталог EKT</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Популярные товары</h2>
        </div>
        <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          Данные из API ekt.kz
        </span>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Каталог временно недоступен: {error}
        </div>
      )}

      {!error && !items.length && (
        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 text-center text-slate-500 shadow-sm">
          Загружаем товары…
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 8).map((item) => (
          <ProductCard product={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
