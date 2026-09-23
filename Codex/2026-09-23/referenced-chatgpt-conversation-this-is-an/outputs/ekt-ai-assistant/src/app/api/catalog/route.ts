import { NextResponse } from "next/server";
import { getCatalogPage } from "@/lib/ekt";

export async function GET() {
  try {
    return NextResponse.json({ items: await getCatalogPage(1) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка каталога." }, { status: 502 });
  }
}
