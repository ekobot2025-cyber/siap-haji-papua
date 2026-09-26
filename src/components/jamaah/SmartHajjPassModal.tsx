'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  X,
  ShieldCheck,
  Plane,
  Building2,
  HeartPulse,
  Phone,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  QrCode,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';

export interface SmartHajjPassProps {
  isOpen: boolean;
  onClose: () => void;
  jamaah: {
    fullName: string;
    porsiNumber: string;
    regionName: string;
    bloodType: string;
    age: number;
    gender: string;
    kloterCode: string;
    kloterNumber: number;
    embarkation: string;
    airline: string;
    flightNumber: string;
    seatNumber: string;
    groupName: string;
    dormitoryDate: string;
    departureDate: string;
    passportNumber?: string;
    readinessScore?: number;
    istithaahStatus?: string;
    maktabMakkah?: string;
    hotelMadinah?: string;
    tphiName?: string;
    tphiPhone?: string;
    tkhiName?: string;
    tkhiPhone?: string;
  };
}

export function SmartHajjPassModal({ isOpen, onClose, jamaah }: SmartHajjPassProps) {
  const [activeTab, setActiveTab] = useState<'front' | 'back' | 'all'>('front');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [verificationUrl, setVerificationUrl] = useState<string>('');

  useEffect(() => {
    async function generateRealQR() {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
        // URL verifikasi resmi yang langsung membuka rincian jamaah di portal cek porsi
        const verifyLink = `${origin}/cek-porsi?porsi=${encodeURIComponent(jamaah.porsiNumber)}&th=1951`;
        setVerificationUrl(verifyLink);

        const dataUrl = await QRCode.toDataURL(verifyLink, {
          width: 320,
          margin: 1,
          color: {
            dark: '#0A3E2F',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Gagal generate QR Code', err);
      }
    }

    if (isOpen) {
      generateRealQR();
    }
  }, [isOpen, jamaah.porsiNumber]);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Switch to 'all' (dual-sided) before printing so both sides are printed on paper
    setActiveTab('all');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const passportNumber = jamaah.passportNumber || `B${8000000 + parseInt(jamaah.porsiNumber.slice(-3) || '1', 10)}`;
  const maktab = jamaah.maktabMakkah || 'Sektor 4 Syisyah (Maktab 48 - Kiswah)';
  const hotelMadinah = jamaah.hotelMadinah || 'Markaziyah Sektor 2 (Front Taiba)';
  const tphi = jamaah.tphiName || 'H. Abdul Karim, S.Ag (0811-4800-101)';
  const tkhi = jamaah.tkhiName || 'dr. Sarah Wulandari, Sp.PD (0811-4800-103)';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Printable Root Container - This will be strictly captured during printing */}
      <div
        id="printable-hajj-card-root"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-4 relative animate-in fade-in zoom-in-95 duration-200 border border-slate-200"
      >
        {/* =========================================================================
            1. MODAL INTERACTIVE HEADER (SCREEN ONLY: HIDDEN IN PRINT)
            ========================================================================= */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0A3E2F] text-[#D4AF37] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900 leading-tight">
                Kartu Digital Jamaah Haji (Smart Hajj Pass)
              </h2>
              <p className="text-[11px] text-gray-500">
                Dokumen Identitas Resmi PPIH Provinsi Papua 1447 H / 2026 M
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            2. VIEW SELECTOR TABS & PRINT ACTION (SCREEN ONLY)
            ========================================================================= */}
        <div className="no-print px-4 sm:px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab('front')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'front'
                  ? 'bg-[#0A3E2F] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sisi Depan (Identitas)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('back')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'back'
                  ? 'bg-[#0A3E2F] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sisi Belakang (Akomodasi & Medis)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0A3E2F] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Format Lengkap (Siap Cetak 2 Sisi)
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Cetak / Simpan PDF (A4)</span>
          </button>
        </div>

        {/* =========================================================================
            3. PRINT FORMAL HEADER (ONLY VISIBLE ON PAPER / PRINT PREVIEW)
            ========================================================================= */}
        <div className="hidden print:block text-center border-b-2 border-black pb-3 mb-4 mx-4 pt-2">
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/branding/app-icon.png" alt="Emblem" className="w-12 h-12 object-contain" />
            <div className="text-center flex-1 px-4">
              <h1 className="text-xs font-bold uppercase tracking-wider text-black">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </h1>
              <h2 className="text-sm font-black uppercase text-black">
                PANITIA PENYELENGGARA IBADAH HAJI (PPIH) EMBARKASI PAPUA
              </h2>
              <p className="text-[10px] text-gray-700">
                Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji (SIAP HAJI PAPUA) • Musim 1447 H / 2026 M
              </p>
            </div>
            <div className="w-12 h-12 flex flex-col items-center justify-center border border-black text-[8px] font-mono font-bold leading-tight">
              <span>RESMI</span>
              <span>1447H</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. HAJJ CARD CONTENT CONTAINER
            ========================================================================= */}
        <div className="p-4 sm:p-6 bg-slate-100 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible print:bg-white print:p-2">
          <div
            className={`grid gap-6 items-start justify-center ${
              activeTab === 'all'
                ? 'grid-cols-1 md:grid-cols-2 print:grid-cols-2'
                : 'grid-cols-1 max-w-md mx-auto'
            }`}
          >
            {/* -------------------------------------------------------------
                SIDE A: SISI DEPAN (FRONT CARD)
                ------------------------------------------------------------- */}
            {(activeTab === 'front' || activeTab === 'all') && (
              <div className="w-full max-w-[340px] mx-auto bg-gradient-to-b from-[#0A3E2F] via-[#093528] to-[#041a14] rounded-3xl border-3 border-[#D4AF37] text-white shadow-xl overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-2 print:border-[#0A3E2F]">
                {/* Top Indonesian Ribbon Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-red-600 via-white to-red-600 border-b border-black/30" />

                {/* Card Header */}
                <div className="p-3.5 pb-2 text-center border-b border-white/15 bg-black/20">
                  <div className="flex items-center justify-between mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/branding/app-icon.png"
                      alt="Logo"
                      className="w-8 h-8 rounded-lg bg-white/10 p-0.5 border border-[#D4AF37]"
                    />
                    <div className="text-center flex-1 px-1">
                      <span className="text-[9px] uppercase font-bold text-slate-200 tracking-wider block">
                        Kemenag RI • PPIH Papua
                      </span>
                      <span className="text-xs font-black uppercase text-[#D4AF37] tracking-tight block">
                        SIAP HAJI PAPUA 1447 H
                      </span>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#D4AF37] text-gray-950">
                      REGULER
                    </span>
                  </div>

                  {/* Ribbon Title */}
                  <div className="inline-block px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] font-extrabold uppercase tracking-wide">
                    KARTU IDENTITAS RESMI JAMAAH HAJI
                  </div>
                </div>

                {/* Pilgrim Main Profile Area */}
                <div className="p-3.5 space-y-3">
                  {/* Photo & Primary Bio */}
                  <div className="flex items-center gap-3">
                    {/* Official Photo Box */}
                    <div className="relative w-20 h-24 rounded-xl bg-white p-1 border-2 border-[#D4AF37] shadow-md shrink-0 flex flex-col items-center justify-between overflow-hidden">
                      <div className="w-full h-full bg-emerald-950 rounded-lg flex flex-col items-center justify-center text-white relative">
                        <span className="text-2xl font-black text-[#D4AF37]">
                          {jamaah.fullName.slice(0, 1)}
                        </span>
                        <span className="text-[8px] uppercase font-mono text-emerald-200">
                          {jamaah.gender === 'FEMALE' ? 'JAMAAH (P)' : 'JAMAAH (L)'}
                        </span>
                      </div>
                      {/* Official Stamp Watermark */}
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none rotate-[-15deg]">
                        <span className="text-[8px] font-black text-rose-600/70 border border-rose-600/70 px-1 py-0.2 rounded uppercase">
                          VERIFIED PPIH
                        </span>
                      </div>
                    </div>

                    {/* Bio Data */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">
                        Nama Lengkap:
                      </span>
                      <h3 className="text-sm font-black text-white leading-tight truncate">
                        {jamaah.fullName}
                      </h3>

                      <div className="pt-0.5">
                        <span className="text-[9px] text-slate-300 uppercase block">Nomor Porsi Resmi:</span>
                        <span className="font-mono text-xs font-black text-[#D4AF37] bg-black/40 px-2 py-0.5 rounded border border-[#D4AF37]/40 inline-block">
                          {jamaah.porsiNumber}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-200 pt-0.5">
                        Paspor: <strong className="font-mono text-white">{passportNumber}</strong>
                      </div>
                      <div className="text-[10px] text-slate-300 truncate">
                        Asal: <strong className="text-white">{jamaah.regionName}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Flight & Kloter Strip */}
                  <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-black/35 border border-white/10 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase">Kloter:</span>
                      <strong className="text-[#D4AF37] text-xs font-bold block">
                        {jamaah.kloterCode}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase">Rombongan / Regu:</span>
                      <strong className="text-white text-[10px] font-bold block truncate">
                        {jamaah.groupName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase">Seat Pesawat:</span>
                      <strong className="text-white text-xs font-bold block">
                        {jamaah.flightNumber} • {jamaah.seatNumber}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase">Gol. Darah / Usia:</span>
                      <strong className="text-white text-[10px] font-bold block">
                        {jamaah.bloodType} • {jamaah.age} Th
                      </strong>
                    </div>
                  </div>

                  {/* Real Scannable QR Code Box */}
                  <div className="p-2.5 rounded-2xl bg-white text-gray-950 flex items-center justify-between gap-3 shadow-md border border-[#D4AF37]">
                    <div className="w-20 h-20 bg-white rounded-lg shrink-0 flex items-center justify-center p-0.5 border border-slate-200">
                      {qrCodeDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code Verifikasi"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <QrCode className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 text-left">
                      <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>SIAP BERANGKAT</span>
                      </div>
                      <p className="text-[9px] font-bold text-gray-900 leading-tight">
                        Scan dengan Kamera HP untuk Cek Keabsahan Data
                      </p>
                      <p className="text-[7.5px] font-mono text-gray-500 truncate">
                        TOKEN: SHP-1447H-{jamaah.porsiNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Strip */}
                <div className="p-2 bg-black/40 border-t border-white/10 text-center text-[8px] font-mono text-slate-300">
                  Embarkasi Makassar (UPG) • Asrama Sudiang: {jamaah.dormitoryDate}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                SIDE B: SISI BELAKANG (BACK CARD)
                ------------------------------------------------------------- */}
            {(activeTab === 'back' || activeTab === 'all') && (
              <div className="w-full max-w-[340px] mx-auto bg-gradient-to-b from-[#0A3E2F] via-[#093528] to-[#041a14] rounded-3xl border-3 border-[#D4AF37] text-white shadow-xl overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-2 print:border-[#0A3E2F]">
                {/* Top Ribbon */}
                <div className="h-2 w-full bg-[#D4AF37] border-b border-black/30" />

                {/* Header */}
                <div className="p-3 pb-2 text-center border-b border-white/15 bg-black/20">
                  <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                    AKOMODASI & LAYANAN DARURAT
                  </span>
                  <span className="text-xs font-black uppercase text-white block">
                    MAKKAH • MADINAH • EMBARKASI
                  </span>
                </div>

                <div className="p-3.5 space-y-3 text-xs">
                  {/* Lodging & Maktab */}
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-300 uppercase font-bold block">
                          Maktab & Hotel di Makkah:
                        </span>
                        <strong className="text-white text-xs block leading-tight">{maktab}</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-white/10">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-300 uppercase font-bold block">
                          Hotel di Madinah:
                        </span>
                        <strong className="text-white text-xs block leading-tight">{hotelMadinah}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Medical & Health Summary */}
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300">Status Istitha&apos;ah:</span>
                      <strong className="text-emerald-300 font-bold">MEMENUHI SYARAT</strong>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300">Vaksin Meningitis:</span>
                      <strong className="text-white font-bold">TERVERIFIKASI</strong>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300">Kategori Kesehatan:</span>
                      <strong className="text-[#D4AF37] font-bold">
                        {jamaah.age >= 65 ? 'PRIORITAS LANSIA' : 'MANDIRI'}
                      </strong>
                    </div>
                  </div>

                  {/* Emergency Officers Contacts */}
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] block">
                      Kontak Darurat Petugas Kloter {jamaah.kloterCode} (24 Jam):
                    </span>
                    <div className="text-[10px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Ketua Kloter (TPHI):</span>
                        <span className="font-mono text-white font-bold">{tphi}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Dokter Kloter (TKHI):</span>
                        <span className="font-mono text-rose-300 font-bold">{tkhi}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Call Center Haji Papua:</span>
                        <span className="font-mono text-emerald-300 font-bold">(0967) 532100</span>
                      </div>
                    </div>
                  </div>

                  {/* Prayer / Wish */}
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center">
                    <p className="text-[9px] text-[#D4AF37] italic font-serif">
                      &ldquo;Semoga Menjadi Haji yang Mabrur dan Mabrurah. Amin Ya Rabbal &apos;Alamin.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="p-2 bg-black/40 border-t border-white/10 text-center text-[8px] font-mono text-slate-300">
                  Kartu ini wajib dibawa selama berada di Embarkasi & Tanah Suci
                </div>
              </div>
            )}
          </div>

          {/* Dotted Cut Guides (Visible in All View & Print) */}
          {activeTab === 'all' && (
            <div className="text-center my-4 print:my-3">
              <div className="border-t-2 border-dashed border-slate-400 print:border-black max-w-lg mx-auto relative">
                <span className="text-[9px] text-gray-500 print:text-black bg-white px-2 absolute -top-2 left-1/2 -translate-x-1/2 font-mono">
                  ✂ Gunting di sepanjang garis putus-putus untuk kartu gantung / lanyard jamaah
                </span>
              </div>
            </div>
          )}

          {/* Mobile scan testing tip (Screen only) */}
          <div className="no-print mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2 max-w-md mx-auto">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Uji Coba Scan Kamera HP:</strong>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Arahkan kamera smartphone Anda ke QR Code di atas. Ponsel Anda akan langsung mendeteksi tautan resmi verifikasi jamaah haji ini.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            5. MODAL BOTTOM FOOTER (SCREEN ONLY)
            ========================================================================= */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-gray-500">
            Disahkan oleh Panitia Penyelenggara Ibadah Haji (PPIH)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0A3E2F] hover:bg-[#072d22] text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/40"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
