import "@shopify/shopify-api/adapters/web-api";

import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import type { Session, Shopify } from "@shopify/shopify-api";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";
import PrismaSessionStorage from "./shopify/session-storage-prisma";

export const apiVersion = ApiVersion.January26;

const globalForShopify = globalThis as typeof globalThis & {
  shopifySessionStorage?: MemorySessionStorage | PrismaSessionStorage;
  shopifyInstance?: Shopify;
};

export const shopifySessionStorage =
  globalForShopify.shopifySessionStorage ??
  (process.env.SESSION_STORAGE === "memory"
    ? new MemorySessionStorage()
    : new PrismaSessionStorage());
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
    apiVersion,
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

// Remix-like convenience exports for server code in this Next.js app.
export const sessionStorage = shopifySessionStorage;

export async function registerWebhooks(session: Session) {
  return getShopify().webhooks.register({ session });
}

export function login(options: {
  request: Request;
  shop: string;
  callbackPath?: string;
  isOnline?: boolean;
}) {
  const { request, shop, callbackPath = "/api/shopify/auth/callback", isOnline = false } =
    options;
  return getShopify().auth.begin({
    rawRequest: request,
    shop,
    callbackPath,
    isOnline,
  });
}

export default getShopify;
