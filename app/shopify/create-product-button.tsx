"use client";

import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";

import { createTestProductAction } from "@/app/shopify/actions";

export function CreateProductButton() {
  const shopify = useAppBridge();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function createProduct() {
    setMessage(null);
    setPending(true);
    try {
      const idToken = await shopify.idToken();
      const title = `Demo product ${new Date().toISOString().slice(0, 19)}`;
      const result = await createTestProductAction(idToken, title);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage(`Created: ${result.product.title} (${result.product.id})`);
      shopify.toast.show("Product created");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => void createProduct()}
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create test product"}
      </button>
      {message ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}
