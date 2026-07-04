import React from "react";
import { X, User, Phone, MapPin, BookOpen, AlertCircle } from "lucide-react";
import ProfileAvatar from './ProfileAvatar';

export default function DetailSantriModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div onClick={onClose} className="fixed cursor-pointer inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div onClick={(e) => e.stopPropagation()} className="cursor-default bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-[url('/header.png')] bg-cover bg-center p-6 relative text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 p-2 rounded-full transition"><X size={20} /></button>
          <ProfileAvatar
            fotoProfil={data.foto_profil}
            nama={data.nama}
            className="w-24 h-24 mx-auto border-4 border-white shadow-lg mb-3"
            iconSize={40}
          />
          <h3 className="text-xl font-bold text-white truncate">{data.nama}</h3>
          <p className="text-green-100 text-sm">NIS: {data.nip}</p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] [scrollbar-width:none]">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kelas Aktif</p><div className="flex items-center gap-2 text-gray-700 font-bold"><BookOpen size={14} className="text-green-600" /> <span>{data.kelas_aktif || "Tanpa Kelas"}</span></div></div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kamar Aktif</p><div className="flex items-center gap-2 text-gray-700 font-bold"><User size={14} className="text-green-600" /> <span>{data.kamar_aktif || "Tanpa Kamar"}</span></div></div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Informasi Kontak</h4>
            <div className="flex items-start gap-3"><Phone size={16} className="text-green-600 mt-1" /><div className="text-sm font-medium text-gray-700"><p className="text-xs text-gray-400 mb-0.5">Nomor Handphone</p>{data.no_hp || "-"}</div></div>
            <div className="flex items-start gap-3"><MapPin size={16} className="text-green-600 mt-1" /><div className="text-sm font-medium text-gray-700"><p className="text-xs text-gray-400 mb-0.5">Alamat Lengkap</p><p className="leading-relaxed">{data.alamat || "Alamat belum diatur."}</p></div></div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Kontak Orang Tua / Wali</h4>
            {data.kontak_orangtua?.length > 0 ? (
              <div className="space-y-3">
                {data.kontak_orangtua.map((kontak, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <ProfileAvatar fotoProfil={kontak.foto_profil} nama={kontak.nama} className="w-10 h-10 border border-gray-100 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{kontak.nama}</p>
                      <p className="text-[10px] text-gray-500 mb-1">{kontak.hubungan}</p>
                      <a href={`https://wa.me/${kontak.no_hp?.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-green-600 hover:underline">Hubungi WhatsApp</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 flex items-center text-gray-400 text-xs italic"><AlertCircle size={14} className="mr-2" /> Belum ada data orang tua tertaut.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}