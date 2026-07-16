import { useState, useEffect, useRef } from 'react';
import { Smartphone, BookOpen, Download, ChevronRight, Menu, X, ArrowLeft, Printer, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

let screenshotsPromise = null;
const fetchScreenshotsOnce = () => {
  if (!screenshotsPromise) {
    screenshotsPromise = api.get('/public/guidebook/screenshots?role=santri')
      .then(res => res.data.success ? res.data.data : {})
      .catch(err => {
        console.warn('Failed to load guidebook screenshots from database, using fallback paths:', err);
        return {};
      });
  }
  return screenshotsPromise;
};

function parseFilename(filename) {
  const isDesktop = filename.endsWith('_desktop.png');
  const isMobile = filename.endsWith('_mobile.png');
  if (!isDesktop && !isMobile) return null;

  const device = isDesktop ? 'desktop' : 'mobile';
  const core = filename.replace(/_(desktop|mobile)\.png$/, '');

  let modul = '';
  let bagian = '';

  if (core.startsWith('login')) {
    modul = 'auth';
    bagian = 'login';
  } else if (core.startsWith('lupa_password')) {
    modul = 'auth';
    bagian = 'lupa_password';
  } else if (core.startsWith('dashboard')) {
    modul = 'dashboard';
    bagian = 'main';
  } else if (core.startsWith('notifikasi')) {
    modul = 'dashboard';
    bagian = 'notifikasi';
  } else if (core.startsWith('scabies_dashboard')) {
    modul = 'scabies';
    bagian = 'dashboard';
  } else if (core.startsWith('scabies_detail_materi')) {
    modul = 'scabies';
    bagian = 'detail_materi';
  } else if (core.startsWith('scabies_modal_ajukan_materi')) {
    modul = 'scabies';
    bagian = 'ajukan_materi';
  } else if (core.startsWith('scabies_materi')) {
    modul = 'scabies';
    bagian = 'materi';
  } else if (core.startsWith('riwayat_layanan_modal_detail')) {
    modul = 'riwayat_layanan';
    bagian = 'detail';
  } else if (core.startsWith('riwayat_layanan_modal_feedback')) {
    modul = 'riwayat_layanan';
    bagian = 'feedback';
  } else if (core.startsWith('riwayat_layanan')) {
    modul = 'riwayat_layanan';
    bagian = 'main';
  } else if (core.startsWith('keuangan_modal_detail')) {
    modul = 'keuangan';
    bagian = 'detail';
  } else if (core.startsWith('keuangan')) {
    modul = 'keuangan';
    bagian = 'main';
  } else if (core.startsWith('kegiatan_modal_detail')) {
    modul = 'kegiatan';
    bagian = 'detail';
  } else if (core.startsWith('kegiatan_modal_feedback')) {
    modul = 'kegiatan';
    bagian = 'feedback';
  } else if (core.startsWith('kegiatan')) {
    modul = 'kegiatan';
    bagian = 'main';
  } else if (core.startsWith('pengaduan_modal_detail')) {
    modul = 'pengaduan';
    bagian = 'detail';
  } else if (core.startsWith('pengaduan')) {
    modul = 'pengaduan';
    bagian = 'main';
  } else if (core.startsWith('layanan_modal_detail')) {
    modul = 'layanan';
    bagian = 'detail';
  } else if (core.startsWith('layanan_modal_form')) {
    modul = 'layanan';
    bagian = 'form';
  } else if (core.startsWith('layanan')) {
    modul = 'layanan';
    bagian = 'main';
  } else if (core.startsWith('konsultasi_room_riwayat')) {
    modul = 'konsultasi';
    bagian = 'room';
  } else if (core.startsWith('konsultasi_room')) {
    modul = 'konsultasi';
    bagian = 'room_active';
  } else if (core.startsWith('konsultasi_riwayat')) {
    modul = 'konsultasi';
    bagian = 'riwayat';
  } else if (core.startsWith('konsultasi')) {
    modul = 'konsultasi';
    bagian = 'main';
  } else if (core.startsWith('profil_upload_foto')) {
    modul = 'profil';
    bagian = 'upload_foto';
  } else if (core.startsWith('profil_data_diri_belum_lengkap')) {
    modul = 'profil';
    bagian = 'data_diri_belum_lengkap';
  } else if (core.startsWith('profil_data_diri')) {
    modul = 'profil';
    bagian = 'data_diri';
  } else if (core.startsWith('profil_ortu_locked')) {
    modul = 'profil';
    bagian = 'ortu_locked';
  } else if (core.startsWith('profil_ortu_cari')) {
    modul = 'profil';
    bagian = 'ortu_cari';
  } else if (core.startsWith('profil_ortu')) {
    modul = 'profil';
    bagian = 'ortu';
  } else if (core.startsWith('profil_modal_ganti_password')) {
    modul = 'profil';
    bagian = 'ganti_password';
  } else if (core.startsWith('profil')) {
    modul = 'profil';
    bagian = 'main';
  } else {
    return null;
  }

  return { modul, bagian, device };
}

function Screenshot({ desktop, mobile, alt = "Screenshot" }) {
  const [urls, setUrls] = useState({ desktop, mobile });

  useEffect(() => {
    fetchScreenshotsOnce().then(mapping => {
      const getUrl = (localPath) => {
        if (!localPath || typeof localPath !== 'string') return localPath;
        const filename = localPath.split('/').pop();
        const parsed = parseFilename(filename);
        if (parsed) {
          const key = `${parsed.modul}_${parsed.bagian}_${parsed.device}`;
          return mapping[key] || localPath;
        }
        return localPath;
      };

      setUrls({
        desktop: getUrl(desktop),
        mobile: getUrl(mobile)
      });
    });
  }, [desktop, mobile]);

  return (
    <div className="flex flex-row gap-4 my-6 justify-center items-start w-full print:my-4 print:page-break-inside-avoid">
      <div className="flex-[7.4] flex flex-col items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 print:text-[10px]">Desktop</span>
        <img 
          src={urls.desktop} 
          alt={`${alt} - Desktop`} 
          className="w-full h-auto object-contain rounded-xl border border-gray-200 shadow-md max-h-[340px] print:max-h-[300px]"
        />
      </div>
      <div className="flex-[2.6] flex flex-col items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 print:text-[10px]">Mobile</span>
        <img 
          src={urls.mobile} 
          alt={`${alt} - Mobile`} 
          className="w-full h-auto object-contain rounded-xl border border-gray-200 shadow-md max-h-[340px] print:max-h-[300px]"
        />
      </div>
    </div>
  );
}

function Callout({ type, children }) {
  let styles = "border-l-4 p-4 my-5 rounded-r-xl text-sm leading-relaxed print:my-3";
  let title = "";
  let icon = null;

  if (type === "important") {
    styles += " border-red-500 bg-red-50 text-red-950";
    title = "PENTING";
    icon = <AlertTriangle size={16} className="text-red-600 shrink-0" />;
  } else if (type === "warning") {
    styles += " border-amber-500 bg-amber-50 text-amber-950";
    title = "PERINGATAN";
    icon = <AlertTriangle size={16} className="text-amber-600 shrink-0" />;
  } else if (type === "note") {
    styles += " border-blue-500 bg-blue-50 text-blue-950";
    title = "CATATAN";
    icon = <Info size={16} className="text-blue-600 shrink-0" />;
  } else {
    styles += " border-teal-500 bg-teal-50 text-teal-950";
    title = "TIPS";
    icon = <Lightbulb size={16} className="text-teal-600 shrink-0" />;
  }

  return (
    <div className={styles}>
      <div className="flex items-center gap-2 font-bold mb-1.5 text-xs tracking-wider">
        {icon}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SantriGuidebook() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('pendahuluan');
  
  const sections = [
    { id: 'pendahuluan', label: '1. Pendahuluan' },
    { id: 'instalasi', label: '2. Instalasi & Login' },
    { id: 'dashboard', label: '3. Dashboard Utama' },
    { id: 'notifikasi', label: '4. Notifikasi' },
    { id: 'profil', label: '5. Profil & Akun' },
    { id: 'keuangan', label: '6. Tagihan & Keuangan' },
    { id: 'kegiatan', label: '7. Kegiatan Pesantren' },
    { id: 'pengaduan', label: '8. Pengaduan Pelanggaran' },
    { id: 'layanan', label: '9. Layanan Pesantren' },
    { id: 'scabies', label: '10. Kesehatan & Scabies' },
    { id: 'konsultasi', label: '11. Konsultasi Timkes' },
  ];

  const sectionRefs = {
    pendahuluan: useRef(null),
    instalasi: useRef(null),
    dashboard: useRef(null),
    notifikasi: useRef(null),
    profil: useRef(null),
    keuangan: useRef(null),
    kegiatan: useRef(null),
    pengaduan: useRef(null),
    layanan: useRef(null),
    scabies: useRef(null),
    konsultasi: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const ref = sectionRefs[section.id].current;
        if (ref) {
          const offsetTop = ref.offsetTop;
          const offsetHeight = ref.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const ref = sectionRefs[id].current;
    if (ref) {
      window.scrollTo({
        top: ref.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(id);
      setSidebarOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased print:bg-white print:text-black">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Menyembunyikan elemen non-print */
          .no-print, header, nav, button, footer {
            display: none !important;
          }
          
          /* Pengaturan Halaman Cetak */
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          
          body {
            font-size: 12pt !important;
            line-height: 1.5 !important;
            background: white !important;
            color: black !important;
          }

          .print-container {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Force bab utama mulai di halaman baru */
          .print-section-break {
            page-break-before: always !important;
          }

          h1, h2, h3, h4, h5, h6 {
            color: #047857 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }

          h1 { font-size: 24pt !important; margin-top: 30pt !important; margin-bottom: 15pt !important; border-bottom: 2px solid #e5e7eb !important; padding-bottom: 6pt !important; }
          h2 { font-size: 18pt !important; margin-top: 24pt !important; margin-bottom: 12pt !important; }
          h3 { font-size: 14pt !important; margin-top: 18pt !important; margin-bottom: 10pt !important; }
          h4 { font-size: 12pt !important; font-weight: bold !important; margin-top: 14pt !important; }

          p, li, blockquote {
            font-size: 11pt !important;
            text-align: left !important;
          }

          /* Memastikan list point & penomoran memiliki jarak kiri yang aman agar tidak kepotong */
          ul, ol {
            padding-left: 28pt !important;
            margin-bottom: 12pt !important;
          }

          li {
            margin-bottom: 4pt !important;
          }

          blockquote {
            background-color: #f9fafb !important;
            border-left: 4px solid #10b981 !important;
            padding: 10pt 15pt !important;
            margin: 12pt 0 !important;
            font-size: 10.5pt !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 15pt 0 !important;
            font-size: 10pt !important;
          }

          th, td {
            padding: 8pt 10pt !important;
            border-bottom: 1px solid #e5e7eb !important;
          }

          th {
            background-color: #f3f4f6 !important;
          }

          .print-image-row {
            display: flex !important;
            flex-direction: row !important;
            gap: 15pt !important;
            page-break-inside: avoid !important;
            margin: 15pt 0 !important;
          }
        }
      `}} />

      {/* Header Utama (no-print) */}
      <header className="no-print sticky top-0 z-40 bg-green-600 text-white shadow-md px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/santri')}
            className="p-2 hover:bg-green-600 rounded-full transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-green-200" />
            <div>
              <h1 className="text-base font-bold tracking-wide leading-tight">Buku Panduan SIM-Tren</h1>
              <p className="text-xs text-green-200">Peran: Santri</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-500 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            <Printer size={15} />
            <span>Cetak PDF</span>
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-green-600 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-row relative">
        
        {/* Sidebar Navigasi / Daftar Isi (no-print) */}
        <aside className={`
          no-print
          fixed inset-y-16 left-0 z-30 w-72 bg-white border-r border-gray-200 p-5 overflow-y-auto transition-transform duration-300
          md:sticky md:top-22 md:h-[calc(100vh-88px)] md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daftar Isi Panduan</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
                    ${activeSection === section.id 
                      ? 'bg-emerald-50 text-green-600 border-l-4 border-green-500 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <span>{section.label}</span>
                  <ChevronRight size={14} className={activeSection === section.id ? 'text-green-500' : 'text-gray-400'} />
                </button>
              ))}
            </nav>
          </div>
          
          <div className="pt-5 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">SIM-Tren Darunna'im Yapia</p>
          </div>
        </aside>

        {/* Overlay Backdrop Mobile (no-print) */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="no-print fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 print-container p-6 md:p-10 max-w-4xl mx-auto bg-white shadow-sm md:my-6 md:rounded-2xl border border-gray-100 print:border-none print:shadow-none print:my-0 print:rounded-none">
          
          {/* Cover Header di Print */}
          <div className="hidden print:flex flex-col items-center justify-center text-center border-b-4 border-green-600 pb-6 mb-8">
            <img src="/pwa-192x192.png" alt="Logo" className="w-16 h-16 rounded-2xl mb-3 border" />
            <h1 className="text-3xl font-extrabold text-green-600 tracking-wide m-0">BUKU PANDUAN PENGGUNAAN SIM-TREN</h1>
            <p className="text-base text-gray-600 uppercase tracking-widest mt-1">Role: Santri Pesantren Darun-Na'im Yapia</p>
          </div>

          {/* ── 1. PENDAHULUAN ────────────────────────────────── */}
          <section ref={sectionRefs.pendahuluan} className="mb-14 print:mb-8">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Pendahuluan</span>
            </h1>
            
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              <strong>SIM-Tren (Sistem Informasi Manajemen Pesantren)</strong> adalah aplikasi resmi Pondok Pesantren Modern Darun-Na'im Yapia yang dirancang khusus untuk memudahkan aktivitas digital santri selama menetap di pesantren.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Sebagai <strong>Santri</strong>, aplikasi ini membantu Anda untuk:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700 text-justify">
              <li>Memantau informasi kelas, kamar, dan data diri secara mandiri</li>
              <li>Melihat status tagihan dan riwayat pembayaran (pembayaran dilakukan oleh Orang Tua/Wali)</li>
              <li>Mengikuti perkembangan agenda dan kegiatan pesantren</li>
              <li>Mengajukan permohonan layanan pesantren (izin, pemeriksaan, dsb.)</li>
              <li>Memantau kondisi kesehatan dan hasil pemeriksaan scabies</li>
              <li>Berkonsultasi langsung dengan Tim Kesehatan pesantren</li>
            </ul>

            <Callout type="tip">
              SIM-Tren berbasis <strong>Progressive Web App (PWA)</strong>. Aplikasi ini dapat diinstal langsung di layar utama smartphone Anda seperti aplikasi biasa, tanpa perlu mengunduh dari Play Store atau App Store.
            </Callout>
          </section>

          {/* ── 2. INSTALASI & LOGIN ──────────────────────────── */}
          <section ref={sectionRefs.instalasi} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Instalasi & Login</span>
            </h1>

            <h2 className="text-xl font-bold text-green-600 mt-6 mb-3">2.1 Instalasi PWA (Progressive Web App)</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Cara termudah menggunakan SIM-Tren adalah dengan menginstalnya langsung di smartphone Anda:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6 text-gray-700 text-justify">
              <li>Buka <strong>browser</strong> di smartphone Anda (Google Chrome sangat direkomendasikan).</li>
              <li>Kunjungi alamat: <strong className="text-green-600">`https://ppdny.vercel.app`</strong></li>
              <li>Setelah halaman terbuka, cari ikon <strong>"Tambahkan ke layar utama"</strong> di browser Anda (biasanya di menu titik tiga ⋮ di pojok kanan atas browser).</li>
              <li>Ikuti instruksi browser untuk menambahkan aplikasi ke layar utama HP Anda.</li>
              <li>Aplikasi SIM-Tren kini tersedia di homescreen dan bisa dibuka seperti aplikasi biasa.</li>
            </ol>

            <h2 className="text-xl font-bold text-green-600 mt-6 mb-3">2.2 Cara Masuk (Login)</h2>
            <ol className="list-decimal pl-6 space-y-2 mb-4 text-gray-700 text-justify">
              <li>Buka aplikasi SIM-Tren di HP Anda.</li>
              <li>Pada halaman <strong>Login</strong>, masukkan email terdaftar atau nomor induk santri Anda (NIS) di kolom Identifier.</li>
              <li>Masukkan <strong>Kata Sandi</strong> Anda (ketuk ikon mata 👁 untuk menampilkan password).</li>
              <li>Ketuk tombol <strong>"Masuk"</strong>.</li>
            </ol>

            <Screenshot 
              desktop="/assets/guidebook/santri/login_desktop.png" 
              mobile="/assets/guidebook/santri/login_mobile.png" 
              alt="Halaman Login"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">2.3 Lupa Kata Sandi</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Apabila Anda lupa kata sandi Anda:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6 text-gray-700 text-justify">
              <li>Di bawah tombol masuk, ketuk tautan <strong>"Lupa kata sandi?"</strong>.</li>
              <li>Isi formulir pada modal yang muncul: pilih tipe akun <strong>"Santri"</strong>, lalu isi nama lengkap, NIS, dan No. HP Anda.</li>
              <li>Ketuk <strong>"Kirim ke WhatsApp"</strong>. Sistem akan membuka chat WhatsApp ke Admin pesantren untuk mereset password Anda.</li>
            </ol>

            <Screenshot 
              desktop="/assets/guidebook/santri/lupa_password_desktop.png" 
              mobile="/assets/guidebook/santri/lupa_password_mobile.png" 
              alt="Lupa Password"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">2.4 Cara Keluar (Logout)</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Untuk keluar dari aplikasi, ketuk ikon <strong>Keluar</strong> (pintu keluar merah) di menu header kanan atas (tampilan desktop) atau di bar navigasi paling bawah (tampilan mobile).
            </p>
          </section>

          {/* ── 3. DASHBOARD UTAMA ────────────────────────────── */}
          <section ref={sectionRefs.dashboard} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Dashboard Utama</span>
            </h1>
            
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Setelah berhasil login, Anda akan masuk ke halaman <strong>Dashboard Santri</strong> yang merangkum segala aktivitas Anda secara komprehensif.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/dashboard_desktop.png" 
              mobile="/assets/guidebook/santri/dashboard_mobile.png" 
              alt="Dashboard Utama"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">Elemen Dashboard Utama:</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700 text-justify">
              <li><strong>Kartu Selamat Datang</strong>: Menampilkan Nama, NIS, Kelas, Kamar asrama, Wali kelas, dan Pengawas kamar Anda.</li>
              <li><strong>Menu Cepat (Grid)</strong>: Akses pintasan instan ke fitur-fitur seperti Pendataan Diri, Keuangan, Kegiatan, Pengaduan, dan Scabies.</li>
              <li><strong>Kegiatan Hari Ini</strong>: Jadwal kegiatan yang wajib Anda ikuti pada hari ini.</li>
              <li><strong>Ringkasan Pengaduan & Aktivitas Kesehatan</strong>: Menampilkan data screening kesehatan scabies terakhir dan catatan laporan pelanggaran terbaru atas nama Anda.</li>
              <li><strong>Status Tagihan</strong>: Menampilkan kartu ringkasan status keuangan pesantren Anda.</li>
            </ul>
          </section>

          {/* ── 4. NOTIFIKASI ─────────────────────────────────── */}
          <section ref={sectionRefs.notifikasi} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Notifikasi</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Fitur Notifikasi (ikon lonceng 🔔 di pojok kanan atas) menyimpan pemberitahuan penting seperti tagihan baru, ulasan kegiatan, konfirmasi permohonan layanan, dan screening scabies terbaru.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/notifikasi_desktop.png" 
              mobile="/assets/guidebook/santri/notifikasi_mobile.png" 
              alt="Notifikasi"
            />
          </section>

          {/* ── 5. PROFIL & AKUN ──────────────────────────────── */}
          <section ref={sectionRefs.profil} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Profil & Akun</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Halaman ini digunakan untuk mengelola data pribadi, mengganti foto profil, mengganti password, dan menautkan akun Orang Tua.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/profil_desktop.png" 
              mobile="/assets/guidebook/santri/profil_mobile.png" 
              alt="Profil Santri"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">5.1 Mengubah Foto Profil</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk ikon kamera di atas foto profil Anda, pilih file foto dari HP/desktop Anda (Format: JPG/PNG, maksimal 2MB).
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/profil_upload_foto_desktop.png" 
              mobile="/assets/guidebook/santri/profil_upload_foto_mobile.png" 
              alt="Upload Foto"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">5.2 Data Diri & Data Kamar/Kelas</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Isi data diri Anda secara lengkap mulai dari tempat lahir, alamat, jenis kelamin, dan nomor HP aktif.
            </p>

            <Callout type="important">
              Data diri Anda akan <strong>dikunci (locked) otomatis</strong> secara permanen setelah semua formulir wajib terisi. Jika ada perubahan data setelah terkunci, silakan hubungi Admin pesantren.
            </Callout>

            <Screenshot 
              desktop="/assets/guidebook/santri/profil_data_diri_desktop.png" 
              mobile="/assets/guidebook/santri/profil_data_diri_mobile.png" 
              alt="Data Diri"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">5.3 Menautkan Data Orang Tua / Wali</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Hubungkan akun Anda dengan akun Orang Tua Anda agar mereka dapat memantau pembayaran dan tagihan Anda di pesantren. Jika data sudah diinput, statusnya akan terkunci.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/profil_ortu_locked_desktop.png" 
              mobile="/assets/guidebook/santri/profil_ortu_locked_mobile.png" 
              alt="Orang Tua"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">5.4 Mengganti Password</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk tombol <strong>"Ganti Kata Sandi"</strong>, masukkan password baru Anda (minimal 6 karakter) dan konfirmasi kembali.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/profil_modal_ganti_password_desktop.png" 
              mobile="/assets/guidebook/santri/profil_modal_ganti_password_mobile.png" 
              alt="Ganti Password"
            />
          </section>

          {/* ── 6. TAGIHAN & KEUANGAN ─────────────────────────── */}
          <section ref={sectionRefs.keuangan} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Tagihan & Keuangan</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Halaman ini menyajikan status tagihan Anda (SPP, uang buku, dsb.) baik yang belum dibayar, menunggu konfirmasi, maupun yang sudah lunas.
            </p>

            <Callout type="note">
              Santri <strong>hanya dapat memantau</strong> informasi tagihan. Pembayaran tagihan dan upload bukti transfer harus dilakukan oleh Orang Tua/Wali melalui akun wali masing-masing.
            </Callout>

            <Screenshot 
              desktop="/assets/guidebook/santri/keuangan_desktop.png" 
              mobile="/assets/guidebook/santri/keuangan_mobile.png" 
              alt="Keuangan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">Detail & Riwayat Pembayaran Tagihan:</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk tombol <strong>"Lihat Detail"</strong> pada tagihan mana saja untuk membuka rincian log pembayaran dan melihat status verifikasi pembayaran oleh Pengurus.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/keuangan_modal_detail_desktop.png" 
              mobile="/assets/guidebook/santri/keuangan_modal_detail_mobile.png" 
              alt="Detail Tagihan"
            />
          </section>

          {/* ── 7. KEGIATAN PESANTREN ─────────────────────────── */}
          <section ref={sectionRefs.kegiatan} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Kegiatan Pesantren</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Di halaman ini Anda dapat melihat jadwal, agenda harian, dan ulasan kegiatan pesantren yang wajib Anda ikuti.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/kegiatan_desktop.png" 
              mobile="/assets/guidebook/santri/kegiatan_mobile.png" 
              alt="Daftar Kegiatan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">7.1 Detail Kegiatan</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk tombol <strong>"Detail Kegiatan"</strong> pada salah satu agenda untuk mengetahui deskripsi kegiatan, penanggung jawab, lokasi, dan waktu mulainya.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/kegiatan_modal_detail_desktop.png" 
              mobile="/assets/guidebook/santri/kegiatan_modal_detail_mobile.png" 
              alt="Detail Kegiatan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">7.2 Mengisi Ulasan / Feedback Kegiatan</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Setelah suatu kegiatan selesai dilaksanakan, Anda dapat berkontribusi dengan mengirimkan ulasan. Ketuk tombol <strong>"Beri Ulasan"</strong> di dalam modal detail, beri bintang (1–5), dan ketik ulasan Anda di form yang disediakan.
            </p>
          </section>

          {/* ── 8. LAPORAN PELANGGARAN ────────────────────────── */}
          <section ref={sectionRefs.pengaduan} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Pengaduan Pelanggaran</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Halaman ini menyajikan rekaman pelanggaran (kronologi kedisiplinan) atas nama Anda yang dilaporkan oleh Ustadz atau Pengurus.
            </p>

            <Callout type="important">
              Santri <strong>tidak dapat</strong> membuat pengaduan baru atau mengubah status pengaduan. Halaman ini bertindak sebagai media transparansi agar Anda dapat memantau status laporan Anda.
            </Callout>

            <Screenshot 
              desktop="/assets/guidebook/santri/pengaduan_desktop.png" 
              mobile="/assets/guidebook/santri/pengaduan_mobile.png" 
              alt="Pengaduan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">Detail & Riwayat Percakapan Pengaduan:</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk kartu laporan pelanggaran Anda untuk melihat rincian laporan, nama pelapor, tanggal, dan riwayat tanggapan/solusi pelanggaran dari Ustadz.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/pengaduan_modal_detail_desktop.png" 
              mobile="/assets/guidebook/santri/pengaduan_modal_detail_mobile.png" 
              alt="Rincian Pengaduan"
            />
          </section>

          {/* ── 9. LAYANAN PESANTREN ──────────────────────────── */}
          <section ref={sectionRefs.layanan} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Layanan Pesantren</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Melalui fitur ini, Anda dapat mengajukan permohonan resmi kepada pengurus, seperti Izin Pulang, Permohonan Obat, Layanan Surat Menyurat, dan lainnya.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/layanan_desktop.png" 
              mobile="/assets/guidebook/santri/layanan_mobile.png" 
              alt="Layanan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">9.1 Detail Layanan & Prosedur Pengajuan</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk layanan yang Anda inginkan, baca deskripsi serta estimasi pengerjaannya, lalu klik <strong>"Ajukan Sekarang"</strong>. Isi formulir permohonan dan simpan.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/layanan_modal_detail_desktop.png" 
              mobile="/assets/guidebook/santri/layanan_modal_detail_mobile.png" 
              alt="Detail Layanan"
            />

            <Screenshot 
              desktop="/assets/guidebook/santri/layanan_modal_form_desktop.png" 
              mobile="/assets/guidebook/santri/layanan_modal_form_mobile.png" 
              alt="Form Layanan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">9.2 Riwayat Pengajuan & Unduh Bukti PDF</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Di halaman Riwayat Layanan, Anda dapat memantau permohonan Anda (Menunggu, Diproses, Selesai, atau Batal). Ketuk <strong>"Lihat Rincian Log"</strong> pada layanan yang berstatus Selesai untuk mengunduh bukti permohonan resmi dalam format PDF.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/riwayat_layanan_desktop.png" 
              mobile="/assets/guidebook/santri/riwayat_layanan_mobile.png" 
              alt="Riwayat Layanan"
            />

            <Screenshot 
              desktop="/assets/guidebook/santri/riwayat_layanan_modal_detail_desktop.png" 
              mobile="/assets/guidebook/santri/riwayat_layanan_modal_detail_mobile.png" 
              alt="Log Log Layanan"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">9.3 Mengirim Feedback Layanan</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Beri penilaian dan bintang ulasan pada layanan yang telah diselesaikan untuk perbaikan kinerja petugas pelayanan pesantren.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/riwayat_layanan_modal_feedback_desktop.png" 
              mobile="/assets/guidebook/santri/riwayat_layanan_modal_feedback_mobile.png" 
              alt="Feedback Layanan"
            />
          </section>

          {/* ── 10. KESEHATAN & SCABIES ───────────────────────── */}
          <section ref={sectionRefs.scabies} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Kesehatan & Scabies</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Fitur khusus untuk memantau pencegahan dan screening infeksi scabies di lingkungan asrama pesantren.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/scabies_dashboard_desktop.png" 
              mobile="/assets/guidebook/santri/scabies_dashboard_mobile.png" 
              alt="Dashboard Scabies"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">10.1 Membaca Artikel Edukasi Scabies</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Akses modul edukasi untuk membaca panduan penanganan, tips kesehatan, dan artikel-artikel PHBS.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/scabies_materi_desktop.png" 
              mobile="/assets/guidebook/santri/scabies_materi_mobile.png" 
              alt="Daftar Materi Scabies"
            />

            <Screenshot 
              desktop="/assets/guidebook/santri/scabies_detail_materi_desktop.png" 
              mobile="/assets/guidebook/santri/scabies_detail_materi_mobile.png" 
              alt="Detail Materi Scabies"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">10.2 Mengajukan Materi Pengalaman</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Tulis dan ajukan pengalaman pribadi Anda mengatasi scabies agar dapat dipublikasikan dan dibaca oleh santri lainnya setelah divalidasi oleh Tim Kesehatan.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/scabies_modal_ajukan_materi_desktop.png" 
              mobile="/assets/guidebook/santri/scabies_modal_ajukan_materi_mobile.png" 
              alt="Ajukan Materi"
            />
          </section>

          {/* ── 11. KONSULTASI TIM KESEHATAN ──────────────────── */}
          <section ref={sectionRefs.konsultasi} className="mb-14 print:mb-8 print-section-break">
            <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
              <span>Konsultasi Tim Kesehatan</span>
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Melalui fitur ini, Anda dapat berkonsultasi (chat) secara langsung dengan anggota Tim Kesehatan pesantren yang bertugas.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/konsultasi_desktop.png" 
              mobile="/assets/guidebook/santri/konsultasi_mobile.png" 
              alt="Konsultasi Timkes"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">11.1 Memulai Sesi Percakapan</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Pilih anggota tim kesehatan yang berstatus <strong>"Tersedia"</strong>, lalu ketuk tombol <strong>"Mulai Konsultasi"</strong> untuk masuk ke dalam ruang percakapan. Jika status "Full", Anda akan masuk daftar antrian.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/konsultasi_room_riwayat_desktop.png" 
              mobile="/assets/guidebook/santri/konsultasi_room_riwayat_mobile.png" 
              alt="Ruang Chat Konsultasi"
            />

            <h2 className="text-xl font-bold text-green-600 mt-8 mb-3">11.2 Mengakses Riwayat Konsultasi</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              Ketuk tab <strong>"Riwayat Percakapan"</strong> untuk melihat sesi chat konsultasi yang telah ditutup sebelumnya dalam format baca-saja.
            </p>

            <Screenshot 
              desktop="/assets/guidebook/santri/konsultasi_riwayat_desktop.png" 
              mobile="/assets/guidebook/santri/konsultasi_riwayat_mobile.png" 
              alt="Riwayat Konsultasi"
            />
          </section>

          {/* Footer Dokumentasi di Print */}
          <div className="hidden print:block text-center border-t border-gray-200 pt-6 mt-12 text-xs text-gray-400">
            <p>Buku Panduan SIM-Tren Pesantren Darun-Na'im Yapia © {new Date().getFullYear()}</p>
          </div>

        </main>
      </div>
    </div>
  );
}
