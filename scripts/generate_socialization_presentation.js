const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

// Initialize presentation
const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
pres.title = 'Sosialisasi Aplikasi SIAP HAJI PAPUA v1.0';
pres.author = 'Kementerian Haji dan Umrah RI - Kanwil Papua';
pres.company = 'Bidang Penyelenggaraan Haji dan Umrah (PHU)';
pres.subject = 'Presentasi Sosialisasi & Bimbingan Teknis Penggunaan Aplikasi SIAP HAJI PAPUA 1447 H / 2026 M';

// Color Palette Constants
const COLOR_BG_DARK = '0B132B';    // Deep Obsidian Night
const COLOR_BG_LIGHT = 'F8FAFC';   // Soft Off-White
const COLOR_PRIMARY = '064E3B';    // Deep Forest Islamic Emerald
const COLOR_EMERALD = '059669';    // Vibrant Emerald
const COLOR_GOLD = 'D97706';       // Rich Prestige Gold
const COLOR_AMBER = 'B45309';      // Deep Amber Gold
const COLOR_NAVY = '1E3A8A';       // Command Center Navy
const COLOR_CARD_BG = 'FFFFFF';    // White Card
const COLOR_TEXT_DARK = '0F172A';  // Slate Dark Text
const COLOR_TEXT_MUTED = '64748B'; // Muted Gray Text
const COLOR_BORDER = 'E2E8F0';     // Subtle Card Border

// Asset Paths
const logoPath = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/logo-kemenhaj.png';
const fc1Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_1_alur_layanan.png';
const fc2Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_2_rbac_peran.png';
const fc3Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_3_early_warning.png';
const fc4Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_4_cek_porsi_noc.png';

// Helper: Add Standard Header on Light Slides
function addStandardHeader(slide, category, title, subtitle) {
    // Top Accent Stripe
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 0.08,
        fill: { color: COLOR_EMERALD },
        line: { color: COLOR_EMERALD }
    });

    // Logo on Top Right
    if (fs.existsSync(logoPath)) {
        slide.addImage({
            path: logoPath,
            x: 9.15, y: 0.18, w: 0.65, h: 0.65
        });
    }

    // Category Badge
    slide.addText(category.toUpperCase(), {
        x: 0.6, y: 0.18, w: 5.5, h: 0.22,
        fontSize: 8.5, fontFace: 'Segoe UI', bold: true,
        color: COLOR_AMBER
    });

    // Slide Main Title
    slide.addText(title, {
        x: 0.6, y: 0.38, w: 8.3, h: 0.38,
        fontSize: 17, fontFace: 'Segoe UI', bold: true,
        color: COLOR_TEXT_DARK
    });

    // Slide Subtitle
    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.6, y: 0.76, w: 8.3, h: 0.24,
            fontSize: 9.5, fontFace: 'Segoe UI',
            color: COLOR_TEXT_MUTED
        });
    }

    // Horizontal Separator Line
    slide.addShape(pres.ShapeType.line, {
        x: 0.6, y: 1.05, w: 8.8, h: 0,
        line: { color: COLOR_BORDER, width: 1 }
    });

    // Footer Info
    slide.addText('SIAP HAJI PAPUA v1.0  |  Kementerian Haji dan Umrah Wilayah Provinsi Papua', {
        x: 0.6, y: 5.32, w: 7.0, h: 0.2,
        fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
    });
}

// Helper: Add Card Container
function addCard(slide, x, y, w, h, options = {}) {
    slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: w, h: h,
        rectRadius: 0.08,
        fill: { color: options.fill || COLOR_CARD_BG },
        line: { color: options.borderColor || COLOR_BORDER, width: options.borderWidth || 1 }
    });

    if (options.accentColor) {
        // Left accent stripe
        slide.addShape(pres.ShapeType.roundRect, {
            x: x, y: y, w: 0.12, h: h,
            rectRadius: 0.05,
            fill: { color: options.accentColor },
            line: { color: options.accentColor }
        });
    }
}

console.log('Generating 16 Presentation Slides for SIAP HAJI PAPUA...');

// =============================================================================
// SLIDE 1: COVER SLIDE (DARK OBSIDIAN & ROYAL GOLD)
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_DARK };

    // Decorative geometric accents
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: 0.25, h: 5.625,
        fill: { color: COLOR_GOLD }, line: { color: COLOR_GOLD }
    });
    slide.addShape(pres.ShapeType.rect, {
        x: 0.25, y: 0, w: 0.08, h: 5.625,
        fill: { color: COLOR_EMERALD }, line: { color: COLOR_EMERALD }
    });

    // Ministry Logo
    if (fs.existsSync(logoPath)) {
        slide.addImage({
            path: logoPath,
            x: 0.8, y: 0.6, w: 1.2, h: 1.2
        });
    }

    // Header Agency Tag
    slide.addText('KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA\nKANTOR WILAYAH PROVINSI PAPUA', {
        x: 2.2, y: 0.65, w: 7.0, h: 0.6,
        fontSize: 12, fontFace: 'Segoe UI', bold: true,
        color: 'E2E8F0', lineSpacingMultiple: 1.15
    });
    slide.addText('Bidang Penyelenggaraan Haji dan Umrah (PHU)', {
        x: 2.2, y: 1.28, w: 7.0, h: 0.3,
        fontSize: 10, fontFace: 'Segoe UI',
        color: COLOR_GOLD
    });

    // Main Presentation Title
    slide.addText('SOSIALISASI & BIMBINGAN TEKNIS', {
        x: 0.8, y: 2.05, w: 8.5, h: 0.4,
        fontSize: 14, fontFace: 'Segoe UI', bold: true,
        color: COLOR_GOLD
    });
    slide.addText('SIAP HAJI PAPUA v1.0', {
        x: 0.8, y: 2.45, w: 8.5, h: 0.85,
        fontSize: 34, fontFace: 'Segoe UI', bold: true,
        color: 'FFFFFF'
    });
    slide.addText('Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua', {
        x: 0.8, y: 3.32, w: 8.5, h: 0.4,
        fontSize: 14, fontFace: 'Segoe UI',
        color: '94A3B8'
    });

    // Tagline Card
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 3.85, w: 8.4, h: 0.55,
        rectRadius: 0.06,
        fill: { color: '0F291E' },
        line: { color: COLOR_EMERALD, width: 1.2 }
    });
    slide.addText('Satu Data  •  Satu Monitoring  •  Satu Layanan  —  Haji Papua Siap 1447 H / 2026 M', {
        x: 0.9, y: 3.92, w: 8.2, h: 0.4,
        fontSize: 11, fontFace: 'Segoe UI', bold: true,
        color: '34D399', align: 'center'
    });

    // Presenter & Event Metadata
    slide.addText('Peserta: Pimpinan Kanwil, Kepala Seksi PHU 11 Kab/Kota, Dokter Pemeriksa RSUD & Petugas Kloter\nJayapura, Papua  |  Tahun Anggaran 2026', {
        x: 0.8, y: 4.8, w: 8.4, h: 0.5,
        fontSize: 9, fontFace: 'Segoe UI',
        color: '64748B'
    });
}

