import { getPublicHub, meetingResponse } from "@/lib/committeeMeetings.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return meetingResponse(await getPublicHub());
  } catch {
    return meetingResponse(
      { error: "Meeting information is temporarily unavailable." },
      503,
    );
  }
}
