import { AssistantWidget } from "@/components/assistant-widget";
import { Catalog } from "@/components/catalog";

export default function Home() {
  return (
    <main className="app-shell">
      <header className="border-b border-emerald-900/10 bg-white/75 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="brand-pill rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em]">
              EKT
            </div>
            <div className="text-lg font-black tracking-tight text-emerald-900">
              ЭЛЕКТРОКОМПЛЕКТ <span className="font-medium text-slate-400">· demo</span>
            </div>
          </div>
          <div className="hidden text-sm text-slate-500 sm:block">Электротехническая продукция</div>
        </div>
      </header>

      <section className="hero-glow bg-[radial-gradient(circle_at_top,#1f5a40_0%,#0f2f23_38%,#0a1d18_100%)] px-4 py-12 text-white sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="soft-grid relative rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full border border-emerald-200/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              ИИ-консультант EKT
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl xl:text-6xl">
              Подберём оборудование быстро и без лишнего хаоса.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/90 sm:text-lg">
              Спросите о товаре, наличии, характеристиках, аналогах, оплате или доставке — и получите точный ответ по каталогу ekt.kz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalog" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5">
                Смотреть каталог
              </a>
              <a href="#assistant" className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Спросить ИИ
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="info-card rounded-2xl p-5">
              <div className="text-3xl font-black text-white">120+</div>
              <div className="mt-2 text-sm text-emerald-50/80">товаров в подборке</div>
            </div>
            <div className="info-card rounded-2xl p-5">
              <div className="text-3xl font-black text-white">24/7</div>
              <div className="mt-2 text-sm text-emerald-50/80">поддержка покупателя</div>
            </div>
            <div className="info-card rounded-2xl p-5">
              <div className="text-3xl font-black text-white">99%</div>
              <div className="mt-2 text-sm text-emerald-50/80">точность по остаткам</div>
            </div>
          </div>
        </div>
      </section>

      <Catalog />
      <AssistantWidget />
    </main>
  );
}
