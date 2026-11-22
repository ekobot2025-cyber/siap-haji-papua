'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tv,
  Globe,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  Check,
  X,
} from 'lucide-react';
import type { PromotionSlide } from '@/application/services/promotion.service';

export default function MediaPromosiPage() {
  const [slides, setSlides] = useState<PromotionSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<PromotionSlide> | null>(null);

  // Form Fields
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Pengumuman • Kemenhaj Papua');
  const [ringkas, setRingkas] = useState('');
  const [sumber, setSumber] = useState('papua.haji.go.id');
  const [url, setUrl] = useState('https://papua.haji.go.id');
  const [gambar, setGambar] = useState('');
  const [targetChannel, setTargetChannel] = useState<'ALL' | 'WEB' | 'TV'>('ALL');
  const [priority, setPriority] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [runningText, setRunningText] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/promotions?active=false');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSlides(json.data);
      }
    } catch (err) {
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const openAddModal = () => {
    setEditingSlide(null);
    setJudul('');
    setKategori('Pengumuman • Kemenhaj Papua');
    setRingkas('');
    setSumber('papua.haji.go.id');
    setUrl('https://papua.haji.go.id');
    setGambar('/logo-kemenhaj.png');
    setTargetChannel('ALL');
    setPriority(slides.length + 1);
    setStartDate('');
    setEndDate('');
    setRunningText('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: PromotionSlide) => {
    setEditingSlide(slide);
    setJudul(slide.judul);
    setKategori(slide.kategori);
    setRingkas(slide.ringkas);
    setSumber(slide.sumber);
    setUrl(slide.url);
    setGambar(slide.gambar || '');
    setTargetChannel(slide.targetChannel);
    setPriority(slide.priority);
    setStartDate(slide.startDate || '');
    setEndDate(slide.endDate || '');
    setRunningText(slide.runningText || '');
    setIsActive(slide.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !ringkas.trim()) {
      setFeedback({ type: 'error', message: 'Judul dan Ringkasan Informasi wajib diisi!' });
      return;
    }

    try {
      setActionLoading(true);
      setFeedback(null);

      const payload = {
        ...(editingSlide?.id ? { id: editingSlide.id } : {}),
        judul,
        kategori,
        ringkas,
        sumber,
        url,
        gambar,
        targetChannel,
        priority: Number(priority),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        runningText,
        isActive,
      };

      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: 'success', message: resData.message || 'Media promosi berhasil disimpan!' });
        setIsModalOpen(false);
        await fetchSlides();
      } else {
        setFeedback({ type: 'error', message: resData.message || 'Gagal menyimpan media promosi.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        await fetchSlides();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus slide "${name}"?`)) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Slide berhasil dihapus.' });
        await fetchSlides();
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Quick stats
  const totalSlides = slides.length;
  const activeSlides = slides.filter((s) => s.isActive).length;
  const webSlides = slides.filter((s) => s.targetChannel === 'ALL' || s.targetChannel === 'WEB').length;
  const tvSlides = slides.filter((s) => s.targetChannel === 'ALL' || s.targetChannel === 'TV').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8dfc8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8a6d2b] mb-1">
            <Sparkles className="w-4 h-4 text-[#c9a961]" />
            <span>Pusat Manajemen Informasi &amp; Media Promosi Kemenhaj</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1410] tracking-tight">
            Media Promosi &amp; Display TV Layanan
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Input media promosi, flyer sosialisasi, dan running text pengumuman untuk ditampilkan serentak pada{' '}
            <strong className="text-stone-800">Landing Page hajipapua.id</strong> serta{' '}
            <strong className="text-stone-800">Layar TV Informasi Publik (Video Wall)</strong> di seluruh kantor layanan se-Papua.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/video-wall"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#c9a961]/40 bg-[#1A1410] text-[#c9a961] hover:bg-black transition-colors"
          >
            <Tv className="w-4 h-4" />
            <span>Buka Layar TV Lobi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#e8dfc8] bg-[#fbf8ee] text-[#8a6d2b] hover:bg-[#f5ecd3] transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Buka Landing Page Web</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white hover:brightness-105 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Media Baru</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfc8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Total Media Input</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-black text-[#1A1410] mt-1">{totalSlides}</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Koleksi slide terdaftar</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Status Tayang (Aktif)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{activeSlides}</div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Ditampilkan ke publik</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Kanal Web Publik</span>
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">{webSlides}</div>
          <span className="text-[11px] text-blue-600 mt-0.5 block">hajipapua.id (HP &amp; Desktop)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8a6d2b] font-medium">
            <span>Kanal Display TV / Lobi</span>
            <Tv className="w-4 h-4 text-[#c9a961]" />
          </div>
          <div className="text-2xl font-black text-[#8a6d2b] mt-1">{tvSlides}</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Layar TV Kantor Layanan</span>
        </div>
      </div>

      {/* Main List Section */}
      <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#e8dfc8] flex items-center justify-between bg-[#fbf8ee]/50">
          <div>
            <h2 className="text-lg font-bold text-[#1A1410] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#8a6d2b]" />
              <span>Daftar Slide Media Promosi &amp; Layanan</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Urutan slide ditentukan oleh angka prioritas. Anda dapat mengubah status tayang secara instan.
            </p>
          </div>
          <button
            onClick={fetchSlides}
            disabled={loading}
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#c9a961] mb-3" />
            <p className="text-sm">Memuat data media promosi...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-base font-bold text-[#1A1410]">Belum ada media promosi yang diinput</p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Silakan klik tombol <strong>+ Tambah Media Baru</strong> untuk menambahkan materi iklan layanan, sosialisasi pelunasan, atau edukasi jamaah.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-kemenhaj-primary"
            >
              <Plus className="w-4 h-4" /> Tambah Sekarang
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#e8dfc8]">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className={`p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors ${
                  s.isActive ? 'hover:bg-[#fbf8ee]/30' : 'bg-stone-50/80 opacity-70'
                }`}
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Priority Number */}
                  <div className="w-8 h-8 rounded-full bg-[#fbf8ee] border border-[#e8dfc8] flex items-center justify-center font-bold text-xs text-[#8a6d2b] shrink-0">
                    {s.priority || idx + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-24 h-16 rounded-xl bg-stone-100 border border-[#e8dfc8] overflow-hidden shrink-0 flex items-center justify-center relative">
                    {s.gambar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.gambar}
                        alt={s.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="w-5 h-5 text-stone-400 mx-auto" />
                        <span className="text-[9px] text-stone-400 block">Teks Saja</span>
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] px-2 py-0.5 rounded-full">
                        {s.kategori}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.targetChannel === 'ALL'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : s.targetChannel === 'WEB'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {s.targetChannel === 'ALL'
                          ? 'Web & TV Display'
                          : s.targetChannel === 'WEB'
                          ? 'Hanya Web'
                          : 'Hanya TV Display'}
                      </span>
                      {s.isActive ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Tayang
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                          Draft / Nonaktif
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[#1A1410] text-base leading-snug line-clamp-1">
                      {s.judul}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">{s.ringkas}</p>

                    {/* Metadata & Running Text info */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-500">
                      <span>Sumber: <strong className="text-stone-700">{s.sumber}</strong></span>
                      {s.runningText && (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate max-w-md">
                          Ticker TV: {s.runningText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <button
                    onClick={() => handleToggleActive(s.id)}
                    disabled={actionLoading}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      s.isActive
                        ? 'border-stone-300 text-stone-600 hover:bg-stone-100'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {s.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>

                  <button
                    onClick={() => openEditModal(s)}
                    disabled={actionLoading}
                    className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#fbf8ee] border border-transparent hover:border-[#e8dfc8] transition-colors"
                    title="Edit Slide"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(s.id, s.judul)}
                    disabled={actionLoading}
                    className="p-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    title="Hapus Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL INPUT / EDIT PROMOTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#e8dfc8] max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#e8dfc8] flex items-center justify-between bg-[#fbf8ee] rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white flex items-center justify-center font-bold">
                  {editingSlide ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1410]">
                    {editingSlide ? 'Perbarui Media Promosi Layanan' : 'Input Media Promosi & Informasi Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Form input materi sosialisasi dan display TV untuk Admin Kemenhaj Papua
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 flex-1">
              {/* Row 1: Judul & Kategori */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Judul Promosi / Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Pelunasan Bipih 1448 H / 2027 M Tahap 1 Dibuka"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Kategori Konten
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden"
                  >
                    <option value="Pengumuman • Kemenhaj Papua">Pengumuman Resmi</option>
                    <option value="Layanan Medis & Kesehatan">Layanan Medis / Istithaah</option>
                    <option value="Edukasi & Perlindungan Jamaah">Edukasi &amp; Anti-Penipuan</option>
                    <option value="Bimbingan & Manasik">Bimbingan &amp; Manasik</option>
                    <option value="Informasi Paspor & Dokumen">Dokumen &amp; Paspor</option>
                    <option value="Pemberangkatan & Kloter">Kloter &amp; Penerbangan</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Ringkasan Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                  Ringkasan / Pesan Edukasi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={ringkas}
                  onChange={(e) => setRingkas(e.target.value)}
                  placeholder="Tuliskan uraian singkat, batas waktu, petunjuk, atau imbauan resmi bagi calon jamaah..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-hidden"
                />
              </div>

              {/* Row 3: Gambar / Flyer Media & Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider flex items-center justify-between">
                  <span>URL Gambar / Flyer Poster (Rasio 16:9 Disarankan)</span>
                  <span className="text-[11px] font-normal text-stone-500">Bisa diisi URL gambar lokal atau link internet</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gambar}
                    onChange={(e) => setGambar(e.target.value)}
                    placeholder="Contoh: /logo-kemenhaj.png atau https://.../flyer.jpg"
                    className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] outline-hidden"
                  />
                  {gambar && (
                    <button
                      type="button"
                      onClick={() => setGambar('')}
                      className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-xl"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Fast Select */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-stone-400 text-[11px]">Pilihan cepat:</span>
                  <button
                    type="button"
                    onClick={() => setGambar('/logo-kemenhaj.png')}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#fbf8ee] border border-stone-200 text-stone-700 text-[11px]"
                  >
                    Logo Resmi Kemenhaj
                  </button>
                  <button
                    type="button"
                    onClick={() => setGambar('/assets/branding/logo-horizontal.svg')}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#fbf8ee] border border-stone-200 text-stone-700 text-[11px]"
                  >
                    Logo Horizontal
                  </button>
                  <button
                    type="button"
                    onClick={() => setGambar('')}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#fbf8ee] border border-stone-200 text-stone-700 text-[11px]"
                  >
                    Tanpa Gambar (Teks Only)
                  </button>
                </div>
              </div>

              {/* Row 4: Kanal Tayang & Tautan Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Target Saluran Tayang
                  </label>
                  <select
                    value={targetChannel}
                    onChange={(e) => setTargetChannel(e.target.value as 'ALL' | 'WEB' | 'TV')}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden font-medium"
                  >
                    <option value="ALL">🌐 &amp; 📺 Seluruh Kanal (Web hajipapua.id &amp; Layar TV Lobi)</option>
                    <option value="WEB">🌐 Hanya Website Publik (hajipapua.id)</option>
                    <option value="TV">📺 Hanya TV Digital Signage / Layar Kantor Layanan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Tautan Aksi (Tombol Klik / Buka Link)
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Contoh: /cek-porsi, /kesehatan, atau link luar https://..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] outline-hidden"
                  />
                </div>
              </div>

              {/* Row 5: Running Text Khusus Layar TV */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-[#c9a961]" />
                    <span>Teks Berjalan Layar TV (Running Text / Ticker Pengumuman Kilat)</span>
                  </span>
                  <span className="text-[11px] font-normal text-stone-500">Opsional</span>
                </label>
                <input
                  type="text"
                  value={runningText}
                  onChange={(e) => setRunningText(e.target.value)}
                  placeholder="Pesan pendek yang berjalan di bagian bawah layar monitor kantor layanan..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] outline-hidden"
                />
              </div>

              {/* Row 6: Prioritas, Tanggal & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#e8dfc8]">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Urutan Tampil (Prioritas)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] outline-hidden font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Batas Akhir Tayang (Auto-Expire)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Status Publikasi
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#c9a961] focus:ring-[#c9a961]"
                    />
                    <span className="text-xs font-bold text-stone-700">
                      {isActive ? 'Aktif (Langsung Tayang)' : 'Simpan sebagai Draft'}
                    </span>
                  </label>
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div className="pt-3 border-t border-[#e8dfc8]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 block">
                  Pratinjau Tampilan di Hajipapua.id
                </span>
                <div className="p-4 rounded-2xl border border-[#e8dfc8] bg-[#fbf8ee]/40 flex flex-col sm:flex-row gap-4 items-center">
                  {gambar ? (
                    <div className="w-24 h-24 rounded-xl bg-white border border-[#e8dfc8] overflow-hidden shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={gambar} alt="Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-white border border-[#e8dfc8] text-[#8a6d2b] px-2 py-0.5 rounded-full">
                      {kategori || 'Kategori'}
                    </span>
                    <h4 className="font-bold text-[#1A1410] text-base mt-1 line-clamp-1">
                      {judul || 'Judul Media Promosi / Layanan Akan Tampil di Sini'}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {ringkas || 'Ringkasan isi pesan promosi dan edukasi layanan calon jamaah haji papua...'}
                    </p>
                    <div className="mt-2 text-[10px] text-stone-500 font-medium">
                      Sumber: {sumber || 'papua.haji.go.id'} • Tautan: {url || '#'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8dfc8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white hover:brightness-105 shadow-xs transition-all flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Simpan &amp; Publikasikan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
