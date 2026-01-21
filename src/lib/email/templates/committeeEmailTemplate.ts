type CommitteeEmailTemplateProps = {
  subject: string;
  preheader?: string;
  bodyHtml: string;
};

export function committeeEmailTemplate({
  subject,
  preheader,
  bodyHtml,
}: CommitteeEmailTemplateProps): string {
  const previewText =
    preheader ||
    "Official communication from the James Square Proprietors Association.";

  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background-color:#102a50;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:#f1f5f9;">

<!-- Preheader (hidden) -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
  ${previewText}
</div>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#102a50;">
  <tr>
    <td align="center" style="padding:24px 12px;">

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="max-width:640px; background-color:#0c2142; border-radius:16px; overflow:hidden;">

        <!-- Header -->
        <tr>
          <td>
            <img
              src="https://www.james-square.com/images/logo/header-banner-blue.png"
              width="640"
              alt="James Square"
              style="width:100%; display:block; border:0;"
            >
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td align="center" style="padding:22px 32px 10px;">
            <h1 style="margin:0; font-size:22px; font-weight:600; color:#ffffff;">
              ${subject}
            </h1>
          </td>
        </tr>

        <!-- Body content -->
        <tr>
          <td style="padding:20px 32px; font-size:15px; line-height:1.6; color:#e5e7eb;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Image notice -->
        <tr>
          <td style="padding:14px 32px 18px;">
            <table width="100%" role="presentation"
              style="background:#0b1f3f; border-radius:10px;
                     border:1px solid rgba(255,255,255,0.06);">
              <tr>
                <td style="padding:12px 14px; font-size:10.5px;
                           line-height:1.5; color:#9ca3af;">
                  <strong style="color:#cbd5e1;">Image display notice</strong><br><br>
                  Some email clients hide images by default. If images are not visible,
                  please select “Display images” or “Always trust emails from this sender”.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#081a35; padding:22px 24px;
                     font-size:11px; color:#94a3b8;">
            <table width="100%" role="presentation">
              <tr>
                <td>
                  <p style="margin:0 0 8px;">
                    <strong>James Square Proprietors Association (JSPA)</strong><br>
                    James Square, Caledonian Crescent<br>
                    Edinburgh, EH11 2AT
                  </p>

                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="18">
                        <a href="mailto:committee@james-square.com">
                          <img src="https://www.james-square.com/images/icons/mail-white.png" width="14" alt="">
                        </a>
                      </td>
                      <td>
                        <a href="mailto:committee@james-square.com"
                           style="color:#c7d2fe; text-decoration:none;">
                          committee@james-square.com
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td width="18">
                        <a href="https://www.james-square.com">
                          <img src="https://www.james-square.com/images/icons/globe-white.png" width="14" alt="">
                        </a>
                      </td>
                      <td>
                        <a href="https://www.james-square.com"
                           style="color:#c7d2fe; text-decoration:none;">
                          www.james-square.com
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top:10px;">© ${year} James Square</div>
                </td>

                <td align="right">
                  <img
                    src="https://www.james-square.com/images/icons/Logo-white.PNG"
                    width="110"
                    alt="James Square"
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Unsubscribe -->
        <tr>
          <td style="background:#07152b; padding:16px 24px; text-align:center;">
            <p style="margin:0 0 10px; font-size:10.5px; line-height:1.5; color:#94a3b8;">
              You are receiving this email because you are registered with the James Square community.
              You can unsubscribe at any time using the button below, or by emailing
              <a href="mailto:support@james-square.com"
                 style="color:#c7d2fe; text-decoration:none;">
                support@james-square.com
              </a>
              and we will remove you from the mailing list.
            </p>

            <a href="mailto:support@james-square.com?subject=Unsubscribe"
               style="display:inline-block; padding:6px 16px; border-radius:999px;
                      border:1px solid rgba(255,255,255,0.18);
                      background:rgba(255,255,255,0.06);
                      color:#cbd5e1; text-decoration:none;
                      font-size:11px; font-weight:600;">
              Unsubscribe
            </a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}
