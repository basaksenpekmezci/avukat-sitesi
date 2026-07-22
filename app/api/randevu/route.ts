import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, message, meetingType } = body;

    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Randevu Formu <onboarding@resend.dev>",
      to: "senpekmezcibasak@gmail.com",
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
      `,
    });

    if (error) {
      // Resend gerçek hatayı buraya koyar (örn. domain doğrulanmadı, izin verilmeyen alıcı vb.)
      console.error("RESEND HATASI:", error);
      return NextResponse.json({ error: error.message || "Mail gönderilemedi" }, { status: 500 });
    }

    console.log("Mail başarıyla gönderildi, Resend ID:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("SUNUCU HATASI:", error);
    return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
  }
}