import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { ArrowLeft, User, Loader2, MessageSquareText } from 'lucide-react';
import DetailPengaduanModal from '../../components/DetailPengaduanModal'; 
import { getImageUrl } from '../../utils/imageUrl';
import ProfileAvatar from '../../components/ProfileAvatar';

// --- HELPER: FORMAT JAM MENIT ---
const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false,
    timeZone: 'UTC'
  });
};

export default function PengaduanList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/santri/pengaduan');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full overflow-x-hidden">
      
      {/* Header gradient hijau premium */}
      <div className="bg-[url('/header.png')] bg-cover bg-center text-white p-6 pb-40 shadow-lg relative md:pb-32">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/santri")} className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition">
              <ArrowLeft size={24} />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">Laporan Pelanggaran</h1>
              <p className="text-green-100 text-sm truncate">Daftar laporan kedisiplinan atas nama Anda</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 md:-mt-24 space-y-4">
        
        {/* Timeline List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <Loader2 className="animate-spin h-8 w-8 text-green-500 mx-auto mb-2"/>
                <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : data.length > 0 ? (
            data.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedId(item.id)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Indikator status */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'Selesai' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>

                <div className="flex gap-4 items-start pl-2">
                  
                  {/* Avatar Pelapor */}
                  <div className="flex-shrink-0 pt-1">
                    <ProfileAvatar fotoProfil={item.pelapor.foto} nama={item.pelapor.nama} className="w-10 h-10 border border-green-100 flex-shrink-0" iconSize={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                             <span className="font-semibold text-gray-700">{item.pelapor.nama}</span>
                             <span>•</span>
                             {/* Waktu format baru */}
                             <span>{formatTime(item.waktu)}</span>
                          </p>
                          <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-green-600 transition">
                            {item.judul}
                          </h3>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 mt-1">
                      {item.deskripsi}
                    </p>

                    {/* Footer List Item */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-between pt-2 border-t border-gray-50 mt-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-md
                          ${item.status === 'Selesai' ? 'text-green-700 bg-green-50 border border-green-100' : 'text-yellow-700 bg-yellow-50 border border-yellow-100'}`}>
                          {item.status || 'Aktif'}
                        </div>
                        {item.jumlah_tanggapan > 0 && (
                          <div className="text-xs text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100 font-medium gap-1">
                            <MessageSquareText size={14} className="text-gray-400" />
                            <span>{item.jumlah_tanggapan}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-green-500" />
               </div>
               <h3 className="text-lg font-bold text-gray-800">Tidak ada laporan</h3>
               <p className="text-gray-500 text-sm">Alhamdulillah, belum ada laporan pelanggaran atas nama anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Render Modal Terpisah */}
      {selectedId && (
        <DetailPengaduanModal 
          idAduan={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </div>
  );
}