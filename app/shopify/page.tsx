import Link from "next/link";
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="text-2xl font-semibold mb-4">Shopify App</h1>
      <p className="mb-6 text-sm text-zinc-700">Welcome to the Shopify app index page.</p>
      <div className="flex gap-3">
        <Link href="/shopify/app" className="rounded-md bg-blue-600 px-4 py-2 text-white">
          Open Embedded App
        </Link>
        <Link href="/api/shopify/webhooks" className="rounded-md border px-4 py-2">
          Webhooks (API)
        </Link>
      </div>
    </main>
  );
}
