import { AssistantWidget } from "@/components/assistant-widget";
import { Catalog } from "@/components/catalog";

export default function Home() {
  return <main><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><div className="text-xl font-black tracking-tight text-emerald-800">ЭЛЕКТРОКОМПЛЕКТ <span className="font-medium text-slate-400">· демо</span></div><div className="text-sm text-slate-500">Электротехническая продукция</div></div></header><section className="bg-emerald-950 px-4 py-16 text-white"><div className="mx-auto max-w-6xl"><p className="mb-3 text-sm font-bold uppercase tracking-widest text-emerald-300">ИИ-консультант EKT</p><h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Поможем выбрать нужное оборудование</h1><p className="mt-5 max-w-2xl text-lg leading-7 text-emerald-50">Спросите о товаре, наличии, характеристиках, аналогах, оплате или доставке. Ассистент работает с данными каталога ekt.kz.</p></div></section><Catalog /><AssistantWidget /></main>;
}
