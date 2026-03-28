"use client";

import Link from "next/link";
import { NavMenu } from "@shopify/app-bridge-react";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";

/**
 * Thin client wrapper that provides:
 * - Polaris AppProvider (design system + i18n)
 * - App Bridge NavMenu with top-level navigation links
 *   (equivalent to Remix's <AppProvider> + <NavMenu>)
 *
 * Must be "use client" because these components use browser APIs.
 */
export function AppBridgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider i18n={en}>
      <NavMenu>
        <Link href="/shopify/app" rel="home">
          Home
        </Link>
        <Link href="/shopify/app/additional">Additional page</Link>
      </NavMenu>
      {children}
    </AppProvider>
  );
}
