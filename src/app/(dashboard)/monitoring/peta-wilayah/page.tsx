'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Plane,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  HeartPulse,
  CreditCard,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Compass,
} from 'lucide-react';

export default function PetaWilayahPage() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRegionalData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success && data.data.regionalRanking) {
        setRanking(data.data.regionalRanking);
        if (!selectedRegion && data.data.regionalRanking.length > 0) {
          setSelectedRegion(data.data.regionalRanking[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedRegion]);

  useEffect(() => {
    fetchRegionalData();
  }, [fetchRegionalData]);

  // Spatial metadata for 11 official Papua regencies
  const regionalMeta: Record<string, { coordinates: string; transitHub: string; distanceEmbarkation: string; islandType: string }> = {
    'REG-JPR-KOTA': { coordinates: '2.5337° S, 140.7181° E', transitHub: 'Bandara Internasional Sentani (DJJ)', distanceEmbarkation: '3.5 Jam Udara ke Makassar (UPG)', islandType: 'Pusat Pemerintahan / Pesisir Teluk Youtefa' },
    'REG-KEEROM': { coordinates: '3.2974° S, 140.7715° E', transitHub: 'Transit Darat Trans-Papua ke Jayapura -> Sentani', distanceEmbarkation: 'Transit Jayapura -> UPG', islandType: 'Wilayah Perbatasan RI-PNG (Arso/Waris)' },
    'REG-JPR-KAB': { coordinates: '2.5855° S, 140.5186° E', transitHub: 'Bandara Internasional Sentani (DJJ)', distanceEmbarkation: '3.5 Jam Udara ke Makassar (UPG)', islandType: 'Danau Sentani / Hub Utama Embarkasi (Sentani)' },
    'REG-MRK': { coordinates: '8.4991° S, 140.4011° E', transitHub: 'Bandara Mopah Merauke (MKQ) -> UPG', distanceEmbarkation: '3.0 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Dataran Rendah Selatan / Ujung Timur NKRI' },
    'REG-BVD': { coordinates: '6.0967° S, 140.3025° E', transitHub: 'Bandara Tanah Merah (TMH) -> MKQ -> UPG', distanceEmbarkation: 'Transit Perintis Tanah Merah -> Merauke -> UPG', islandType: 'Pedalaman DAS Sungai Digoel / Perbatasan' },
    'REG-ASMAT': { coordinates: '5.4667° S, 138.3000° E', transitHub: 'Bandara Ewer (EWE) -> TIM -> UPG', distanceEmbarkation: 'Transit Speedboat/Ewer -> Timika -> UPG', islandType: 'Kawasan Pesisir Rawa / Kota Papan Agats' },
    'REG-MMK': { coordinates: '4.5469° S, 136.8837° E', transitHub: 'Bandara Mozes Kilangin Timika (TIM) -> UPG', distanceEmbarkation: '2.5 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Kota Industri Timika / Pesisir Laut Arafura' },
    'REG-BIAK': { coordinates: '1.1833° S, 136.0833° E', transitHub: 'Bandara Internasional Frans Kaisiepo (BIK)', distanceEmbarkation: '2.5 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Kepulauan Teluk Cenderawasih / Hub Utara' },
    'REG-YAPEN': { coordinates: '1.7833° S, 136.2333° E', transitHub: 'Pelabuhan Serui / Bandara Stevanus Rumbewas -> Biak', distanceEmbarkation: 'Transit Laut/Udara -> Biak -> UPG', islandType: 'Gugusan Kepulauan Serui / Selat Yapen' },
    'REG-NBR': { coordinates: '3.3667° S, 135.4833° E', transitHub: 'Bandara Douw Aturure Nabire (NBX) -> UPG', distanceEmbarkation: '2.5 Jam Udara ke Makassar (UPG)', islandType: 'Pesisir Teluk Cenderawasih Leher Burung' },
    'REG-JWY': { coordinates: '4.0833° S, 138.9500° E', transitHub: 'Bandara Wamena (WMX) -> Sentani (DJJ)', distanceEmbarkation: 'Transit Udara Wamena -> Sentani -> UPG', islandType: 'Lembah Baliem Pegunungan Tengah Papua' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#059669] text-white shadow-xs">
            <Compass className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              PETA GEOSPASIAL & LOGISTIK EMBARKASI PROVINSI PAPUA
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Pemetaan spasial kesiapan jamaah di 11 Kabupaten/Kota Penyelenggara Haji Papua, titik transit bandara perintis, dan rute konsentrasi Embarkasi Hasanuddin Makassar
            </p>
          </div>
        </div>

        <button
          onClick={fetchRegionalData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Peta
        </button>
      </div>

      {/* Main Grid: Spatial Map View + Regional Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Grid of Regencies */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-[#1e3a8a]/70 to-[#047857]/80 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider block">
                  Provinsi Papua • 9 Kabupaten & Kota Penyelenggara Haji
                </span>
                <h2 className="text-lg font-black mt-0.5">Peta Sebaran & Densitas Jamaah</h2>
              </div>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-1 rounded font-mono">
                Pusat Koordinasi: Kota Jayapura
              </span>
            </div>

            {/* Interactive Regions Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {ranking.map((reg) => {
                const score = Number(reg?.averageReadiness ?? reg?.readinessIndex ?? 0);
                const isSelected = selectedRegion?.regionId === reg?.regionId;
                const isHighReady = score >= 90;
                const isMidReady = score >= 75;

                return (
                  <div
                    key={reg?.regionId || reg?.regionCode}
                    onClick={() => setSelectedRegion(reg)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/20 border-emerald-400 ring-2 ring-emerald-400 shadow-lg'
                        : 'bg-black/30 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                          {reg?.regionCode}
                        </span>
                        <h3 className="text-sm font-bold text-white">{reg?.regionName}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                        isHighReady ? 'bg-emerald-500 text-white' : isMidReady ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {score.toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-white/10 text-slate-300">
                      <span>Total: <strong>{reg?.totalJamaah ?? 0} Jamaah</strong></span>
                      <span className="text-emerald-300 font-semibold">{reg?.siapCount ?? reg?.siapBerangkat ?? 0} Siap</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Regional Detail Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedRegion ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Wilayah Terpilih ({selectedRegion.regionCode})
                  </span>
                  <h3 className="text-lg font-black text-[#1e40af]">{selectedRegion.regionName}</h3>
                </div>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </span>
              </div>

              {/* Spatial Specs */}
              {regionalMeta[selectedRegion.regionCode] && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Karakter Wilayah:</span>
                    <strong className="text-gray-800">{regionalMeta[selectedRegion.regionCode].islandType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Titik Hub Transit Udara:</span>
                    <strong className="text-gray-800">{regionalMeta[selectedRegion.regionCode].transitHub}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Jarak Logistik ke Embarkasi:</span>
                    <span className="text-gray-700">{regionalMeta[selectedRegion.regionCode].distanceEmbarkation}</span>
                  </div>
                </div>
              )}

              {/* Readiness Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">Capaian Indeks Kesiapan:</span>
                  <span className="font-mono text-[#1e40af] text-base">
                    {Number(selectedRegion?.averageReadiness ?? selectedRegion?.readinessIndex ?? 0).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#1e40af] to-[#059669] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, Number(selectedRegion?.averageReadiness ?? selectedRegion?.readinessIndex ?? 0)))}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-center">
                  <span className="text-[10px] uppercase font-bold block">Siap Berangkat</span>
                  <strong className="text-lg font-mono font-black">{selectedRegion?.siapCount ?? selectedRegion?.siapBerangkat ?? 0}</strong>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-center">
                  <span className="text-[10px] uppercase font-bold block">Dalam Proses</span>
                  <strong className="text-lg font-mono font-black">{selectedRegion?.hampirSiapCount ?? selectedRegion?.dalamProses ?? 0}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  href={`/action-center?regionId=${selectedRegion.regionId}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Buka Antrean Action Center Wilayah <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/jamaah?regionId=${selectedRegion.regionId}`}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-gray-700 hover:bg-slate-50 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Lihat Seluruh Jamaah Wilayah Ini
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 italic">Pilih wilayah pada peta untuk melihat detail.</div>
          )}
        </div>
      </div>
    </div>
  );
}
