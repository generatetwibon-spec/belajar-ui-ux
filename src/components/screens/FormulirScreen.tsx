'use client';

import { useApp } from '@/context/AppContext';
import { LogisticRequest } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'pangan', label: 'Logistik Pangan & Air Bersih', icon: 'restaurant', tag: 'Sembako' },
  { id: 'medis', label: 'Medis & Obat-obatan', icon: 'medical_services', tag: 'Kritis' },
  { id: 'shelter', label: 'Tenda & Selimut Pengungsi', icon: 'night_shelter', tag: 'Shelter' },
  { id: 'evakuasi', label: 'Peralatan SAR & Evakuasi', icon: 'emergency', tag: 'SAR' },
] as const;

export default function FormulirScreen() {
  const { addRequest, addToast, setActiveTab } = useApp();

  // Form states
  const [pelapor, setPelapor] = useState('Budi Santoso');
  const [lokasiNama, setLokasiNama] = useState('Lapangan RW 05, Desa Cijedil, Kec. Cugenang');
  const [lat, setLat] = useState<number>(-6.8124);
  const [lng, setLng] = useState<number>(107.1352);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [kategori, setKategori] = useState<'pangan' | 'medis' | 'evakuasi' | 'shelter'>('pangan');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field error states
  const [errors, setErrors] = useState<{
    pelapor?: string;
    lokasiNama?: string;
    keterangan?: string;
  }>({});

  // GPS simulation / actual geolocation
  const handleAutoGPS = () => {
    setIsGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(6)));
          setLng(parseFloat(pos.coords.longitude.toFixed(6)));
          setIsGpsLoading(false);
          addToast('info', 'Koordinat GPS akurat berhasil diambil.');
        },
        () => {
          // Fallback simulation coordinates (Cianjur disaster zone)
          const simLat = -6.8124 + (Math.random() - 0.5) * 0.01;
          const simLng = 107.1352 + (Math.random() - 0.5) * 0.01;
          setLat(parseFloat(simLat.toFixed(6)));
          setLng(parseFloat(simLng.toFixed(6)));
          setIsGpsLoading(false);
          addToast('info', 'Simulasi GPS aktif (Zona Lapangan Cugenang).');
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

    // Validation
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
      // If Supabase is configured, insert to table
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('logistic_requests').insert({
          kode: generatedKode,
          pelapor: newRequest.pelapor,
          lokasi_nama: newRequest.lokasi_nama,
          lat: newRequest.lat,
          lng: newRequest.lng,
          kategori: newRequest.kategori,
          keterangan: newRequest.keterangan,
          status: 'menunggu',
        });
        if (error) {
          console.error('Supabase insert error:', error);
        }
      }

      // Add to local state (works both offline and alongside Supabase)
      addRequest(newRequest);

      addToast('success', `Pengajuan ${generatedKode} berhasil dikirim ke Posko Induk!`);

      // Reset form
      setKeterangan('');

      // Navigate to Profil tab to view submission history
      setTimeout(() => {
        setActiveTab('profil');
      }, 700);
    } catch (err) {
      console.error(err);
      addToast('error', 'Gagal mengirim pengajuan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === kategori) || CATEGORIES[0];

  return (
    <div className="flex flex-col w-full pb-10 space-y-4 animate-fade-in-up">
      {/* Header Banner */}
      <section className="bg-siaga-primary-container text-white px-margin-mobile py-4 rounded-b-2xl shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 bg-blue-500/20 px-2.5 py-0.5 rounded-full text-label-sm font-bold text-blue-200">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            DISPATCH CEPAT
          </div>
          <span className="text-label-sm text-blue-200">Tahap 1 dari 1</span>
        </div>
        <h2 className="text-headline-sm font-bold leading-tight mb-1">
          Formulir Pengajuan Logistik & Laporan Darurat
        </h2>
        <p className="text-body-sm text-blue-100">
          Data langsung masuk ke sistem monitoring BPBD & Posko Gabungan.
        </p>
      </section>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="px-margin-mobile flex flex-col gap-4">
        {/* Field 1: Nama Pelapor / Koordinator */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pelapor" className="text-label-lg font-semibold text-siaga-on-surface">
            Nama Pelapor / Koordinator Lapangan <span className="text-siaga-error font-bold">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-siaga-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </span>
            <input
              id="pelapor"
              type="text"
              value={pelapor}
              onChange={(e) => {
                setPelapor(e.target.value);
                if (errors.pelapor) setErrors((prev) => ({ ...prev, pelapor: undefined }));
              }}
              placeholder="Contoh: Budi Santoso (Koordinator Posko 01)"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white text-body-md text-siaga-on-surface transition-all shadow-card ${
                errors.pelapor
                  ? 'border-2 border-siaga-error focus:ring-2 focus:ring-siaga-error'
                  : 'border border-gray-200 focus:border-siaga-primary-container focus:ring-2 focus:ring-siaga-primary-container'
              } focus:outline-none`}
            />
          </div>
          {errors.pelapor && (
            <p className="text-label-sm text-siaga-error font-bold flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.pelapor}
            </p>
          )}
        </div>

        {/* Field 2: Lokasi Titik Posko (Geotagging + Auto GPS Simulation) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="lokasi" className="text-label-lg font-semibold text-siaga-on-surface">
              Lokasi Titik Posko (Geotagging) <span className="text-siaga-error font-bold">*</span>
            </label>
            <span className="text-label-sm text-siaga-primary font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-siaga-primary animate-pulse" />
              Presisi GPS
            </span>
          </div>

          <div
            className={`bg-white rounded-xl p-3.5 shadow-card transition-all ${
              errors.lokasiNama
                ? 'border-2 border-siaga-error'
                : 'border border-blue-100 ring-1 ring-siaga-primary/20'
            }`}
          >
            <div className="flex items-start gap-2.5 mb-2.5">
              <span
                className="material-symbols-outlined text-[24px] text-siaga-error shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                pin_drop
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-label-sm text-siaga-on-surface-variant font-semibold uppercase tracking-wider block">
                  Nama Titik Lokasi
                </span>
                <input
                  id="lokasi"
                  type="text"
                  value={lokasiNama}
                  onChange={(e) => {
                    setLokasiNama(e.target.value);
                    if (errors.lokasiNama) setErrors((prev) => ({ ...prev, lokasiNama: undefined }));
                  }}
                  placeholder="Ketik nama titik posko atau lokasi..."
                  className="w-full mt-0.5 text-body-md font-bold text-siaga-on-surface bg-transparent border-b border-gray-200 focus:border-siaga-primary focus:outline-none pb-1"
                />
                <div className="flex items-center gap-2 mt-1 text-label-sm text-siaga-on-surface-variant font-mono">
                  <span>Lat: {lat}</span>
                  <span>•</span>
                  <span>Long: {lng}</span>
                </div>
              </div>
            </div>

            {/* Simulated Map Snippet & GPS Action */}
            <div className="w-full h-24 rounded-lg bg-siaga-surface-container flex items-end justify-between p-2 relative overflow-hidden border border-blue-100">
              <svg className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 300 90">
                <rect fill="#e5eeff" width="300" height="90" />
                <path d="M 0,40 L 300,70" stroke="#ffffff" strokeWidth="6" />
                <path d="M 0,40 L 300,70" stroke="#c5c5d3" strokeWidth="2" strokeDasharray="4,4" />
                <circle cx="150" cy="55" r="7" fill="#ba1a1a" />
                <circle cx="150" cy="55" r="14" fill="#ba1a1a" opacity="0.3" className="animate-ping" />
              </svg>
              <div className="relative z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-label-sm text-siaga-on-surface font-medium flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-siaga-secondary">explore</span>
                Akses Logistik Terbuka
              </div>
              <button
                type="button"
                onClick={handleAutoGPS}
                disabled={isGpsLoading}
                className="relative z-10 bg-siaga-secondary hover:bg-siaga-secondary/90 text-white px-3 py-1.5 rounded-lg text-label-sm font-bold shadow-sm flex items-center gap-1 active:scale-95 transition-all"
              >
                <span className={`material-symbols-outlined text-[16px] ${isGpsLoading ? 'animate-spin' : ''}`}>
                  {isGpsLoading ? 'sync' : 'my_location'}
                </span>
                <span>{isGpsLoading ? 'Mencari...' : 'Ambil Koordinat GPS Otomatis'}</span>
              </button>
            </div>
          </div>
          {errors.lokasiNama && (
            <p className="text-label-sm text-siaga-error font-bold flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.lokasiNama}
            </p>
          )}
        </div>

        {/* Field 3: Kategori Kebutuhan Mendesak (Dropdown Interactive) */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-label-lg font-semibold text-siaga-on-surface">
            Kategori Kebutuhan Mendesak <span className="text-siaga-error font-bold">*</span>
          </label>

          {/* Trigger Button */}
          <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="bg-white rounded-xl p-3 shadow-card flex items-center justify-between cursor-pointer border border-gray-200 hover:border-siaga-primary active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-siaga-surface-container-high flex items-center justify-center text-siaga-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  {selectedCategoryObj.icon}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-sm text-siaga-on-surface-variant font-medium">Kategori Terpilih</span>
                <span className="text-body-md text-siaga-on-surface font-bold truncate">
                  {selectedCategoryObj.label}
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[24px] text-siaga-on-surface-variant transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </div>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <div className="bg-white rounded-2xl p-2 shadow-toast border border-blue-100 flex flex-col gap-1 animate-slide-down z-20">
              {CATEGORIES.map((cat) => {
                const isSelected = cat.id === kategori;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setKategori(cat.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-siaga-surface-container-low text-siaga-primary font-bold'
                        : 'hover:bg-siaga-surface-container-lowest text-siaga-on-surface hover:text-siaga-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      <span className="text-body-md">{cat.label}</span>
                    </div>
                    {isSelected ? (
                      <span className="material-symbols-outlined text-[20px] text-siaga-primary font-bold">
                        check
                      </span>
                    ) : (
                      <span className="text-label-sm px-2 py-0.5 rounded-full bg-siaga-surface-container text-siaga-on-surface-variant font-semibold">
                        {cat.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Field 4: Jumlah & Rincian Kebutuhan (Textarea) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="keterangan" className="text-label-lg font-semibold text-siaga-on-surface">
            Jumlah & Rincian Kebutuhan Spesifik <span className="text-siaga-error font-bold">*</span>
          </label>
          <div className="relative">
            <textarea
              id="keterangan"
              rows={4}
              value={keterangan}
              onChange={(e) => {
                setKeterangan(e.target.value);
                if (errors.keterangan) setErrors((prev) => ({ ...prev, keterangan: undefined }));
              }}
              placeholder="Contoh: Dibutuhkan untuk 120 KK: Beras 200 kg, Air mineral galon 50 buah, Selimut bayi 40 lembar, serta obat diare darurat..."
              className={`w-full p-3.5 rounded-xl bg-white text-body-md text-siaga-on-surface transition-all shadow-card resize-none ${
                errors.keterangan
                  ? 'border-2 border-siaga-error focus:ring-2 focus:ring-siaga-error'
                  : 'border border-gray-200 focus:border-siaga-primary-container focus:ring-2 focus:ring-siaga-primary-container'
              } focus:outline-none`}
            />
          </div>
          {errors.keterangan ? (
            <p className="text-label-sm text-siaga-error font-bold flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.keterangan}
            </p>
          ) : (
            <p className="text-body-sm text-siaga-on-surface-variant pl-1">
              Sertakan estimasi jumlah kepala keluarga (KK) atau jumlah jiwa yang membutuhkan.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-siaga-primary-container text-white py-3.5 px-4 rounded-xl text-label-lg font-bold shadow-card hover:bg-siaga-primary active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>Mengirim Pengajuan ke Posko...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  send
                </span>
                <span>Kirim Pengajuan Logistik</span>
              </>
            )}
          </button>
          <p className="text-label-sm text-center text-siaga-on-surface-variant">
            Laporan Anda dilindungi enkripsi darurat & diverifikasi oleh Koordinator Lapangan.
          </p>
        </div>
      </form>
    </div>
  );
}
