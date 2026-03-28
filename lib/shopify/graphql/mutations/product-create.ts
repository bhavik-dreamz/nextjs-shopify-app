/**
 * Admin API: create a product. Requires `write_products` on the offline session.
 * @see https://shopify.dev/docs/api/admin-graphql/latest/mutations/productcreate
 */
export const PRODUCT_CREATE = `#graphql
  mutation ProductCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

export type ProductCreateVariables = {
  input: {
    title: string;
  };
};

/** Shape of GraphQL `data` for {@link PRODUCT_CREATE}. */
export type ProductCreateData = {
  productCreate?: {
    product?: { id: string; title: string; handle: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};
