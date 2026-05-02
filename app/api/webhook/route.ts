export async function POST(req: Request) {
  const data = await req.json();
  console.log('Farcaster Webhook received:', data);
  return Response.json({ success: true });
}
