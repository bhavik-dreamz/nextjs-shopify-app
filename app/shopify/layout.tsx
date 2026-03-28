import type { Metadata } from "next";
import Script from "next/script";

import { requireShopifyEmbeddedSession } from "@/lib/shopify/session-layout";
import { AppBridgeProvider } from "@/app/shopify/app-bridge-provider";
import { get } from "http";
import { getShopify } from "@/lib/shopify";

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

 const shopify = getShopify();
  const shopifySession = await requireShopifyEmbeddedSession();

  return (
    <>
      {/* App Bridge script — must load before React hydration */}
      <Script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        strategy="beforeInteractive"
      />
      <AppBridgeProvider>
        {children}
      </AppBridgeProvider>
    </>
  );
}
