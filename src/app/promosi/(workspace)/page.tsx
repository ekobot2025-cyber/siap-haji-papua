'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Tv,
  Globe,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Video,
  X,
  Play,
} from 'lucide-react';
import type { PromotionSlide } from '@/application/services/promotion.service';
import { parseVideoUrl } from '@/lib/video-helper';

export default function PromosiDashboardPage() {
  const [slides, setSlides] = useState<PromotionSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'WEB' | 'TV'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<PromotionSlide> | null>(null);

  // Form Fields
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Pengumuman • Kemenhaj Papua');
  const [ringkas, setRingkas] = useState('');
  const [sumber, setSumber] = useState('papua.haji.go.id');
  const [url, setUrl] = useState('https://papua.haji.go.id');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [gambar, setGambar] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
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
    setMediaType('IMAGE');
    setGambar('/logo-kemenhaj.png');
    setVideoUrl('');
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
    setMediaType(slide.mediaType || (slide.videoUrl ? 'VIDEO' : 'IMAGE'));
    setGambar(slide.gambar || '');
    setVideoUrl(slide.videoUrl || '');
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

    if (mediaType === 'VIDEO' && !videoUrl.trim()) {
      setFeedback({ type: 'error', message: 'Masukkan URL Link Video (YouTube / MP4) untuk format video!' });
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
        mediaType,
        gambar: mediaType === 'IMAGE' ? gambar : '',
        videoUrl: mediaType === 'VIDEO' ? videoUrl.trim() : '',
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
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Slides
  const filteredSlides = slides.filter((s) => {
    if (channelFilter !== 'ALL' && s.targetChannel !== 'ALL' && s.targetChannel !== channelFilter) {
      return false;
    }
    if (typeFilter === 'VIDEO' && s.mediaType !== 'VIDEO' && !s.videoUrl) {
      return false;
    }
    if (typeFilter === 'IMAGE' && (s.mediaType === 'VIDEO' || s.videoUrl)) {
      return false;
    }
    return true;
  });

  const totalActive = slides.filter((s) => s.isActive).length;
  const totalVideo = slides.filter((s) => s.mediaType === 'VIDEO' || s.videoUrl).length;
  const totalTv = slides.filter((s) => s.targetChannel === 'ALL' || s.targetChannel === 'TV').length;
  const totalWeb = slides.filter((s) => s.targetChannel === 'ALL' || s.targetChannel === 'WEB').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-[#14100D] via-[#1E1712] to-[#14100D] border border-[#c9a961]/30 p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c9a961]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a961]" />
              PANEL KHUSUS PENGELOLA MEDIA &amp; TV DISPLAY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pusat Media Promosi &amp; Informasi Layanan
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Kelola materi flyer promosi, banner pengumuman, link video YouTube / MP4, serta running text TV digital signage secara instan tanpa perlu akses ke menu teknis haji.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openAddModal}
              className="px-5 py-3 rounded-2xl btn-kemenhaj-primary text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Media Iklan / Info</span>
            </button>

            <button
              type="button"
              onClick={fetchSlides}
              disabled={loading}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 text-[10px] uppercase font-sans font-bold block">Total Slide Aktif</span>
            <span className="text-2xl font-black text-[#c9a961]">{totalActive}</span>
            <span className="text-stone-400 text-[10px] block font-sans">dari {slides.length} materi</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 text-[10px] uppercase font-sans font-bold block">Format Video</span>
            <span className="text-2xl font-black text-rose-400">{totalVideo}</span>
            <span className="text-stone-400 text-[10px] block font-sans">YouTube / MP4</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 text-[10px] uppercase font-sans font-bold block">Tayang di Web</span>
            <span className="text-2xl font-black text-blue-300">{totalWeb}</span>
            <span className="text-stone-400 text-[10px] block font-sans">hajipapua.id</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 text-[10px] uppercase font-sans font-bold block">Tayang di TV Lobi</span>
            <span className="text-2xl font-black text-amber-300">{totalTv}</span>
            <span className="text-stone-400 text-[10px] block font-sans">Digital Signage</span>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dfc8] shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Channel Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-500 mr-2 uppercase tracking-wider">Kanal:</span>
          <button
            type="button"
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              channelFilter === 'ALL'
                ? 'bg-[#1A1410] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Semua Saluran ({slides.length})
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('WEB')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              channelFilter === 'WEB'
                ? 'bg-[#c9a961] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web hajipapua.id</span>
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('TV')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              channelFilter === 'TV'
                ? 'bg-[#c9a961] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Layar TV Lobi</span>
          </button>
        </div>

        {/* Media Format Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-stone-500 mr-2 uppercase tracking-wider">Format:</span>
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              typeFilter === 'ALL' ? 'bg-[#c9a961] text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('VIDEO')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              typeFilter === 'VIDEO' ? 'bg-rose-600 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('IMAGE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              typeFilter === 'IMAGE' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Poster Flyer</span>
          </button>
        </div>
      </div>

      {/* 3. Slide List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-[#e8dfc8] text-center text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#c9a961]" />
            <p className="text-xs font-medium">Memuat materi promosi &amp; informasi...</p>
          </div>
        ) : filteredSlides.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#e8dfc8] text-center space-y-3 shadow-xs">
            <Tv className="w-12 h-12 text-[#c9a961] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#1A1410]">Tidak ada materi promosi yang cocok</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Belum ada materi promosi dengan filter yang dipilih. Klik tombol &ldquo;Tambah Media Iklan / Info&rdquo; untuk membuat konten baru.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl btn-kemenhaj-primary text-xs font-bold text-white shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Konten Pertama</span>
            </button>
          </div>
        ) : (
          filteredSlides.map((s, idx) => (
            <div
              key={s.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all bg-white shadow-xs hover:border-[#c9a961] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !s.isActive ? 'opacity-70 bg-stone-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Priority number */}
                <div className="w-8 h-8 rounded-full bg-[#fbf8ee] border border-[#e8dfc8] flex items-center justify-center font-bold text-xs text-[#8a6d2b] shrink-0 mt-1">
                  {s.priority || idx + 1}
                </div>

                {/* Media Thumbnail / Preview Badge */}
                <div className="w-28 h-20 rounded-xl bg-stone-100 border border-[#e8dfc8] overflow-hidden shrink-0 flex items-center justify-center relative">
                  {s.mediaType === 'VIDEO' || s.videoUrl ? (
                    <div className="text-center p-2 bg-[#14100D] text-[#c9a961] w-full h-full flex flex-col items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-rose-600/20 border border-rose-500 flex items-center justify-center mb-1">
                        <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400 ml-0.5" />
                      </div>
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider block">Video</span>
                    </div>
                  ) : s.gambar ? (
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
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] px-2 py-0.5 rounded-full">
                      {s.kategori}
                    </span>

                    {s.mediaType === 'VIDEO' || s.videoUrl ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <Video className="w-3 h-3 text-rose-600" />
                        Video Link
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-stone-500" />
                        Poster Flyer
                      </span>
                    )}

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
                        ? 'Web & TV Lobi'
                        : s.targetChannel === 'WEB'
                        ? 'Hanya Web'
                        : 'Hanya TV Lobi'}
                    </span>

                    {s.isActive ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Tayang Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                        Draft / Nonaktif
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[#1A1410] text-sm sm:text-base leading-snug line-clamp-1">
                    {s.judul}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{s.ringkas}</p>

                  {/* Ticker / Running text preview if set */}
                  {s.runningText && (
                    <div className="pt-1">
                      <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 inline-block max-w-xl truncate">
                        <strong>Ticker TV:</strong> {s.runningText}
                      </span>
                    </div>
                  )}

                  {s.videoUrl && (
                    <p className="text-[11px] font-mono text-stone-500 truncate max-w-lg">
                      Link: {s.videoUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleActive(s.id)}
                  disabled={actionLoading}
                  className={`w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    s.isActive
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200'
                  }`}
                  title="Klik untuk mengubah status tayang"
                >
                  {s.isActive ? '✓ Tayang Aktif' : '○ Nonaktifkan'}
                </button>

                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => openEditModal(s)}
                    disabled={actionLoading}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-[#fbf8ee] text-stone-700 transition-colors cursor-pointer"
                    title="Edit Materi Promosi"
                  >
                    <Edit3 className="w-4 h-4 text-[#8a6d2b]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(s.id, s.judul)}
                    disabled={actionLoading}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Materi Promosi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Modal Add / Edit Media Promosi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e8dfc8] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e8dfc8] bg-[#fbf8ee] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#c9a961] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1410]">
                    {editingSlide ? 'Edit Media Promosi & Iklan' : 'Tambah Media Promosi Baru'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Materi akan disinkronkan otomatis ke landing page &amp; TV display
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Judul & Kategori */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Judul Promosi / Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Jadwal Pelunasan Bipih 1448 H Resmi Dibuka"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-hidden bg-[#FAF9F5]/40"
                  />
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden"
                  >
                    <option value="Pengumuman • Kemenhaj Papua">Pengumuman Resmi</option>
                    <option value="Layanan Medis & Kesehatan">Layanan Medis / Istithaah</option>
                    <option value="Edukasi & Perlindungan Jamaah">Edukasi &amp; Perlindungan</option>
                    <option value="Bimbingan & Manasik">Bimbingan &amp; Manasik</option>
                    <option value="Informasi Paspor & Dokumen">Dokumen &amp; Paspor</option>
                    <option value="Pemberangkatan & Kloter">Kloter &amp; Penerbangan</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Ringkasan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                  Ringkasan / Pesan Edukasi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={ringkas}
                  onChange={(e) => setRingkas(e.target.value)}
                  placeholder="Tuliskan petunjuk, tanggal penting, persyaratan, atau pesan himbauan bagi calon jamaah haji..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-hidden bg-[#FAF9F5]/40"
                />
              </div>

              {/* Row 3: Format Media (Poster vs Video) */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#fbf8ee]/60 border border-[#e8dfc8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider flex items-center gap-1.5">
                    <span>Format Media Slide</span>
                    <span className="text-stone-400 font-normal">|</span>
                    <span className="text-[11px] text-[#8a6d2b] font-normal lowercase">pilih jenis media iklan</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e8dfc8] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setMediaType('IMAGE')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        mediaType === 'IMAGE'
                          ? 'bg-[#c9a961] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Poster Gambar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('VIDEO')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        mediaType === 'VIDEO'
                          ? 'bg-[#c9a961] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video (Link YouTube / MP4)</span>
                    </button>
                  </div>
                </div>

                {mediaType === 'VIDEO' ? (
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                      <span>URL Link Video (YouTube / Shorts / MP4) <span className="text-rose-500">*</span></span>
                      <span className="text-[11px] text-[#8a6d2b] font-normal">Cukup paste link video di sini</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/... atau link file .mp4"
                        className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] bg-white focus:border-[#c9a961] outline-hidden"
                      />
                      {videoUrl && (
                        <button
                          type="button"
                          onClick={() => setVideoUrl('')}
                          className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-xl bg-white cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      💡 <strong>Petunjuk:</strong> Cukup paste tautan video dari channel YouTube resmi Kemenhaj atau tautan file MP4. Video akan otomatis di-embed dan diputar langsung pada slide banner beranda dan Layar TV Kantor Layanan.
                    </p>

                    {/* Live Video Preview inside Modal */}
                    {videoUrl && (() => {
                      const vInfo = parseVideoUrl(videoUrl);
                      if (vInfo.type === 'youtube' && vInfo.embedUrl) {
                        return (
                          <div className="mt-2 rounded-xl overflow-hidden border border-[#e8dfc8] bg-black aspect-video max-h-48 relative shadow-md">
                            <iframe
                              src={vInfo.embedUrl}
                              title="Preview Video Promosi"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }
                      if (vInfo.type === 'direct' && vInfo.directUrl) {
                        return (
                          <div className="mt-2 rounded-xl overflow-hidden border border-[#e8dfc8] bg-black aspect-video max-h-48 relative shadow-md">
                            <video
                              src={vInfo.directUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        );
                      }
                      return (
                        <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                          Format link belum dapat di-preview. Pastikan link YouTube (watch/shorts/youtu.be) atau file video .mp4.
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                      <span>URL Gambar / Flyer Poster (Rasio 16:9 Disarankan)</span>
                      <span className="text-[11px] font-normal text-stone-500">Bisa diisi URL gambar lokal atau link internet</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gambar}
                        onChange={(e) => setGambar(e.target.value)}
                        placeholder="Contoh: /logo-kemenhaj.png atau https://.../flyer.jpg"
                        className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] bg-white focus:border-[#c9a961] outline-hidden"
                      />
                      {gambar && (
                        <button
                          type="button"
                          onClick={() => setGambar('')}
                          className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-xl bg-white cursor-pointer"
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
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#fbf8ee] border border-stone-200 text-stone-700 text-[11px] cursor-pointer"
                      >
                        Logo Resmi Kemenhaj
                      </button>
                      <button
                        type="button"
                        onClick={() => setGambar('/assets/branding/logo-horizontal.svg')}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#fbf8ee] border border-stone-200 text-stone-700 text-[11px] cursor-pointer"
                      >
                        Logo Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => setGambar('')}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#fbf8ee] border border-stone-200 text-stone-700 text-[11px] cursor-pointer"
                      >
                        Tanpa Gambar (Teks Only)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 4: Kanal Tayang & Tautan Target */}
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
                    <option value="TV">📺 Hanya TV Digital Signage / Layar Lobi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Tautan Link Informasi (Target URL)
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Contoh: https://papua.haji.go.id atau /kesehatan"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden"
                  />
                </div>
              </div>

              {/* Row 5: Running Text Ticker TV */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/50 border border-amber-200">
                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-[#b8941e]" />
                  <span>Pesan Teks Berjalan TV Lobi (Running Text Marquee)</span>
                </label>
                <input
                  type="text"
                  value={runningText}
                  onChange={(e) => setRunningText(e.target.value)}
                  placeholder="Contoh: Pelunasan Bipih Tahap 1 dibuka s.d 10 Desember 2026. Segera penuhi syarat istithaah kesehatan..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-amber-200 focus:border-[#c9a961] bg-white outline-hidden"
                />
                <span className="text-[11px] text-amber-800 block">
                  Teks ini akan melintas di bagian bawah layar TV Lobi saat slide tayang.
                </span>
              </div>

              {/* Row 6: Prioritas Urutan, Tanggal, & Saklar Aktif */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Urutan Prioritas (No)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Mulai Tayang (Opsional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">
                    Selesai Tayang (Opsional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] bg-white outline-hidden"
                  />
                </div>
              </div>

              {/* Toggle Aktif Langsung */}
              <div className="pt-2 flex items-center justify-between border-t border-[#e8dfc8]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#c9a961] focus:ring-[#c9a961] border-stone-300"
                  />
                  <span className="text-xs font-bold text-[#1A1410]">
                    Langsung Publikasikan (Tayang Aktif)
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#e8dfc8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl btn-kemenhaj-primary text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
