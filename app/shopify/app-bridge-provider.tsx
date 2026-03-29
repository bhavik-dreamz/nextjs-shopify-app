"use client";

import { useEffect, useState } from "react";
import { NavMenu } from "@shopify/app-bridge-react";

function AppBridgeReady({ children }: { children: React.ReactNode }) {
  // Safe to call useAppBridge here — only rendered after window.shopify exists.
  // If you need the shopify instance deeper in the tree, import useAppBridge
  // directly in those components; this wrapper just ensures the global is ready.
  return <>{children}</>;
}

export function AppBridgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // App Bridge v3 sets window.shopify once the CDN script initialises.
    if (typeof window !== "undefined" && window.shopify) {
      setReady(true);
      return;
    }

    // Poll until the script has finished setting up the global.
    const id = setInterval(() => {
      if (typeof window !== "undefined" && window.shopify) {
        setReady(true);
        clearInterval(id);
      }
    }, 50);

    return () => clearInterval(id);
  }, []);

  // Don't render children (and therefore useAppBridge calls) until ready.
  if (!ready) return null;

  return (
    <>
      <NavMenu>
        <a href="/shopify" rel="home">
          Home
        </a>
        <a href="/shopify/additional">Additional page</a>
      </NavMenu>
      <AppBridgeReady>{children}</AppBridgeReady>
    </>
  );
}