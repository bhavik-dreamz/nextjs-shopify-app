import type { Metadata } from "next";
import Script from "next/script";

import { requireShopifyEmbeddedSession } from "@/lib/shopify/session-layout";
import { AppBridgeProvider } from "@/app/shopify/app-bridge-provider";

const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ?? "";

export const metadata: Metadata = {
  title: "Shopify app",
  // This injects the correct <meta name="shopify-api-key"> tag automatically.
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
      {/*
        DO NOT add a manual <meta name="shopify-api-key"> here.
        The `metadata` export above already injects it with the real value
        from NEXT_PUBLIC_SHOPIFY_API_KEY. A hardcoded placeholder like
        "%SHOPIFY_API_KEY%" would override it and break App Bridge init.
      */}

      {/* App Bridge CDN script — must load before React hydration */}
      <Script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        strategy="beforeInteractive"
      />

      {/*
        AppBridgeProvider gates rendering until window.shopify is ready,
        so any child that calls useAppBridge() is safe.
      */}
      <AppBridgeProvider>{children}</AppBridgeProvider>
    </>
  );
}