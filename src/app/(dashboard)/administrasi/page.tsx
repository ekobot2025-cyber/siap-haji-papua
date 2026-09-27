'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  Receipt,
  X,
  Download,
  FileText,
} from 'lucide-react';
import { exportToPdf, exportToExcel } from '@/lib/export-utils';

export default function AdministrasiPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Payment Modal
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editRef, setEditRef] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stageFilter) params.set('stageName', stageFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/administration?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data.items);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [stageFilter, statusFilter, search, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleExportExcel = () => {
    const rows = records.map((rec, index) => [
      (index + 1).toString(),
      rec.jamaah?.fullName || '-',
      rec.stageName?.replace(/_/g, ' ') || '-',
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rec.amountPaid || 0),
      rec.status?.replace(/_/g, ' ') || '-',
      rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('id-ID') : '-'
    ]);

    exportToExcel({
      title: 'Data Administrasi Haji',
      headers: ['No', 'Nama Jamaah', 'Jenis Pembayaran', 'Jumlah', 'Status', 'Tanggal'],
      rows,
      filename: 'data-administrasi',
      sheetName: 'Administrasi'
    });
  };

  const handleExportPdf = () => {
    const rows = records.map((rec, index) => [
      (index + 1).toString(),
      rec.jamaah?.fullName || '-',
      rec.stageName?.replace(/_/g, ' ') || '-',
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rec.amountPaid || 0),
      rec.status?.replace(/_/g, ' ') || '-',
      rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('id-ID') : '-'
    ]);

    exportToPdf({
      title: 'Data Administrasi Haji',
      headers: ['No', 'Nama Jamaah', 'Jenis Pembayaran', 'Jumlah', 'Status', 'Tanggal'],
      rows,
      filename: 'data-administrasi',
    });
  };

  const handleOpenEdit = (rec: any) => {
    setSelectedRecord(rec);
    setEditStatus(rec.status);
    setEditAmount(rec.amountPaid || 0);
    setEditRef(rec.paymentReference || '');
    setEditNotes(rec.notes || '');
  };

  const handleSaveEdit = async () => {
    if (!selectedRecord) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/administration/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          amountPaid: editAmount,
          paymentReference: editRef,
          notes: editNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRecord(null);
        fetchRecords();
      } else {
        alert(data.message || 'Gagal memperbarui status administrasi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] font-bold shadow-xs">
            <CreditCard className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              MONITORING ADMINISTRASI & KEUANGAN (BPIH)
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Pelacakan setoran awal, pelunasan BPIH kuota berhak lunas, dan penerbitan SPPH
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold text-xs font-semibold shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Ekspor PDF
          </button>
          <button
            onClick={fetchRecords}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
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
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="">Semua Tahapan</option>
              <option value="PELUNASAN_BPIH">Pelunasan BPIH</option>
              <option value="SETORAN_AWAL">Setoran Awal</option>
              <option value="SPPH">Penerbitan SPPH</option>
              <option value="BIOMETRIK_BIOVISA">Biometrik Bio Visa</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="">Semua Status</option>
              <option value="SELESAI">Lunas / Selesai</option>
              <option value="DALAM_PROSES">Dalam Proses</option>
              <option value="PERLU_TINDAK_LANJUT">Perlu Tindak Lanjut</option>
              <option value="BELUM">Belum Lunas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">
            Daftar Catatan Administrasi Keuangan ({records.length} data ditampilkan)
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
          <div className="text-center py-12 text-gray-400">Memuat catatan administrasi...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic">
            Tidak ada catatan yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-3.5">Nama Jamaah & Porsi</th>
                  <th className="p-3.5">Wilayah</th>
                  <th className="p-3.5">Tahapan Administrasi</th>
                  <th className="p-3.5">Jumlah Terbayar</th>
                  <th className="p-3.5">No. Referensi / Bank</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => {
                  const isDone = rec.status === 'SELESAI';
                  const isNeedAction = rec.status === 'PERLU_TINDAK_LANJUT';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <Link
                          href={`/jamaah/${rec.jamaah.id}`}
                          className="font-bold text-[#b8941e] hover:underline block"
                        >
                          {rec.jamaah.fullName}
                        </Link>
                        <span className="font-mono text-gray-400">{rec.jamaah.porsiNumber}</span>
                      </td>
                      <td className="p-3.5 font-medium text-gray-700">{rec.jamaah.region.name}</td>
                      <td className="p-3.5 font-bold text-gray-800">
                        {rec.stageName.replace(/_/g, ' ')}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#b8941e]">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rec.amountPaid)}
                      </td>
                      <td className="p-3.5 font-mono text-gray-600">{rec.paymentReference || '-'}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isNeedAction
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {rec.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Update Status
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

      {/* Edit Payment Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] font-bold shadow-xs">
                  <Receipt className="w-4 h-4 text-white" />
                </span>
                <h3 className="text-base font-bold text-gray-900">Perbarui Status Pembayaran / SPPH</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-bold text-gray-900">{selectedRecord.jamaah.fullName} ({selectedRecord.jamaah.porsiNumber})</p>
              <p className="text-gray-600">{selectedRecord.jamaah.region.name} • {selectedRecord.stageName.replace(/_/g, ' ')}</p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status Administrasi</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                >
                  <option value="SELESAI">SELESAI (Lunas / Berhasil)</option>
                  <option value="DALAM_PROSES">DALAM_PROSES (Sedang Diproses)</option>
                  <option value="PERLU_TINDAK_LANJUT">PERLU_TINDAK_LANJUT (Belum Melunasi / Kendala)</option>
                  <option value="BELUM">BELUM (Belum Terdata)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Jumlah Terbayar (IDR)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nomor Referensi Transaksi / BPS-BPIH</label>
                <input
                  type="text"
                  value={editRef}
                  onChange={(e) => setEditRef(e.target.value)}
                  placeholder="Misal: BSI-BPIH-2026-9921"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Catatan</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Catatan konfirmasi pelunasan atau kendala rekening..."
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
