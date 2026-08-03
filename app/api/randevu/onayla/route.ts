import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createEvent, DateArray } from "ics";
import { Resend } from "resend";
import type { RandevuTokenPayload } from "../route";

const resend = new Resend(process.env.RESEND_API_KEY);
const OFFICE_ADDRESS = "Fatih Mah. 35 Nolu Sk. Kardelen Apt A Blok Kat:5 Daire:13 Şehitkamil/Gaziantep";

function getTokenSecret() {
  const secret = process.env.RANDEVU_TOKEN_SECRET;
  if (!secret) {
    throw new Error("RANDEVU_TOKEN_SECRET tanımlı değil");
  }
  return secret;
}

function htmlPage(title: string, message: string) {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="font-family: system-ui, sans-serif; background:#FAF9F6; color:#1c1917; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:24px;">
  <div style="max-width:420px; text-align:center; background:#fff; border:1px solid #e7e5e4; padding:40px 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.05);">
    <h1 style="font-size:20px; margin-bottom:12px;">${title}</h1>
    <p style="font-size:14px; color:#57534e; line-height:1.6;">${message}</p>
  </div>
</body>
</html>`;
}

function buildIcs(payload: RandevuTokenPayload) {
  const [year, month, day] = payload.date.split("-").map(Number);
  const [hour, minute] = payload.time.split(":").map(Number);
  const start: DateArray = [year, month, day, hour, minute];

  const location =
    payload.meetingType === "office" ? OFFICE_ADDRESS : "Online Görüşme (Zoom/Meet)";

  const { error, value } = createEvent({
    title: `Randevu - ${payload.name}`,
    start,
    startInputType: "local",
    startOutputType: "local",
    duration: { hours: 1 },
    location,
    description: payload.message || "Belirtilmedi",
  });

  if (error || !value) {
    throw error || new Error("ICS oluşturulamadı");
  }

  return value;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(
      htmlPage("Geçersiz Bağlantı", "Onay bağlantısı eksik veya hatalı."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  let payload: RandevuTokenPayload;
  try {
    payload = jwt.verify(token, getTokenSecret()) as RandevuTokenPayload;
  } catch (err) {
    console.error("TOKEN DOĞRULAMA HATASI:", err);
    return new NextResponse(
      htmlPage("Bağlantının Süresi Dolmuş", "Bu onay bağlantısının süresi dolmuş veya bağlantı geçersiz."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const icsContent = buildIcs(payload);
    const icsBase64 = Buffer.from(icsContent, "utf-8").toString("base64");
    const meetingLabel = payload.meetingType === "office" ? "Ofiste Yüz Yüze" : "Online Görüşme";

    const attachments = [
      { filename: "randevu.ics", content: icsBase64, contentType: "text/calendar" },
    ];

    const clientHtml = `
      <h2>Randevunuz Onaylandı</h2>
      <p>Sayın ${payload.name},</p>
      <p>Randevunuz avukatımız tarafından onaylanmıştır. Takvim daveti ekte yer almaktadır.</p>
      <p><strong>Görüşme Türü:</strong> ${meetingLabel}</p>
      <p><strong>Tarih:</strong> ${payload.date}</p>
      <p><strong>Saat:</strong> ${payload.time}</p>
      <p>Şenpekmezci Hukuk ve Danışmanlık Bürosu</p>
    `;

    const lawyerHtml = `
      <h2>Randevu Onaylandı</h2>
      <p><strong>Müvekkil:</strong> ${payload.name}</p>
      <p><strong>E-posta:</strong> ${payload.email}</p>
      <p><strong>Telefon:</strong> ${payload.phone}</p>
      <p><strong>Görüşme Türü:</strong> ${meetingLabel}</p>
      <p><strong>Tarih:</strong> ${payload.date}</p>
      <p><strong>Saat:</strong> ${payload.time}</p>
      <p><strong>Uyuşmazlık Konusu:</strong> ${payload.message || "Belirtilmedi"}</p>
    `;

    const [clientResult, lawyerResult] = await Promise.all([
      resend.emails.send({
        from: "Şenpekmezci Hukuk <randevu@senpekmezcihukuk.com>",
        to: payload.email,
        subject: "Randevunuz Onaylandı",
        html: clientHtml,
        attachments,
      }),
      resend.emails.send({
        from: "Randevu Formu <randevu@senpekmezcihukuk.com>",
        to: "av.aysesenpekmezci@gmail.com",
        subject: `Randevu Onaylandı - ${payload.name}`,
        html: lawyerHtml,
        attachments,
      }),
    ]);

    if (clientResult.error) console.error("MÜVEKKİL ONAY MAILI HATASI:", clientResult.error);
    if (lawyerResult.error) console.error("AVUKAT ONAY MAILI HATASI:", lawyerResult.error);

    if (clientResult.error && lawyerResult.error) {
      return new NextResponse(
        htmlPage("Bir Hata Oluştu", "Randevu onaylandı ancak takvim daveti e-postaları gönderilemedi. Lütfen tekrar deneyin."),
        { status: 502, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (clientResult.error || lawyerResult.error) {
      const failedSide = clientResult.error ? "müvekkile" : "avukata";
      return new NextResponse(
        htmlPage(
          "Randevu Onaylandı (Kısmi)",
          `${payload.name} isimli müvekkile ait randevu onaylandı ancak takvim daveti e-postası ${failedSide} gönderilemedi. Lütfen manuel olarak iletin.`
        ),
        { status: 207, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return new NextResponse(
      htmlPage(
        "Randevu Onaylandı",
        `${payload.name} isimli müvekkile ait randevu onaylandı ve her iki tarafa da takvim daveti gönderildi.`
      ),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (err) {
    console.error("ONAY SÜRECİ HATASI:", err);
    return new NextResponse(
      htmlPage("Bir Hata Oluştu", "Randevu onaylanırken bir sorun oluştu, lütfen tekrar deneyin."),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
