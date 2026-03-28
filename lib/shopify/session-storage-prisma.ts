import prisma from "@/lib/prisma";

type ShopifyStored = {
  id: string;
  shop?: string | null;
  isOnline?: boolean | null;
  expiresAt?: Date | null;
  scope?: string | null;
  sessionData: any;
};

export class PrismaSessionStorage {
  async storeSession(session: any) {
    const id = session.id;
    const shop = session.shop ?? session.shopifyDomain ?? null;
    const isOnline = session.isOnline ?? !!session.online;
    const expiresAt = session.expires ? new Date(session.expires) : null;
    const scope = session.scope ?? null;

    await prisma.shopifySession.upsert({
      where: { id },
      update: {
        shop,
        isOnline,
        expiresAt,
        scope,
        sessionData: session,
      },
      create: {
        id,
        shop,
        isOnline,
        expiresAt,
        scope,
        sessionData: session,
      },
    });
  }

  async loadSession(id: string) {
    const rec = await prisma.shopifySession.findUnique({ where: { id } });
    if (!rec) return null;
    return mapRecordToSession(rec);
  }

  async findSessionsByShop(shop: string) {
    const recs = await prisma.shopifySession.findMany({ where: { shop } });
    return recs.map(mapRecordToSession);
  }

  async deleteSession(id: string) {
    await prisma.shopifySession.deleteMany({ where: { id } });
  }
}

function mapRecordToSession(rec: ShopifyStored) {
  const sd = rec.sessionData ?? {};
  return {
    id: rec.id,
    shop: rec.shop ?? sd.shop ?? null,
    isOnline: rec.isOnline ?? sd.isOnline ?? false,
    expiresAt: rec.expiresAt ?? sd.expires ?? null,
    scope: rec.scope ?? sd.scope ?? null,
    sessionData: sd,
    accessToken: sd.accessToken ?? sd.access_token ?? sd.token ?? null,
  };
}

export default PrismaSessionStorage;
