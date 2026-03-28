import "@shopify/shopify-api/adapters/web-api";

import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import type { Shopify } from "@shopify/shopify-api";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

const globalForShopify = globalThis as typeof globalThis & {
  shopifySessionStorage?: MemorySessionStorage;
  shopifyInstance?: Shopify;
};

export const shopifySessionStorage =
  globalForShopify.shopifySessionStorage ?? new MemorySessionStorage();
if (process.env.NODE_ENV !== "production") {
  globalForShopify.shopifySessionStorage = shopifySessionStorage;
}

function getShopifyConfig() {
  const appUrl = process.env.SHOPIFY_APP_URL;
  if (!appUrl) {
    throw new Error("SHOPIFY_APP_URL is required (e.g. https://your-tunnel.example.com)");
  }
  const url = new URL(appUrl);
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecretKey = process.env.SHOPIFY_API_SECRET;
  if (!apiKey || !apiSecretKey) {
    throw new Error("SHOPIFY_API_KEY and SHOPIFY_API_SECRET are required");
  }
  const scopes =
    process.env.SCOPES?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? ["read_products", "write_products"];

  return {
    apiKey,
    apiSecretKey,
    apiVersion: ApiVersion.January26,
    scopes,
    hostName: url.host,
    hostScheme: (url.protocol.replace(":", "") === "http" ? "http" : "https") as
      | "http"
      | "https",
    isEmbeddedApp: process.env.SHOPIFY_EMBEDDED !== "false",
  };
}

export function getShopify(): Shopify {
  if (!globalForShopify.shopifyInstance) {
    globalForShopify.shopifyInstance = shopifyApi(getShopifyConfig());
  }
  return globalForShopify.shopifyInstance;
}
