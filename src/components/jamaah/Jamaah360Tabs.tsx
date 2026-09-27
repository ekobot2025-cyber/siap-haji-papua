'use client';

import React, { useState } from 'react';
import {
  Layers,
  User,
  FileCheck,
  CreditCard,
  HeartPulse,
  BookOpen,
  Plane,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  ShieldAlert,
  ListTodo,
} from 'lucide-react';
import type { ComponentScoreDetail } from '@/domain/entities/readiness.types';

interface Jamaah360TabsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jamaah: any;
  birthDateFormatted: string;
}

export function Jamaah360Tabs({ jamaah, birthDateFormatted }: Jamaah360TabsProps) {
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'BIODATA' | 'DOKUMEN' | 'ADMINISTRASI' | 'KESEHATAN' | 'MANASIK' | 'KLOTER' | 'ACTION' | 'TIMELINE'
  >('OVERVIEW');

  const tabs = [
    { key: 'OVERVIEW', label: 'Ringkasan Kesiapan', icon: Layers },
    { key: 'BIODATA', label: 'Biodata Lengkap', icon: User },
    { key: 'DOKUMEN', label: `Dokumen (${jamaah.documents?.length || 0})`, icon: FileCheck },
    { key: 'ADMINISTRASI', label: 'Administrasi BPIH', icon: CreditCard },
    { key: 'KESEHATAN', label: 'Kesehatan & Istitha\'ah', icon: HeartPulse },
    { key: 'MANASIK', label: 'Bimbingan Manasik', icon: BookOpen },
    { key: 'KLOTER', label: 'Kloter & Manifest', icon: Plane },
    { key: 'ACTION', label: `Tindak Lanjut (${jamaah.actionItems?.length || 0})`, icon: ListTodo },
    { key: 'TIMELINE', label: 'Timeline Event', icon: Clock },
  ] as const;

  const breakdown: Record<string, ComponentScoreDetail> = jamaah.readiness.breakdown || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
        <div className="flex items-center gap-1 p-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1e40af] to-[#059669] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="p-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Rincian Komponen Kesiapan Administratif
                </h3>
                <p className="text-xs text-gray-500">
                  Skor dihitung otomatis berdasarkan bobot aktif musim haji {jamaah.season.seasonName}
                </p>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                Sinkronisasi: {new Date(jamaah.readiness.lastCalculatedAt || new Date()).toLocaleString('id-ID')} WIT
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(breakdown).length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-400 italic">
                  Data rincian kesiapan sedang diproses
                </div>
              ) : (
                Object.values(breakdown).map((comp) => (
                  <div key={comp.code} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{comp.name}</span>
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {comp.score}% (Bobot: {comp.weight}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${comp.score === 100 ? 'bg-emerald-600' : comp.score >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`}
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {comp.itemsChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <span className={item.isCompleted ? 'text-gray-700' : 'text-amber-800 font-semibold'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BIODATA */}
        {activeTab === 'BIODATA' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-slate-100">
              Biodata Lengkap Jamaah
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Nomor Porsi</span>
                <p className="font-mono font-bold text-[#1e40af] text-base">{jamaah.porsiNumber}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Nomor Induk Kependudukan (NIK)</span>
                <p className="font-mono font-bold text-gray-800">{jamaah.nik}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Nomor Kartu Keluarga (KK)</span>
                <p className="font-mono text-gray-800">{jamaah.kk || '-'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Tempat & Tanggal Lahir</span>
                <p className="text-gray-900 font-medium">{jamaah.birthPlace}, {birthDateFormatted}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Jenis Kelamin</span>
                <p className="text-gray-900 font-medium">{jamaah.gender === 'MALE' ? 'Laki-Laki' : 'Perempuan'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Golongan Darah</span>
                <p className="text-gray-900 font-medium">{jamaah.bloodType || 'Tidak Diketahui'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Pekerjaan</span>
                <p className="text-gray-900 font-medium">{jamaah.occupation || '-'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Nomor Handphone</span>
                <p className="font-mono text-gray-800">{jamaah.phone || '-'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Status Pernikahan</span>
                <p className="text-gray-900 font-medium">{jamaah.maritalStatus}</p>
              </div>

              <div className="md:col-span-2 space-y-1">
                <span className="text-xs font-semibold text-gray-500">Alamat Tempat Tinggal</span>
                <p className="text-gray-900 font-medium">{jamaah.address}, Distrik {jamaah.district || '-'}, {jamaah.region.name}, Papua {jamaah.postalCode || ''}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500">Musim & Estimasi Tahun Berangkat</span>
                <p className="text-gray-900 font-medium">{jamaah.season.seasonName} (Th. {jamaah.estimatedDepartureYear || 2026})</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOKUMEN */}
        {activeTab === 'DOKUMEN' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Berkas & Kelengkapan Dokumen</h3>
                <p className="text-xs text-gray-500">Status verifikasi dokumen paspor, identitas, dan persyaratan imigrasi</p>
              </div>
            </div>

            {(!jamaah.documents || jamaah.documents.length === 0) ? (
              <div className="text-center py-8 text-gray-400 italic">Belum ada dokumen yang terdaftar.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jamaah.documents.map((doc: any) => {
                  const isVerified = doc.status === 'TERVERIFIKASI';
                  const isPending = doc.status === 'MENUNGGU_VERIFIKASI' || doc.status === 'UPLOADED';
                  const isRejected = doc.status === 'DITOLAK';

                  return (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{doc.documentType.code}</span>
                          <h4 className="text-sm font-bold text-gray-900">{doc.documentType.name}</h4>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isVerified && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isPending && <Clock3 className="w-3.5 h-3.5" />}
                          {isRejected && <XCircle className="w-3.5 h-3.5" />}
                          {doc.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 pt-2 border-t border-slate-100 text-gray-600">
                        {doc.documentNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nomor Berkas:</span>
                            <span className="font-mono font-semibold text-gray-800">{doc.documentNumber}</span>
                          </div>
                        )}
                        {doc.expiryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Masa Berlaku:</span>
                            <span className="font-medium text-gray-800">{new Date(doc.expiryDate).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                        {doc.rejectionReason && (
                          <div className="p-2 rounded bg-rose-50 text-rose-700 text-xs font-medium">
                            Alasan Revisi: {doc.rejectionReason}
                          </div>
                        )}
                        {doc.notes && !doc.rejectionReason && (
                          <div className="text-[11px] text-gray-500 italic">Catatan: {doc.notes}</div>
                        )}
                        {doc.verifications?.[0] && (
                          <div className="text-[10px] text-gray-400 pt-1">
                            Diverifikasi oleh: {doc.verifications[0].verifiedBy?.fullName || 'Petugas'} ({new Date(doc.verifications[0].createdAt).toLocaleDateString('id-ID')})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADMINISTRASI */}
        {activeTab === 'ADMINISTRASI' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Catatan Administrasi & Keuangan (BPIH)</h3>
                <p className="text-xs text-gray-500">Tahapan pelunasan biaya haji, setoran awal, dan penerbitan SPPH</p>
              </div>
            </div>

            {(!jamaah.administrationRecords || jamaah.administrationRecords.length === 0) ? (
              <div className="text-center py-8 text-gray-400 italic">Belum ada catatan administrasi.</div>
            ) : (
              <div className="space-y-3">
                {jamaah.administrationRecords.map((adm: any) => {
                  const isDone = adm.status === 'SELESAI';
                  const isNeedAction = adm.status === 'PERLU_TINDAK_LANJUT';

                  return (
                    <div key={adm.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{adm.stageName.replace(/_/g, ' ')}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isNeedAction
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {adm.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {adm.notes || 'Administrasi terdaftar resmi pada sistem komando.'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-[#1e40af]">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(adm.amountPaid)}
                        </div>
                        {adm.paymentReference && (
                          <div className="text-[11px] text-gray-400 font-mono">Ref: {adm.paymentReference}</div>
                        )}
                        {adm.completionDate && (
                          <div className="text-[10px] text-emerald-700">
                            Selesai: {new Date(adm.completionDate).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: KESEHATAN */}
        {activeTab === 'KESEHATAN' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Monitoring Administratif Kesehatan & Istitha'ah</h3>
                <p className="text-xs text-gray-500">Status kelayakan berangkat non-medis, tahapan pemeriksaan, dan imunisasi wajib</p>
              </div>
            </div>

            {(!jamaah.healthRecords || jamaah.healthRecords.length === 0) ? (
              <div className="text-center py-8 text-gray-400 italic">Belum ada riwayat monitoring kesehatan.</div>
            ) : (
              <div className="space-y-4">
                {jamaah.healthRecords.map((rec: any) => (
                  <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{rec.checkupStage.replace(/_/g, ' ')}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        rec.istithaahStatus === 'MEMENUHI_SYARAT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.istithaahStatus === 'MEMENUHI_DENGAN_PENDAMPING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rec.istithaahStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-gray-500 block">Fasilitas Pemeriksa:</span>
                        <span className="font-semibold text-gray-800">{rec.locationName || 'RSUD Dok II Jayapura'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Status Vaksin Wajib:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rec.isVaccineMeningitis ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Meningitis: {rec.isVaccineMeningitis ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rec.isVaccinePolio ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Polio: {rec.isVaccinePolio ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Catatan Pendampingan:</span>
                        <span className="text-gray-800 font-medium">{rec.notesNonMedical || 'Tidak ada perhatian khusus'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: MANASIK */}
        {activeTab === 'MANASIK' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Bimbingan Manasik & Presensi Kehadiran</h3>
                <p className="text-xs text-gray-500">Catatan partisipasi bimbingan manasik tingkat KUA dan Kabupaten/Kota</p>
              </div>
            </div>

            {(!jamaah.manasikAttendances || jamaah.manasikAttendances.length === 0) ? (
              <div className="text-center py-8 text-gray-400 italic">Belum ada riwayat kehadiran manasik tercatat.</div>
            ) : (
              <div className="space-y-3">
                {jamaah.manasikAttendances.map((att: any) => (
                  <div key={att.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{att.event?.title || 'Bimbingan Manasik Terpadu'}</h4>
                      <p className="text-xs text-gray-500">
                        {att.event?.location} • {new Date(att.event?.eventDate || att.checkInTime).toLocaleDateString('id-ID')}
                      </p>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Metode: <span className="font-semibold text-gray-700">{att.attendanceMethod}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: KLOTER */}
        {activeTab === 'KLOTER' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Penempatan Kloter, Regu & Manifest Internal</h3>
                <p className="text-xs text-gray-500">Alokasi kelompok terbang, nomor seat pesawat, dan jadwal keberangkatan</p>
              </div>
            </div>

            {!jamaah.kloterMembership ? (
              <div className="text-center py-8 text-gray-400 italic">Jamaah belum dialokasikan ke nomor kloter.</div>
            ) : (
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-gray-500">Nomor Kloter</span>
                    <h3 className="text-xl font-bold text-[#1e40af]">
                      Kloter {jamaah.kloterMembership.kloter.kloterNumber} ({jamaah.kloterMembership.kloter.kloterCode})
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    STATUS: {jamaah.kloterMembership.kloter.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Embarkasi / Debarkasi:</span>
                    <span className="font-medium text-gray-800">{jamaah.kloterMembership.kloter.embarkationName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Maskapai & No. Penerbangan:</span>
                    <span className="font-medium text-gray-800">
                      {jamaah.kloterMembership.kloter.airlineName || 'Garuda Indonesia'} ({jamaah.kloterMembership.kloter.flightNumber || 'GA-1101'})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Nomor Seat / Kursi:</span>
                    <span className="font-mono font-bold text-[#1e40af] text-base">
                      {jamaah.kloterMembership.seatNumber || 'Belum Ditentukan'}
                    </span>
                  </div>
                </div>

                {jamaah.kloterMembership.group && (
                  <div className="pt-3 border-t border-slate-200 text-xs">
                    <span className="text-gray-500">Kelompok: </span>
                    <span className="font-bold text-gray-800">
                      {jamaah.kloterMembership.group.name} ({jamaah.kloterMembership.group.groupType})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: ACTION */}
        {activeTab === 'ACTION' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Pusat Tindak Lanjut & Intervensi (Action Items)</h3>
                <p className="text-xs text-gray-500">Daftar penugasan perbaikan berkas, pemeriksaan, atau administrasi jamaah</p>
              </div>
            </div>

            {(!jamaah.actionItems || jamaah.actionItems.length === 0) ? (
              <div className="text-center py-8 text-gray-400 italic">Tidak ada tugas tindak lanjut aktif untuk jamaah ini.</div>
            ) : (
              <div className="space-y-3">
                {jamaah.actionItems.map((item: any) => {
                  const isResolved = item.status === 'RESOLVED';
                  return (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {item.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      {item.description && <p className="text-xs text-gray-600">{item.description}</p>}
                      {item.notes && <p className="text-[11px] text-gray-500 italic bg-slate-50 p-2 rounded">Catatan: {item.notes}</p>}
                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-slate-100">
                        <span>Ditugaskan kepada: {item.assignedTo?.fullName || 'Belum Ditugaskan'}</span>
                        <span>Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-slate-100">
              Riwayat Perjalanan & Event Audit Jamaah
            </h3>

            <div className="space-y-4 pl-4 border-l-2 border-emerald-500">
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#1e40af] border-2 border-white shadow-xs" />
                <div className="text-xs font-bold text-gray-900">Kalkulasi Kesiapan Terkini</div>
                <div className="text-[11px] text-gray-500 font-mono">
                  {new Date(jamaah.readiness.lastCalculatedAt || new Date()).toLocaleString('id-ID')} WIT
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Indeks Kesiapan Administratif tercatat: <strong className="text-[#1e40af]">{Number(jamaah?.readiness?.score ?? 0).toFixed(1)}% ({jamaah.readiness.category})</strong>
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white shadow-xs" />
                <div className="text-xs font-bold text-gray-900">Registrasi Kepesertaan Haji Papua</div>
                <div className="text-[11px] text-gray-500 font-mono">Tahun Pendaftaran: {jamaah.registrationYear}</div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Nomor Porsi {jamaah.porsiNumber} resmi terbit untuk wilayah {jamaah.region.name}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
