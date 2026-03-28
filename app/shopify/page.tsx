export default function Page() {

    
  return (
    <main className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="text-2xl font-semibold mb-4">Shopify App</h1>
      <p className="mb-6 text-sm text-zinc-700">Welcome to the Shopify app index page.</p>
      <div className="flex gap-3">
        <a href="/shopify/app" className="rounded-md bg-blue-600 px-4 py-2 text-white">
          Open Embedded App
        </a>
        <a href="/api/shopify/webhooks" className="rounded-md border px-4 py-2">
          Webhooks (API)
        </a>
      </div>
    </main>
  );
}
