import { NextResponse } from "next/server";

import { isValidShopParam } from "@/lib/shopify/guards";

/**
 * Exits the Shopify Admin iframe before starting OAuth.
 *
 * Modern browsers block third-party cookies set inside an iframe (SameSite
 * restrictions). If OAuth begins while the app is inside the Admin iframe the
 * state cookie written by `auth.begin()` is silently dropped, making the
 * callback fail with "Could not find an OAuth cookie".
 *
 * This route is loaded inside the iframe but immediately scripts the TOP-LEVEL
 * window to navigate to `/api/shopify/auth`, so when the browser sets the
 * OAuth state cookie it is a first-party operation and the callback succeeds.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  if (!isValidShopParam(shop)) {
    return new NextResponse("Invalid or missing shop parameter", { status: 400 });
  }

  const authUrl = `/api/shopify/auth?shop=${encodeURIComponent(shop)}`;

  // JSON.stringify gives us a safely-escaped JS string literal.
  const escapedUrl = JSON.stringify(authUrl);

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script>
      // Navigate the top-level frame (exits the Shopify Admin iframe) so that
      // the OAuth state cookie is set in a first-party context.
      (function () {
        var url = ${escapedUrl};
        if (window.top && window.top !== window) {
          window.top.location.href = url;
        } else {
          window.location.href = url;
        }
      })();
    </script>
  </head>
  <body></body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
