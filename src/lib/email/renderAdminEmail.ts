import React from "react";
import AdminBroadcastEmail from "./AdminBroadcastEmail";

export async function renderAdminEmail(subject: string, bodyHtml: string) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const html = renderToStaticMarkup(
    React.createElement(AdminBroadcastEmail, { subject, bodyHtml }),
  );
  return "<!doctype html>" + html;
}
