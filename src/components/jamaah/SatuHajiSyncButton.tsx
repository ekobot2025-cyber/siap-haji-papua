'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, X, Search, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  /** Jika diisi, modal langsung memeriksa porsi ini (mode per-baris). */
  porsiNumber?: string;
  /** Tampilkan tombol kompak (ikon saja) untuk baris tabel. */
  compact?: boolean;
  canSync?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function SatuHajiSyncButton({ porsiNumber, compact, canSync = true }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [porsi, setPorsi] = useState(porsiNumber || '');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const post = async (url: string, body: unknown) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Permintaan gagal');
    return json;
  };

  const handleCheck = async () => {
    setError('');
    setInfo('');
    setResult(null);
    setLoading(true);
    try {
      const json = await post('/api/sync/satu-haji/check', { porsiNumber: porsi });
      setResult(json.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setError('');
    setSyncing(true);
    try {
      const json = await post('/api/sync/satu-haji/sync', { porsiNumber: porsi });
      setInfo(json.message);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSyncing(false);
    }
  };

  const openModal = () => {
    setOpen(true);
    setResult(null);
    setError('');
    setInfo('');
    if (porsiNumber) setPorsi(porsiNumber);
  };

  const pd = result?.publicData;
  const local = result?.localRecord;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        title="Cek & Sinkronisasi Satu Haji"
        className={
          compact
            ? 'inline-flex items-center p-1.5 rounded-lg border border-[#e8dfc8] bg-white hover:bg-[#fbf8ee] text-[#8a6d2b]'
            : 'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e8dfc8] bg-white hover:bg-[#fbf8ee] text-[#8a6d2b] text-xs sm:text-sm font-bold'
        }
      >
        <RefreshCw className="w-4 h-4" />
        {!compact && <span>Cek Satu Haji</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-[#e8dfc8] max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between p-4 border-b border-[#e8dfc8]">
              <h2 className="font-black text-[#1A1410]">Cek Status Porsi Publik Satu Haji</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <input
                  value={porsi}
                  onChange={(e) => setPorsi(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 digit nomor porsi"
                  inputMode="numeric"
                  className="flex-1 border border-[#e8dfc8] rounded-xl px-3 py-2 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={loading || porsi.length !== 10}
                  className="btn-kemenhaj-primary px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Cek
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {info && (
                <div className="flex items-start gap-2 text-sm text-green-800 bg-green-50 border border-green-200 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{info}</span>
                </div>
              )}

              {pd && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#e8dfc8] p-3 space-y-1">
                    <p className="font-bold text-[#8a6d2b] uppercase text-[10px]">Data Publik</p>
                    <p>Wilayah: <b>{pd.regencyName}</b></p>
                    <p>BPIH: <b>{pd.bpihStatus}</b></p>
                    <p>Bank BPS: <b>{pd.bpsBank}</b></p>
                    <p>Kuota: <b>{pd.quotaCategory}</b></p>
                    <p>Tahun: <b>{pd.yearGregorian}</b></p>
                  </div>
                  <div className="rounded-xl border border-[#e8dfc8] p-3 space-y-1">
                    <p className="font-bold text-[#8a6d2b] uppercase text-[10px]">Data Lokal Papua</p>
                    <p>Terdaftar: <b>{local?.isRegisteredInPapua ? 'Ya' : 'Tidak'}</b></p>
                    <p>Skor kesiapan: <b>{local?.currentReadinessScore ?? '-'}</b></p>
                  </div>
                  <div className="col-span-2 rounded-xl bg-[#fbf8ee] border border-[#e8dfc8] p-3">
                    <b>Rekomendasi:</b> {String(result?.comparison?.recommendation ?? '-')}
                  </div>
                  {canSync && local?.isRegisteredInPapua && (
                    <button
                      type="button"
                      onClick={handleSync}
                      disabled={syncing}
                      className="col-span-2 btn-kemenhaj-primary px-3.5 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Sinkronkan ke Data Jamaah
                    </button>
                  )}
                </div>
              )}
              <p className="text-[10px] text-stone-500">
                Sumber: data publik. Seluruh sinkronisasi dicatat pada Audit Trail.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
