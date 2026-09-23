"use client";

import { ProductDetails, ProductSummary } from "@/lib/types";

type Props = { product: ProductSummary | ProductDetails; compact?: boolean };

export function ProductCard({ product, compact = false }: Props) {
  const details = "quantity" in product ? product : null;

  return (
    <article className={`catalog-card rounded-[24px] p-4 ${compact ? "" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-lime-50 text-xl text-emerald-700 shadow-inner">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2" />
          ) : (
            "⚡"
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">{product.name}</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            Арт.: {product.article || "не указан"}
          </p>
          <p className="mt-3 text-base font-black text-emerald-800">
            {product.price === null ? "Цена по запросу" : `${product.price.toLocaleString("ru-RU")} ₸`}
          </p>
        </div>
      </div>

      {details && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs leading-5 text-slate-700">
          <p>
            <span className="font-bold text-slate-900">Наличие:</span>{" "}
            {details.quantity === null ? "уточняется" : `${details.quantity} шт.`}
          </p>
          {product.reason && (
            <p className="mt-2 text-[11px] leading-5 text-slate-600">
              <span className="font-bold text-slate-800">Коротко:</span> {product.reason}
            </p>
          )}
          {Object.entries(details.properties)
            .filter(([, value]) => typeof value === "string")
            .slice(0, 3)
            .map(([key, value]) => (
              <p key={key}>
                <span className="font-semibold text-slate-800">{key.replaceAll("_", " ")}:</span> {String(value)}
              </p>
            ))}
        </div>
      )}

      {!details && product.reason && (
        <p className="mt-4 text-[11px] leading-5 text-slate-600">
          <span className="font-bold text-slate-800">Коротко:</span> {product.reason}
        </p>
      )}

      {product.url && (
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-[0.12em] text-emerald-800 underline-offset-4 hover:underline"
        >
          Открыть карточку
        </a>
      )}
    </article>
  );
}
