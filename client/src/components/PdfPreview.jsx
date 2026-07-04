import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Loader2, ExternalLink, Download } from "lucide-react";

// Set worker source locally using Vite's URL asset system
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PdfPage({ pdf, pageNum }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel previous render task if any
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (error) {
        if (error.name !== "RenderingCancelledException") {
          console.error(`Gagal merender halaman ${pageNum}:`, error);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdf, pageNum]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto max-w-full border border-gray-200 rounded-lg shadow-sm bg-white"
    />
  );
}

export default function PdfPreview({ pdfUrl }) {
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setPdf(null);

    if (!pdfUrl) return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdfDoc = await loadingTask.promise;
        if (!isCancelled) {
          setPdf(pdfDoc);
          setLoading(false);
        }
      } catch (err) {
        console.error("PdfPreview loading error:", err);
        if (!isCancelled) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
        <Loader2 className="animate-spin text-green-600 mb-3" size={32} />
        <p className="text-gray-500 text-sm">Memuat pratinjau dokumen PDF...</p>
      </div>
    );
  }

  if (error || !pdf) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 text-center min-h-[250px]">
        <p className="text-red-700 font-semibold mb-3">Gagal memuat pratinjau dokumen PDF</p>
        <p className="text-xs text-red-500 mb-5 max-w-md">
          Pratinjau langsung tidak tersedia untuk browser ini atau file tidak dapat diakses secara langsung.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            <ExternalLink size={16} /> Buka di Tab Baru
          </button>
          <a
            href={pdfUrl}
            download="screening-report.pdf"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            <Download size={16} /> Unduh PDF
          </a>
        </div>
      </div>
    );
  }

  // Render all pages
  const pages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);

  return (
    <div className="space-y-4 w-full flex flex-col items-center">
      {/* Pratinjau info */}
      <div className="w-full flex justify-between items-center text-xs text-gray-500 px-1">
        <span>Total: {pdf.numPages} halaman</span>
        <button
          onClick={handleOpenInNewTab}
          className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:underline font-semibold"
        >
          <ExternalLink size={12} /> Buka di Tab Baru
        </button>
      </div>

      <div className="w-full space-y-4 max-h-[80vh] overflow-y-auto p-2 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner">
        {pages.map((pageNum) => (
          <PdfPage key={pageNum} pdf={pdf} pageNum={pageNum} />
        ))}
      </div>
    </div>
  );
}
