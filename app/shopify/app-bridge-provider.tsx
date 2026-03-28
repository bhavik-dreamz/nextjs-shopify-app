"use client";

import { NavMenu } from "@shopify/app-bridge-react";

/**
 * Thin client wrapper that provides:
 * - App Bridge NavMenu with top-level navigation links
 *   (equivalent to Remix's <NavMenu>)
 *
 * Must be "use client" because these components use browser APIs.
 */
export function AppBridgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenu>
        <a href="/shopify/app" rel="home">
          Home
        </a>
        <a href="/shopify/app/additional">Additional page</a>
      </NavMenu>
      {children}
    </>
  );
}
