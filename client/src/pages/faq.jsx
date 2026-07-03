import { useEffect, useState } from "react";
import { ChevronDown, CircleHelp, Loader2, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import api from "../config/api";
import AlertToast from "../components/AlertToast";
import { useAlert } from "../hooks/useAlert";

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  
  // Filter & Search states
  const [activeTab, setActiveTab] = useState("Semua"); // Semua, Umum, Kesehatan
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ pertanyaan: "", jawaban: "", kategori: "Umum", urutan: 1 });
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const { message, showAlert, clearAlert } = useAlert();

  // Get current user role
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = String(currentUser.role || "guest").toLowerCase().replace(/\s/g, '');
  const isManageable = ["admin", "pengurus", "timkesehatan"].includes(userRole);

  const fetchFaq = async () => {
    try {
      const res = await api.get("/global/faq");
      const rows = res.data?.data || [];
      setFaqs(rows);
    } catch (error) {
      console.error("Gagal memuat FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  // Check if user has permission to manage a specific category
  const canManageCategory = (category) => {
    if (userRole === "admin") return true;
    if (userRole === "pengurus" && category === "Umum") return true;
    if (userRole === "timkesehatan" && category === "Kesehatan") return true;
    return false;
  };

  // Determine allowed categories for dropdown input
  const getAllowedCategories = () => {
    if (userRole === "admin") return ["Umum", "Kesehatan"];
    if (userRole === "pengurus") return ["Umum"];
    if (userRole === "timkesehatan") return ["Kesehatan"];
    return [];
  };

  // Filtered & Sorted FAQ list
  const filteredFaqs = faqs
    .filter(faq => {
      if (activeTab === "Semua") return true;
      return faq.kategori === activeTab;
    })
    .sort((a, b) => {
      let priorityA = 2;
      let priorityB = 2;

      if (userRole === "timkesehatan") {
        priorityA = a.kategori === "Kesehatan" ? 1 : 2;
        priorityB = b.kategori === "Kesehatan" ? 1 : 2;
      } else {
        priorityA = a.kategori === "Umum" ? 1 : 2;
        priorityB = b.kategori === "Umum" ? 1 : 2;
      }

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return (a.urutan || 0) - (b.urutan || 0);
    });

  // Open modal for Create
  const handleCreateClick = () => {
    const allowed = getAllowedCategories();
    setFaqForm({
      pertanyaan: "",
      jawaban: "",
      kategori: allowed[0] || "Umum",
      urutan: faqs.length + 1
    });
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEditClick = (e, item) => {
    e.stopPropagation(); // Prevent accordion from toggling
    setFaqForm({
      pertanyaan: item.pertanyaan,
      jawaban: item.jawaban,
      kategori: item.kategori,
      urutan: item.urutan
    });
    setSelectedFaq(item);
    setIsModalOpen(true);
  };

  // Open modal for Delete
  const handleDeleteClick = (e, item) => {
    e.stopPropagation(); // Prevent accordion from toggling
    setSelectedFaq(item);
    setIsDeleteOpen(true);
  };

  // Submit Create or Edit Form
  const handleSubmitFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.pertanyaan.trim() || !faqForm.jawaban.trim()) {
      showAlert("error", "Pertanyaan dan Jawaban wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      if (selectedFaq) {
        // Edit mode
        const res = await api.put(`/global/faq/${selectedFaq.id_faq}`, faqForm);
        if (res.data.success) {
          showAlert("success", "FAQ berhasil diperbarui!");
          setIsModalOpen(false);
          fetchFaq();
        }
      } else {
        // Create mode
        const res = await api.post("/global/faq", faqForm);
        if (res.data.success) {
          showAlert("success", "FAQ baru berhasil ditambahkan!");
          setIsModalOpen(false);
          fetchFaq();
        }
      }
    } catch (error) {
      console.error(error);
      showAlert("error", error.response?.data?.message || "Gagal menyimpan data FAQ.");
    } finally {
      setSaving(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedFaq) return;
    setSaving(true);
    try {
      const res = await api.delete(`/global/faq/${selectedFaq.id_faq}`);
      if (res.data.success) {
        showAlert("success", "FAQ berhasil dihapus!");
        setIsDeleteOpen(false);
        fetchFaq();
      }
    } catch (error) {
      console.error(error);
      showAlert("error", error.response?.data?.message || "Gagal menghapus FAQ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">FAQ Pesantren</h1>
          <p className="text-gray-500 text-sm">Pertanyaan yang sering ditanyakan seputar sistem dan modul kesehatan.</p>
        </div>
        {isManageable && (
          <button
            onClick={handleCreateClick}
            className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2 active:scale-95 shadow-sm"
          >
            <Plus size={18} /> Tambah FAQ
          </button>
        )}
      </div>

      {/* Tabs Filter Kategori */}
      <div className="flex border-b border-gray-200">
        {["Semua", "Umum", "Kesehatan"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setOpenId(null); }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? "border-green-600 text-green-600 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">Belum ada data FAQ untuk kategori ini.</div>
        ) : (
          filteredFaqs.map((item) => {
            const isOpen = openId === item.id_faq;
            const userCanManage = canManageCategory(item.kategori);

            return (
              <div key={item.id_faq} className="border border-gray-100 rounded-xl overflow-hidden hover:border-green-100 transition duration-200">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id_faq)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition"
                >
                  <span className="text-left text-sm sm:text-base font-semibold text-gray-800 flex items-start gap-2">
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                        item.kategori === 'Kesehatan' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {item.kategori}
                      </span>
                      <p>{item.pertanyaan}</p>
                    </div>
                  </span>
                  
                  <div className="flex items-center gap-3">
                    {isManageable && userCanManage && (
                      <div className="flex items-center gap-1.5 mr-2">
                        <button
                          onClick={(e) => handleEditClick(e, item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit FAQ"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus FAQ"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] border-t border-gray-100" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 py-4 text-sm text-gray-700 leading-relaxed bg-white whitespace-pre-wrap">
                      {item.jawaban}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE & EDIT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 pb-0 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{selectedFaq ? "Edit FAQ" : "Tambah FAQ Baru"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">Tutup</button>
            </div>
            
            <form onSubmit={handleSubmitFaq} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori FAQ</label>
                {getAllowedCategories().length > 1 ? (
                  <select
                    value={faqForm.kategori}
                    onChange={(e) => setFaqForm({ ...faqForm, kategori: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none text-sm font-medium"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                    {faqForm.kategori}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pertanyaan</label>
                <textarea
                  value={faqForm.pertanyaan}
                  onChange={(e) => setFaqForm({ ...faqForm, pertanyaan: e.target.value })}
                  placeholder="Ketik pertanyaan FAQ..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Jawaban</label>
                <textarea
                  value={faqForm.jawaban}
                  onChange={(e) => setFaqForm({ ...faqForm, jawaban: e.target.value })}
                  placeholder="Ketik jawaban FAQ..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan Tampil (Opsional)</label>
                <input
                  type="number"
                  value={faqForm.urutan}
                  onChange={(e) => setFaqForm({ ...faqForm, urutan: parseInt(e.target.value) || 1 })}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none text-sm font-semibold text-gray-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={28} />
              <h3 className="text-lg font-bold text-gray-900 font-bold">Hapus FAQ</h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus pertanyaan FAQ ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={saving}
                className="flex-1 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={saving}
                className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
