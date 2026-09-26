'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  X,
  FileText,
  Download,
} from 'lucide-react';
import { exportToPdf, exportToExcel } from '@/lib/export-utils';

export default function DokumenPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verification Modal
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set('typeCode', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/documents?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data.items);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search, page]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleExportExcel = () => {
    const rows = documents.map((doc, index) => [
      (index + 1).toString(),
      doc.jamaah?.fullName || '-',
      doc.documentType?.name || '-',
      doc.status || '-',
      doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID') : '-'
    ]);

    exportToExcel({
      title: 'Data Dokumen Haji',
      headers: ['No', 'Nama Jamaah', 'Jenis Dokumen', 'Status', 'Tanggal Upload'],
      rows,
      filename: 'data-dokumen',
      sheetName: 'Dokumen'
    });
  };

  const handleExportPdf = () => {
    const rows = documents.map((doc, index) => [
      (index + 1).toString(),
      doc.jamaah?.fullName || '-',
      doc.documentType?.name || '-',
      doc.status || '-',
      doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID') : '-'
    ]);

    exportToPdf({
      title: 'Data Dokumen Haji',
      headers: ['No', 'Nama Jamaah', 'Jenis Dokumen', 'Status', 'Tanggal Upload'],
      rows,
      filename: 'data-dokumen',
    });
  };

  const handleVerify = async (action: 'VERIFY' | 'REJECT') => {
    if (!selectedDoc) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/documents/${selectedDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: actionNotes || (action === 'VERIFY' ? 'Dokumen valid dan sesuai ketentuan' : 'Dokumen tidak memenuhi persyaratan'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedDoc(null);
        setActionNotes('');
        fetchDocuments();
      } else {
        alert(data.message || 'Gagal memproses verifikasi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    } finally {
      setSubmitting(false);
    }
  };

  const docTypes = [
    { code: '', label: 'Semua Jenis' },
    { code: 'PASPOR', label: 'Paspor RI' },
    { code: 'VISA', label: 'Visa Haji' },
    { code: 'KTP', label: 'KTP Elektronik' },
    { code: 'FOTO', label: 'Pasfoto Haji' },
    { code: 'VAKSIN', label: 'Sertifikat Vaksin' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-[#0A3E2F] text-[#D4AF37]">
            <FileCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              DESK VERIFIKASI DOKUMEN & PASPOR
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Pemeriksaan keabsahan dokumen, masa berlaku paspor (min. 6 bulan), dan penerbitan visa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor Excel
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A3E2F] text-white text-xs font-semibold hover:bg-[#072d22] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Ekspor PDF
          </button>
          <button
            onClick={fetchDocuments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Dokumen
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama jamaah atau nomor porsi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A3E2F]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              {docTypes.map((dt) => (
                <option key={dt.code} value={dt.code}>{dt.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="">Semua Status</option>
              <option value="PENDING">Menunggu Verifikasi</option>
              <option value="TERVERIFIKASI">Terverifikasi</option>
              <option value="DITOLAK">Ditolak / Revisi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">
            Daftar Berkas Dokumen Terdata ({documents.length} dokumen ditampilkan)
          </span>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold"
            >
              ← Sebelumnya
            </button>
            <span className="font-mono mx-4">Halaman {page} dari {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold"
            >
              Berikutnya →
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat berkas dokumen...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic">
            Tidak ada dokumen yang sesuai dengan kriteria pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-3.5">Jenis Dokumen</th>
                  <th className="p-3.5">Nama Jamaah & Porsi</th>
                  <th className="p-3.5">Wilayah</th>
                  <th className="p-3.5">Nomor Berkas</th>
                  <th className="p-3.5">Masa Berlaku</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => {
                  const isVerified = doc.status === 'TERVERIFIKASI';
                  const isPending = doc.status === 'MENUNGGU_VERIFIKASI' || doc.status === 'UPLOADED';
                  const isRejected = doc.status === 'DITOLAK';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block">{doc.documentType.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{doc.documentType.code}</span>
                      </td>
                      <td className="p-3.5">
                        <Link
                          href={`/jamaah/${doc.jamaah.id}`}
                          className="font-bold text-[#0A3E2F] hover:underline block"
                        >
                          {doc.jamaah.fullName}
                        </Link>
                        <span className="font-mono text-gray-400">{doc.jamaah.porsiNumber}</span>
                      </td>
                      <td className="p-3.5 font-medium text-gray-700">{doc.jamaah.region.name}</td>
                      <td className="p-3.5 font-mono text-gray-800">{doc.documentNumber || '-'}</td>
                      <td className="p-3.5 text-gray-600">
                        {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isVerified && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <Clock className="w-3 h-3" />}
                          {isRejected && <XCircle className="w-3 h-3" />}
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => { setSelectedDoc(doc); setActionNotes(doc.notes || ''); }}
                          className="px-3 py-1.5 rounded-lg bg-[#0A3E2F] text-[#D4AF37] hover:bg-[#072d22] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Verifikasi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#0A3E2F] text-[#D4AF37]">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-gray-900">Desk Verifikasi Dokumen</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Jenis Dokumen:</span>
                <span className="font-bold text-gray-900">{selectedDoc.documentType.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama Jamaah:</span>
                <span className="font-bold text-[#0A3E2F]">{selectedDoc.jamaah.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nomor Porsi:</span>
                <span className="font-mono font-bold text-gray-800">{selectedDoc.jamaah.porsiNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Wilayah Asal:</span>
                <span className="font-medium text-gray-800">{selectedDoc.jamaah.region.name}</span>
              </div>
              {selectedDoc.documentNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor Dokumen:</span>
                  <span className="font-mono font-semibold text-gray-800">{selectedDoc.documentNumber}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Catatan Verifikasi / Alasan Penolakan</label>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Tuliskan catatan verifikasi atau alasan bila berkas ditolak/memerlukan revisi..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleVerify('REJECT')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer disabled:opacity-50"
                >
                  Tolak Berkas
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleVerify('VERIFY')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Setujui & Verifikasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
