"use client";

import { ProductDetails, ProductSummary } from "@/lib/types";

type Props = { product: ProductSummary | ProductDetails; compact?: boolean };

export function ProductCard({ product, compact = false }: Props) {
  const details = "quantity" in product ? product : null;
  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${compact ? "" : "hover:shadow-md"}`}>
      <div className="flex gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xl text-slate-400">
          {product.image ? <img src={product.image} alt="" className="h-full w-full object-contain" /> : "⚡"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{product.name}</p>
          <p className="mt-1 text-xs text-slate-500">Арт.: {product.article || "не указан"}</p>
          <p className="mt-2 text-base font-bold text-emerald-700">{product.price === null ? "Цена по запросу" : `${product.price.toLocaleString("ru-RU")} ₸`}</p>
        </div>
      </div>
      {details && <div className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600">
        <p><b>Наличие:</b> {details.quantity === null ? "уточняется" : `${details.quantity} шт.`}</p>
        {Object.entries(details.properties).filter(([, value]) => typeof value === "string").slice(0, 4).map(([key, value]) => <p key={key}><b>{key.replaceAll("_", " ")}:</b> {String(value)}</p>)}
      </div>}
      {product.url && <a href={product.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-emerald-700 underline">Открыть карточку на ekt.kz</a>}
    </article>
  );
}
