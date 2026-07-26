"use client";

import React, { useState } from "react";
import { 
  Scale, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Briefcase, 
  Heart, 
  CarFront, 
  Gavel,
  ShieldCheck,
  Eye,
  Target,
  CheckCircle2,
  Menu,
  X
} from "lucide-react";

const expertises = [
  { title: "Aile Hukuku", description: "Anlaşmalı ve çekişmeli boşanma, velayet, nafaka ve mal paylaşımı davalarında hassas ve sonuç odaklı hukuki destek.", icon: Heart },
  { title: "Ticaret Hukuku", description: "Şirket kuruluşu, sözleşme yönetimi, ortaklık uyuşmazlıkları ve ticari alacakların takibinde profesyonel danışmanlık.", icon: Briefcase },
  { title: "Borçlar Hukuku", description: "Sözleşmelerden doğan ihtilaflar, maddi ve manevi tazminat talepleri, borç-alacak ilişkilerinin hukuki zeminde çözümü.", icon: FileText },
  { title: "İdare ve kamulaştırma Hukuku", description: "Vasiyetname düzenleme, miras paylaşımı, tenkis ve muris muvazaası davalarında hak kayıplarını önleyen çözümler.", icon: Scale },
  { title: "İş Hukuku", description: "İşe iade, kıdem ve ihbar tazminatı, iş kazaları ve işçi-işveren ilişkilerinden doğan tüm alacak davalarının takibi.", icon: Gavel },
  { title: "İcra ve İflas Hukuku", description: "Alacakların tahsili, icra takipleri, ihtiyati haciz işlemleri ve borç yapılandırma süreçlerinin etkin yönetimi.", icon: ShieldAlert },
  { title: "Sigorta Hukuku", description: "Sigorta poliçelerinden doğan uyuşmazlıklar, hasar tazminatları ve rücu davalarında hukuki süreç yönetimi.", icon: FileText },
  { title: "Tazminat & Trafik Kazası", description: "Trafik kazalarından doğan değer kaybı, yaralanma ve ölüm durumlarında maddi-manevi tazminat süreçlerinin takibi.", icon: CarFront }
];

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Page() {
  const [meetingType, setMeetingType] = useState<"office" | "online">("office");
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    date: "",
    time: "",
    message: "" 
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; date?: string; time?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayString = getTodayDateString();

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMeetingType(e.target.value as "office" | "online");
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const newErrors: { email?: string; phone?: string; date?: string; time?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Lütfen geçerli bir e-posta adresi giriniz.";
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    const phoneRegex = /^(90)?0?5\d{9}$/;
    if (!phoneRegex.test(phoneDigits)) {
      newErrors.phone = "Lütfen geçerli bir telefon numarası giriniz. (Örn: 05XX XXX XX XX)";
    }

    if (form.date && form.date < todayString) {
      newErrors.date = "Lütfen bugünden itibaren bir tarih seçiniz.";
    }

    if (form.time) {
      const [hour, minute] = form.time.split(":").map(Number);
      const totalMinutes = hour * 60 + minute;
      const minMinutes = 8 * 60 + 30;
      const maxMinutes = 17 * 60 + 30;
      if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
        newErrors.time = "Lütfen mesai saatleri içinde (08:30 - 17:30) bir saat seçiniz.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/randevu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, meetingType }),
      });
      if (!res.ok) throw new Error("Gönderim başarısız");
      setSubmitted(true);
    } catch (err) {
      setErrors({ general: "Bir hata oluştu, lütfen tekrar deneyin veya bizi telefonla arayın." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewRequest() {
    setForm({ name: "", email: "", phone: "", date: "", time: "", message: "" });
    setErrors({});
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-800 antialiased overflow-x-hidden">
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      {/* NAVBAR */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-semibold text-stone-900 tracking-tight font-serif">Av. Ayşe Şenpekmezci</div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#hakkimda" className="hover:text-[#C5A880] transition-colors">Hakkımızda</a>
            <a href="#uzmanlik" className="hover:text-[#C5A880] transition-colors">Uzmanlık Alanları</a>
            <a href="#randevu" className="hover:text-[#C5A880] transition-colors">Randevu</a>
            <a href="#iletisim" className="hover:text-[#C5A880] transition-colors">İletişim</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#randevu" className="hidden sm:inline-block bg-[#C5A880] hover:bg-[#b0936b] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors">
              Randevu Al
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 text-stone-700 hover:text-[#C5A880] transition-colors"
              aria-label="Menüyü aç/kapat"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBİL MENÜ */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-stone-200/60 bg-white/95 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 text-sm font-medium text-stone-700">
              <a href="#hakkimda" onClick={closeMobileMenu} className="py-3 border-b border-stone-100 hover:text-[#C5A880] transition-colors">Hakkımızda</a>
              <a href="#uzmanlik" onClick={closeMobileMenu} className="py-3 border-b border-stone-100 hover:text-[#C5A880] transition-colors">Uzmanlık Alanları</a>
              <a href="#randevu" onClick={closeMobileMenu} className="py-3 border-b border-stone-100 hover:text-[#C5A880] transition-colors">Randevu</a>
              <a href="#iletisim" onClick={closeMobileMenu} className="py-3 hover:text-[#C5A880] transition-colors">İletişim</a>
              <a
                href="#randevu"
                onClick={closeMobileMenu}
                className="mt-3 bg-[#C5A880] hover:bg-[#b0936b] text-white text-center px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Randevu Al
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* HERO ALANI */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-28 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6 animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880]">Hukuk Bürosu</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 leading-tight">
            Hukukta Güven <br /><span className="italic font-light">ve Şeffaflık</span>
          </h1>
          <p className="text-stone-600 max-w-xl font-light leading-relaxed">
            Şenpekmezci Hukuk ve Danışmanlık Bürosu olarak, hukuki süreçlerinizde stratejik, şeffaf ve sonuç odaklı çözümlerle yanınızdayız.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#randevu" className="bg-[#C5A880] hover:bg-[#b0936b] text-white px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
              Online Randevu Al <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-200">
            <div>
              <div className="text-2xl font-serif text-stone-900">5+</div>
              <div className="text-xs text-stone-500">Yıl Deneyim</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-stone-900">100+</div>
              <div className="text-xs text-stone-500">Başarılı Süreç</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-stone-900">%100</div>
              <div className="text-xs text-stone-500">Şeffaflık</div>
            </div>
          </div>
        </div>

        {/* Kurumsal Sağ Kart */}
        <div className="md:col-span-5 flex justify-center md:justify-end animate-fade-in-up">
          <div className="relative w-full max-w-[340px] aspect-[3/4] bg-white border border-stone-200 p-8 flex flex-col justify-center items-center text-center shadow-md">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-stone-900 -mt-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-stone-900 -mb-1 -mr-1"></div>
            
            <div className="space-y-4">
              <div className="w-12 h-[1px] bg-[#C5A880] mx-auto"></div>
              <h2 className="text-lg font-serif tracking-widest text-stone-900 uppercase font-medium leading-snug">
                ŞENPEKMEZCİ <br /> <span className="text-xs font-light text-stone-500 tracking-normal block mt-1">HUKUK & DANIŞMANLIK</span>
              </h2>
              <div className="w-12 h-[1px] bg-[#C5A880] mx-auto"></div>
              <div className="pt-6">
                <h3 className="text-sm text-stone-800 font-medium tracking-wide">Av. Ayşe Şenpekmezci</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Kurucu / Avukat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HAKKIMIZDA */}
      <section id="hakkimda" className="bg-stone-900 text-stone-100 py-32 md:py-40 border-y border-stone-800">
        <div className="max-w-5xl mx-auto px-6 space-y-16 text-center animate-fade-in-up">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#C5A880]">Kurumsal İlkelerimiz</h2>
            <p className="text-3xl font-serif text-white font-light">Hakkımızda</p>
            <div className="w-12 h-[1px] bg-stone-700 mx-auto pt-1"></div>
          </div>
          
          <p className="text-stone-300 font-light max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
            Şenpekmezci Hukuk ve Danışmanlık Bürosu; müvekkillerine hukukun her alanında güven, şeffafik ve meslek etik ilkelerine tam bağlılık esasıyla hizmet sunar. Gaziantep merkezli büromuz, genç, dinamik ve yenilikçi bakış açısıyla hukuki süreçleri karmaşadan uzak, şeffaf ve sonuç odaklı bir şekilde yönetmektedir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 max-w-4xl mx-auto border-t border-stone-800/60 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#C5A880]">
                <ShieldCheck size={22} />
                <h4 className="text-sm font-medium uppercase tracking-wider text-stone-200">Dürüstlük & Güven</h4>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">Tüm hukuki riskleri ve süreç ihtimallerini müvekkillerimizle açıkça paylaşırız.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#C5A880]">
                <Eye size={22} />
                <h4 className="text-sm font-medium uppercase tracking-wider text-stone-200">Şeffaf Bilgilendirme</h4>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">Dava ve icra süreçlerindeki her gelişmeyi anlık ve anlaşılır şekilde raporlarız.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#C5A880]">
                <Target size={22} />
                <h4 className="text-sm font-medium uppercase tracking-wider text-stone-200">Sonuç Odaklılık</h4>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">Zamanı ve hukuki enstrümanları en efektik şekilde kullanarak sonuca odaklanırız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* UZMANLIK ALANLARI */}
      <section id="uzmanlik" className="max-w-6xl mx-auto px-6 py-28 space-y-16">
        <div className="text-center space-y-2 animate-fade-in-up">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C5A880]">Faaliyet Alanlarımız</p>
          <h2 className="text-3xl font-serif text-stone-900 font-medium">Uzmanlık Alanları</h2>
          <div className="w-12 h-[1px] bg-stone-300 mx-auto pt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertises.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className="bg-white border border-stone-200/80 p-6 flex flex-col justify-between group transition-all duration-500 hover:shadow-md hover:border-stone-400 bg-gradient-to-br from-white to-stone-50/30 animate-fade-in-up"
              >
                <div>
                  <div className="w-10 h-10 bg-stone-50 flex items-center justify-center mb-6 group-hover:bg-stone-900 transition-colors duration-300 border border-stone-100">
                    <IconComponent className="w-4 h-4 text-stone-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-serif font-medium text-stone-900 mb-2.5 group-hover:text-[#C5A880] transition-colors">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RANDEVU ALANI */}
      <section id="randevu" className="bg-stone-900 py-24 border-y border-stone-800 relative z-30">
        <div className="max-w-xl mx-auto px-6 space-y-8 animate-fade-in-up">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif text-white font-light">Randevu & Ön Görüşme Talebi</h2>
            <p className="text-xs text-stone-400 font-light">Hukuki danışmanlık süreçleriniz için tercih ettiğiniz görüşme türünü seçiniz.</p>
            <div className="w-12 h-[1px] bg-stone-700 mx-auto pt-2"></div>
          </div>

          <div className="w-full bg-white border border-stone-200/80 shadow-2xl rounded-sm overflow-hidden">

{submitted ? (
    <div className="p-10 flex flex-col items-center text-center space-y-4 animate-fade-in-up">
      <div className="w-14 h-14 rounded-full bg-[#C5A880]/10 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-[#C5A880]" />
      </div>
      <h3 className="text-xl font-serif text-stone-900">Talebiniz Alındı</h3>
      <p className="text-sm text-stone-600 font-light leading-relaxed max-w-sm">
        Randevu talebiniz başarıyla iletildi. En kısa sürede sizinle e-posta veya telefon yoluyla iletişime geçeceğiz.
      </p>
      <button
        onClick={handleNewRequest}
        className="mt-2 text-xs font-semibold text-[#C5A880] uppercase tracking-wider hover:text-[#b0936b] transition-colors"
      >
        Yeni Talep Oluştur
      </button>
    </div>
  ) : (

            <form onSubmit={onSubmit} className="p-8 space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Talep Edilen Görüşme Türü</label>
                <select 
                  value={meetingType} 
                  onChange={handleSelectChange}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm transition-colors font-medium rounded-sm cursor-pointer"
                >
                  <option value="office">Ofiste Yüz Yüze Görüşme (Fiziksel)</option>
                  <option value="online">Online Görüntülü Görüşme (Zoom / Meet)</option>
                </select>
              </div>

              <div className="bg-stone-50 border-l-2 border-[#C5A880] p-3 text-xs text-stone-600 font-light">
                {meetingType === 'office' 
                  ? "Ofisimizde yüz yüze gerçekleştirilecek ön görüşme için lütfen bilgileri doldurunuz." 
                  : "Google Meet / Zoom üzerinden uzaktan gerçekleştirilecek online video konferans görüşmesi için lütfen bilgileri doldurunuz."
                }
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">İsim Soyisim</label>
                <input name="name" value={form.name} onChange={onChange} className="w-full h-11 px-4 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm transition-colors" required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">E-posta Adresi</label>
                  <input name="email" type="email" value={form.email} onChange={onChange} className="w-full h-11 px-4 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm transition-colors" required />
                  {errors.email && <p className="text-[11px] text-red-600 font-light">{errors.email}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Telefon Numarası</label>
                  <input name="phone" value={form.phone} onChange={onChange} className="w-full h-11 px-4 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm transition-colors" required />
                  {errors.phone && <p className="text-[11px] text-red-600 font-light">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Tercih Edilen Tarih</label>
                  <input type="date" name="date" min={todayString} value={form.date} onChange={onChange} className="w-full h-11 px-4 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm transition-colors" required />
                  {errors.date && <p className="text-[11px] text-red-600 font-light">{errors.date}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Tercih Edilen Saat</label>
                  <input type="time" name="time" min="08:30" max="17:30" value={form.time} onChange={onChange} className="w-full h-11 px-4 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm transition-colors" required />
                  {errors.time && <p className="text-[11px] text-red-600 font-light">{errors.time}</p>}
                </div>
              </div>
              <p className="text-[11px] text-stone-400 font-light -mt-3">Randevular yalnızca mesai saatleri içinde (08:30 - 17:30) alınabilir.</p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Uyuşmazlık Konusu / Kısa Özet</label>
                <textarea name="message" value={form.message} onChange={onChange} className="w-full p-4 bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-[#C5A880] text-sm resize-none transition-colors" rows={3} />
              </div>

              {errors.general && (
                <p className="text-xs text-red-600 font-light text-center">{errors.general}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#b0936b] transition-colors uppercase tracking-widest pt-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Gönderiliyor..." : "Talep Formunu Gönder"}
              </button>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="iletisim" className="bg-white py-16 text-sm text-stone-600 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-base text-stone-900 font-medium font-serif">Şenpekmezci Hukuk ve Danışmanlık Bürosu</h3>
            <div className="space-y-2 font-light text-stone-600">
              <p className="flex items-center gap-2"><MapPin size={16} className="text-[#C5A880]" /> Fatih Mah. 35 Nolu Sk. Kardelen Apt A Blok Kat:5 Daire:13 Şehitkamil/Gaziantep </p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-[#C5A880]" /> +90 536 630 99 63</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-[#C5A880]" /> av.aysesenpekmezci@gmail.com</p>
            </div>
          </div>
          <div className="md:col-span-4 space-y-2 md:border-l md:border-stone-200 md:pl-12">
            <h4 className="text-stone-900 font-medium flex items-center gap-2"><Clock size={16} className="text-[#C5A880]" /> Çalışma Saatleri</h4>
            <p className="font-light">Hafta İçi: 08:30 - 17:30</p>
          </div>
        </div>
      </footer>

    </main>
  );
}