// =============================================================================
// SLIDE 2: LATAR BELAKANG & TANTANGAN OPERASIONAL PAPUA
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '1. Urgensi Transformasi', 'Latar Belakang & Tantangan Penyelenggaraan Haji Papua', 'Mengapa transformasi komando digital haji di Provinsi Papua menjadi kebutuhan mendesak?');

    const challenges = [
        {
            title: 'Tantangan Geografis 11 Wilayah',
            desc: 'Bentang wilayah Papua terbentang dari pesisir kepulauan (Biak, Yapen, Merauke) hingga pegunungan tengah (Jayawijaya/Wamena). Akses transportasi terbatas membuat pengiriman berkas fisik sangat lambat.',
            color: COLOR_NAVY, icon: 'GEOGRAFIS'
        },
        {
            title: 'Bottleneck Paspor & Bio Visa',
            desc: 'Keterlambatan verifikasi paspor RI 3 kata nama dan rekam biometrik Saudi Bio Visa sering memicu kepanikan menjelang keberangkatan kloter, berisiko visa tidak terbit tepat waktu.',
            color: COLOR_AMBER, icon: 'DOKUMEN'
        },
        {
            title: 'Konsentrasi 4 Kloter di Makassar',
            desc: 'Seluruh jamaah Papua diberangkatkan melalui Embarkasi Hasanuddin Makassar (UPG). Diperlukan sinkronisasi tepat antara penerbangan perintis lokal dengan jadwal penerbangan internasional Saudi.',
            color: COLOR_EMERALD, icon: 'EMBARKASI'
        }
    ];

    for (let i = 0; i < 3; i++) {
        const ch = challenges[i];
        const cardX = 0.6 + (i * 2.95);
        addCard(slide, cardX, 1.3, 2.85, 3.7, { accentColor: ch.color, fill: 'FFFFFF' });

        // Tag Pill
        slide.addShape(pres.ShapeType.roundRect, {
            x: cardX + 0.25, y: 1.5, w: 1.3, h: 0.28,
            rectRadius: 0.04, fill: { color: ch.color }
        });
        slide.addText(ch.icon, {
            x: cardX + 0.25, y: 1.52, w: 1.3, h: 0.24,
            fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: 'FFFFFF', align: 'center'
        });

        slide.addText(ch.title, {
            x: cardX + 0.25, y: 1.95, w: 2.45, h: 0.55,
            fontSize: 12.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });

        slide.addText(ch.desc, {
            x: cardX + 0.25, y: 2.6, w: 2.45, h: 2.2,
            fontSize: 9.8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
        });
    }
}

