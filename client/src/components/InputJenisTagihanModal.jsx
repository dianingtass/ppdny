import React, { useState } from "react";
import { X, Save, Loader2, Tag, FileText } from "lucide-react";
import AlertToast from "../components/AlertToast";
import { useAlert } from "../hooks/useAlert";

export default function InputJenisTagihanModal({ isOpen, onClose, isEditing, editData, onSubmit, saving }) {
  const { message, showAlert, clearAlert } = useAlert();

  const [formData, setFormData] = useState(() => ({
    jenis_tagihan: isEditing && editData ? (editData.jenis_tagihan || "") : "",
    deskripsi: isEditing && editData ? (editData.deskripsi || "") : ""
  }));

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jenis_tagihan) return showAlert("error", "Nama jenis tagihan wajib diisi");
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
        <AlertToast message={message} onClose={clearAlert} />
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Tag className="text-green-600" size={20} />
            {isEditing ? "Edit Jenis Tagihan" : "Tambah Jenis Tagihan"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form id="jenisTagihanForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Jenis Tagihan</label>
                <div className="relative">
                    <input 
                        type="text" name="jenis_tagihan" required
                        className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition text-sm"
                        value={formData.jenis_tagihan} onChange={handleChange}
                        placeholder="Contoh: SPP Bulanan, Uang Pangkal"
                    />
                    <Tag className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <div className="relative">
                    <textarea 
                        name="deskripsi" rows="3"
                        className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none transition text-sm"
                        value={formData.deskripsi} onChange={handleChange}
                        placeholder="Deskripsi atau keterangan tagihan..."
                    />
                    <FileText className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button onClick={onClose} type="button" className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition">
                Batal
            </button>
            <button form="jenisTagihanForm" type="submit" disabled={saving} className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition flex items-center disabled:opacity-70 shadow-md">
                {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                {saving ? "Menyimpan..." : "Simpan Data"}
            </button>
        </div>

      </div>
    </div>
  );
}