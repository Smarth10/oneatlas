import { NextRequest } from "next/server";
import { GET as modelsList } from "@/app/api/models/route";
import { GET as modelDetail } from "@/app/api/models/[slug]/route";
import { GET as labsList } from "@/app/api/labs/route";
import { GET as labDetail } from "@/app/api/labs/[slug]/route";
import { GET as providersList } from "@/app/api/providers/route";
import { GET as providerDetail } from "@/app/api/providers/[slug]/route";
import { GET as compare } from "@/app/api/compare/route";
import { GET as rankings } from "@/app/api/rankings/route";
import { GET as filters } from "@/app/api/filters/route";
import { GET as search } from "@/app/api/search/route";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const slugCtx = (s: string) => ({ params: Promise.resolve({ slug: decodeURIComponent(s) }) });

// Server components call the API route handlers directly (no HTTP round trip),
// so pages and the public REST API share exactly the same code path.
export async function apiGet<T>(path: string): Promise<T> {
  const url = new URL(path, "http://internal");
  const req = new NextRequest(url);
  const [, resource, slug] = url.pathname.split("/").filter(Boolean);

  let res: Response;
  switch (resource) {
    case "models":
      res = slug ? await modelDetail(req, slugCtx(slug)) : await modelsList(req);
      break;
    case "labs":
      res = slug ? await labDetail(req, slugCtx(slug)) : await labsList();
      break;
    case "providers":
      res = slug ? await providerDetail(req, slugCtx(slug)) : await providersList();
      break;
    case "compare":
      res = await compare(req);
      break;
    case "rankings":
      res = await rankings(req);
      break;
    case "filters":
      res = await filters();
      break;
    case "search":
      res = await search(req);
      break;
    default:
      throw new ApiError(404, `Unknown API route: ${url.pathname}`);
  }

  if (!res.ok) {
    let message = res.statusText || "Request failed";
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}