'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  MapPin,
  X,
} from 'lucide-react';

export default function EarlyWarningPage() {
  const [warnings, setWarnings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ critical: 0, warning: 0, attention: 0, normal: 0 });
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Resolve Modal
  const [resolveItem, setResolveItem] = useState<any | null>(null);
  const [resolveNotes, setResolveNotes] = useState('Telah ditindaklanjuti dan diselesaikan');
  const [submitting, setSubmitting] = useState(false);

  const fetchWarnings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (severityFilter !== 'ALL') params.set('severity', severityFilter);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/early-warning?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setWarnings(data.data.items);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [severityFilter, page]);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  const handleResolve = async () => {
    if (!resolveItem) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/early-warning/${resolveItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: resolveNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setResolveItem(null);
        fetchWarnings();
      } else {
        alert(data.message || 'Gagal menyelesaikan peringatan');
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
          <span className="p-2.5 rounded-xl bg-rose-950 text-rose-300">
            <ShieldAlert className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              EARLY WARNING ENGINE — SISTEM DETEKSI DINI RISIKO
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Monitoring anomali, keterlambatan berkas, dan indikator risiko pra-keberangkatan
            </p>
          </div>
        </div>

        <button
          onClick={fetchWarnings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Peringatan
        </button>
      </div>

      {/* 4 Severity Alert Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => { setSeverityFilter(severityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL'); setPage(1); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'CRITICAL' ? 'ring-2 ring-rose-600 bg-rose-50/50' : 'bg-white hover:border-rose-300'
          } border-rose-200`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider">
              CRITICAL (MERAH)
            </span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-rose-700">{stats.critical}</span>
            <p className="text-xs text-rose-900 font-bold mt-1">Risiko Kritis / Gagal Berangkat</p>
            <span className="text-[10px] text-gray-500">Paspor ditolak, belum bayar mendekati deadline</span>
          </div>
        </div>

        <div
          onClick={() => { setSeverityFilter(severityFilter === 'WARNING' ? 'ALL' : 'WARNING'); setPage(1); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'WARNING' ? 'ring-2 ring-amber-500 bg-amber-50/50' : 'bg-white hover:border-amber-300'
          } border-amber-200`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-white uppercase tracking-wider">
              WARNING (ORANYE)
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-amber-700">{stats.warning}</span>
            <p className="text-xs text-amber-900 font-bold mt-1">Peringatan Operasional</p>
            <span className="text-[10px] text-gray-500">Berkas mendekati batas waktu / butuh pendamping</span>
          </div>
        </div>

        <div
          onClick={() => { setSeverityFilter(severityFilter === 'ATTENTION' ? 'ALL' : 'ATTENTION'); setPage(1); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'ATTENTION' ? 'ring-2 ring-yellow-500 bg-yellow-50/50' : 'bg-white hover:border-yellow-300'
          } border-yellow-200`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-yellow-500 text-white uppercase tracking-wider">
              ATTENTION (KUNING)
            </span>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-yellow-700">{stats.attention}</span>
            <p className="text-xs text-yellow-900 font-bold mt-1">Perhatian Khusus</p>
            <span className="text-[10px] text-gray-500">Kehadiran manasik rendah / jamaah lansia risti</span>
          </div>
        </div>

        <div
          onClick={() => { setSeverityFilter(severityFilter === 'NORMAL' ? 'ALL' : 'NORMAL'); setPage(1); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'NORMAL' ? 'ring-2 ring-emerald-600 bg-emerald-50/50' : 'bg-white hover:border-emerald-300'
          } border-emerald-200`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
              NORMAL (HIJAU)
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono text-emerald-700">{stats.normal}</span>
            <p className="text-xs text-emerald-900 font-bold mt-1">Dalam Jalur Aman</p>
            <span className="text-[10px] text-gray-500">Seluruh indikator kesiapan sesuai target</span>
          </div>
        </div>
      </div>

      {/* Warnings List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Daftar Peringatan Dini Aktif</span>
            {severityFilter !== 'ALL' && (
              <span className="text-[10px] font-bold bg-[#0A3E2F] text-white px-2 py-0.5 rounded">
                Filter: {severityFilter}
              </span>
            )}
          </div>
          <Link
            href="/action-center"
            className="text-xs font-bold text-[#0A3E2F] hover:underline flex items-center gap-1"
          >
            Buka di Action Center <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memindai indikator peringatan dini...</div>
        ) : warnings.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic">
            Tidak ada peringatan dini yang terdeteksi. Sistem dalam kondisi aman.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {warnings.map((w) => {
              const isCrit = w.severity === 'CRITICAL';
              const isWarn = w.severity === 'WARNING';

              return (
                <div key={w.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        isCrit
                          ? 'bg-rose-600 text-white'
                          : isWarn
                          ? 'bg-amber-500 text-white'
                          : 'bg-yellow-400 text-yellow-950 font-bold'
                      }`}>
                        {w.severity}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{w.title}</span>
                    </div>

                    <p className="text-xs text-gray-600">{w.reason}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <div>
                        Jamaah:{' '}
                        <Link href={`/jamaah/${w.jamaah.id}`} className="font-bold text-[#0A3E2F] hover:underline">
                          {w.jamaah.fullName}
                        </Link>{' '}
                        <span className="font-mono text-[11px] text-gray-400">({w.jamaah.porsiNumber})</span>
                      </div>
                      <div>Wilayah: <strong className="text-gray-700">{w.region.name}</strong></div>
                      <div>Terdeteksi: <span className="font-mono">{new Date(w.detectedAt).toLocaleString('id-ID')} WIT</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/action-center?search=${w.jamaah.porsiNumber}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 hover:bg-slate-100 flex items-center gap-1"
                    >
                      Action Item <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    {w.status === 'OPEN' && (
                      <button
                        onClick={() => setResolveItem(w)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Selesaikan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {resolveItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-gray-900">Selesaikan Peringatan Dini</h3>
              <button onClick={() => setResolveItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-gray-900">{resolveItem.title}</p>
              <p className="text-gray-600">{resolveItem.reason}</p>
              <p className="text-gray-500">Jamaah: <strong>{resolveItem.jamaah.fullName}</strong> ({resolveItem.jamaah.porsiNumber})</p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 block">Catatan Penyelesaian</label>
              <textarea
                rows={3}
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setResolveItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleResolve}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : 'Konfirmasi Selesai'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
