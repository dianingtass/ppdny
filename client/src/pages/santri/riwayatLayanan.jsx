import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import DetailRiwayatLayananModal from '../../components/DetailRiwayatLayananModal';
import FeedbackModal from '../../components/FeedbackModal';
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";

export default function RiwayatLayananList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLayanan, setSelectedLayanan] = useState("");
  
  const { message, showAlert, clearAlert } = useAlert();

  // State Modals
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [feedbackItem, setFeedbackItem] = useState(null);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchRiwayat = async () => {
    try {
      const res = await api.get('/santri/layanan/riwayat');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat riwayat layanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // --- SUBMIT FEEDBACK ---
  const handleSubmitFeedback = async (idRiwayat, rating, review) => {
    setIsSavingFeedback(true);
    try {
        await api.post('/santri/layanan/riwayat/feedback', {
            id_riwayat: idRiwayat,
            rating: rating,
            isi_text: review
        });

        showAlert("success", "Terima kasih atas ulasan Anda!");
        setFeedbackItem(null); // Tutup modal
        fetchRiwayat(); // Refresh data biar tombol feedback hilang
    } catch (err) {
        console.error(err);
        showAlert("error", "Gagal mengirim ulasan");
    } finally {
        setIsSavingFeedback(false);
    }
  };

  // --- STATUS HELPERS ---
  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('selesai') || s.includes('diterima')) return 'text-green-600 bg-green-50 border-green-100';
    if (s.includes('batal') || s.includes('tolak')) return 'text-red-600 bg-red-50 border-red-100';
    return 'text-yellow-600 bg-yellow-50 border-yellow-100';
  };

  const getStatusIcon = (status) => {
    const s = status.toLowerCase();
    if (s.includes('selesai') || s.includes('diterima')) return <CheckCircle size={14} className="mr-1.5" />;
    if (s.includes('batal') || s.includes('tolak')) return <XCircle size={14} className="mr-1.5" />;
    return <Clock size={14} className="mr-1.5" />;
  };

  // Dynamic filter options for Layanan Types
  const layananOptions = Array.from(
    new Set(data.map((item) => item.nama_layanan).filter(Boolean))
  ).map((lay) => ({ value: lay, label: lay }));

  // Filter Search & Dropdown Filters
  const filteredData = data.filter(item => {
    const matchSearch = item.nama_layanan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !selectedStatus || item.status === selectedStatus;
    const matchLayanan = !selectedLayanan || item.nama_layanan === selectedLayanan;
    return matchSearch && matchStatus && matchLayanan;
  });

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedStatus) count++;
    if (selectedLayanan) count++;
    return count;
  };

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedLayanan("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header Gradient */}
      <div className="bg-[url('/header.png')] bg-cover bg-center text-white p-6 pb-24 shadow-lg relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
                onClick={() => navigate("/santri/layanan")} 
                className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition"
            >
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold">Riwayat Pengajuan</h1>
                <p className="text-green-100 text-sm">Status dan histori layanan anda</p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            <SearchBar
              placeholder="Cari riwayat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              className="flex-1 text-gray-800"
            />
            <FilterDropdown
              activeCount={getActiveFilterCount()}
              onReset={resetFilters}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status Layanan</label>
                  <FilterSelect
                    placeholder="Semua Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    options={[
                      { value: "Menunggu", label: "Menunggu" },
                      { value: "Proses", label: "Proses" },
                      { value: "Selesai", label: "Selesai" },
                      { value: "Batal", label: "Batal" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Jenis Layanan</label>
                  <FilterSelect
                    placeholder="Semua Layanan"
                    value={selectedLayanan}
                    onChange={(e) => setSelectedLayanan(e.target.value)}
                    options={layananOptions}
                  />
                </div>
              </div>
            </FilterDropdown>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        {loading ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center font-medium text-gray-500">
                Memuat riwayat...
            </div>
        ) : (
            <div className="space-y-4">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div 
                            key={item.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{item.nama_layanan}</h3>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <Calendar size={12} className="mr-1.5" />
                                        {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(item.status)}`}>
                                    {getStatusIcon(item.status)}
                                    <span className="capitalize">{item.status}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 bg-gray-50 p-3 rounded-xl">{item.keperluan}</p>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-50">
                                <button 
                                    onClick={() => setSelectedDetailId(item.id)}
                                    className="text-xs text-green-600 font-bold hover:underline"
                                >
                                    Lihat Rincian Log
                                </button>
                                
                                {item.status.toLowerCase() === 'selesai' && !item.feedback_layanan && (
                                    <button 
                                        onClick={() => setFeedbackItem(item)}
                                        className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                                    >
                                        Beri Ulasan
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100 text-gray-400">
                        Tidak ada riwayat pengajuan layanan.
                    </div>
                )}
            </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <DetailRiwayatLayananModal 
        isOpen={!!selectedDetailId}
        idRiwayat={selectedDetailId}
        onClose={() => setSelectedDetailId(null)}
      />

      {/* FEEDBACK MODAL */}
      {feedbackItem && (
          <FeedbackModal 
              isOpen={!!feedbackItem}
              onClose={() => setFeedbackItem(null)}
              saving={isSavingFeedback}
              onSubmit={(rating, text) => handleSubmitFeedback(feedbackItem.id, rating, text)}
              title={feedbackItem.nama_layanan}
          />
      )}
    </div>
  );
}