import { Resend } from "resend";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.SITE_URL || "https://www.senpekmezcihukuk.com";

export interface RandevuTokenPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  meetingType: "office" | "online";
}

function getTokenSecret() {
  const secret = process.env.RANDEVU_TOKEN_SECRET;
  if (!secret) {
    throw new Error("RANDEVU_TOKEN_SECRET tanımlı değil");
  }
  return secret;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, message, meetingType } = body;

    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const tokenPayload: RandevuTokenPayload = { name, email, phone, date, time, message, meetingType };
    const token = jwt.sign(tokenPayload, getTokenSecret(), { expiresIn: "90d" });
    const onayUrl = `${SITE_URL}/api/randevu/onayla?token=${encodeURIComponent(token)}`;

    const { data, error } = await resend.emails.send({
      from: "Randevu Formu <randevu@senpekmezcihukuk.com>",
      to: "av.aysesenpekmezci@gmail.com",
      replyTo: email,
      subject: `Yeni Randevu Talebi - ${name}`,
      html: `
        <h2>Yeni Randevu &amp; Ön Görüşme Talebi</h2>
        <p><strong>Görüşme Türü:</strong> ${meetingType === "office" ? "Ofiste Yüz Yüze" : "Online Görüşme"}</p>
        <p><strong>İsim Soyisim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Tercih Edilen Tarih:</strong> ${date}</p>
        <p><strong>Tercih Edilen Saat:</strong> ${time}</p>
        <p><strong>Uyuşmazlık Konusu:</strong> ${message || "Belirtilmedi"}</p>
        <div style="margin-top: 24px;">
          <a href="${onayUrl}" style="display:inline-block;background-color:#C5A880;color:#ffffff;padding:12px 24px;text-decoration:none;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;font-size:13px;">
            Randevuyu Onayla
          </a>
        </div>
      `,
    });

    if (error) {
      // Resend gerçek hatayı buraya koyar (örn. domain doğrulanmadı, izin verilmeyen alıcı vb.)
      console.error("RESEND HATASI:", error);
      return NextResponse.json({ error: error.message || "Mail gönderilemedi" }, { status: 500 });
    }

    const { error: clientError } = await resend.emails.send({
      from: "Şenpekmezci Hukuk <randevu@senpekmezcihukuk.com>",
      to: email,
      subject: "Randevu Talebiniz Alındı",
      html: `
        <h2>Randevu Talebiniz Alındı</h2>
        <p>Sayın ${name},</p>
        <p>Randevu talebiniz tarafımıza ulaşmıştır. Avukatımız en kısa sürede talebinizi onaylayıp size dönüş yapacaktır.</p>
        <p><strong>Tercih Ettiğiniz Tarih:</strong> ${date}</p>
        <p><strong>Tercih Ettiğiniz Saat:</strong> ${time}</p>
        <p>İlginiz için teşekkür ederiz.</p>
        <p>Şenpekmezci Hukuk ve Danışmanlık Bürosu</p>
      `,
    });

    if (clientError) {
      console.error("MÜVEKKİL MAIL HATASI:", clientError);
    }

    console.log("Mail başarıyla gönderildi, Resend ID:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("SUNUCU HATASI:", error);
    return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
  }
}