// =============================================================================
// SLIDE 3: FILOSOFI SISTEM — PROVINCIAL COMMAND CENTER
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '2. Konsep Dasar', 'Filosofi Sistem: Hajj Provincial Command Center', 'SIAP HAJI PAPUA bukan sekadar database jamaah biasa, melainkan pusat komando pemantauan real-time.');

    // Left Column: 5 Tahapan Siklus Tertutup
    addCard(slide, 0.6, 1.25, 4.3, 3.8, { accentColor: COLOR_PRIMARY });
    slide.addText('SIKLUS TERTUTUP TINDAK LANJUT', {
        x: 0.85, y: 1.4, w: 3.8, h: 0.3,
        fontSize: 11, fontFace: 'Segoe UI', bold: true, color: COLOR_PRIMARY
    });

    const cycleSteps = [
        { no: '1. MONITOR', text: 'Command Center menyajikan indikator kesiapan real-time 11 kab/kota.' },
        { no: '2. IDENTIFY', text: 'Early Warning Engine otomatis mendeteksi berkas/medis bermasalah.' },
        { no: '3. PRIORITIZE', text: 'Triase kendala ke Critical (Merah), Warning (Kuning), Attention.' },
        { no: '4. ACTION', text: 'Penugasan terarah ke petugas daerah dengan batas waktu jelas.' },
        { no: '5. RESOLVE', text: 'Verifikasi selesai, skor kesiapan otomatis naik menuju 100%.' }
    ];

    let stepY = 1.8;
    for (const st of cycleSteps) {
        slide.addShape(pres.ShapeType.rect, {
            x: 0.85, y: stepY, w: 3.8, h: 0.52,
            fill: { color: 'F1F5F9' }, line: { color: 'E2E8F0' }
        });
        slide.addText(st.no, {
            x: 0.95, y: stepY + 0.04, w: 1.2, h: 0.22,
            fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: COLOR_NAVY
        });
        slide.addText(st.text, {
            x: 0.95, y: stepY + 0.22, w: 3.6, h: 0.26,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
        });
        stepY += 0.58;
    }

    // Right Column: 3 Pilar Layanan
    const pillars = [
        {
            title: 'Pusat Kendali Eksekutif',
            sub: 'Kakanwil & Forkopimda',
            desc: 'Decision Support System (DSS) alokasi kuota cadangan, Early Warning Engine, dan Mode Video Wall NOC untuk aula rapat komando.'
        },
        {
            title: 'Operasional Terpadu Petugas',
            sub: 'Admin Kab/Kota & Dokter RSUD',
            desc: 'Verifikasi paspor RI (3 kata nama), sinkronisasi status Bio Visa, penetapan istitha\'ah RSUD, dan penataan 4 kloter Embarkasi Makassar.'
        },
        {
            title: 'Layanan Mandiri Warga',
            sub: 'Calon Jamaah & Keluarga',
            desc: 'Portal Cek Estimasi Porsi Mandiri (haji.go.id), Smart Hajj Pass ber-QR Code, dan transparansi kesiapan ramah lansia.'
        }
    ];

    let pY = 1.25;
    for (const p of pillars) {
        addCard(slide, 5.1, pY, 4.3, 1.18, { accentColor: COLOR_AMBER });
        slide.addText(p.title + ' — ' + p.sub, {
            x: 5.3, y: pY + 0.12, w: 3.9, h: 0.28,
            fontSize: 10.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(p.desc, {
            x: 5.3, y: pY + 0.42, w: 3.9, h: 0.65,
            fontSize: 8.5, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.15
        });
        pY += 1.31;
    }
}

// =============================================================================
// SLIDE 4: ARSITEKTUR EKOSISTEM & INTEGRASI SATU PINTU
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '3. Arsitektur Terpadu', 'Arsitektur Ekosistem & Integrasi Satu Pintu', 'Menghubungkan sistem daerah Papua dengan infrastruktur nasional dan Arab Saudi.');

    const intCards = [
        {
            title: 'Portal Resmi haji.go.id',
            tag: 'KEMENHAJ PUSAT',
            desc: 'Penyelarasan identitas kelembagaan, basis data kuota nasional, regulasi porsi, dan portal publik terpadu kementerian.',
            color: COLOR_PRIMARY
        },
        {
            title: 'Saudi Smart Card Nusuk',
            tag: 'KERAJAAN ARAB SAUDI',
            desc: 'Sinkronisasi identitas jamaah Papua untuk akses kartu pintar Nusuk (izin masuk hotel Makkah, tenda Mina & Arafah).',
            color: COLOR_AMBER
        },
        {
            title: 'Embarkasi Hasanuddin Makassar',
            tag: 'KONSENTRASI 4 KLOTER',
            desc: 'Koordinasi manifest penerbangan UPG, jadwal asrama haji Sudiang, pemeriksaan imigrasi akhir, dan pembagian gelang identitas.',
            color: COLOR_NAVY
        },
        {
            title: 'RSUD & Bank BPS-BPIH',
            tag: 'LAYANAN DAERAH',
            desc: 'Koneksi data penetapan istitha\'ah medis dari 11 RSUD pemeriksa serta rekonsiliasi setoran lunas BPIH secara aman.',
            color: COLOR_EMERALD
        }
    ];

    for (let i = 0; i < 4; i++) {
        const item = intCards[i];
        const cx = 0.6 + (i * 2.2);
        addCard(slide, cx, 1.35, 2.15, 3.6, { accentColor: item.color });

        slide.addShape(pres.ShapeType.roundRect, {
            x: cx + 0.15, y: 1.55, w: 1.4, h: 0.26,
            rectRadius: 0.04, fill: { color: item.color }
        });
        slide.addText(item.tag, {
            x: cx + 0.15, y: 1.57, w: 1.4, h: 0.22,
            fontSize: 7.5, fontFace: 'Segoe UI', bold: true, color: 'FFFFFF', align: 'center'
        });

        slide.addText(item.title, {
            x: cx + 0.15, y: 1.95, w: 1.85, h: 0.55,
            fontSize: 11.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });

        slide.addText(item.desc, {
            x: cx + 0.15, y: 2.6, w: 1.85, h: 2.1,
            fontSize: 9, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
        });
    }
}

