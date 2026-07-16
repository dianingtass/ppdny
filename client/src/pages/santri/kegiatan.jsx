import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { 
  ArrowLeft, Loader2, Calendar, Clock, MapPin
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";

// Import Modals
import DetailKegiatanModal from "../../components/DetailKegiatanModal";
import FeedbackModal from "../../components/FeedbackModal";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";

export default function KegiatanSantri() {
  const [loading, setLoading] = useState(true);
  const [kegiatans, setKegiatans] = useState([]);
  const { message, showAlert, clearAlert } = useAlert();
  
  // Filter State
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua"); 

  // Modal State
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchKegiatan();
  }, [filterType]); // Refetch kalau filter ganti

  const fetchKegiatan = async () => {
    try {
      setLoading(true);
      // Query Params: ?search=...&type=...
      const res = await api.get(`/santri/kegiatan/?search=${search}&type=${filterType === "Semua" ? "" : filterType}`);
      if (res.data.success) {
        setKegiatans(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat daftar kegiatan");
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
        fetchKegiatan();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Handlers Modal
  const handleOpenDetail = (item) => {
    setSelectedKegiatan(item);
    setIsDetailOpen(true);
  };

  const handleOpenFeedback = (item) => {
    setSelectedKegiatan(item);
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = async (idKegiatan, rating, isiText) => {
    setIsSaving(true);
    try {
        const res = await api.post("/santri/kegiatan/feedback", {
            id_kegiatan: idKegiatan,
            rating: rating,
            isi_text: isiText
        });

        if (res.data.success) {
            showAlert("success", "Feedback berhasil dikirim!");
            setIsFeedbackOpen(false);
            setIsDetailOpen(false);
            fetchKegiatan(); // Refresh data biar tombol feedback hilang
        }
    } catch (err) {
        console.error(err);
        showAlert("error", err.response?.data?.message || "Gagal mengirim feedback");
    } finally {
        setIsSaving(false);
    }
  };

  if (loading && kegiatans.length === 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-green-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10 w-full overflow-x-hidden">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header */}
      <div className="bg-[url('/header.png')] bg-cover bg-center text-white p-6 pb-40 shadow-lg md:pb-24">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/santri")} className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition"><ArrowLeft size={24} /></button>
          <div className="min-w-0"><h1 className="text-2xl font-bold truncate">Daftar Kegiatan</h1><p className="text-green-100 text-sm truncate">Informasi agenda dan kegiatan santri</p></div>
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-32 space-y-8 relative z-10 md:-mt-16">
        
        {/* Search + Filter */}
        <div className="flex gap-3 items-center w-full">
          <SearchBar
            placeholder="Cari Kegiatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="flex-1"
          />
          <FilterDropdown
            activeCount={filterType !== "Semua" ? 1 : 0}
            onReset={() => setFilterType("Semua")}
          >
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Waktu Kegiatan</label>
              <FilterSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: "Semua", label: "Semua Waktu" },
                  { value: "Mendatang", label: "Akan Datang" },
                  { value: "Selesai", label: "Selesai" },
                ]}
              />
            </div>
          </FilterDropdown>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-4 hidden md:block">Kegiatan Mendatang & Riwayat</h2>

        {kegiatans.length > 0 ? (
            kegiatans.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Placeholder Gambar */}
                    <div className="w-full md:w-48 h-40 bg-green-50 rounded-xl flex-shrink-0 flex items-center justify-center text-green-500">
                        <Calendar size={32} strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1 w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.nama}</h3>
                        <p className="text-gray-500 text-sm mb-1 flex items-center"><Calendar size={14} className="mr-2" /> {item.tanggal}</p>
                        <p className="text-gray-500 text-sm mb-1 flex items-center"><MapPin size={14} className="mr-2" /> {item.lokasi}</p>
                        <p className="text-gray-500 text-sm mb-4 flex items-center"><Clock size={14} className="mr-2" /> {item.waktu}</p>
                        
                        <button 
                            onClick={() => handleOpenDetail(item)}
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Detail Kegiatan
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100 text-gray-500">
                Belum ada kegiatan untuk saat ini.
            </div>
        )}
      </div>

      {/* MODALS */}
      {selectedKegiatan && (
          <>
              <DetailKegiatanModal 
                  isOpen={isDetailOpen}
                  onClose={() => setIsDetailOpen(false)}
                  data={selectedKegiatan}
                  onFeedbackClick={handleOpenFeedback}
              />
              
              <FeedbackModal 
                  isOpen={isFeedbackOpen}
                  onClose={() => setIsFeedbackOpen(false)}
                  item={selectedKegiatan}
                  onSubmit={handleSubmitFeedback}
                  saving={isSaving}
              />
          </>
      )}

    </div>
  );
}