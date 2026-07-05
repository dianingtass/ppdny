import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap, WifiOff, Bell } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);

    if (alreadyInstalled || dismissed || !isMobile) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Tunda 3 detik supaya tidak muncul bareng splash screen
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    // Simpan pilihan dismiss agar tidak muncul lagi
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay backdrop blur */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Banner utama — muncul dari bawah */}
      <div
        role="dialog"
        aria-label="Instal aplikasi SIM-Tren"
        className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up"
        style={{ fontFamily: '"Geist", sans-serif' }}
      >
        <div className="mx-3 mb-4 rounded-2xl bg-white shadow-2xl overflow-hidden">

          {/* Header hijau */}
          <div className="bg-green-600 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Smartphone size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Instal SIM-Tren</p>
                <p className="text-green-200 text-xs">Akses lebih cepat dari homescreen</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Tutup"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <div className="flex items-start gap-3 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="Logo SIM-Tren"
                className="w-14 h-14 rounded-2xl object-contain flex-shrink-0 p-1 shadow-sm"
              />
              <div>
                <p className="text-gray-800 font-medium text-sm mb-1">
                  Tambahkan ke layar utama HP Anda
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Buka SIM-Tren lebih cepat tanpa perlu buka browser setiap saat. Bekerja bahkan saat koneksi lambat.
                </p>
              </div>
            </div>

            {/* Fitur singkat */}
            <div className="flex gap-2 mb-4">
              {[
                { icon: <Zap size={13} className="text-yellow-600 shrink-0" />, label: 'Cepat' },
                { icon: <WifiOff size={13} className="text-yellow-600 shrink-0" />, label: 'Offline' },
                { icon: <Bell size={13} className="text-yellow-600 shrink-0" />, label: 'Notifikasi' }
              ].map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium"
                >
                  {f.icon}
                  <span>{f.label}</span>
                </span>
              ))}
            </div>

            {/* Tombol aksi */}
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Nanti saja
              </button>
              <button
                onClick={handleInstall}
                id="pwa-install-btn"
                className="flex-[2] py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all shadow-sm shadow-green-200"
              >
                <Download size={16} />
                Instal Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }
      `}</style>
    </>
  );
}