// =============================================================================
// SLIDE 5: CAKUPAN 11 WILAYAH KERJA OPERASIONAL PAPUA
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '4. Wilayah Binaan', '11 Wilayah Kerja Operasional Penyelenggara Haji Papua', 'Pemetaan koordinasi kloter, sentra populasi, dan rumah sakit pemeriksa istitha\'ah.');

    const regions = [
        { no: '1', name: 'Kota Jayapura', kloter: 'Kloter 1 & 2 UPG', rs: 'RSUD Dok II Jayapura' },
        { no: '2', name: 'Kab. Keerom', kloter: 'Kloter 2 UPG', rs: 'RSUD Kwaingga Keerom' },
        { no: '3', name: 'Kab. Jayapura', kloter: 'Kloter 1 UPG', rs: 'RSUD Yowari Sentani' },
        { no: '4', name: 'Kab. Merauke', kloter: 'Kloter 3 UPG', rs: 'RSUD Merauke' },
        { no: '5', name: 'Kab. Boven Digoel', kloter: 'Kloter 3 UPG', rs: 'RSUD Boven Digoel' },
        { no: '6', name: 'Kab. Asmat', kloter: 'Kloter 3 UPG', rs: 'RSUD Agats Asmat' },
        { no: '7', name: 'Kab. Mimika', kloter: 'Kloter 2 & 4 UPG', rs: 'RSUD Mimika (Timika)' },
        { no: '8', name: 'Kab. Biak Numfor', kloter: 'Kloter 4 UPG', rs: 'RSUD Biak' },
        { no: '9', name: 'Kab. Kep. Yapen', kloter: 'Kloter 4 UPG', rs: 'RSUD Serui' },
        { no: '10', name: 'Kab. Nabire', kloter: 'Kloter 4 UPG', rs: 'RSUD Nabire' },
        { no: '11', name: 'Kab. Jayawijaya', kloter: 'Kloter 4 UPG', rs: 'RSUD Wamena' },
    ];

    // Left 6
    let y1 = 1.3;
    for (let i = 0; i < 6; i++) {
        const r = regions[i];
        addCard(slide, 0.6, y1, 4.3, 0.55, { accentColor: COLOR_PRIMARY });
        slide.addText(`${r.no}. ${r.name}  —  [${r.kloter}]`, {
            x: 0.85, y: y1 + 0.06, w: 3.9, h: 0.22,
            fontSize: 9.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(`RS Rujukan: ${r.rs}`, {
            x: 0.85, y: y1 + 0.28, w: 3.9, h: 0.2,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
        });
        y1 += 0.62;
    }

    // Right 5 + Kloter Summary Card
    let y2 = 1.3;
    for (let i = 6; i < 11; i++) {
        const r = regions[i];
        addCard(slide, 5.1, y2, 4.3, 0.55, { accentColor: COLOR_AMBER });
        slide.addText(`${r.no}. ${r.name}  —  [${r.kloter}]`, {
            x: 5.35, y: y2 + 0.06, w: 3.9, h: 0.22,
            fontSize: 9.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(`RS Rujukan: ${r.rs}`, {
            x: 5.35, y: y2 + 0.28, w: 3.9, h: 0.2,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
        });
        y2 += 0.62;
    }

    // Summary Box at bottom right
    addCard(slide, 5.1, y2, 4.3, 0.55, { fill: 'ECFDF5', borderColor: COLOR_EMERALD });
    slide.addText('TOTAL KONSENTRASI: 4 KLOTER PAPUA (EMBARKASI UPG MAKASSAR)', {
        x: 5.25, y: y2 + 0.1, w: 4.0, h: 0.35,
        fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: COLOR_PRIMARY, align: 'center'
    });
}

// =============================================================================
// SLIDE 6: FLOWCHART ALUR OPERASIONAL END-TO-END
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '5. Alur Layanan', 'Flowchart Alur Operasional Layanan Jamaah End-to-End', '7 Tahapan utama pelayanan jamaah dari pendaftaran daerah hingga keberangkatan ke Tanah Suci.');

    // Left: Flowchart Image
    if (fs.existsSync(fc1Path)) {
        slide.addImage({
            path: fc1Path,
            x: 0.6, y: 1.25, w: 3.4, h: 4.0
        });
    }

    // Right: Key Milestones Summary
    const stepsBrief = [
        { t: '1. Pendaftaran & Berkas Fisik', d: 'Validasi SPPH, KTP, dan KK oleh Kemenag Kab/Kota di menu /jamaah/new.' },
        { t: '2. Istitha\'ah Medis RSUD', d: 'Dokter RSUD menetapkan status MS/TMS dan vaksinasi wajib Meningitis/Polio.' },
        { t: '3. Paspor & Saudi Bio Visa', d: 'Verifikasi nama paspor min. 3 kata dan rekam biometrik sidik jari/wajah.' },
        { t: '4. Pelunasan BPIH Bank', d: 'Konfirmasi bukti setoran lunas Bank BPS-BPIH dan penguncian kuota jamaah.' },
        { t: '5. Penataan 4 Kloter Papua', d: 'Alokasi jamaah ke Kloter 1-4 UPG, pembagian Karom, Karu, dan cetak manifest.' },
        { t: '6. Smart Pass & Kartu Nusuk', d: 'Penerbitan kartu QR Code digital jamaah dan sinkronisasi smart card Nusuk.' },
        { t: '7. Monitoring Video Wall NOC', d: 'Pimpinan memantau pergerakan kloter real-time dan ekspor laporan kedinasan.' }
    ];

    let sY = 1.25;
    for (const sb of stepsBrief) {
        addCard(slide, 4.2, sY, 5.2, 0.52, { accentColor: COLOR_PRIMARY });
        slide.addText(sb.t, {
            x: 4.4, y: sY + 0.05, w: 4.8, h: 0.2,
            fontSize: 9, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(sb.d, {
            x: 4.4, y: sY + 0.25, w: 4.8, h: 0.22,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
        });
        sY += 0.57;
    }
}

// =============================================================================
// SLIDE 7: MATRIKS HAK AKSES & PERAN PENGGUNA (RBAC)
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '6. Keamanan & Peran', 'Matriks Peran Pengguna & Row-Level Authorization', 'Prinsip tata kelola akses berjenjang dan perlindungan data sensitif jamaah.');

    // Left: Flowchart Image
    if (fs.existsSync(fc2Path)) {
        slide.addImage({
            path: fc2Path,
            x: 0.6, y: 1.25, w: 4.8, h: 3.9
        });
    }

    // Right: Security Highlights
    const secPoints = [
        {
            title: 'Isolasi Wilayah (Row-Level Security)',
            desc: 'Admin Kemenag Kabupaten/Kota terkunci secara mutlak hanya dapat mengakses data jamaah di daerahnya sendiri di tingkat query backend Prisma.'
        },
        {
            title: 'Penyamaran Data (Data Masking)',
            desc: 'Nomor Induk Kependudukan (NIK) dan nomor telepon disamarkan otomatis (contoh: 917101******0003) sesuai kepatuhan UU PDP No. 27/2022.'
        },
        {
            title: 'Immutable Audit Trail',
            desc: 'Seluruh aksi pengguna (login, edit rekam medis, ekspor laporan, hapus berkas) dicatat permanen dalam sistem audit log yang tidak dapat diubah.'
        },
        {
            title: 'Peran Dokter RSUD Khusus',
            desc: 'Hanya dokter pemeriksa RSUD tersertifikasi yang memiliki otorisasi menetapkan status istitha\'ah dan menginput riwayat diagnosa jamaah.'
        }
    ];

    let scY = 1.25;
    for (const sc of secPoints) {
        addCard(slide, 5.6, scY, 3.8, 0.9, { accentColor: COLOR_NAVY });
        slide.addText(sc.title, {
            x: 5.8, y: scY + 0.1, w: 3.4, h: 0.24,
            fontSize: 9.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(sc.desc, {
            x: 5.8, y: scY + 0.35, w: 3.4, h: 0.5,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.15
        });
        scY += 0.98;
    }
}

// =============================================================================
// SLIDE 8: MODUL 1 — DATA JAMAAH 360° & ADMINISTRASI
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '7. Fitur Modul', 'Modul 1: Manajemen Data Jamaah Papua 360° & Administrasi', 'Pusat data terpadu calon jamaah haji dari pendaftaran, berkas paspor, hingga bio visa.');

    const featuresM1 = [
        {
            title: 'Tabel Virtual Jamaah Papua',
            desc: 'Daftar jamaah berkinerja tinggi dengan filter instan 11 kabupaten/kota, status dokumen, kesiapan medis, dan status pelunasan BPIH.',
            path: 'Menu: /jamaah'
        },
        {
            title: 'Profil Jamaah 360° (5 Tab)',
            desc: 'Tampilan detail per jamaah: (1) Biodata Personal, (2) Dokumen Fisik, (3) Rekam Medis RSUD, (4) Alokasi Kloter/Regu, dan (5) Audit Log.',
            path: 'Menu: /jamaah/[id]'
        },
        {
            title: 'Verifikasi Paspor 3 Kata Nama',
            desc: 'Pengecekan standar nama paspor RI sesuai regulasi keimigrasian Arab Saudi dan peringatan masa berlaku minimal 6 bulan.',
            path: 'Menu: Tab Administrasi'
        },
        {
            title: 'Sinkronisasi Saudi Bio Visa',
            desc: 'Pelacakan progres rekam biometrik sidik jari dan foto wajah jamaah via Saudi Visa Bio untuk penerbitan e-Visa Haji.',
            path: 'Menu: Tab Administrasi'
        }
    ];

    for (let i = 0; i < 4; i++) {
        const fm = featuresM1[i];
        const row = Math.floor(i / 2);
        const col = i % 2;
        const cx = 0.6 + (col * 4.5);
        const cy = 1.35 + (row * 1.95);

        addCard(slide, cx, cy, 4.3, 1.75, { accentColor: COLOR_PRIMARY });

        slide.addShape(pres.ShapeType.roundRect, {
            x: cx + 0.2, y: cy + 0.15, w: 1.6, h: 0.24,
            rectRadius: 0.04, fill: { color: 'F1F5F9' }
        });
        slide.addText(fm.path, {
            x: cx + 0.2, y: cy + 0.16, w: 1.6, h: 0.2,
            fontSize: 7.5, fontFace: 'Segoe UI', bold: true, color: COLOR_NAVY, align: 'center'
        });

        slide.addText(fm.title, {
            x: cx + 0.2, y: cy + 0.45, w: 3.8, h: 0.3,
            fontSize: 11.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });

        slide.addText(fm.desc, {
            x: cx + 0.2, y: cy + 0.78, w: 3.8, h: 0.85,
            fontSize: 9, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
        });
    }
}

// =============================================================================
// SLIDE 9: MODUL 2 — PEMERIKSAAN MEDIS & ISTITHA'AH RSUD
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '8. Fitur Modul', 'Modul 2: Pemeriksaan Medis & Penetapan Istitha\'ah RSUD', 'Instrumen digital bagi dokter pemeriksa RSUD se-Papua dalam menetapkan kelaikan terbang.');

    // 4 Decision Categories Cards
    const categories = [
        {
            code: 'MS',
            title: 'Memenuhi Syarat (MS)',
            sub: 'Kondisi Sehat / Mandiri',
            desc: 'Jamaah sehat fisik dan mental, mampu melaksanakan seluruh rukun dan wajib haji tanpa pendampingan medis khusus.',
            color: '059669', bg: 'ECFDF5'
        },
        {
            code: 'MS-P',
            title: 'MS dengan Pendampingan',
            sub: 'Pengawasan Obat / Lansia',
            desc: 'Memiliki riwayat penyakit terkontrol (hipertensi, DM) atau lansia yang memerlukan pendampingan keluarga/alat bantu.',
            color: 'D97706', bg: 'FFFBEB'
        },
        {
            code: 'TMS-S',
            title: 'TMS Sementara',
            sub: 'Perlu Terapi Lanjutan',
            desc: 'Sedang menjalani pengobatan intensif; status istitha\'ah dapat dievaluasi ulang sebelum batas akhir kloter.',
            color: 'DC2626', bg: 'FEF2F2'
        },
        {
            code: 'TMS-M',
            title: 'TMS Mutlak',
            sub: 'Tidak Laik Terbang',
            desc: 'Penyakit terminal, gangguan jiwa berat, atau kondisi medis permanen yang tidak memenuhi syarat penerbangan.',
            color: '475569', bg: 'F1F5F9'
        }
    ];

    for (let i = 0; i < 4; i++) {
        const cat = categories[i];
        const cx = 0.6 + (i * 2.2);
        addCard(slide, cx, 1.35, 2.15, 2.5, { fill: cat.bg, borderColor: cat.color });

        slide.addShape(pres.ShapeType.ellipse, {
            x: cx + 0.15, y: 1.5, w: 0.45, h: 0.45,
            fill: { color: cat.color }, line: { color: cat.color }
        });
        slide.addText(cat.code, {
            x: cx + 0.15, y: 1.55, w: 0.45, h: 0.35,
            fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: 'FFFFFF', align: 'center'
        });

        slide.addText(cat.title, {
            x: cx + 0.15, y: 2.02, w: 1.85, h: 0.4,
            fontSize: 10, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });

        slide.addText(cat.desc, {
            x: cx + 0.15, y: 2.45, w: 1.85, h: 1.3,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.15
        });
    }

    // Bottom Banner: Vaksinasi Wajib ICV
    addCard(slide, 0.6, 4.05, 8.8, 1.05, { fill: 'FFFFFF', accentColor: COLOR_PRIMARY });
    slide.addText('PENCATATAN VAKSINASI INTERNASIONAL (ICV) TERVERIFIKASI', {
        x: 0.85, y: 4.15, w: 8.3, h: 0.25,
        fontSize: 10, fontFace: 'Segoe UI', bold: true, color: COLOR_PRIMARY
    });
    slide.addText('• Vaksin Meningitis Meningokokus: Wajib diberikan minimal 14 hari sebelum keberangkatan kloter.\n• Vaksinasi Polio: Wajib bagi seluruh jamaah asal Papua sesuai ketentuan International Health Regulations (IHR).\n• Input Nomor Batch Vaksin & Penerbitan Sertifikat Vaksinasi Digital langsung tercatat pada Profil Jamaah 360°.', {
        x: 0.85, y: 4.42, w: 8.3, h: 0.6,
        fontSize: 8.5, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
    });
}

