import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminBroadcastEmail from "./AdminBroadcastEmail";

export function renderAdminEmail(subject: string, bodyHtml: string) {
  const html = renderToStaticMarkup(
    <AdminBroadcastEmail subject={subject} bodyHtml={bodyHtml} />,
  );
  return "<!doctype html>" + html;
}
