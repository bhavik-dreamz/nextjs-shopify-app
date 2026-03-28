"use client";

import Link from "next/link";
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
        <Link href="/shopify/app" rel="home">
          Home
        </Link>
        <Link href="/shopify/app/additional">Additional page</Link>
      </NavMenu>
      {children}
    </>
  );
}
