import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import PdfPreview from "../../../components/PdfPreview";
import { exportAbsensiPdf } from "../../../components/PdfAbsensi";

export default function ViewAbsensi({ rolePrefix }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  const [bulan, setBulan] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());

  const [items, setItems] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kamar, setKamar] = useState(null);
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [laporanRes, kamarRes] = await Promise.all([
        api.get(`/${rolePrefix}/absensi/kamar/${id}/laporan`, { params: { bulan, tahun } }),
        api.get(`/${rolePrefix}/absensi/kamar/${id}/detail`)
      ]);
      setItems(laporanRes.data.items || []);
      setAbsensi(laporanRes.data.absensi || []);
      setKamar(kamarRes.data.data || null);
    } catch (err) {
      console.error(err);
      setPdfError("Gagal memuat data absensi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun, id]);

  useEffect(() => {
    if (!kamar || items.length === 0) return;

    const loadPreview = async () => {
      setPdfError(null);
      try {
        const url = await exportAbsensiPdf(kamar, items, absensi, bulan, tahun, id, "preview");
        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        setPdfError("Gagal memuat dokumen PDF");
      }
    };

    loadPreview();
  }, [kamar, items, absensi, bulan, tahun, id]);

  const handleDownload = async () => {
    try {
      await exportAbsensiPdf(kamar, items, absensi, bulan, tahun, id, "download");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || (!pdfUrl && kamar && !pdfError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Laporan Absensi Kebersihan</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label>Bulan</label>
        <select
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          {namaBulan.map((b, i) => (
            <option key={i + 1} value={i + 1}>
              {b}
            </option>
          ))}
        </select>

        <label>Tahun</label>
        <select
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i}>{today.getFullYear() - 2 + i}</option>
          ))}
        </select>
      </div>

      <div className="max-w-4xl mx-auto sm:px-4 mt-6">
        {pdfError ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 text-center shadow-sm">
            <p className="text-red-600 font-semibold">{pdfError}</p>
          </div>
        ) : (
          pdfUrl && <PdfPreview pdfUrl={pdfUrl} />
        )}
      </div>

      <button
        onClick={handleDownload}
        className="fixed bottom-4 right-4 px-4 py-2 text-sm sm:bottom-6 sm:right-6 sm:px-6 sm:py-3 sm:text-base bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg print:hidden z-20"
      >
        Download PDF
      </button>
    </div>
  );
}
