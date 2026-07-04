import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { X, Eye, Loader2, CheckCircle } from 'lucide-react';
import DetailPembayaranModal from './DetailPembayaranModal';
import ConfirmActionModal from './ConfirmActionModal';
import AlertToast from "../components/AlertToast";
import { useAlert } from "../hooks/useAlert";

export default function ListPembayaranModal({ isOpen, onClose, idTagihan, userRole }) {
  const [list, setList] = useState([]);
  const [tagihanInfo, setTagihanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { message, showAlert, clearAlert } = useAlert();
  const [detailData, setDetailData] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState({ isOpen: false, newStatus: null, loading: false });

  const isReadOnly = !["pengurus", "admin"].includes(userRole?.toLowerCase());

  useEffect(() => {
    if (isOpen && idTagihan) fetchPembayaran();
  }, [isOpen, idTagihan]);

  const fetchPembayaran = async () => {
    setLoading(true);
    try {
        let endpoint = '';
        if (userRole === 'pimpinan') {
            endpoint = `/pimpinan/keuangan/pembayaran/${idTagihan}`;
        } else {
            endpoint = `/${userRole}/keuangan/${idTagihan}/pembayaran`;
        }
        const res = await api.get(endpoint);
        const sortedData = (res.data.data || []).sort((a, b) => {
            const dateDiff = new Date(b.tanggal_bayar) - new Date(a.tanggal_bayar);
            if (dateDiff !== 0) return dateDiff;
            return b.id - a.id;
        });
        setList(sortedData);
        setTagihanInfo(res.data.tagihanInfo);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdateStatusTagihan = (e) => {
      if(isReadOnly) return;
      setConfirmStatus({ isOpen: true, newStatus: e.target.value, loading: false });
  };

  const confirmUpdateStatus = async () => {
      setConfirmStatus(prev => ({ ...prev, loading: true }));
      try {
          await api.put(`/${userRole}/keuangan/${idTagihan}/status`, { status: confirmStatus.newStatus });
          setTagihanInfo(prev => ({ ...prev, status: confirmStatus.newStatus }));
          showAlert("success", "Status berhasil diperbarui");
          setConfirmStatus({ isOpen: false, newStatus: null, loading: false });
      } catch (err) {
          console.error("Gagal update status tagihan:", err);
          showAlert("error", "Gagal update status");
          setConfirmStatus(prev => ({ ...prev, loading: false }));
      }
  };

  const openDetail = (item) => { setDetailData(item); setIsDetailOpen(true); };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed cursor-pointer inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="cursor-default bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        <AlertToast message={message} onClose={clearAlert} />
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
            <div><h3 className="font-bold text-gray-800 text-lg">Riwayat Pembayaran</h3>{tagihanInfo && <div className="flex items-center gap-2 mt-1"><span className="text-xs text-gray-500">Status:</span>{isReadOnly ? <span className={`text-xs font-bold px-2 py-1 rounded ${tagihanInfo.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tagihanInfo.status}</span> : <select value={tagihanInfo.status || 'Aktif'} onChange={handleUpdateStatusTagihan} className={`text-xs font-bold px-2 py-1 rounded outline-none ${tagihanInfo.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}><option value="Aktif">Aktif</option><option value="Lunas">Lunas</option></select>}</div>}</div>
            <button onClick={onClose}><X size={20} className="text-gray-400"/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
            {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-green-500"/></div> : (
                <>
                    {/* Unified Grid Cards (1 Column on Mobile, 2 Columns on Desktop) */}
                    <div className="grid grid-cols-1 gap-4">
                        {list.length > 0 ? list.map(item => (
                            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between space-y-3 hover:border-green-100 hover:shadow-md transition duration-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {new Date(item.tanggal_bayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        item.status === 'Berhasil' ? 'bg-green-100 text-green-700' : 
                                        item.status === 'Gagal' ? 'bg-red-100 text-red-700' : 
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                                    <div>
                                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Nominal</span>
                                        <span className="font-bold text-gray-800 text-base">Rp {item.nominal.toLocaleString('id-ID')}</span>
                                        <span className="text-xs text-gray-500 block mt-0.5 font-medium">Metode: {item.metode_bayar}</span>
                                    </div>
                                    <button onClick={() => openDetail(item)} className="px-3.5 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition active:scale-95 flex items-center gap-1.5">
                                        <Eye size={14}/> Detail
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-1 md:col-span-2 text-center p-8 bg-gray-50 rounded-2xl text-gray-500 text-sm">
                                Belum ada riwayat pembayaran untuk tagihan ini.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-2xl"><button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-xl">Tutup</button></div>
      </div>
      <DetailPembayaranModal isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); fetchPembayaran(); }} data={detailData} userRole={userRole} />
      <ConfirmActionModal
        isOpen={confirmStatus.isOpen}
        onClose={() => setConfirmStatus({ isOpen: false, newStatus: null, loading: false })}
        onConfirm={confirmUpdateStatus}
        loading={confirmStatus.loading}
        title="Ubah Status Tagihan"
        message={`Ubah status tagihan menjadi "${confirmStatus.newStatus}"?`}
        confirmText="Ya, Ubah"
        confirmClass="bg-green-600 hover:bg-green-700"
      />
    </div>
  );
}