'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  QrCode,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  UserCheck,
  Search,
  RefreshCw,
  X,
  ScanLine,
} from 'lucide-react';

export default function ManasikPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventDetail, setEventDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // QR / Manual Attendance Simulator
  const [porsiInput, setPorsiInput] = useState('');
  const [attendStatus, setAttendStatus] = useState<'HADIR' | 'IZIN' | 'SAKIT'>('HADIR');
  const [attendMethod, setAttendMethod] = useState<'QR_SCAN' | 'MANUAL_OPERATOR'>('QR_SCAN');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/manasik');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setEvents(data.data);
        if (!selectedEventId) {
          setSelectedEventId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  const fetchEventDetail = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/manasik/${id}`);
      // Fallback: list from event directly or detail
      const ev = events.find((e) => e.id === id);
      if (ev) setEventDetail(ev);
    } catch (err) {
      console.error(err);
    }
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventDetail(selectedEventId);
    }
  }, [selectedEventId, fetchEventDetail]);

  const handleRecordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!porsiInput.trim() || !selectedEventId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      // Find Jamaah ID by Porsi
      const searchRes = await fetch(`/api/jamaah?search=${encodeURIComponent(porsiInput.trim())}`);
      const searchData = await searchRes.json();

      if (!searchData.success || searchData.data.items.length === 0) {
        setMessage({ text: `Jamaah dengan nomor porsi ${porsiInput} tidak ditemukan`, type: 'error' });
        setSubmitting(false);
        return;
      }

      const jamaahId = searchData.data.items[0].id;

      const attendRes = await fetch(`/api/manasik/${selectedEventId}/attend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jamaahId,
          status: attendStatus,
          attendanceMethod: attendMethod,
        }),
      });

      const attendData = await attendRes.json();
      if (attendData.success) {
        setMessage({
          text: `Presensi ${searchData.data.items[0].fullName} berhasil dicatat (${attendMethod})! Skor kesiapan telah diperbarui.`,
          type: 'success',
        });
        setPorsiInput('');
        fetchEvents();
      } else {
        setMessage({ text: attendData.message || 'Gagal merekam presensi', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Terjadi kesalahan sistem', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-[#0A3E2F] text-[#D4AF37]">
            <BookOpen className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              BIMBINGAN MANASIK HAJI & PRESENSI QR
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Monitoring partisipasi manasik massal/KUA dan pencatatan presensi terverifikasi
            </p>
          </div>
        </div>

        <button
          onClick={fetchEvents}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Jadwal
        </button>
      </div>

      {/* Simulator Presensi QR & Scanner Box */}
      <div className="bg-gradient-to-r from-[#0A3E2F] to-[#0d4d3a] p-6 rounded-3xl text-white shadow-md">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-[#D4AF37]">
              <ScanLine className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                Simulator Presensi Digital & Scanner QR Manasik
              </h2>
              <p className="text-xs text-slate-300">
                Pindai token QR kartu jamaah atau masukkan 10-digit Nomor Porsi secara instan
              </p>
            </div>
          </div>

          <form onSubmit={handleRecordAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Masukkan 10-digit Nomor Porsi Jamaah..."
                value={porsiInput}
                onChange={(e) => setPorsiInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <select
                value={attendStatus}
                onChange={(e) => setAttendStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-white text-gray-900 text-xs font-semibold focus:outline-none"
              >
                <option value="HADIR">HADIR (Lengkap)</option>
                <option value="IZIN">IZIN</option>
                <option value="SAKIT">SAKIT</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-full py-2.5 rounded-xl bg-[#D4AF37] text-gray-950 font-bold text-xs hover:bg-[#c49f2e] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                {submitting ? 'Merekam...' : 'Catat Presensi'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              message.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Events Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((ev) => {
          const isSelected = ev.id === selectedEventId;
          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#0A3E2F] ring-2 ring-[#0A3E2F] bg-emerald-50/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-[#0A3E2F] uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Sesi {ev.sessionNumber}
                </span>
                <span className="text-xs font-mono font-bold text-gray-700">
                  {ev._count?.attendances || 0} Hadir
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{ev.title}</h3>
                <p className="text-[11px] text-gray-500 flex items-center gap-1 pt-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {new Date(ev.eventDate).toLocaleDateString('id-ID')} ({ev.startTime} - {ev.endTime})
                </p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {ev.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Info for Selected Event */}
      {selectedEvent && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#0A3E2F] uppercase tracking-wider">
                {selectedEvent.region.name} • Sesi {selectedEvent.sessionNumber}
              </span>
              <h2 className="text-lg font-black text-gray-900 mt-0.5">{selectedEvent.title}</h2>
              <p className="text-xs text-gray-500">
                Narasumber: <strong>{selectedEvent.speakerName || 'Pembimbing Haji Daerah'}</strong> • {selectedEvent.location}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Token Rahasia QR</span>
              <span className="text-xs font-mono font-bold text-gray-800">{selectedEvent.qrSecretToken.substring(0, 13)}...</span>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold text-gray-800 mb-1">Materi & Pokok Bahasan:</h4>
            <p>{selectedEvent.topicDescription || 'Bimbingan komprehensif manasik haji sesuai tuntunan sunnah dan regulasi keselamatan penerbangan.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
