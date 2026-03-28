"use server";

import { createTestProductWithIdToken } from "@/lib/shopify/server/create-test-product";

export type { CreateTestProductResult } from "@/lib/shopify/server/create-test-product";

/**
 * Called from the embedded UI client (after `shopify.idToken()`). Runs GraphQL on the server.
 */
export async function createTestProductAction(idToken: string, title: string) {
  return createTestProductWithIdToken(idToken, title);
}
