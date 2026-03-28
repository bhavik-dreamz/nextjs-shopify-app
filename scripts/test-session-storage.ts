import { PrismaSessionStorage } from "../lib/shopify/session-storage-prisma";

const storage = new PrismaSessionStorage();
const TEST_ID = `__test_session_${Date.now()}`;

const testSession = {
  id: TEST_ID,
  shop: "test-shop.myshopify.com",
  isOnline: false,
  expires: null,
  scope: "read_products,write_products",
  accessToken: "test_token_abc123",
};

async function run() {
  console.log("1. storeSession...");
  await storage.storeSession(testSession);
  console.log("   ✔ stored OK");

  console.log("2. loadSession...");
  const loaded = await storage.loadSession(TEST_ID);
  if (!loaded) throw new Error("loadSession returned null");
  if (loaded.id !== TEST_ID) throw new Error(`ID mismatch: got ${loaded.id}`);
  if (loaded.accessToken !== testSession.accessToken)
    throw new Error(`accessToken mismatch: got ${loaded.accessToken}`);
  console.log("   ✔ loaded OK — id:", loaded.id, "| accessToken:", loaded.accessToken);

  console.log("3. findSessionsByShop...");
  const byShop = await storage.findSessionsByShop(testSession.shop);
  const found = byShop.find((s) => s.id === TEST_ID);
  if (!found) throw new Error("Session not found by shop");
  console.log(`   ✔ found ${byShop.length} session(s) for ${testSession.shop}`);

  console.log("4. deleteSession...");
  await storage.deleteSession(TEST_ID);
  const afterDelete = await storage.loadSession(TEST_ID);
  if (afterDelete !== null) throw new Error("Session still exists after delete");
  console.log("   ✔ deleted OK");

  console.log("\n✅  All session storage checks passed against NeonDB (PostgreSQL)!");
}

run().catch((e) => {
  console.error("\n❌  FAIL:", e.message);
  process.exit(1);
});