// =============================================================================
// SLIDE 10: MODUL 3 — MANAJEMEN 4 KLOTER PAPUA & PENATAAN REGU
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '9. Fitur Modul', 'Modul 3: Manajemen 4 Kloter & Penataan Regu (Karom / Karu)', 'Penataan struktur kepemimpinan jamaah Papua di Embarkasi Hasanuddin Makassar.');

    const kloterList = [
        {
            name: 'KLOTER 1 UPG',
            pop: 'Konsentrasi Utama',
            desc: 'Kota Jayapura & Kab. Jayapura (Sentani). Kloter pembuka jamaah Papua.',
            icon: 'KLOTER 1'
        },
        {
            name: 'KLOTER 2 UPG',
            pop: 'Wilayah Tengah & Timur',
            desc: 'Gabungan Kota Jayapura, Kab. Keerom, dan sebagian jamaah Kab. Mimika.',
            icon: 'KLOTER 2'
        },
        {
            name: 'KLOTER 3 UPG',
            pop: 'Wilayah Papua Selatan',
            desc: 'Kab. Merauke, Kab. Boven Digoel, dan Kab. Asmat. Pengawalan rute laut & darat.',
            icon: 'KLOTER 3'
        },
        {
            name: 'KLOTER 4 UPG',
            pop: 'Kepulauan & Pegunungan',
            desc: 'Biak Numfor, Kep. Yapen, Nabire, Jayawijaya (Wamena), dan sisa kuota Mimika.',
            icon: 'KLOTER 4'
        }
    ];

    for (let i = 0; i < 4; i++) {
        const kl = kloterList[i];
        const cx = 0.6 + (i * 2.2);
        addCard(slide, cx, 1.35, 2.15, 2.2, { accentColor: COLOR_NAVY });

        slide.addText(kl.icon, {
            x: cx + 0.15, y: 1.5, w: 1.85, h: 0.24,
            fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: COLOR_GOLD
        });
        slide.addText(kl.name, {
            x: cx + 0.15, y: 1.75, w: 1.85, h: 0.3,
            fontSize: 12, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(kl.pop, {
            x: cx + 0.15, y: 2.05, w: 1.85, h: 0.22,
            fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: COLOR_PRIMARY
        });
        slide.addText(kl.desc, {
            x: cx + 0.15, y: 2.3, w: 1.85, h: 1.1,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.15
        });
    }

    // Bottom Card: Penataan Karom & Karu
    addCard(slide, 0.6, 3.75, 8.8, 1.35, { fill: 'FFFFFF', accentColor: COLOR_AMBER });
    slide.addText('STRUKTUR HIERARKI KLOTER & DOKUMEN MANIFEST', {
        x: 0.85, y: 3.88, w: 8.3, h: 0.25,
        fontSize: 10, fontFace: 'Segoe UI', bold: true, color: COLOR_AMBER
    });
    slide.addText('• Ketua Kloter (TPHI) & Pembimbing Ibadah (TPIH): Mengawasi keseluruhan koordinasi 393-450 jamaah per kloter.\n• Ketua Rombongan (Karom): Setiap kloter dibagi menjadi 9-10 rombongan (± 40-45 jamaah) dipimpin seorang Karom.\n• Ketua Regu (Karu): Setiap rombongan dibagi menjadi 4 regu (± 10-11 jamaah) dipimpin seorang Karu.\n• Ekspor Manifest Resmi: Men-generate manifes penerbangan resmi (Pax Manifest) dan stiker bagasi koper.', {
        x: 0.85, y: 4.15, w: 8.3, h: 0.85,
        fontSize: 8.5, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
    });
}

// =============================================================================
// SLIDE 11: MODUL 4 — EARLY WARNING ENGINE & ACTION CENTER
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '10. Deteksi Dini', 'Modul 4: Early Warning Engine & Action Center', 'Pencegahan proaktif terhadap kendala berkas paspor, pelunasan BPIH, dan rekam medis.');

    // Left: Flowchart Image
    if (fs.existsSync(fc3Path)) {
        slide.addImage({
            path: fc3Path,
            x: 0.6, y: 1.25, w: 4.8, h: 3.9
        });
    }

    // Right: Action Center Workflow
    const actionPoints = [
        {
            level: 'CRITICAL (MERAH)',
            rule: 'Sisa Waktu < 14 Hari',
            desc: 'Jamaah belum memiliki paspor valid atau belum lunas BPIH. Berisiko mutlak gagal terbang kloter.',
            color: 'DC2626'
        },
        {
            level: 'WARNING (KUNING)',
            rule: 'Sisa Waktu 15 - 30 Hari',
            desc: 'Perekaman Bio Visa tertunda atau hasil pemeriksaan laboratorium RSUD belum keluar.',
            color: 'D97706'
        },
        {
            level: 'ACTION ASSIGNMENT',
            rule: 'Penugasan Petugas Lapangan',
            desc: 'Pimpinan/admin menugaskan petugas Kemenag daerah langsung dari sistem dengan batas deadline.',
            color: '0284C7'
        },
        {
            level: 'RECALCULATE READINESS',
            rule: 'Hitung Ulang Indeks Kesiapan',
            desc: 'Klik tombol emas Recalculate untuk memperbarui skor kesiapan wilayah secara instan.',
            color: '059669'
        }
    ];

    let acY = 1.25;
    for (const ap of actionPoints) {
        addCard(slide, 5.6, acY, 3.8, 0.9, { accentColor: ap.color });
        slide.addText(`${ap.level}  [${ap.rule}]`, {
            x: 5.8, y: acY + 0.1, w: 3.4, h: 0.22,
            fontSize: 9, fontFace: 'Segoe UI', bold: true, color: ap.color
        });
        slide.addText(ap.desc, {
            x: 5.8, y: acY + 0.32, w: 3.4, h: 0.52,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.15
        });
        acY += 0.98;
    }
}

