export type ProductSummary = {
  id: number;
  name: string;
  article: string | null;
  price: number | null;
  image: string | null;
  url: string | null;
  reason?: string;
};

export type AlternativeProduct = ProductSummary & {
  quantity: number | null;
  reason: string;
};

export type ProductDetails = ProductSummary & {
  description: string | null;
  quantity: number | null;
  stores: Array<{ id: number; name: string; quantity: number }>;
  properties: Record<string, unknown>;
};

export type CartOffer = {
  id: string;
  productId: number;
  name: string;
  article: string | null;
  price: number | null;
  requestedQuantity: number;
  availableQuantity: number | null;
  image: string | null;
};

export type ChatResult = {
  reply: string;
  products: ProductSummary[];
  offer?: CartOffer;
};
