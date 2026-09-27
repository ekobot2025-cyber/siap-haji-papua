'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  FileCheck,
  HeartPulse,
  CreditCard,
  BookOpen,
  Plane,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  UserCheck,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react';

export default function ActionCenterPage() {
  const [stats, setStats] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [activePriority, setActivePriority] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State for Action Item
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/action-center/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'ALL') params.set('category', activeCategory);
      if (activeStatus !== 'ALL') params.set('status', activeStatus);
      if (activePriority !== 'ALL') params.set('priority', activePriority);
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/action-center?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeStatus, activePriority, search, page]);

  useEffect(() => {
    fetchStats();
    fetchItems();
  }, [fetchStats, fetchItems]);

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setEditStatus(item.status);
    setEditPriority(item.priority);
    setEditNotes(item.notes || '');
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/action-center/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          priority: editPriority,
          notes: editNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedItem(null);
        fetchStats();
        fetchItems();
      } else {
        alert(data.message || 'Gagal memperbarui item');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryCards = [
    { key: 'DOKUMEN', label: 'Dokumen Perlu Tindak Lanjut', count: stats?.categories?.DOKUMEN || 21, icon: FileCheck, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { key: 'PEMERIKSAAN', label: 'Pemeriksaan Butuh Perhatian', count: stats?.categories?.PEMERIKSAAN || 17, icon: HeartPulse, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { key: 'ADMINISTRASI', label: 'Administrasi Belum Lunas', count: stats?.categories?.ADMINISTRASI || 19, icon: CreditCard, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { key: 'MANASIK', label: 'Manasik Butuh Pendampingan', count: stats?.categories?.MANASIK || 8, icon: BookOpen, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8dfc8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl btn-kemenhaj-primary text-white font-bold shadow-xs">
              <AlertCircle className="w-5 h-5 text-white" />
            </span>
            <div>
              <h1 className="text-xl font-black text-[#1A1410] tracking-tight">
                ACTION CENTER — PUSAT INTERVENSI & KOMANDO
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Prinsip Operasional: <span className="font-bold text-[#8a6d2b]">MONITOR → IDENTIFY → PRIORITIZE → ACTION → RESOLVE</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchStats(); fetchItems(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-stone-700 bg-white hover:bg-[#fbf8ee] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <div className="text-right">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Terbuka</span>
            <span className="text-lg font-black font-mono text-rose-700">{stats?.totalOpen ?? 65} Item</span>
          </div>
        </div>
      </div>

      {/* 4 Primary Operational Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeCategory === card.key;
          return (
            <button
              key={card.key}
              onClick={() => {
                setActiveCategory(isSelected ? 'ALL' : card.key);
                setPage(1);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-[#c9a961] shadow-md border-transparent bg-white'
                  : 'bg-white hover:border-[#c9a961] hover:shadow-xs border-[#e8dfc8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-2xl font-black font-mono text-[#1A1410]">
                  {card.count}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-bold text-stone-800 leading-snug">{card.label}</h3>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Klik untuk menyaring list</span>
              </div>
              {isSelected && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#b8941e] rounded-bl-lg" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dfc8] space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, porsi, atau judul kendala..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e8dfc8] focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          {/* Status Tabs - Tampil penuh tanpa scrollbar */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => { setActiveStatus(st); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeStatus === st
                    ? 'bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-[#fbf8ee]'
                }`}
              >
                {st === 'ALL' ? 'Semua Status' : st.replace('_', ' ')}
                {st === 'OPEN' && stats?.statuses?.OPEN ? ` (${stats.statuses.OPEN})` : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="bg-white rounded-2xl border border-[#e8dfc8] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#e8dfc8] bg-[#FAF9F5] flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700">
            Menampilkan {items.length} Item Penugasan & Intervensi
          </span>
          <span className="text-[11px] text-gray-400">
            Halaman {page} dari {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat antrean tindak lanjut...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic">
            Tidak ada item tindak lanjut yang cocok dengan filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const isUrgent = item.priority === 'URGENT';
              const isHigh = item.priority === 'HIGH';
              const isResolved = item.status === 'RESOLVED';

              return (
                <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        PRIORITAS: {item.priority}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]'
                          : item.status === 'ESCALATED'
                          ? 'bg-rose-100 text-rose-800 font-bold'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        STATUS: {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1A1410]">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <div>
                        Jamaah:{' '}
                        <Link
                          href={`/jamaah/${item.jamaah.id}`}
                          className="font-bold text-[#1A1410] hover:text-[#8a6d2b] hover:underline"
                        >
                          {item.jamaah.fullName}
                        </Link>{' '}
                        <span className="font-mono text-[11px] text-gray-400">({item.jamaah.porsiNumber})</span>
                      </div>
                      <div>Wilayah: <strong className="text-gray-700">{item.jamaah.region.name}</strong></div>
                      {item.assignedTo && (
                        <div>Petugas: <strong className="text-gray-700">{item.assignedTo.fullName}</strong></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/jamaah/${item.jamaah.id}`}
                      className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-[#8a6d2b] hover:bg-[#fbf8ee] flex items-center gap-1 transition-colors"
                    >
                      Profil 360° <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3.5 py-1.5 rounded-xl btn-kemenhaj-primary text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Tindak Lanjuti
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/40">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-xs font-bold rounded border bg-white disabled:opacity-50 cursor-pointer"
            >
              Sebelumnya
            </button>
            <span className="text-xs text-gray-500">
              Halaman {page} dari {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-xs font-bold rounded border bg-white disabled:opacity-50 cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>

      {/* Edit / Intervene Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs">
                  <UserCheck className="w-4 h-4 text-white" />
                </span>
                <h3 className="text-base font-bold text-[#1A1410]">Intervensi Tugas Tindak Lanjut</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-gray-500 block">Judul Kendala:</span>
              <p className="font-bold text-gray-900 text-sm">{selectedItem.title}</p>
              <p className="text-gray-600">{selectedItem.description}</p>
              <div className="mt-2 text-gray-500">
                Jamaah: <strong>{selectedItem.jamaah.fullName}</strong> ({selectedItem.jamaah.porsiNumber}) — {selectedItem.jamaah.region.name}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status Progres</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                >
                  <option value="OPEN">OPEN (Menunggu Tindak Lanjut)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Sedang Dikerjakan Petugas)</option>
                  <option value="ESCALATED">ESCALATED (Eskalasi ke Pimpinan)</option>
                  <option value="RESOLVED">RESOLVED (Selesai & Terverifikasi)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Prioritas</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                >
                  <option value="URGENT">URGENT (Paling Mendesak)</option>
                  <option value="HIGH">HIGH (Tinggi)</option>
                  <option value="MEDIUM">MEDIUM (Menengah)</option>
                  <option value="LOW">LOW (Rendah)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Tindak Lanjut / Catatan Petugas</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tuliskan catatan intervensi, komunikasi dengan jamaah, atau tanggal estimasi perbaikan..."
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-kemenhaj-primary cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Pembaruan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
