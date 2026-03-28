import type { NextConfig } from "next";

/**
 * Shopify embedded apps must be served inside an iframe on admin.shopify.com.
 * The Content-Security-Policy `frame-ancestors` directive (and legacy X-Frame-Options)
 * must allow that origin. This is the Next.js equivalent of
 * `shopify.addDocumentResponseHeaders` in the Remix template.
 */
const SHOPIFY_CSP =
  "frame-ancestors https://admin.shopify.com https://*.myshopify.com;";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply CSP + frame headers to all embedded /shopify/* pages
        source: "/shopify/:path*",
        headers: [
          { key: "Content-Security-Policy", value: SHOPIFY_CSP },
          // Legacy fallback for older browsers / Safari
          { key: "X-Frame-Options", value: "ALLOW-FROM https://admin.shopify.com" },
        ],
      },
    ];
  },
};

export default nextConfig;
