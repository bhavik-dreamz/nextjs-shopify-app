import { Card, Page, Layout, Text, BlockStack } from "@shopify/polaris";

export default function AdditionalPage() {
  return (
    <Page title="Additional page">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Additional page
              </Text>
              <Text as="p" variant="bodyMd">
                This is an additional page in your embedded Shopify app — add
                your content here.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
