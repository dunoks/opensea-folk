import { minikitConfig } from "@/lib/minikit-config";

export async function GET() {
  return Response.json(minikitConfig);
}
