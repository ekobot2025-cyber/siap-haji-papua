'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  X,
  Syringe,
  Download,
  FileText,
} from 'lucide-react';
import { exportToPdf, exportToExcel } from '@/lib/export-utils';

export default function KesehatanPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState('');
  const [istithaahFilter, setIstithaahFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Modal
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [editIstithaah, setEditIstithaah] = useState('');
  const [editAdminStatus, setEditAdminStatus] = useState('');
  const [editMeningitis, setEditMeningitis] = useState(false);
  const [editPolio, setEditPolio] = useState(false);
  const [editCovid, setEditCovid] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stageFilter) params.set('checkupStage', stageFilter);
      if (istithaahFilter) params.set('istithaahStatus', istithaahFilter);
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/health?${params.toString()}`);
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
  }, [stageFilter, istithaahFilter, search, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleExportExcel = () => {
    const rows = records.map((rec, index) => [
      (index + 1).toString(),
      rec.jamaah?.fullName || '-',
      rec.checkupStage?.replace(/_/g, ' ') || '-',
      rec.administrativeStatus || '-',
      rec.istithaahStatus?.replace(/_/g, ' ') || '-',
      rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('id-ID') : '-'
    ]);

    exportToExcel({
      title: 'Data Kesehatan Haji',
      headers: ['No', 'Nama Jamaah', 'Jenis Pemeriksaan', 'Status', 'Hasil', 'Tanggal'],
      rows,
      filename: 'data-kesehatan',
      sheetName: 'Kesehatan'
    });
  };

  const handleExportPdf = () => {
    const rows = records.map((rec, index) => [
      (index + 1).toString(),
      rec.jamaah?.fullName || '-',
      rec.checkupStage?.replace(/_/g, ' ') || '-',
      rec.administrativeStatus || '-',
      rec.istithaahStatus?.replace(/_/g, ' ') || '-',
      rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('id-ID') : '-'
    ]);

    exportToPdf({
      title: 'Data Kesehatan Haji',
      headers: ['No', 'Nama Jamaah', 'Jenis Pemeriksaan', 'Status', 'Hasil', 'Tanggal'],
      rows,
      filename: 'data-kesehatan',
    });
  };

  const handleOpenEdit = (rec: any) => {
    setSelectedRecord(rec);
    setEditIstithaah(rec.istithaahStatus);
    setEditAdminStatus(rec.administrativeStatus);
    setEditMeningitis(rec.isVaccineMeningitis);
    setEditPolio(rec.isVaccinePolio);
    setEditCovid(rec.isVaccineCovid);
    setEditLocation(rec.locationName || '');
    setEditNotes(rec.notesNonMedical || '');
  };

  const handleSaveEdit = async () => {
    if (!selectedRecord) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/health/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          istithaahStatus: editIstithaah,
          administrativeStatus: editAdminStatus,
          isVaccineMeningitis: editMeningitis,
          isVaccinePolio: editPolio,
          isVaccineCovid: editCovid,
          locationName: editLocation,
          notesNonMedical: editNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRecord(null);
        fetchRecords();
      } else {
        alert(data.message || 'Gagal memperbarui data kesehatan');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8dfc8]">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs">
            <HeartPulse className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              MONITORING ADMINISTRATIF KESEHATAN & ISTITHA&apos;AH
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Pelacakan status kelayakan non-medis, tahapan pemeriksaan Puskesmas/RSUD, dan vaksinasi wajib
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-gray-700 bg-white hover:bg-[#fbf8ee] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor Excel
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="btn-kemenhaj-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Ekspor PDF
          </button>
          <button
            onClick={fetchRecords}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-gray-700 bg-white hover:bg-[#fbf8ee] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dfc8] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama jamaah atau nomor porsi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="">Semua Tahapan</option>
              <option value="TAHAP_1_PUSKESMAS">Tahap 1 (Puskesmas)</option>
              <option value="TAHAP_2_RSUD">Tahap 2 (RSUD Penetapan)</option>
              <option value="TAHAP_3_EMBARKASI">Tahap 3 (Embarkasi)</option>
            </select>

            <select
              value={istithaahFilter}
              onChange={(e) => { setIstithaahFilter(e.target.value); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="">Semua Status Istitha&apos;ah</option>
              <option value="MEMENUHI_SYARAT">Memenuhi Syarat</option>
              <option value="MEMENUHI_DENGAN_PENDAMPING">Memenuhi dgn Pendamping</option>
              <option value="TIDAK_MEMENUHI">Tidak Memenuhi</option>
              <option value="DITUNDA">Ditunda</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">
            Daftar Monitoring Kesehatan ({records.length} data ditampilkan)
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
          <div className="text-center py-12 text-gray-400">Memuat data kesehatan...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic">
            Tidak ada catatan yang cocok dengan kriteria filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-3.5">Nama Jamaah & Porsi</th>
                  <th className="p-3.5">Wilayah</th>
                  <th className="p-3.5">Tahap</th>
                  <th className="p-3.5">Status Istitha&apos;ah</th>
                  <th className="p-3.5">Vaksin Wajib</th>
                  <th className="p-3.5">Fasilitas RSUD</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => {
                  const isOk = rec.istithaahStatus === 'MEMENUHI_SYARAT';
                  const isCompanion = rec.istithaahStatus === 'MEMENUHI_DENGAN_PENDAMPING';

                    return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <Link
                          href={`/jamaah/${rec.jamaah.id}`}
                          className="font-bold text-[#8a6d2b] hover:text-[#b8941e] hover:underline block"
                        >
                          {rec.jamaah.fullName}
                        </Link>
                        <div className="flex items-center gap-1.5 font-mono text-gray-400">
                          <span>{rec.jamaah.porsiNumber}</span>
                          {rec.jamaah.isPriorityElderly && (
                            <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded font-bold font-sans">
                              Lansia ({rec.jamaah.elderlyAge} th)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-gray-700">{rec.jamaah.region.name}</td>
                      <td className="p-3.5 font-semibold text-gray-800">{rec.checkupStage.replace(/_/g, ' ')}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isOk
                            ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]'
                            : isCompanion
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isOk ? <CheckCircle2 className="w-3 h-3 text-[#b8941e]" /> : <AlertTriangle className="w-3 h-3" />}
                          {rec.istithaahStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rec.isVaccineMeningitis ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            M:{rec.isVaccineMeningitis ? '✓' : '✗'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rec.isVaccinePolio ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            P:{rec.isVaccinePolio ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-600">{rec.locationName || 'RSUD Dok II'}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="px-3 py-1.5 rounded-lg bg-[#fbf8ee] hover:bg-[#c9a961] text-[#8a6d2b] hover:text-white border border-[#e8dfc8] text-xs font-bold transition-all shadow-xs cursor-pointer"
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

      {/* Edit Health Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8dfc8]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs">
                  <HeartPulse className="w-4 h-4 text-white" />
                </span>
                <h3 className="text-base font-bold text-gray-900">Perbarui Status Kesehatan Jamaah</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-bold text-gray-900">{selectedRecord.jamaah.fullName} ({selectedRecord.jamaah.porsiNumber})</p>
              <p className="text-gray-600">{selectedRecord.jamaah.region.name} • {selectedRecord.checkupStage.replace(/_/g, ' ')}</p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status Istitha&apos;ah Kesehatan</label>
                <select
                  value={editIstithaah}
                  onChange={(e) => setEditIstithaah(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                >
                  <option value="MEMENUHI_SYARAT">MEMENUHI_SYARAT (Istitha&apos;ah Penuh)</option>
                  <option value="MEMENUHI_DENGAN_PENDAMPING">MEMENUHI_DENGAN_PENDAMPING (Wajib Pendamping)</option>
                  <option value="DITUNDA">DITUNDA (Rujukan / Pemulihan)</option>
                  <option value="TIDAK_MEMENUHI">TIDAK_MEMENUHI (Tidak Laik Terbang)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status Administratif</label>
                <select
                  value={editAdminStatus}
                  onChange={(e) => setEditAdminStatus(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                >
                  <option value="SELESAI">SELESAI (Pemeriksaan Tuntas)</option>
                  <option value="PROSES">PROSES (Dalam Observasi)</option>
                  <option value="PERLU_TINDAK_LANJUT">PERLU_TINDAK_LANJUT (Butuh Tindak Lanjut)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Fasilitas Pemeriksa</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Nama Rumah Sakit / Puskesmas..."
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-gray-700 block">Vaksinasi Wajib</span>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMeningitis}
                      onChange={(e) => setEditMeningitis(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span>Vaksin Meningitis</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPolio}
                      onChange={(e) => setEditPolio(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span>Vaksin Polio (nOPV2)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Non-Medis / Pendampingan</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Catatan mobilitas (kursi roda, lansia, atau obat rutin)..."
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
                className="btn-kemenhaj-primary px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
