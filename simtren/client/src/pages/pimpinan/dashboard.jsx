import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertCircle,
  BarChart3,
  DollarSign,
  Loader2,
  Printer,
  Star,
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import { PdfLaporanPimpinan } from "../../components/PdfLaporanPimpinan";

const formatNumber = (value) => Number(value || 0).toLocaleString("id-ID");

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function PimpinanDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { message, showAlert, clearAlert } = useAlert();

  const barChartRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/pimpinan/dashboard");
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Gagal load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      await PdfLaporanPimpinan(data, barChartRef);
    } catch (error) {
      showAlert("error", "Terjadi kesalahan saat menyusun dokumen cetak.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
        <p className="text-gray-500 font-medium">Memuat Laporan Eksekutif...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen space-y-7">
      <AlertToast message={message} onClose={clearAlert} />

      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Eksekutif Pimpinan</h1>
          <p className="text-gray-500 text-sm mt-1">Ringkasan kondisi pesantren untuk pantauan harian.</p>
        </div>

        <button
          onClick={handlePrint}
          disabled={isExporting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
          {isExporting ? "Menyusun Dokumen..." : "Cetak ke PDF"}
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pemasukan Bulanan"
          value={formatRupiah(data.keuangan.total_pendapatan)}
          icon={<DollarSign size={24} />}
          color="blue"
        />
        <StatCard
          title="Total Pengaduan"
          value={`${formatNumber(data.kedisiplinan.total_aduan)} Laporan`}
          icon={<AlertCircle size={24} />}
          color="orange"
        />
        <StatCard
          title="Indeks Kepuasan"
          value={`${data.kepuasan.rata_rata} / 5.0`}
          icon={<Star size={24} />}
          color="yellow"
        />
        <StatCard
          title="Tunggakan SPP"
          value={`${data.keuangan.persentase_tunggakan}% Santri`}
          icon={<Activity size={24} />}
          color="red"
          valueClassName="text-red-600"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Pendapatan Pondok</h2>
          <p className="text-xs text-gray-500 mb-4">Pembayaran 6 bulan terakhir</p>
          <div className="h-72 bg-white" ref={barChartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.keuangan.grafik_bulanan} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} dy={10} />
                <YAxis tickFormatter={(val) => `Rp ${val / 1000000}Jt`} axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <RechartsTooltip formatter={(value) => formatRupiah(value)} />
                <Bar dataKey="pendapatan" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Riwayat Pengaduan</h2>
          <p className="text-xs text-gray-500 mb-6">Pengaduan oleh ustadz kepada wali terkait santri.</p>
          <div className="space-y-5">
            <ProgressRow
              label="Laporan Selesai"
              value={data.kedisiplinan.selesai}
              total={data.kedisiplinan.total_aduan}
              barClassName="bg-green-500"
              valueClassName="text-green-600"
            />
            <ProgressRow
              label="Laporan Aktif (Belum Ditangani)"
              value={data.kedisiplinan.aktif}
              total={data.kedisiplinan.total_aduan}
              barClassName="bg-orange-400"
              valueClassName="text-orange-500"
            />
          </div>
        </section>
      </div>


    </div>
  );
}

function StatCard({ title, value, icon, color, valueClassName = "text-gray-800" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    yellow: "bg-yellow-50 text-yellow-500",
    red: "bg-red-50 text-red-500",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <h3 className={`text-xl font-bold truncate ${valueClassName}`}>{value}</h3>
      </div>
    </div>
  );
}



function ProgressRow({ label, value, total, barClassName, valueClassName }) {
  const percent = total ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className={`font-bold ${valueClassName}`}>{formatNumber(value)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div className={`h-3 rounded-full ${barClassName}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}


