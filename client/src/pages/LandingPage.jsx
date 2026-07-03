import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import {
  LogIn,
  UserPlus,
  BookOpen,
  Award,
  Users,
  MapPin,
  Mail,
  Instagram,
  ArrowRight,
  ShieldCheck,
  Target,
  Compass
} from "lucide-react";

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState({ santri: 0, ustadz: 0 }); // State untuk statistik
  const [loadingStats, setLoadingStats] = useState(true);
  const [isPpdbOpen, setIsPpdbOpen] = useState(false);

  const images = [
    "/ppdny/ppdny-1.jpg",
    "/ppdny/ppdny-2.jpg",
    "/ppdny/ppdny-3.jpg",
    "/ppdny/ppdny-4.jpg",
  ];

  // Efek untuk Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Efek untuk Fetch Data Statistik & Status PPDB dari API Public
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get("/public/stats");
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil statistik:", err);
      } finally {
        setLoadingStats(false);
      }

      try {
        const ppdbRes = await api.get("/public/ppdb-status");
        if (ppdbRes.data.success) {
          setIsPpdbOpen(ppdbRes.data.isOpen);
        }
      } catch (err) {
        console.error("Gagal mengambil status PPDB:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-green-100 selection:text-green-900">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14">
              <img src="/logo.png" alt="PPDNY" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 leading-tight">
                Darun-Na'im Yapia
              </h1>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                Pondok Pesantren Modern
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/materi"
              className="text-gray-600 hover:text-green-600 font-semibold px-4 py-2 transition hidden md:inline-flex"
            >
              Materi
            </Link>
            {isPpdbOpen && (
              <Link
                to="/ppdb/daftar"
                className="text-gray-600 hover:text-green-600 font-semibold px-4 py-2 transition hidden md:inline-flex"
              >
                Pendaftaran PPDB
              </Link>
            )}
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition active:scale-95 shadow-md shadow-green-100"
            >
              <LogIn size={18} /> Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-52 md:pb-24 min-h-[600px] md:min-h-[700px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gray-900 items-center">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 visible" : "opacity-0"}`}
            >
              <img
                src={img}
                alt={`Ponpes DNY Background ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gray-950/50 z-10 backdrop-blur-[1px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wide mb-6">
              <ShieldCheck size={14} className="text-green-400" /> Sistem
              Informasi Manajemen Terpadu
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
              Membangun Generasi <br />
              <span className="text-transparent bg-clip-text bg-green-400">
                Berakhlak & Berprestasi
              </span>
            </h1>

            <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl">
              Selamat datang di Portal Resmi Pondok Pesantren Modern Darun-Na'im
              Yapia (DNY). Pusat informasi pendaftaran santri baru dan sistem
              akademik terintegrasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {isPpdbOpen && (
                <Link
                  to="/ppdb/daftar"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition group"
                >
                  <UserPlus size={20} /> Daftar Sekarang
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG KAMI / KEUNGGULAN */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-gray-500 mb-8">
              Kami berkomitmen memberikan pendidikan Islam yang modern, terpadu,
              dan berorientasi pada pembentukan karakter.
            </p>

            {/* DATA STATISTIK */}
            {!loadingStats && (
              <div className="flex justify-center gap-4 md:gap-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <h3 className="text-4xl font-black text-white mb-1">{stats.santri}+</h3>
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Santri Aktif</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <h3 className="text-4xl font-black text-white mb-1">{stats.ustadz}+</h3>
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Pengajar</p>
                </div>
              </div>
            )}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen size={28} />}
              title="Kurikulum Terpadu"
              desc="Memadukan kurikulum nasional dan kepesantrenan untuk keseimbangan ilmu dunia dan akhirat."
            />
            <FeatureCard
              icon={<Award size={28} />}
              title="Fasilitas Modern"
              desc="Didukung fasilitas asrama dan ruang kelas yang nyaman untuk menunjang kegiatan belajar mengajar."
            />
            <FeatureCard
              icon={<Users size={28} />}
              title="Tenaga Pendidik Kompeten"
              desc="Dibimbing oleh ustadz/ustadzah dan pengajar profesional yang berpengalaman di bidangnya."
            />
          </div>
        </div>
      </section>

      {/* VISI & MISI SECTION */}
      <section className="py-20 relative overflow-hidden bg-green-700 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-3">Visi & Misi</h2>
            <p className="text-green-200 text-sm md:text-base max-w-xl mx-auto">
              Arah dan komitmen kami dalam membina generasi santri yang berakhlak mulia dan berprestasi unggul.
            </p>
            <div className="w-16 h-1 bg-green-400 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            {/* VISI CARD */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur border border-white/15 p-8 md:p-10 rounded-2xl flex flex-col justify-between shadow-lg hover:bg-white/[0.12] transition duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                  <Target className="text-green-300 w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-300 mb-2 block">Visi Kami</span>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">Unggul Prestasi</h3>
              </div>
              <p className="text-lg md:text-xl text-white/95 leading-relaxed font-semibold italic border-l-4 border-green-400 pl-4 py-2 my-auto">
                "Unggul dalam prestasi akademik dan non-akademik"
              </p>
            </div>

            {/* MISI CARD */}
            <div className="lg:col-span-3 bg-white/10 backdrop-blur border border-white/15 p-8 md:p-10 rounded-2xl shadow-lg hover:bg-white/[0.12] transition duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Compass className="text-green-300 w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-300 block">Misi Kami</span>
                  <h3 className="text-xl font-bold text-white">Upaya & Langkah Kami</h3>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { text: "Menciptakan lingkungan sekolah yang kondusif atraktif, kreatif dan inovatif." },
                  { text: "Menumbuhkan rasa percaya diri siswa bertanggung jawab dan mandiri." },
                  { text: "Pembiasan nilai-nilai keagamaan dan disiplin." },
                  { text: "Mengembangkan minat dan bakat siswa dalam bidang Agama, Seni, Olahraga, Sains dan Bahasa." }
                ].map((item) => (
                  <div className="flex items-center gap-4 group/item">
                    <div className="w-6 h-6 rounded-full bg-white/20 group-hover/item:bg-green-500/70 flex items-center justify-center font-bold text-green-200 shrink-0 transition-colors" />
                    <p className="text-base text-white/90 leading-relaxed font-medium transition-colors group-hover/item:text-white">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                {/* Pastikan path logo sesuai di sistem Anda saat build */}
                <img src="/logo.png" alt="PPDNY" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-bold text-white leading-tight">
                  Darun-Na'im Yapia
                </h2>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">
                  Pondok Pesantren Modern
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Mendidik generasi penerus bangsa yang tangguh, berilmu, dan
              berakhlakul karimah.
            </p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
              Kontak & Lokasi
            </h4>
            <ul className="space-y-4 text-sm mb-5">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-green-500 flex-shrink-0 mt-0.5"
                />
                <span>
                  Jl. Demang Aria Rt. 01 Rw. 03 Desa Waru Jaya Kec. Parung Kab.
                  Bogor
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500 flex-shrink-0" />
                <span>ponpesmodern.darunnaimyapia@gmail.com</span>
              </li>
            </ul>
            <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden border border-gray-700 shadow-inner">
              <iframe
                src="https://maps.google.com/maps?q=Pondok%20Pesantren%20Modern%20Darun-Na'im%20Yapia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Ponpes Darun-Na'im Yapia"
              ></iframe>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
              Media Sosial
            </h4>
            <a
              href="https://instagram.com/ponpes_modern_darun_naim_yapia"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-white transition"
            >
              <div className="p-2 bg-gray-800 rounded-lg">
                <Instagram size={18} />
              </div>
              @ponpes_modern_darun_naim_yapia
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Pondok Pesantren Modern Darun-Na'im
          Yapia (DNY).
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}