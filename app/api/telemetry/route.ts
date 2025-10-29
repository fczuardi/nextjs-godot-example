export async function POST(req: Request) {
  const body = await req.json();
  console.log("game sent a telemetry", {body})
  return new Response(null, { status: 204 });
}