// =============================================================================
// SLIDE 12: MODUL 5 — MODE VIDEO WALL NOC AULA KOMANDO
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '11. Ruang Komando', 'Modul 5: Mode Video Wall NOC Layar Lebar Aula', 'Display visual ultra-wide resolusi 4K untuk rapat komando Forkopimda dan pemantauan pimpinan.');

    // Left: Flowchart Image (Jalur B)
    if (fs.existsSync(fc4Path)) {
        slide.addImage({
            path: fc4Path,
            x: 0.6, y: 1.25, w: 4.8, h: 3.9
        });
    }

    // Right: Video Wall Features
    const nocFeatures = [
        {
            title: 'Tema Obsidian & Emas Kemenhaj',
            desc: 'Kontras visual sangat tinggi, dirancang untuk kenyamanan penglihatan di ruangan aula rapat besar dan hemat energi display.'
        },
        {
            title: 'Auto-Refresh Real-Time 30 Detik',
            desc: 'Pembaruan data tanpa me-reload peramban web, menjaga kestabilan tampilan layar komando tanpa kedipan (flicker-free).'
        },
        {
            title: 'Peta Geospasial Kesiapan 11 Wilayah',
            desc: 'Visualisasi status warna (Hijau: Siap >90%, Kuning: Waspada 70-89%, Merah: Butuh Perhatian <70%) di peta pulau Papua.'
        },
        {
            title: 'Akses Satu Tombol Fullscreen (F11)',
            desc: 'Buka URL /video-wall pada PC operator dan tekan F11 untuk beralih ke mode komando penuh tanpa gangguan bilah browser.'
        }
    ];

    let nY = 1.25;
    for (const nf of nocFeatures) {
        addCard(slide, 5.6, nY, 3.8, 0.9, { accentColor: COLOR_PRIMARY });
        slide.addText(nf.title, {
            x: 5.8, y: nY + 0.1, w: 3.4, h: 0.22,
            fontSize: 9.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });
        slide.addText(nf.desc, {
            x: 5.8, y: nY + 0.32, w: 3.4, h: 0.52,
            fontSize: 8, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.15
        });
        nY += 0.98;
    }
}

