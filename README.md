# ⚖️ Şenpekmezci Hukuk & Danışmanlık Web Sitesi

Modern, performanslı ve kullanıcı dostu bir avukatlık bürosu web sitesi. Potansiyel müvekkillerin avukatlık bürosu hakkında bilgi almasını, hizmet alanlarını incelemesini ve doğrudan online randevu oluşturmasını sağlar.

🔗 **Canlı Website:** [senpekmezcihukuk.com](https://www.senpekmezcihukuk.com/)

---

## 🚀 Öne Çıkan Özellikler

* **Online Randevu Sistemi:** Kullanıcıların randevu talebi oluşturabilmesi için dinamik form yapısı.
* **Otomatik E-Posta & Takvim Entegrasyonu:** Randevu onaylandığında avukata ve müvekkile e-posta bildirimi ve `.ics` uzantılı otomatik takvim davetiyesi gönderimi.
* **Dinamik Yönetim ve Onay Akışı:** API Route'lar üzerinden güvenli token doğrulaması ile randevu onay/red süreçleri.
* **Tam Mobil Uyum (Responsive):** Tüm cihazlarda sorunsuz çalışan modern arayüz tasarımı.
* **SEO & Performans:** Next.js Server Components ve App Router yapısı ile yüksek arama motoru optimizasyonu.

---

## 🛠️ Kullanılan Teknolojiler

* **Framework:** Next.js (App Router)
* **Dil:** TypeScript
* **Stilleme:** Tailwind CSS / CSS Modules
* **E-Posta Servisi:** Resend API
* **Takvim Entegrasyonu:** `ics` paketi (iCalendar event generator)
* **Güvenlik & Auth:** JSON Web Tokens (`jsonwebtoken`)
* **Deploy / Hosting:** Vercel

---

## 💻 Yerel Geliştirme (Local Setup)

Projeyi kendi bilgisayarınızda çalıştırmak için:

1. Depoyu klonlayın:
   ```bash
   git clone [https://github.com/basaksenpekmezci/avukat-sitesi.git](https://github.com/basaksenpekmezci/avukat-sitesi.git)
   cd avukat-sitesi
