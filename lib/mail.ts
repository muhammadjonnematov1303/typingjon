import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
})


export async function sendVerificationEmail(to: string, code: string) {
  const digits = code.split('').map(d =>
    `<td style="padding:0 4px;">
       <div style="width:46px;height:58px;background:#ffffff;border:2px solid #e2e8f0;border-radius:10px;text-align:center;line-height:58px;font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:900;color:#1d4ed8;box-shadow:0 2px 8px rgba(37,99,235,0.10);">
         ${d}
       </div>
     </td>`
  ).join('')

  await transporter.sendMail({
    from: `"Typingjon" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `${code} — Typingjon tasdiqlash kodi`,
    html: `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Typingjon — Tasdiqlash kodi</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;-webkit-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f1f5f9;">
  <tr>
    <td align="center" style="padding:40px 16px 48px;">

      <table width="560" cellpadding="0" cellspacing="0" role="presentation"
        style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,0.08);">

        <!-- Top accent bar -->
        <tr>
          <td height="4" style="background:linear-gradient(90deg,#1d4ed8 0%,#6366f1 100%);font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(145deg,#1e40af 0%,#2563eb 60%,#3b82f6 100%);padding:32px 40px;text-align:center;">
            <div style="color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
              Typingjon
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 8px;">
            <h1 style="margin:0 0 10px;color:#0f172a;font-size:21px;font-weight:700;letter-spacing:-0.4px;line-height:1.3;">
              Hisobingizni tasdiqlang
            </h1>
            <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.7;">
              Typingjon hisobingizni faollashtirish uchun quyidagi
              <strong style="color:#0f172a;">bir martalik kodni</strong> kiriting.
              Kod faqat <strong style="color:#0f172a;">10 daqiqa</strong> davomida amal qiladi.
            </p>

            <!-- Code digits -->
            <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom:12px;">
              <tr>
                <td style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:16px;padding:28px 20px;">
                  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
                    <tr>${digits}</tr>
                  </table>
                  <div style="text-align:center;margin-top:16px;">
                    <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;padding:4px 14px;color:#1d4ed8;font-size:11px;font-weight:600;letter-spacing:0.3px;">
                      10 daqiqadan keyin muddati tugaydi
                    </span>
                  </div>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;color:#94a3b8;font-size:12px;text-align:center;">
              Kodni saytga qo'lda kiriting — uni hech kimga yubormang
            </p>

            <!-- Warning -->
            <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom:32px;">
              <tr>
                <td style="background:#fff7ed;border-left:3px solid #f97316;border-radius:0 12px 12px 0;padding:14px 18px;">
                  <table cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="vertical-align:top;padding-right:10px;padding-top:2px;">
                        <!-- CSS icon: orange circle with ! -->
                        <div style="width:16px;height:16px;border-radius:50%;background:#ea580c;text-align:center;line-height:16px;font-size:10px;font-weight:900;color:#ffffff;font-family:Arial,sans-serif;">!</div>
                      </td>
                      <td>
                        <div style="color:#9a3412;font-size:13px;font-weight:600;margin-bottom:2px;">Xavfsizlik eslatmasi</div>
                        <div style="color:#c2410c;font-size:12px;line-height:1.6;">
                          Ushbu kodni hech kim bilan ulashmang. Typingjon xodimlari hech qachon sizdan bu kodni so'ramaydi.
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background:#f1f5f9;"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 28px;">
            <p style="margin:0 0 6px;color:#64748b;font-size:12px;line-height:1.6;">
              Agar siz ro'yxatdan o'tishni so'ramagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.
              Hech qanday harakatni bajarishingiz shart emas.
            </p>
            <p style="margin:0;color:#94a3b8;font-size:11px;">
              &copy; 2026 Typingjon &nbsp;&bull;&nbsp; Barcha huquqlar himoyalangan
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
    `,
  })
}
