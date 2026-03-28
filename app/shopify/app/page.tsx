import { headers } from "next/headers";

import { CreateProductButton } from "@/app/shopify/app/create-product-button";
import {
  SHOPIFY_FORWARD_HOST_HEADER,
  SHOPIFY_FORWARD_SHOP_HEADER,
} from "@/lib/shopify/guards";

export default async function ShopifyAppPage() {
  const h = await headers();
  const shop = h.get(SHOPIFY_FORWARD_SHOP_HEADER);
  const host = h.get(SHOPIFY_FORWARD_HOST_HEADER);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Shopify app (embedded)
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        OAuth completed and the offline session was stored. Install URL:{" "}
        <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
          /api/shopify/auth?shop=your-store.myshopify.com
        </code>
      </p>
      <dl className="grid gap-2 text-sm">
        <dt className="font-medium text-zinc-700 dark:text-zinc-300">Shop</dt>
        <dd className="text-zinc-600 dark:text-zinc-400">{shop ?? "—"}</dd>
        <dt className="font-medium text-zinc-700 dark:text-zinc-300">Host</dt>
        <dd className="break-all text-zinc-600 dark:text-zinc-400">
          {host ? "present (embedded)" : "—"}
        </dd>
      </dl>
      <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          GraphQL (secured API)
        </h2>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-500">
          Uses App Bridge session token + offline session Admin API. Requires{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            write_products
          </code>
          .
        </p>
        <CreateProductButton />
      </div>
    </div>
  );
}
