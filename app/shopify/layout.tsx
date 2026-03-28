import type { Metadata } from "next";
import Script from "next/script";

import { requireShopifyEmbeddedSession } from "@/lib/shopify/session-layout";

const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ?? "";

export const metadata: Metadata = {
  title: "Shopify app",
  ...(apiKey ? { other: { "shopify-api-key": apiKey } as const } : {}),
};

export default async function ShopifySegmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireShopifyEmbeddedSession();

  return (
    <>
      <Script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
