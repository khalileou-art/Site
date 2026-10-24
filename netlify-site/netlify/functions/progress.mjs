import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("progress");
  if (req.method === "POST") {
    if (!process.env.EDIT_KEY || req.headers.get("x-key") !== process.env.EDIT_KEY) {
      return new Response("wrong key", { status: 401 });
    }
    const b = await req.json();
    await store.setJSON("data", { days: b.days || {}, cfg: b.cfg || null });
    return new Response("ok");
  }
  const d = await store.get("data", { type: "json" });
  return Response.json(d || {}, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/progress" };
