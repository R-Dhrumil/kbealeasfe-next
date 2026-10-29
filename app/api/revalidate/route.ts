import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag || request.nextUrl.searchParams.get("tag");
    const path = body.path || request.nextUrl.searchParams.get("path");

    if (tag) {
      // @ts-ignore - Next.js revalidateTag
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    return NextResponse.json(
      { message: "Specify 'tag' or 'path' to revalidate" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Revalidation failed", error: err?.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  if (tag) {
    // @ts-ignore
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  return NextResponse.json(
    { message: "Pass 'tag' or 'path' as query parameter" },
    { status: 400 }
  );
}
