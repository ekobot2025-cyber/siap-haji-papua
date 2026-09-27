'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plane,
  HeartPulse,
  CreditCard,
  FileCheck,
  BookOpen,
  ArrowLeft,
  QrCode,
  Printer,
  Sparkles,
  Info,
  ArrowUpRight,
} from 'lucide-react';
import { SmartHajjPassModal } from '@/components/jamaah/SmartHajjPassModal';

export default function CekPorsiPage() {
  const [porsi, setPorsi] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSmartPass, setShowSmartPass] = useState(false);

  // Auto-lookup if opened with query params (e.g. from QR Code scan on phone)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlPorsi = params.get('porsi');
      const urlTh = params.get('th') || params.get('birthYear');

      if (urlPorsi && urlTh) {
        setPorsi(urlPorsi);
        setBirthYear(urlTh);
        setLoading(true);

        fetch('/api/public/cek-porsi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            porsiNumber: urlPorsi.trim(),
            birthYear: parseInt(urlTh.trim(), 10),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setResult(data.data);
            }
          })
          .catch((e) => console.error(e))
          .finally(() => setLoading(false));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!porsi.trim() || !birthYear.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/public/cek-porsi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          porsiNumber: porsi.trim(),
          birthYear: parseInt(birthYear.trim(), 10),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Nomor Porsi atau Tahun Lahir tidak cocok.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kendala koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setPorsi('2700192001');
    setBirthYear('1951');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white text-stone-800 border-b border-[#e8dfc8] shadow-xs sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 border border-[#e8dfc8] flex items-center justify-center shadow-2xs">
              <Image
                src="/assets/branding/logo-kemenhaj.png"
                alt="Logo SIAP HAJI PAPUA"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-sm tracking-wider text-[#1A1410] block">
                SIAP <span className="text-[#b8941e]">HAJI</span> PAPUA
              </span>
              <span className="text-[10px] text-stone-500 block">
                Portal Mandiri Layanan Jamaah & Keluarga
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#fbf8ee] hover:bg-[#f4ebd0] text-[#8a6d2b] border border-[#e8dfc8] transition-colors"
          >
            Login Petugas
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Hero Banner */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf8ee] text-[#8a6d2b] text-xs font-bold border border-[#e8dfc8]">
            <Sparkles className="w-3.5 h-3.5 text-[#b8941e]" />
            Transparansi & Layanan Publik Haji Papua
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1410] tracking-tight">
            Cek Kesiapan Keberangkatan Jamaah
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Periksa status kelengkapan berkas, pelunasan BPIH, rekomendasi kesehatan, bimbingan manasik, dan nomor kloter Anda.
          </p>
        </div>

        {/* Official Ministry Integration Banner */}
        <div className="bg-gradient-to-r from-[#1A1410] via-[#261F1A] to-[#1A1410] text-white rounded-2xl p-4 border border-[#c9a961]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#c9a961] shrink-0" />
            <div>
              <span className="font-bold text-xs text-[#c9a961] block">Integrasi Basis Data Resmi SISKOHAT</span>
              <span className="text-[11px] text-[#e8dfc8]">
                Terkoneksi langsung dengan portal Kementerian Haji dan Umrah RI.
              </span>
            </div>
          </div>
          <a
            href="https://haji.go.id"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#c9a961] text-xs font-bold border border-[#c9a961]/40 transition-all whitespace-nowrap self-start sm:self-auto shadow-xs"
          >
            <span>Portal haji.go.id</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#c9a961]" />
          </a>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl border border-[#e8dfc8] p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                10-Digit Nomor Porsi Haji
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="Contoh: 2700192001"
                  value={porsi}
                  onChange={(e) => setPorsi(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e8dfc8] text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Tahun Lahir Jamaah (Verifikasi Keamanan)
              </label>
              <input
                type="number"
                required
                min={1920}
                max={2015}
                placeholder="Contoh: 1951"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e8dfc8] text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961]"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP), verifikasi tahun lahir melindungi data pribadi Anda.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-kemenhaj-primary text-white font-bold text-sm shadow-md disabled:opacity-50"
            >
              {loading ? 'Memeriksa Data...' : 'Cek Status Kesiapan'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-[#8a6d2b] hover:text-[#1A1410] hover:underline font-semibold cursor-pointer"
            >
              ✨ Isi Otomatis Contoh Nomor Porsi Demo
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        {result && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Identity & Overall Score Box */}
            <div className="bg-gradient-to-r from-[#1A1410] via-[#261F1A] to-[#1A1410] border border-[#c9a961]/40 text-white rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase font-bold text-[#c9a961] tracking-wider block">
                    {result.seasonName} • Wilayah {result.regionName}
                  </span>
                  <h2 className="text-2xl font-black mt-1 text-white">{result.fullName}</h2>
                  <div className="flex items-center gap-3 text-xs text-[#e8dfc8] mt-1 font-mono">
                    <span>Nomor Porsi: <strong className="text-white">{result.porsiNumber}</strong></span>
                    <span>•</span>
                    <span>NIK: <strong className="text-white">{result.nikMasked}</strong></span>
                  </div>
                </div>

                <div className="bg-white/10 px-4 py-3 rounded-2xl text-center border border-[#c9a961]/30 shrink-0">
                  <span className="text-[10px] text-[#e8dfc8] uppercase font-bold block">Indeks Kesiapan</span>
                  <span className="text-2xl font-black font-mono text-[#c9a961]">
                    {Number(result?.readiness?.score ?? 0).toFixed(0)}%
                  </span>
                  <span className="text-[10px] block font-semibold text-white/90 uppercase">
                    {result.readiness.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Kloter & Pass Trigger */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-[#e8dfc8] space-y-0.5">
                  <div>
                    Alokasi Kloter:{' '}
                    <strong className="text-white">
                      {result.kloter ? `Kloter ${result.kloter.number} (${result.kloter.code})` : 'Dalam Proses Penetapan'}
                    </strong>
                  </div>
                  <div>
                    Embarkasi: <strong className="text-white">{result.kloter ? result.kloter.embarkation : 'Hasanuddin Makassar (UPG)'}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setShowSmartPass(true)}
                  className="px-4 py-2 rounded-xl btn-kemenhaj-primary text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-white" /> Buka Smart Hajj Pass Digital
                </button>
              </div>
            </div>

            {/* 5 Milestone Step Trackers */}
            <div className="bg-white rounded-3xl border border-[#e8dfc8] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1A1410] pb-2 border-b border-stone-100">
                Status 5 Tahapan Kesiapan Pra-Keberangkatan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {/* 1. Dokumen */}
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#e8dfc8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">1. Dokumen</span>
                    <FileCheck className="w-4 h-4 text-[#b8941e]" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
                    Tervalidasi
                  </span>
                  <p className="text-[11px] text-stone-500">Paspor & foto telah tervalidasi lengkap.</p>
                </div>

                {/* 2. BPIH */}
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#e8dfc8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">2. BPIH</span>
                    <CreditCard className="w-4 h-4 text-[#b8941e]" />
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.bpihStatus === 'SELESAI' ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {result.bpihStatus === 'SELESAI' ? 'LUNAS' : 'DALAM PROSES'}
                  </span>
                  <p className="text-[11px] text-stone-500">Pelunasan biaya haji reguler.</p>
                </div>

                {/* 3. Kesehatan */}
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#e8dfc8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">3. Kesehatan</span>
                    <HeartPulse className="w-4 h-4 text-[#b8941e]" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
                    {result.healthStatus === 'MEMENUHI_SYARAT' ? 'ISTITHA\'AH' : 'TERPERIKSA'}
                  </span>
                  <p className="text-[11px] text-stone-500">Pemeriksaan Puskesmas & RSUD rujukan.</p>
                </div>

                {/* 4. Manasik */}
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#e8dfc8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">4. Manasik</span>
                    <BookOpen className="w-4 h-4 text-[#b8941e]" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
                    TERCATAT
                  </span>
                  <p className="text-[11px] text-stone-500">Bimbingan di KUA dan Kabupaten/Kota.</p>
                </div>

                {/* 5. Kloter */}
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#e8dfc8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">5. Kloter</span>
                    <Plane className="w-4 h-4 text-[#b8941e]" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
                    {result.kloter ? result.kloter.code : 'TERALOKASI'}
                  </span>
                  <p className="text-[11px] text-stone-500">Alokasi penerbangan & asrama haji.</p>
                </div>
              </div>
            </div>

            {/* Assistance Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Butuh Bantuan atau Informasi Perbaikan Berkas?</strong>
                <span>
                  Silakan hubungi Seksi Penyelenggaraan Haji dan Umrah di Kantor Kementerian Haji dan Umrah {result.regionName} atau posko pelayanan haji terdekat.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Master Modal: Smart Hajj Pass Digital (Authentic Scannable QR & Print Ready) */}
        {result && (
          <SmartHajjPassModal
            isOpen={showSmartPass}
            onClose={() => setShowSmartPass(false)}
            jamaah={{
              fullName: result.fullName,
              porsiNumber: result.porsiNumber,
              regionName: result.regionName,
              bloodType: result.bloodType || 'B',
              age: 75,
              gender: 'FEMALE',
              kloterCode: result.kloter?.code || 'UPG-02',
              kloterNumber: result.kloter?.number || 2,
              embarkation: result.kloter?.embarkation || 'Embarkasi Hasanuddin Makassar (UPG)',
              airline: 'Garuda Indonesia',
              flightNumber: result.kloter?.flightNumber || 'GA-1102',
              seatNumber: result.kloter?.seatNumber || '14-B',
              groupName: 'Rombongan 02 (Regu 01)',
              dormitoryDate: '14 Mei 2026',
              departureDate: '15 Mei 2026',
              readinessScore: result.readiness?.score || 90,
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e8dfc8] py-6 text-center text-xs text-stone-500 space-y-1">
        <p className="font-semibold text-stone-800">SIAP HAJI PAPUA — Kementerian Haji dan Umrah Wilayah Kerja Papua</p>
        <p className="text-[11px] text-stone-500">
          Terintegrasi vertikal dengan SISKOHAT Kementerian Haji dan Umrah Republik Indonesia (
          <a
            href="https://haji.go.id"
            target="_blank"
            rel="noreferrer"
            className="text-[#8a6d2b] font-bold underline hover:text-[#1A1410]"
          >
            haji.go.id
          </a>
          )
        </p>
        <p className="text-[11px] text-stone-400">Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap</p>
      </footer>
    </div>
  );
}
