import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Microscope } from "lucide-react";
import { getImageUrl } from '../utils/imageUrl';

function CardMateri({ materi, isManage, onDelete, onEdit, detailBasePath, fromPath, rootFrom }) {
  const navigate = useNavigate();
  const tanggalMateri = materi?.tanggal_dibuat
    ? new Date(materi.tanggal_dibuat).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
    : "-";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-0.5 md:hover:-translate-y-1 transition-all duration-300 flex flex-row md:flex-col h-44 sm:h-40 md:h-auto">
      <div className="relative w-32 sm:w-40 md:w-full h-full md:h-52 flex-shrink-0">
        {materi.gambar ? (
          <img src={getImageUrl(materi.gambar)} alt={materi.judul} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
            <Microscope className="text-emerald-600" size={30} />
          </div>
        )}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <h2 className="hidden md:block absolute bottom-3 left-4 text-white font-semibold text-lg px-2 line-clamp-1">{materi.judul}</h2>
      </div>
      <div className="p-3.5 md:p-5 flex flex-col justify-between md:justify-start flex-1 min-w-0">
        <div className="space-y-1 md:space-y-0 md:mb-5 min-w-0">
          <h2 className="text-gray-900 font-bold text-sm sm:text-base truncate md:hidden" title={materi.judul}>{materi.judul}</h2>
          <p className="text-gray-500 md:text-gray-900 text-xs md:text-sm line-clamp-2">{materi.ringkasan}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] md:text-xs text-gray-400 md:mt-2 md:space-y-1 md:flex-col">
            <span>{materi.penulis}</span>
            <span className="md:hidden">•</span>
            <span>{tanggalMateri}</span>
          </div>
        </div>
        <div className="flex flex-col md:w-full gap-2 mt-2 md:mt-auto">
          <button
            onClick={() => navigate(`${detailBasePath}/${materi.id}`, { state: { from: fromPath, rootFrom } })}
            className="py-1.5 md:py-2.5 px-3 bg-green-50 text-green-600 rounded-xl font-semibold text-xs md:text-sm transition hover:bg-green-800 hover:text-white text-center w-full"
          >
            <span className="md:hidden">Baca</span>
            <span className="hidden md:inline">Baca Selengkapnya</span>
          </button>
          {isManage && (
            <div className="flex gap-1.5 md:gap-2 md:mt-1 md:mb-2 w-full">
              <button
                className="flex-1 py-1.5 px-2.5 md:py-2.5 bg-yellow-50 text-yellow-600 rounded-xl font-semibold text-xs md:text-sm flex justify-center items-center gap-1 transition hover:bg-yellow-500 hover:text-white"
                onClick={() => onEdit(materi)}
              >
                <Edit2 size={12} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">Edit</span>
              </button>
              <button
                className="flex-1 py-1.5 px-2.5 md:py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-xs md:text-sm flex justify-center items-center gap-1 transition hover:bg-red-500 hover:text-white"
                onClick={() => onDelete(materi.id)}
              >
                <Trash2 size={12} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardMateri;