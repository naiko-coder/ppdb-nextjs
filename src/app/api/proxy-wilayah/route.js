export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return new Response("Missing url param", { status: 400 });
  }
  try {
    const res = await fetch(url);
    const data = await res.text();
    return new Response(data, {
      status: 200,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  } catch (e) {
    return new Response("Failed to fetch", { status: 500 });
  }
}