// =============================================================================
// SLIDE 13: MODUL 6 — PORTAL MANDIRI CEK PORSI & SMART PASS
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '12. Layanan Jamaah', 'Modul 6: Portal Cek Porsi Mandiri & Smart Hajj Pass', 'Transparansi informasi bagi calon jamaah haji Papua dan keluarga secara digital.');

    // 2 Big Cards
    // Left: Cek Porsi Mandiri
    addCard(slide, 0.6, 1.35, 4.3, 3.75, { accentColor: COLOR_PRIMARY });
    slide.addText('PORTAL MANDIRI CEK PORSI (/cek-porsi)', {
        x: 0.85, y: 1.5, w: 3.8, h: 0.28,
        fontSize: 11, fontFace: 'Segoe UI', bold: true, color: COLOR_PRIMARY
    });
    slide.addText('Kemudahan Cek Porsi Calon Jamaah:', {
        x: 0.85, y: 1.85, w: 3.8, h: 0.22,
        fontSize: 9.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
    });

    const cpSteps = [
        '1. Buka situs https://siap-haji-papua.vercel.app/cek-porsi di ponsel.',
        '2. Masukkan 10 digit nomor porsi haji dari lembar pendaftaran SPPH.',
        '3. Sistem menyajikan informasi Nama, Kabupaten/Kota, dan Musim.',
        '4. Menampilkan indikator kesiapan paspor, rekam bio visa, dan medis.',
        '5. Desain responsif mobile-first, ramah lansia dengan font besar.'
    ];
    let cpY = 2.15;
    for (const step of cpSteps) {
        slide.addText(step, {
            x: 0.85, y: cpY, w: 3.8, h: 0.38,
            fontSize: 8.5, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
        });
        cpY += 0.42;
    }

    // Right: Smart Hajj Pass Digital
    addCard(slide, 5.1, 1.35, 4.3, 3.75, { accentColor: COLOR_AMBER });
    slide.addText('KARTU DIGITAL SMART HAJJ PASS', {
        x: 5.35, y: 1.5, w: 3.8, h: 0.28,
        fontSize: 11, fontFace: 'Segoe UI', bold: true, color: COLOR_AMBER
    });
    slide.addText('Fitur Smart Pass Berbasis QR Code:', {
        x: 5.35, y: 1.85, w: 3.8, h: 0.22,
        fontSize: 9.5, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
    });

    const spSteps = [
        '1. QR Code Identitas Terenkripsi: Memuat data porsi & nomor paspor.',
        '2. Informasi Kloter & Regu: Tercantum Kloter UPG, Karom, dan Karu.',
        '3. Ringkasan Golongan Darah & Kontak Darurat Petugas Haji Papua.',
        '4. Dapat Diunduh & Dicetak: Format kartu tanda pengenal saku.',
        '5. Sinkronisasi dengan Kartu Pintar Nusuk Kementerian Haji Saudi.'
    ];
    let spY = 2.15;
    for (const step of spSteps) {
        slide.addText(step, {
            x: 5.35, y: spY, w: 3.8, h: 0.38,
            fontSize: 8.5, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED
        });
        spY += 0.42;
    }
}

// =============================================================================
// SLIDE 14: MODUL 7 — PUSAT EKSPOR LAPORAN RESMI KEDINASAN
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '13. Pelaporan Dinas', 'Modul 7: Pusat Ekspor Laporan Resmi Kedinasan (/laporan)', 'Penerbitan dokumen siap cetak format PDF resmi dan spreadsheet Excel terpadu.');

    const reportCards = [
        {
            title: 'Laporan Rekapitulasi 11 Wilayah',
            format: 'PDF & EXCEL',
            desc: 'Rekapitulasi total jamaah, persentase kesiapan berkas, status paspor, dan rincian per kabupaten/kota untuk laporan Kakanwil kepada Menteri Haji.',
            color: COLOR_PRIMARY
        },
        {
            title: 'Laporan Istitha\'ah Medis RSUD',
            format: 'PDF & EXCEL',
            desc: 'Daftar rekapitulasi status kesehatan jamaah (MS, MS Pendampingan, TMS) dan status vaksinasi meningitis/polio per rumah sakit daerah.',
            color: COLOR_AMBER
        },
        {
            title: 'Manifest 4 Kloter Embarkasi',
            format: 'PDF & EXCEL',
            desc: 'Daftar penumpang resmi (Passenger Manifest) Kloter 1 s.d. 4 UPG lengkap dengan nomor paspor, regu, rombongan, dan nomor kursi penerbangan.',
            color: COLOR_NAVY
        }
    ];

    for (let i = 0; i < 3; i++) {
        const rc = reportCards[i];
        const cx = 0.6 + (i * 2.95);
        addCard(slide, cx, 1.35, 2.85, 3.6, { accentColor: rc.color });

        slide.addShape(pres.ShapeType.roundRect, {
            x: cx + 0.2, y: 1.55, w: 1.2, h: 0.26,
            rectRadius: 0.04, fill: { color: rc.color }
        });
        slide.addText(rc.format, {
            x: cx + 0.2, y: 1.57, w: 1.2, h: 0.22,
            fontSize: 8, fontFace: 'Segoe UI', bold: true, color: 'FFFFFF', align: 'center'
        });

        slide.addText(rc.title, {
            x: cx + 0.2, y: 1.95, w: 2.45, h: 0.55,
            fontSize: 12, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });

        slide.addText(rc.desc, {
            x: cx + 0.2, y: 2.6, w: 2.45, h: 2.1,
            fontSize: 9, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
        });
    }
}

