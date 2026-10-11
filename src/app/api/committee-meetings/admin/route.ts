import {
  committeeAdminGet,
  committeeAdminPost,
} from "@/lib/committeeMeetings.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = committeeAdminGet;
export const POST = committeeAdminPost;
