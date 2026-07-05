import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const logoPesantren = "/logo.png";

const getBase64ImageFromUrl = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const formatGender = (gender) => {
  if (!gender) return "-";
  if (gender === "Laki_laki") return "Laki-laki";
  if (gender === "Perempuan") return "Perempuan";
  return gender;
};

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const exportAbsensiPdf = async (kamar, items, absensi, bulan, tahun, id, action = "download") => {
  if (!kamar || !items || items.length === 0) return;
  
  const jumlahHari = daysInMonth(bulan, tahun);

  const getStatus = (itemId, day) => {
    const data = absensi.find(a => {
      const tgl = new Date(a.tanggal).getDate();
      return tgl === day;
    });
    if (!data) return null;
    const detail = data.absensi_detail.find(d => d.id_item === itemId);
    return detail?.status || null;
  };

  try {
    const doc = new jsPDF({ orientation: "l", unit: "mm", format: "a4", compress: true });
    const margin = { left: 15, right: 15, top: 15, bottom: 15 };
    const printWidth = 297 - margin.right;
    let cursorY = margin.top;

    // === KOP SURAT ===
    try {
      const logoBase64 = await getBase64ImageFromUrl(logoPesantren);
      doc.addImage(logoBase64, "PNG", margin.left, cursorY, 18, 18, undefined, 'FAST');
    } catch (error) {
      console.warn("Gagal memuat logo kop surat:", error);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("YAYASAN DARUNNA'IM YAPIA", 148.5, cursorY + 4, { align: "center" });
    doc.setFontSize(12);
    doc.text("PONDOK PESANTREN MODERN DARUN-NA'IM YAPIA", 148.5, cursorY + 9, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("Jl. Demang Aria Rt. 01 Rw. 03 Desa Waru Jaya, Kec. Parung, Kab. Bogor", 148.5, cursorY + 13, { align: "center" });
    doc.text("Email: ponpesmodern.darunnaimyapia@gmail.com | IG: @ponpes_modern_darun_naim_yapia", 148.5, cursorY + 17, { align: "center" });

    cursorY += 20;
    doc.setLineWidth(0.8);
    doc.setDrawColor(0, 0, 0);
    doc.line(margin.left, cursorY, printWidth, cursorY);
    cursorY += 1;
    doc.setLineWidth(0.2);
    doc.line(margin.left, cursorY, printWidth, cursorY);

    // === JUDUL ===
    cursorY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("LAPORAN ABSENSI KEBERSIHAN KAMAR", 148.5, cursorY, { align: "center" });

    cursorY += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Bulan: ${namaBulan[bulan - 1]} ${tahun}`, 148.5, cursorY, { align: "center" });

    cursorY += 10;

    // === DATA KAMAR ===
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Nama Kamar", margin.left, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${kamar?.kamar || "-"}`, margin.left + 25, cursorY);

    doc.setFont("helvetica", "bold");
    doc.text("Gender", margin.left + 120, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${formatGender(kamar?.gender)}`, margin.left + 140, cursorY);

    cursorY += 6;

    // === TABLE ===
    const tableHeaders = [
      ["No", "Jenis Kegiatan", "Waktu", ...Array.from({ length: jumlahHari }, (_, i) => (i + 1).toString())]
    ];

    const tableBody = items.map((item, index) => {
      const row = [
        index + 1,
        item.nama_item?.replace(/[\r\n]+/g, " ")?.trim() || "",
        item.waktu_pengerjaan?.replaceAll("_", " ")?.replace(/[\r\n]+/g, " ")?.trim() || ""
      ];
      
      for (let day = 1; day <= jumlahHari; day++) {
        row.push("");
      }
      return row;
    });

    const dayColWidth = 194 / jumlahHari;

    const columnStyles = {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 44 },
      2: { cellWidth: 21 }
    };

    for (let i = 3; i < 3 + jumlahHari; i++) {
      columnStyles[i] = { cellWidth: dayColWidth, halign: "center" };
    }

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin.left, right: margin.right },
      head: tableHeaders,
      body: tableBody,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [55, 65, 81],
        fontStyle: "bold",
        halign: "center"
      },
      columnStyles: columnStyles,
      didParseCell: (data) => {
        if (data.column.index >= 3) {
          data.cell.styles.cellPadding = { top: 2, right: 0, bottom: 2, left: 0 };
        }
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index >= 3) {
          const item = items[data.row.index];
          const day = data.column.index - 2;
          const val = getStatus(item.id_item, day);
          if (val === "Dilakukan") {
            doc.setFillColor(34, 197, 94); // Green (#22c55e)
            doc.rect(data.cell.x + 0.3, data.cell.y + 0.3, data.cell.width - 0.6, data.cell.height - 0.6, "F");
          } else if (val === "Tidak_Dilakukan") {
            doc.setFillColor(239, 68, 68); // Red (#ef4444)
            doc.rect(data.cell.x + 0.3, data.cell.y + 0.3, data.cell.width - 0.6, data.cell.height - 0.6, "F");
          }
        }
      }
    });

    cursorY = doc.lastAutoTable.finalY + 8;

    // === LEGEND ===
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Green Box
    doc.setFillColor(34, 197, 94);
    doc.rect(margin.left, cursorY - 3, 4, 4, "F");
    doc.text("Dilakukan", margin.left + 6, cursorY);

    // Red Box
    doc.setFillColor(239, 68, 68);
    doc.rect(margin.left + 30, cursorY - 3, 4, 4, "F");
    doc.text("Tidak Dilakukan", margin.left + 36, cursorY);

    // White Box
    doc.setDrawColor(209, 213, 219);
    doc.setFillColor(255, 255, 255);
    doc.rect(margin.left + 70, cursorY - 3, 4, 4, "FD");
    doc.text("Tidak Ada Absensi", margin.left + 76, cursorY);

    // === PAGE NUMBERS ===
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text("Dokumen ini dihasilkan secara otomatis oleh SIM-Tren.", 148.5, 210 - 10, { align: "center" });
    }

    if (action === "preview") {
      return doc.output("bloburl");
    } else {
      doc.save(`Laporan_Absensi_${kamar?.kamar?.replace(/\s+/g, "_") || id}_${bulan}_${tahun}.pdf`);
    }
  } catch (error) {
    console.error("Gagal generate PDF", error);
    throw error;
  }
};
