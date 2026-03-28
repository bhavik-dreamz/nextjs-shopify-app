import { getShopify } from "@/lib/shopify";
import {
  PRODUCT_CREATE,
  type ProductCreateData,
  adminGraphql,
} from "@/lib/shopify/graphql";

export type CreateTestProductResult =
  | { ok: true; product: { id: string; title: string; handle: string } }
  | { ok: false; error: string };

/**
 * Server-only: validates App Bridge session token, then creates a product with the shop offline session.
 */
export async function createTestProductWithIdToken(
  idToken: string,
  title: string,
): Promise<CreateTestProductResult> {
  const trimmed = title.trim();
  if (!trimmed) {
    return { ok: false, error: "title is required" };
  }

  let shop: string;
  try {
    const shopify = getShopify();
    const payload = await shopify.session.decodeSessionToken(idToken, {
      checkAudience: true,
    });
    shop = new URL(payload.dest).hostname;
  } catch {
    return { ok: false, error: "Invalid or expired session" };
  }

  try {
    const { body: gqlBody } = await adminGraphql<ProductCreateData>({
      shop,
      query: PRODUCT_CREATE,
      variables: { input: { title: trimmed } },
    });

    const userErrors = gqlBody.data?.productCreate?.userErrors ?? [];
    if (userErrors.length > 0) {
      return {
        ok: false,
        error: userErrors.map((e) => e.message).join("; "),
      };
    }

    const product = gqlBody.data?.productCreate?.product;
    if (!product) {
      return { ok: false, error: "No product returned from Shopify" };
    }

    return { ok: true, product };
  } catch (err) {
    if (err instanceof Error && err.message === "OFFLINE_SESSION_MISSING") {
      return {
        ok: false,
        error: "No offline session for this shop; complete OAuth again.",
      };
    }
    throw err;
  }
}
