'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, ShieldCheck } from 'lucide-react';

interface CreateJamaahFormProps {
  regions: { id: string; name: string }[];
  activeSeasonId: string;
  isRegionAdmin?: boolean;
  userRegionId?: string | null;
}

export function CreateJamaahForm({
  regions,
  activeSeasonId,
  isRegionAdmin,
  userRegionId,
}: CreateJamaahFormProps) {
  const router = useRouter();

  const [seasonId, setSeasonId] = useState(activeSeasonId);
  const [regionId, setRegionId] = useState(isRegionAdmin && userRegionId ? userRegionId : regions[0]?.id || '');
  const [porsiNumber, setPorsiNumber] = useState('');
  const [nik, setNik] = useState('');
  const [kkNumber, setKkNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthPlace, setBirthPlace] = useState('Jayapura');
  const [birthDate, setBirthDate] = useState('1975-05-15');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O');
  const [occupation, setOccupation] = useState('Wiraswasta');
  const [registrationYear, setRegistrationYear] = useState(2018);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/jamaah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seasonId,
          regionId,
          porsiNumber,
          nik,
          kkNumber: kkNumber || undefined,
          fullName,
          birthPlace,
          birthDate,
          gender,
          address,
          district: district || undefined,
          phone: phone || undefined,
          bloodType,
          occupation,
          registrationYear: Number(registrationYear),
          dataSource: 'INTERNAL',
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Gagal menyimpan data jamaah');
        setSaving(false);
        return;
      }

      router.push(`/jamaah/${json.data.id}`);
      router.refresh();
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Group 1: Geographic & Porsi */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-slate-100 pb-2">
          1. Wilayah & Kepesertaan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kabupaten / Kota Domisili
            </label>
            <select
              value={regionId}
              disabled={isRegionAdmin}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none bg-white disabled:bg-gray-100"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {isRegionAdmin && (
              <span className="text-[10px] text-gray-400 mt-1 block">
                Terkunci pada wilayah wewenang Anda (Row-Level Authorization)
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nomor Porsi (10 Digit)
            </label>
            <input
              type="text"
              required
              maxLength={10}
              value={porsiNumber}
              onChange={(e) => setPorsiNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 2700192999"
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Sensitive Personal Data (Encrypted) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-gray-900">
            2. Identitas Pribadi (Terenkripsi AES-256)
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>UU PDP Compliant</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nomor Induk Kependudukan (NIK 16 Digit)
            </label>
            <input
              type="text"
              required
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
              placeholder="917101..."
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nomor Kartu Keluarga (Opsional)
            </label>
            <input
              type="text"
              maxLength={16}
              value={kkNumber}
              onChange={(e) => setKkNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="917101..."
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Lengkap (Sesuai KTP & Paspor)
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. H. Achmad Subarjo"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tempat Lahir
            </label>
            <input
              type="text"
              required
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Jenis Kelamin
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none bg-white"
            >
              <option value="MALE">Laki-Laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Group 3: Demographics & Contacts */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-gray-900 border-b border-slate-100 pb-2">
          3. Alamat & Kontak
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Jl. Raya Sentani No. 42"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Distrik / Kecamatan
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Sentani"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              No. Handphone / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Golongan Darah
            </label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none bg-white"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tahun Pendaftaran
            </label>
            <input
              type="number"
              min={2000}
              max={2035}
              value={registrationYear}
              onChange={(e) => setRegistrationYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-slate-100 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-emerald-200" />
          <span>{saving ? 'Menyimpan & Menghitung Kesiapan...' : 'Simpan Jamaah'}</span>
        </button>
      </div>
    </form>
  );
}
