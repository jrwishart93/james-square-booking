import React from "react";
import AdminBroadcastEmail from "./AdminBroadcastEmail";

export async function renderAdminEmail(
  subject: string,
  bodyHtml: string,
  footerText?: string,
) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const html = renderToStaticMarkup(
    React.createElement(AdminBroadcastEmail, { subject, bodyHtml, footerText }),
  );
  return "<!doctype html>" + html;
}