// =============================================================================
// SLIDE 15: RENCANA AKSI & JADWAL ROLLOUT OPERASIONAL
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_LIGHT };
    addStandardHeader(slide, '14. Tindak Lanjut', 'Rencana Aksi Sosialisasi, Bimtek & Jadwal Rollout', 'Langkah konkret implementasi operasional SIAP HAJI PAPUA menjelang Musim 1447 H / 2026 M.');

    const timeline = [
        {
            tahap: 'TAHAP I',
            fokus: 'Sosialisasi & Bimtek Admin',
            durasi: 'Oktober 2026',
            kegiatan: 'Pelatihan teknis intensif bagi seluruh operator Kemenag 11 Kabupaten/Kota dan penyerahan akun resmi.'
        },
        {
            tahap: 'TAHAP II',
            fokus: 'Integrasi Medis RSUD & Lab',
            durasi: 'November 2026',
            kegiatan: 'Sosialisasi bagi dokter RSUD se-Papua, input rekam medis, dan penetapan status istitha\'ah kesehatan awal.'
        },
        {
            tahap: 'TAHAP III',
            fokus: 'Sinkronisasi Paspor & Kloter',
            durasi: 'Desember 2026',
            kegiatan: 'Verifikasi paspor 3 kata nama, rekam Saudi Bio Visa, dan simulasi penataan 4 Kloter Papua di Makassar.'
        },
        {
            tahap: 'TAHAP IV',
            fokus: 'Posko Siaga Komando (NOC)',
            durasi: 'Musim Haji 2026 M',
            kegiatan: 'Aktivasi posko NOC aula komando 24/7, monitoring pergerakan jamaah, dan koordinasi terpadu PPIH Embarkasi UPG.'
        }
    ];

    for (let i = 0; i < 4; i++) {
        const tl = timeline[i];
        const cx = 0.6 + (i * 2.2);
        addCard(slide, cx, 1.35, 2.15, 3.6, { accentColor: COLOR_PRIMARY });

        slide.addShape(pres.ShapeType.roundRect, {
            x: cx + 0.15, y: 1.55, w: 1.3, h: 0.26,
            rectRadius: 0.04, fill: { color: COLOR_PRIMARY }
        });
        slide.addText(tl.tahap, {
            x: cx + 0.15, y: 1.57, w: 1.3, h: 0.22,
            fontSize: 8, fontFace: 'Segoe UI', bold: true, color: 'FFFFFF', align: 'center'
        });

        slide.addText(tl.fokus, {
            x: cx + 0.15, y: 1.95, w: 1.85, h: 0.55,
            fontSize: 11, fontFace: 'Segoe UI', bold: true, color: COLOR_TEXT_DARK
        });

        slide.addText(`Periode: ${tl.durasi}`, {
            x: cx + 0.15, y: 2.52, w: 1.85, h: 0.22,
            fontSize: 8.5, fontFace: 'Segoe UI', bold: true, color: COLOR_AMBER
        });

        slide.addText(tl.kegiatan, {
            x: cx + 0.15, y: 2.8, w: 1.85, h: 1.9,
            fontSize: 8.5, fontFace: 'Segoe UI', color: COLOR_TEXT_MUTED, lineSpacingMultiple: 1.2
        });
    }
}

// =============================================================================
// SLIDE 16: PENUTUP, KONTAK & SESI TANYA JAWAB (Q&A)
// =============================================================================
{
    const slide = pres.addSlide();
    slide.background = { color: COLOR_BG_DARK };

    // Decorative side stripes
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: 0.25, h: 5.625,
        fill: { color: COLOR_GOLD }, line: { color: COLOR_GOLD }
    });
    slide.addShape(pres.ShapeType.rect, {
        x: 0.25, y: 0, w: 0.08, h: 5.625,
        fill: { color: COLOR_EMERALD }, line: { color: COLOR_EMERALD }
    });

    // Ministry Logo
    if (fs.existsSync(logoPath)) {
        slide.addImage({
            path: logoPath,
            x: 0.8, y: 0.5, w: 1.1, h: 1.1
        });
    }

    slide.addText('KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA\nKANTOR WILAYAH PROVINSI PAPUA', {
        x: 2.1, y: 0.55, w: 7.0, h: 0.5,
        fontSize: 11, fontFace: 'Segoe UI', bold: true, color: 'E2E8F0'
    });
    slide.addText('Bidang Penyelenggaraan Haji dan Umrah (PHU)', {
        x: 2.1, y: 1.1, w: 7.0, h: 0.25,
        fontSize: 9.5, fontFace: 'Segoe UI', color: COLOR_GOLD
    });

    slide.addText('TERIMA KASIH', {
        x: 0.8, y: 1.85, w: 8.4, h: 0.6,
        fontSize: 32, fontFace: 'Segoe UI', bold: true, color: 'FFFFFF'
    });
    slide.addText('Mari Bersinergi Mewujudkan Pelayanan Haji Papua yang Profesional, Transparan & Ramah Lansia', {
        x: 0.8, y: 2.45, w: 8.4, h: 0.35,
        fontSize: 12, fontFace: 'Segoe UI', color: COLOR_GOLD
    });

    // Access Box
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 2.95, w: 8.4, h: 1.4,
        rectRadius: 0.06, fill: { color: '0F291E' }, line: { color: COLOR_EMERALD, width: 1 }
    });

    slide.addText('AKSES SISTEM & SALURAN BANTUAN TEKNIS', {
        x: 1.0, y: 3.1, w: 8.0, h: 0.25,
        fontSize: 10, fontFace: 'Segoe UI', bold: true, color: '34D399'
    });
    slide.addText('• Portal Aplikasi Resmi: https://siap-haji-papua.vercel.app\n• Portal Publik Cek Porsi: https://siap-haji-papua.vercel.app/cek-porsi\n• Alamat Sekretariat: Jl. Raya Abepura, Entrop, Distrik Jayapura Selatan, Kota Jayapura 99224\n• Layanan Helpdesk & Call Center: Telepon (0967) 537427  |  Email: phu.papua@haji.go.id', {
        x: 1.0, y: 3.4, w: 8.0, h: 0.85,
        fontSize: 9, fontFace: 'Segoe UI', color: 'CBD5E1', lineSpacingMultiple: 1.2
    });

    // Q&A Invitation
    slide.addText('SESI TANYA JAWAB (Q&A) DIBUKA', {
        x: 0.8, y: 4.65, w: 8.4, h: 0.45,
        fontSize: 16, fontFace: 'Segoe UI', bold: true, color: COLOR_GOLD, align: 'center'
    });
}

// Write to file
const targetFile = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/SLIDE_PRESENTASI_SOSIALISASI_SIAP_HAJI_PAPUA.pptx';

pres.writeFile({ fileName: targetFile })
    .then(() => {
        console.log(`Presentation successfully created! Saved to: ${targetFile}`);
    })
    .catch(err => {
        console.error('Error writing presentation:', err);
        process.exit(1);
    });
