'use client';

import { useApp } from '@/context/AppContext';
import { LogisticRequest } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'pangan', label: 'Logistik Pangan & Air Bersih' },
  { id: 'medis', label: 'Medis & Obat-obatan' },
  { id: 'shelter', label: 'Tenda & Selimut Pengungsi' },
  { id: 'evakuasi', label: 'Peralatan SAR & Evakuasi' },
] as const;

export default function FormulirScreen() {
  const { addRequest, addToast, setActiveTab } = useApp();

  const [pelapor, setPelapor] = useState('Budi Santoso');
  const [lokasiNama, setLokasiNama] = useState('Lapangan RW 05, Desa Cijedil, Kec. Cugenang');
  const [lat, setLat] = useState<number>(-6.8124);
  const [lng, setLng] = useState<number>(107.1352);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [kategori, setKategori] = useState<'pangan' | 'medis' | 'evakuasi' | 'shelter'>('pangan');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    pelapor?: string;
    lokasiNama?: string;
    keterangan?: string;
  }>({});

  const handleAutoGPS = () => {
    setIsGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(6)));
          setLng(parseFloat(pos.coords.longitude.toFixed(6)));
          setIsGpsLoading(false);
          addToast('info', 'Koordinat GPS akurat berhasil diperoleh.');
        },
        () => {
          const simLat = -6.8124 + (Math.random() - 0.5) * 0.01;
          const simLng = 107.1352 + (Math.random() - 0.5) * 0.01;
          setLat(parseFloat(simLat.toFixed(6)));
          setLng(parseFloat(simLng.toFixed(6)));
          setIsGpsLoading(false);
          addToast('info', 'Simulasi GPS aktif (Koordinat terisi).');
        },
        { timeout: 3000 }
      );
    } else {
      const simLat = -6.8124 + (Math.random() - 0.5) * 0.01;
      const simLng = 107.1352 + (Math.random() - 0.5) * 0.01;
      setLat(parseFloat(simLat.toFixed(6)));
      setLng(parseFloat(simLng.toFixed(6)));
      setIsGpsLoading(false);
      addToast('info', 'Simulasi GPS aktif.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!pelapor.trim()) {
      newErrors.pelapor = 'Silakan isi data pendukung yang valid';
    }
    if (!lokasiNama.trim()) {
      newErrors.lokasiNama = 'Silakan isi data pendukung yang valid';
    }
    if (!keterangan.trim()) {
      newErrors.keterangan = 'Silakan isi data pendukung yang valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('error', 'Silakan lengkapi formulir dengan data yang valid.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const generatedKode = `#LOG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: LogisticRequest = {
      id: `req-${Date.now()}`,
      kode: generatedKode,
      pelapor: pelapor.trim(),
      lokasi_nama: lokasiNama.trim(),
      lat,
      lng,
      kategori,
      keterangan: keterangan.trim(),
      status: 'menunggu',
      created_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('logistic_requests').insert({
          kode: generatedKode,
          pelapor: newRequest.pelapor,
          lokasi_nama: newRequest.lokasi_nama,
          lat: newRequest.lat,
          lng: newRequest.lng,
          kategori: newRequest.kategori,
          keterangan: newRequest.keterangan,
          status: 'menunggu',
        });
      }

      addRequest(newRequest);
      addToast('success', `Pengajuan ${generatedKode} berhasil disimpan ke Posko!`);
      setKeterangan('');

      setTimeout(() => {
        setActiveTab('profil');
      }, 700);
    } catch (err) {
      console.error(err);
      addToast('error', 'Gagal mengirim pengajuan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCat = CATEGORIES.find((c) => c.id === kategori) || CATEGORIES[0];

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 animate-fade-in">
      {/* 1. Header Banner (Clean White + Minimal Blue Accent) */}
      <section className="px-5 pt-3">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
          <span className="font-caption text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider block mb-1">
            FORM PENGAJUAN LOGISTIK
          </span>
          <h2 className="font-heading text-[18px] font-bold text-slate-900 leading-snug">
            Laporkan Kebutuhan Darurat
          </h2>
          <p className="font-body text-[13px] text-slate-600 mt-1 leading-relaxed">
            Data akan diverifikasi oleh koordinator logistik dan tersinkronisasi ke sistem BPBD.
          </p>
        </div>
      </section>

      {/* 2. Main Form */}
      <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-5">
        {/* Field 1: Nama Pelapor */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pelapor" className="font-heading text-[13px] font-semibold text-slate-800">
            Nama Pelapor / Koordinator <span className="text-[#DC2626] font-bold">*</span>
          </label>
          <input
            id="pelapor"
            type="text"
            value={pelapor}
            onChange={(e) => {
              setPelapor(e.target.value);
              if (errors.pelapor) setErrors((prev) => ({ ...prev, pelapor: undefined }));
            }}
            placeholder="Masukkan nama lengkap Anda..."
            className={`w-full px-4 py-3 bg-white rounded-xl font-body text-[14px] text-slate-900 placeholder:text-slate-400 transition-all ${
              errors.pelapor
                ? 'border-2 border-[#DC2626] focus:outline-none'
                : 'border border-slate-200 focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.pelapor && (
            <p className="font-caption text-[11px] text-[#DC2626] font-medium flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.pelapor}
            </p>
          )}
        </div>

        {/* Field 2: Titik Lokasi Posko (Geotagging + GPS Button) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="lokasi" className="font-heading text-[13px] font-semibold text-slate-800">
              Lokasi Titik Posko (Geotagging) <span className="text-[#DC2626] font-bold">*</span>
            </label>
            <span className="font-caption text-[11px] font-semibold text-[#0D9488]">
              Presisi GPS Aktif
            </span>
          </div>

          <div
            className={`bg-white rounded-xl p-4 transition-all ${
              errors.lokasiNama
                ? 'border-2 border-[#DC2626]'
                : 'border border-slate-200 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-blue-100'
            }`}
          >
            <input
              id="lokasi"
              type="text"
              value={lokasiNama}
              onChange={(e) => {
                setLokasiNama(e.target.value);
                if (errors.lokasiNama) setErrors((prev) => ({ ...prev, lokasiNama: undefined }));
              }}
              placeholder="Ketik alamat titik posko..."
              className="w-full font-body text-[14px] font-medium text-slate-900 border-b border-slate-100 pb-2 focus:outline-none"
            />
            <div className="flex items-center justify-between pt-2.5">
              <span className="font-caption text-[11px] text-slate-500 font-mono">
                Lat: {lat}, Long: {lng}
              </span>
              <button
                type="button"
                onClick={handleAutoGPS}
                disabled={isGpsLoading}
                className="bg-slate-100 hover:bg-[#EFF6FF] text-[#1E3A8A] px-3 py-1.5 rounded-lg font-heading text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <span className={`material-symbols-outlined text-[15px] ${isGpsLoading ? 'animate-spin' : ''}`}>
                  {isGpsLoading ? 'sync' : 'my_location'}
                </span>
                <span>{isGpsLoading ? 'Mencari...' : 'Ambil Koordinat GPS Otomatis'}</span>
              </button>
            </div>
          </div>
          {errors.lokasiNama && (
            <p className="font-caption text-[11px] text-[#DC2626] font-medium flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.lokasiNama}
            </p>
          )}
        </div>

        {/* Field 3: Kategori Kebutuhan (Dropdown) */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="font-heading text-[13px] font-semibold text-slate-800">
            Kategori Kebutuhan Mendesak <span className="text-[#DC2626] font-bold">*</span>
          </label>
          <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#1E3A8A] transition-all"
          >
            <span className="font-body text-[14px] text-slate-900 font-medium">
              {selectedCat.label}
            </span>
            <span className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>

          {isDropdownOpen && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 flex flex-col gap-1 animate-fade-in z-20">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setKategori(cat.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-colors ${
                    cat.id === kategori
                      ? 'bg-[#EFF6FF] text-[#1E3A8A] font-bold font-heading'
                      : 'hover:bg-slate-50 text-slate-700 font-body'
                  }`}
                >
                  <span className="text-[13px]">{cat.label}</span>
                  {cat.id === kategori && (
                    <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 4: Rincian Kebutuhan */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="keterangan" className="font-heading text-[13px] font-semibold text-slate-800">
            Rincian & Keterangan Kebutuhan <span className="text-[#DC2626] font-bold">*</span>
          </label>
          <textarea
            id="keterangan"
            rows={4}
            value={keterangan}
            onChange={(e) => {
              setKeterangan(e.target.value);
              if (errors.keterangan) setErrors((prev) => ({ ...prev, keterangan: undefined }));
            }}
            placeholder="Contoh: Beras 300kg, telur 50 rak, obat luka bakar & selimut bayi untuk 120 KK..."
            className={`w-full p-4 bg-white rounded-xl font-body text-[14px] text-slate-900 placeholder:text-slate-400 transition-all resize-none ${
              errors.keterangan
                ? 'border-2 border-[#DC2626] focus:outline-none'
                : 'border border-slate-200 focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.keterangan ? (
            <p className="font-caption text-[11px] text-[#DC2626] font-medium flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.keterangan}
            </p>
          ) : (
            <p className="font-caption text-[11px] text-slate-400 pl-1">
              Sertakan estimasi jumlah jiwa atau KK yang membutuhkan.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1E3A8A] hover:bg-[#172554] text-white py-3.5 px-4 rounded-xl font-heading text-[14px] font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Menyimpan ke Sistem...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Kirim Pengajuan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
