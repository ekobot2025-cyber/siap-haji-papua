const fs = require('fs');
const path = require('path');
const docx = require('docx');

const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    AlignmentType,
    WidthType,
    BorderStyle,
    ShadingType,
    ImageRun,
    Header,
    Footer,
    PageNumber,
    NumberFormat,
    PageBreak
} = docx;

// Helper: Borderless table cell borders
const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

// Helper: Clean subtle borders for tables
const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
};

// Styling Palette Constants
const COLOR_PRIMARY = '1E3A8A'; // Navy
const COLOR_SECONDARY = '0F172A'; // Slate Dark
const COLOR_ACCENT = 'B45309'; // Gold Amber
const COLOR_EMERALD = '059669'; // Emerald
const COLOR_TEXT = '1E293B'; // Charcoal Dark Text
const COLOR_MUTED = '64748B'; // Muted Slate
const COLOR_BG_HEADER = '1E3A8A'; // Table Header Navy
const COLOR_BG_ROW_ALT = 'F8FAFC'; // Alternate Row Light Gray
const COLOR_BG_CALLOUT = 'F0FDF4'; // Callout Box Light Emerald

function createHeading1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 140 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 28,
                color: COLOR_PRIMARY,
                font: 'Segoe UI'
            })
        ]
    });
}

function createHeading2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 260, after: 100 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 24,
                color: COLOR_SECONDARY,
                font: 'Segoe UI'
            })
        ]
    });
}

function createHeading3(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 180, after: 80 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 21,
                color: COLOR_ACCENT,
                font: 'Segoe UI'
            })
        ]
    });
}

function createParagraph(text, options = {}) {
    return new Paragraph({
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        spacing: { before: options.before || 60, after: options.after || 100, line: 276 },
        children: [
            new TextRun({
                text: text,
                bold: options.bold || false,
                italics: options.italics || false,
                size: options.size || 21, // 10.5pt
                color: options.color || COLOR_TEXT,
                font: 'Segoe UI'
            })
        ]
    });
}

function createBullet(text, boldPrefix = '') {
    const children = [];
    if (boldPrefix) {
        children.push(new TextRun({
            text: boldPrefix + ' ',
            bold: true,
            size: 21,
            color: COLOR_TEXT,
            font: 'Segoe UI'
        }));
    }
    children.push(new TextRun({
        text: text,
        size: 21,
        color: COLOR_TEXT,
        font: 'Segoe UI'
    }));

    return new Paragraph({
        bullet: { level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 40, after: 60, line: 260 },
        children: children
    });
}

function createCallout(title, text) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: '10B981' },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: '10B981' },
            left: { style: BorderStyle.SINGLE, size: 12, color: '059669' }, // thick green left accent
            right: { style: BorderStyle.SINGLE, size: 2, color: '10B981' },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'ECFDF5', type: ShadingType.CLEAR },
                        margins: { top: 160, bottom: 160, left: 200, right: 200 },
                        children: [
                            new Paragraph({
                                spacing: { after: 60 },
                                children: [
                                    new TextRun({
                                        text: '  ' + title.toUpperCase(),
                                        bold: true,
                                        size: 21,
                                        color: '047857',
                                        font: 'Segoe UI'
                                    })
                                ]
                            }),
                            new Paragraph({
                                spacing: { after: 40 },
                                children: [
                                    new TextRun({
                                        text: text,
                                        size: 20,
                                        color: '064E3B',
                                        font: 'Segoe UI'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

function createStyledTable(headers, rowsData, colWidths = []) {
    const headerRow = new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
            width: colWidths[i] ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
            shading: { fill: COLOR_BG_HEADER, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: h,
                            bold: true,
                            size: 19,
                            color: 'FFFFFF',
                            font: 'Segoe UI'
                        })
                    ]
                })
            ]
        }))
    });

    const bodyRows = rowsData.map((row, rIdx) => {
        const isAlt = rIdx % 2 === 1;
        return new TableRow({
            children: row.map((cellText, cIdx) => new TableCell({
                width: colWidths[cIdx] ? { size: colWidths[cIdx], type: WidthType.PERCENTAGE } : undefined,
                shading: { fill: isAlt ? COLOR_BG_ROW_ALT : 'FFFFFF', type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [
                    new Paragraph({
                        alignment: cIdx === 0 && row.length > 3 ? AlignmentType.CENTER : AlignmentType.LEFT,
                        spacing: { before: 20, after: 20, line: 240 },
                        children: [
                            new TextRun({
                                text: cellText,
                                size: 19,
                                color: COLOR_TEXT,
                                font: 'Segoe UI'
                            })
                        ]
                    })
                ]
            }))
        });
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorders,
        rows: [headerRow, ...bodyRows]
    });
}

async function buildDocument() {
    console.log('Building Procurement Specification Document for SIAP HAJI PAPUA...');

    const logoPath = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/logo-kemenhaj.png';
    const fc1Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/flowchart_1_siklus_pengadaan.png';
    const fc2Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/flowchart_2_persyaratan_penyedia.png';
    const fc3Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/flowchart_3_serah_terima_uat.png';

    const hasLogo = fs.existsSync(logoPath);
    const hasFc1 = fs.existsSync(fc1Path);
    const hasFc2 = fs.existsSync(fc2Path);
    const hasFc3 = fs.existsSync(fc3Path);

    const docChildren = [];

    // =========================================================================
    // 1. COVER PAGE
    // =========================================================================
    if (hasLogo) {
        docChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 300, after: 200 },
                children: [
                    new ImageRun({
                        data: fs.readFileSync(logoPath),
                        transformation: { width: 120, height: 120 },
                        type: 'png'
                    })
                ]
            })
        );
    }

    docChildren.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
                new TextRun({
                    text: 'KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA',
                    bold: true,
                    size: 28,
                    color: COLOR_PRIMARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 180 },
            children: [
                new TextRun({
                    text: 'KANTOR WILAYAH PROVINSI PAPUA',
                    bold: true,
                    size: 24,
                    color: COLOR_SECONDARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 200 },
            children: [
                new TextRun({
                    text: 'BIDANG PENYELENGGARAAN HAJI DAN UMRAH (PHU)',
                    bold: true,
                    size: 20,
                    color: COLOR_ACCENT,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
                new TextRun({
                    text: 'DOKUMEN PANDUAN DAN PERSYARATAN TEKNIS PENGADAAN APLIKASI',
                    bold: true,
                    size: 32,
                    color: COLOR_PRIMARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 120 },
            children: [
                new TextRun({
                    text: 'SIAP HAJI PAPUA v1.0',
                    bold: true,
                    size: 36,
                    color: COLOR_EMERALD,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 300 },
            children: [
                new TextRun({
                    text: 'Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua\nCommand Center Pemantauan 11 Kabupaten/Kota, Bio Visa, Istitha\'ah Medis RSUD, dan 4 Kloter Embarkasi Hasanuddin (UPG)',
                    italics: true,
                    size: 20,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 40 },
            children: [
                new TextRun({
                    text: 'Nomor Dokumen : DOK-PENG/PHU-PAPUA/2026/001-REV\nSifat : Resmi Kedinasan / Terbuka Untuk Seleksi\nMusim Haji Aktif : 1447 H / 2026 M\nTahun Anggaran : 2026',
                    bold: true,
                    size: 20,
                    color: COLOR_TEXT,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 0 },
            children: [
                new TextRun({
                    text: 'JAYAPURA - PROVINSI PAPUA\n2026',
                    bold: true,
                    size: 22,
                    color: COLOR_PRIMARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 2. LEMBAR PENGESAHAN DOKUMEN PENGADAAN
    // =========================================================================
    docChildren.push(
        createHeading1('LEMBAR PENGESAHAN DOKUMEN PENGADAAN'),
        createParagraph('Dokumen Panduan Permintaan dan Persyaratan Pengadaan Aplikasi "SIAP HAJI PAPUA" ini telah diteliti, direviu, dan disahkan oleh Tim Perencanaan Pengadaan Satuan Kerja Kantor Wilayah Kementerian Haji dan Umrah Provinsi Papua untuk dipergunakan sebagai acuan resmi dalam proses pemilihan penyedia jasa konsultansi perorangan/badan usaha pengembangan perangkat lunak sesuai dengan ketentuan perundang-undangan yang berlaku.'),
        new Paragraph({ spacing: { after: 200 } }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 33, type: WidthType.PERCENTAGE },
                            margins: { top: 120, bottom: 120, left: 120, right: 120 },
                            children: [
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Diverifikasi Oleh:\nKetua Tim Teknis IT & SPBE', bold: true, size: 20, font: 'Segoe UI' })] }),
                                new Paragraph({ spacing: { before: 500, after: 80 } }),
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( Ir. Wahyu Hidayat, S.Kom., M.T. )\nNIP. 19840512 201001 1 018', bold: true, size: 19, font: 'Segoe UI' })] })
                            ]
                        }),
                        new TableCell({
                            width: { size: 34, type: WidthType.PERCENTAGE },
                            margins: { top: 120, bottom: 120, left: 120, right: 120 },
                            children: [
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Disusun Oleh:\nPejabat Pembuat Komitmen (PPK)', bold: true, size: 20, font: 'Segoe UI' })] }),
                                new Paragraph({ spacing: { before: 500, after: 80 } }),
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( H. Ahmad Syarifuddin, S.Ag., M.Si. )\nNIP. 19780315 200501 1 004', bold: true, size: 19, font: 'Segoe UI' })] })
                            ]
                        }),
                        new TableCell({
                            width: { size: 33, type: WidthType.PERCENTAGE },
                            margins: { top: 120, bottom: 120, left: 120, right: 120 },
                            children: [
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Disetujui Oleh:\nKuasa Pengguna Anggaran (KPA)', bold: true, size: 20, font: 'Segoe UI' })] }),
                                new Paragraph({ spacing: { before: 500, after: 80 } }),
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( Dr. H. Klemens Rumabar, M.Pd. )\nNIP. 19710822 199803 1 002', bold: true, size: 19, font: 'Segoe UI' })] })
                            ]
                        })
                    ]
                })
            ]
        }),
        new Paragraph({ spacing: { after: 200 } }),
        createCallout('PERNYATAAN INTEGRITAS & KEPATUHAN PENGADAAN', 'Seluruh proses pengadaan ini diselenggarakan berpedoman teguh pada asas Efisien, Efektif, Transparan, Terbuka, Bersaing, Adil, dan Akuntabel sebagaimana diamanatkan dalam Perpres Pengadaan Barang/Jasa Pemerintah No. 16/2018 jo No. 12/2021 dan Perpres No. 95/2018 tentang SPBE. Seluruh pihak yang terlibat tunduk pada Pakta Integritas dan bebas dari benturan kepentingan.'),
        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 3. BAB I: KETENTUAN UMUM & DASAR HUKUM PENGADAAN
    // =========================================================================
    docChildren.push(
        createHeading1('BAB I: KETENTUAN UMUM & DASAR HUKUM PENGADAAN'),
        createHeading2('1.1 Latar Belakang'),
        createParagraph('Penyelenggaraan Ibadah Haji di Provinsi Papua menghadapi tantangan operasional dan geografis yang sangat unik dibandingkan wilayah barat Indonesia. Wilayah binaan Provinsi Papua mencakup 11 Kabupaten/Kota (Kota Jayapura, Kab. Keerom, Kab. Jayapura, Kab. Merauke, Kab. Boven Digoel, Kab. Asmat, Kab. Mimika, Kab. Biak Numfor, Kab. Kepulauan Yapen, Kab. Nabire, dan Kab. Jayawijaya) dengan bentang geografis pesisir pantai hingga pegunungan tengah yang sulit dijangkau transportasi darat regular.'),
        createParagraph('Selain tantangan jarak, para jamaah Papua diberangkatkan melalui konsentrasi 4 Kloter ke Embarkasi Hasanuddin Makassar (UPG). Keterlambatan validasi dokumen fisik (Paspor RI 3 kata nama), sinkronisasi data biometrik Bio Visa Arab Saudi, rekonsiliasi pelunasan Biaya Perjalanan Ibadah Haji (BPIH), serta penetapan status istitha\'ah kesehatan oleh Tim Pemeriksa Kesehatan RSUD di daerah seringkali menjadi penghambat kritis yang berujung pada keterlambatan penerbitan visa dan penempatan kloter.'),
        createParagraph('Oleh karena itu, diperlukan pengadaan platform komando digital terpadu bernama "SIAP HAJI PAPUA" (Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua). Platform ini memfungsikan peran Command Center pimpinan wilayah (Kakanwil & Forkopimda), Early Warning Engine pendeteksi keterlambatan, Video Wall NOC untuk monitoring visual di aula rapat, serta portal mandiri pengecekan porsi bagi warga Papua secara terintegrasi dengan portal resmi kementerian (haji.go.id).'),

        createHeading2('1.2 Maksud dan Tujuan Pengadaan'),
        createParagraph('Maksud dari pengadaan ini adalah memilih penyedia jasa pengembangan sistem informasi dan teknologi yang memiliki kapabilitas enterprise, integritas profesional, dan rekam jejak teruji dalam membangun sistem informasi kepemerintahan berkeamanan tinggi.'),
        createParagraph('Adapun tujuan pengadaan ini meliputi:'),
        createBullet('Membangun Provincial Hajj Command Center yang memberikan visibilitas real-time kesiapan administrasi, bio visa, dan kesehatan jamaah haji di 11 kabupaten/kota se-Papua.', '1.'),
        createBullet('Mengotomasi deteksi dini (Early Warning Engine) terhadap berkas paspor, pelunasan BPIH, dan penetapan medis RSUD yang mendekati batas waktu tenggat (deadline).', '2.'),
        createBullet('Menyediakan sarana visual Video Wall Network Operations Center (NOC) untuk presentasi dan pemantauan interaktif pimpinan wilayah.', '3.'),
        createBullet('Menyediakan portal mandiri masyarakat untuk pengecekan estimasi keberangkatan porsi secara cepat, transparan, dan ramah lansia.', '4.'),
        createBullet('Menjamin kepatuhan penuh terhadap standar SPBE Nasional, UU Pelindungan Data Pribadi (UU PDP), dan penyerahan aset kode sumber (source code) 100% kepada instansi pemerintah.', '5.'),

        createHeading2('1.3 Landasan Hukum dan Regulasi'),
        createParagraph('Pelaksanaan pengadaan aplikasi ini berlandaskan pada peraturan perundang-undangan yang sah di Negara Kesatuan Republik Indonesia:'),
        createBullet('Undang-Undang Nomor 8 Tahun 2019 tentang Penyelenggaraan Ibadah Haji dan Umrah beserta seluruh regulasi perubahannya.', 'a.'),
        createBullet('Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).', 'b.'),
        createBullet('Undang-Undang Nomor 1 Tahun 2024 tentang Perubahan Kedua atas UU No. 11/2008 tentang Informasi dan Transaksi Elektronik (UU ITE).', 'c.'),
        createBullet('Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah beserta perubahannya Perpres Nomor 12 Tahun 2021.', 'd.'),
        createBullet('Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).', 'e.'),
        createBullet('Peraturan LKPP Nomor 11 Tahun 2021 tentang Pedoman Perencanaan Pengadaan Barang/Jasa Pemerintah.', 'f.'),
        createBullet('Peraturan LKPP Nomor 12 Tahun 2021 tentang Pedoman Pelaksanaan Pengadaan Barang/Jasa Pemerintah Melalui Penyedia.', 'g.'),
        createBullet('Peraturan BSSN Nomor 4 Tahun 2021 tentang Pedoman Manajemen Keamanan Informasi SPBE dan Standar ISO/IEC 27001.', 'h.'),

        createHeading2('1.4 Ruang Lingkup Pekerjaan'),
        createParagraph('Ruang lingkup pekerjaan yang wajib diselesaikan oleh Penyedia Terpilih mencakup:'),
        createBullet('Software Engineering & Modul Core: Pengembangan modul 11 Wilayah, Bio Visa Tracker, Istitha\'ah Medis, Kloter Hasanuddin UPG, dan Executive Command Center.', '1.'),
        createBullet('Integrasi Database & API: Sinkronisasi database Cloud PostgreSQL (Neon), skema Prisma ORM, dan interoperabilitas data SISKOHAT / haji.go.id.', '2.'),
        createBullet('Security Hardening & VAPT: Enkripsi AES-256 data sensitif, penyamaran (masking) NIK, dan audit penetrasi keamanan (Pen-Test) bebas dari celah kritis OWASP Top 10.', '3.'),
        createBullet('Testing & Penjaminan Mutu: Pengujian fungsional UAT bersama 11 admin kabupaten/kota, load testing, dan simulasi skenario kegagalan.', '4.'),
        createBullet('Bimbingan Teknis & Alih Pengetahuan: Pelatihan intensif bagi Super Admin Kanwil, operator Kemenag Kab/Kota, dan dokter pemeriksa RSUD.', '5.'),
        createBullet('Masa Garansi & Pemeliharaan: Dukungan teknis dan operasional selama minimal 6 hingga 12 bulan termasuk masa posko siaga operasional haji.', '6.'),

        createHeading2('1.5 Sumber Pendanaan dan Perkiraan Biaya (HPS)'),
        createParagraph('Pekerjaan ini dibiayai melalui Anggaran Pendapatan dan Belanja Negara (APBN) Kementerian Haji dan Umrah / Kantor Wilayah Provinsi Papua Tahun Anggaran 2026. Nilai Harga Perkiraan Sendiri (HPS) ditetapkan secara resmi oleh Pejabat Pembuat Komitmen (PPK) berdasarkan hasil kajian survei pasar, analisis remunerasi keahlian INKINDO, dan kebutuhan infrastruktur cloud bersertifikasi.'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 4. BAB II: PERSYARATAN DAN KUALIFIKASI PENYEDIA
    // =========================================================================
    docChildren.push(
        createHeading1('BAB II: PERSYARATAN DAN KUALIFIKASI PENYEDIA (VENDOR)'),
        createParagraph('Untuk memastikan kualitas mutu perangkat lunak, keandalan arsitektur, dan kepatuhan hukum, Penyedia yang berminat mengajukan penawaran wajib memenuhi kriteria kualifikasi yang dikelompokkan ke dalam 4 (empat) pilar utama berikut:'),

        createHeading2('2.1 Persyaratan Kualifikasi Administrasi dan Legalitas'),
        createParagraph('Penyedia berbentuk Badan Usaha Perseroan Terbatas (PT) / CV yang memiliki legalitas usaha sah di wilayah hukum Republik Indonesia:'),
        createStyledTable(
            ['No', 'Dokumen Legalitas', 'Dasar Regulasi', 'Kriteria & Status Verifikasi'],
            [
                ['1', 'Nomor Induk Berusaha (NIB)', 'OSS RBA Berbasis Risiko', 'Wajib memuat KBLI 62019 (Aktivitas Pemrograman Komputer Lainnya), KBLI 62011, atau 62020 (Aktivitas Konsultasi Komputer).'],
                ['2', 'NPWP & Konfirmasi Status Wajib Pajak (KSWP)', 'Kementerian Keuangan RI', 'Status KSWP wajib "VALID" dalam konfirmasi sistem DJP Online pada saat evaluasi.'],
                ['3', 'Bukti Pelaporan Pajak (SPT Tahunan)', 'Dirjen Pajak Kemenkeu', 'Telah melaporkan SPT Pajak Penghasilan Badan Tahun Pajak terakhir (2024/2025).'],
                ['4', 'Akta Pendirian & Perubahan Terakhir', 'Kemenkumham RI', 'Menyertakan akta pendirian perusahaan dan SK Pengesahan Kemenkumham, serta susunan direksi terbaru.'],
                ['5', 'Surat Pakta Integritas Resmi', 'Perpres No. 16/2018', 'Bertandatangan direktur utama bermaterai cukup, menyatakan bebas dari KKN dan benturan kepentingan.'],
                ['6', 'Surat Keterangan Bebas Blacklist', 'Inaproc LKPP', 'Penyedia dan pengurus tidak sedang dikenakan sanksi daftar hitam (blacklist) oleh LKPP/Instansi Pemerintah.']
            ],
            [8, 28, 24, 40]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        createHeading2('2.2 Persyaratan Kapabilitas Teknis & Portofolio Perusahaan'),
        createParagraph('Penyedia wajib membuktikan kompetensi teknis dan pengalaman riil dalam menyelesaikan proyek skala pemerintahan (SPBE) atau enterprise:'),
        createBullet('Pengalaman Perusahaan: Memiliki pengalaman operasional minimal 3 (tiga) tahun dalam bidang pengembangan perangkat lunak (software engineering).', 'a.'),
        createBullet('Kontrak Sejenis: Memiliki pengalaman mengerjakan sedikitnya 1 (satu) pekerjaan penyediaan sistem informasi manajemen terintegrasi / command center / sistem layanan publik di lingkungan kementerian/lembaga/BUMN dalam kurun waktu 3 (tiga) tahun terakhir dengan melampirkan salinan Kontrak dan BAST.', 'b.'),
        createBullet('Metodologi Rekayasa Perangkat Lunak: Menerapkan metodologi Agile Scrum / DevOps modern dengan dokumentasi sprint berkala dan automated CI/CD pipeline.', 'c.'),
        createBullet('Sertifikasi Sistem Manajemen Mutu & Keamanan: Nilai tambah mutlak (prioritas) diberikan kepada penyedia yang telah tersertifikasi ISO 9001:2015 (Manajemen Mutu) dan ISO/IEC 27001:2022 (Sistem Manajemen Keamanan Informasi).', 'd.'),

        createHeading2('2.3 Persyaratan Tenaga Ahli Inti (Key Personnel)'),
        createParagraph('Penyedia wajib menugaskan tim tenaga ahli yang berdedikasi penuh dengan kualifikasi minimal sebagai berikut:'),
        createStyledTable(
            ['No', 'Posisi Tenaga Ahli', 'Pendidikan & Pengalaman', 'Sertifikasi Keahlian', 'Tanggung Jawab Utama'],
            [
                ['1', 'Project Manager (PM) - 1 Orang', 'S1/S2 Ilmu Komputer / TI, Pengalaman min. 5 tahun memimpin proyek IT pemerintah.', 'Project Management Professional (PMP) atau SKA Ahli Madya Manajemen Proyek.', 'Memimpin pelaksanaan proyek, koordinasi stakeholder, kendali mutu jadwal & biaya, pelaporan berkala.'],
                ['2', 'Solution / Cloud Architect - 1 Orang', 'S1 Teknik Informatika / Sistem Informasi, Pengalaman min. 4 tahun desain sistem skala besar.', 'TOGAF Certified atau AWS/GCP Certified Solutions Architect.', 'Merancang arsitektur sistem clean hexagonal, integrasi cloud Neon DB, skema scalability, dan high availability.'],
                ['3', 'Senior Full-Stack Engineer - 2 Orang', 'S1 Ilmu Komputer, Pengalaman min. 3 tahun pengembangan web modern.', 'Node.js / React / TypeScript Professional Certified.', 'Mengembangkan kode frontend Next.js 15, backend route handler, Prisma ORM, dan antarmuka responsif.'],
                ['4', 'Database Administrator (DBA) - 1 Orang', 'S1 Teknologi Informasi, Pengalaman min. 3 tahun manajemen database relasional.', 'PostgreSQL Certified Professional atau Oracle Database Expert.', 'Desain skema DB PostgreSQL, indexing optimasi query, connection pooling, backup otomatis, replikasi data.'],
                ['5', 'Cybersecurity Specialist - 1 Orang', 'S1 Keamanan Siber / TI, Pengalaman min. 3 tahun di bidang audit keamanan sistem.', 'Certified Ethical Hacker (CEH), CISSP, atau CompTIA Security+.', 'Audit VAPT OWASP Top 10, implementasi enkripsi AES-256 data rest, konfigurasi blind index, dan security policy.'],
                ['6', 'UI/UX Designer - 1 Orang', 'S1 Desain Komunikasi Visual / TI, Pengalaman min. 3 tahun merancang UI/UX.', 'Google UX Design Professional Certified atau setara.', 'Merancang user experience command center, mobile-first design jamaah lansia, dan layout Video Wall NOC.']
            ],
            [6, 22, 22, 22, 28]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        createHeading2('2.4 Persyaratan Protokol Keamanan & Kepatuhan UU PDP'),
        createParagraph('Mengingat data jamaah haji memuat informasi pribadi yang dilindungi undang-undang (NIK, No Paspor, Rekam Medis Penyakit, Rekening BPIH), penyedia wajib menandatangani Perjanjian Kerahasiaan (Non-Disclosure Agreement / NDA) dan menjamin:'),
        createBullet('Kepatuhan UU PDP No. 27/2022: Menerapkan field-level encryption AES-256-GCM pada seluruh data identitas jamaah yang tersimpan di database.', '1.'),
        createBullet('Penyamaran Data (Data Masking): Menerapkan algoritma penyamaran NIK dan nomor kontak pada antarmuka pengguna yang disesuaikan dengan hak akses otorisasi peranan (RBAC).', '2.'),
        createBullet('Audit Trail Tidak Dapat Diubah (Immutable Audit Logs): Seluruh aktivitas create, read, update, delete (CRUD) dan download data wajib tercatat dalam log audit yang mencantumkan timestamp, ID pengguna, dan alamat IP.', '3.'),
        createBullet('Bebas Vendor Lock-In & Kepemilikan 100%: Seluruh kode program, skema basis data, konfigurasi CI/CD, dan dokumentasi arsitektur diserahkan sepenuhnya menjadi hak milik Kementerian Haji dan Umrah RI tanpa keterikatan royalti.', '4.'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 5. BAB III: FLOWCHART ALUR PENGADAAN & PERSYARATAN APLIKASI
    // =========================================================================
    docChildren.push(
        createHeading1('BAB III: FLOWCHART ALUR PENGADAAN & PERSYARATAN APLIKASI'),
        createParagraph('Bagian ini menyajikan diagram alir (Flowchart) resmi yang menggambarkan mekanisme pengadaan aplikasi dari hulu ke hilir, mulai dari perumusan kebutuhan instansi hingga serah terima hasil pekerjaan dan masa penjaminan layanan (SLA).'),

        createHeading2('3.1 Flowchart 1: Siklus Lengkap Pengadaan Aplikasi Pemerintah'),
        createParagraph('Flowchart berikut menggambarkan 7 (tujuh) tahapan berkesinambungan yang wajib dilalui dalam pengadaan aplikasi SIAP HAJI PAPUA sesuai Perpres No. 16/2018 jo No. 12/2021 dan standar SPBE Perpres No. 95/2018:')
    );

    if (hasFc1) {
        docChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 120 },
                children: [
                    new ImageRun({
                        data: fs.readFileSync(fc1Path),
                        transformation: { width: 540, height: 652 },
                        type: 'png'
                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 140 },
                children: [
                    new TextRun({
                        text: 'Gambar 3.1: Flowchart Siklus Lengkap Pengadaan Aplikasi SIAP HAJI PAPUA (Tahap 01 s.d. 07)',
                        italics: true,
                        size: 19,
                        color: COLOR_MUTED,
                        font: 'Segoe UI'
                    })
                ]
            })
        );
    }

    docChildren.push(
        createParagraph('Deskripsi Rinci 7 Tahapan Siklus Pengadaan:'),
        createBullet('Tahap 01 - Perencanaan & Penyusunan Dokumen: Pejabat Pembuat Komitmen (PPK) bersama Tim Teknis mengidentifikasi kebutuhan komando haji 11 Kabupaten/Kota, menyusun Kerangka Acuan Kerja (KAK), menetapkan Spesifikasi Teknis, dan mengesahkan Harga Perkiraan Sendiri (HPS).', '•'),
        createBullet('Tahap 02 - Persiapan & Pengumuman Pemilihan: Pokja Pemilihan pada LPSE mereviu dokumen persiapan pengadaan, menetapkan Lembar Data Pemilihan (LDP), mengumumkan paket tender/e-katalog secara publik, dan membuka masa pemberian penjelasan (aanwijzing).', '•'),
        createBullet('Tahap 03 - Pengajuan Penawaran & Evaluasi: Peserta tender mengunggah dokumen penawaran (Administrasi, Kualifikasi, Teknis, dan Biaya). Tim Pokja melakukan evaluasi bertingkat termasuk uji pembuktian kualifikasi dan demo prototype sistem.', '•'),
        createBullet('Tahap 04 - Penetapan Pemenang & Penandatanganan Kontrak: Penerbitan SPPBJ oleh PPK, masa sanggah peserta, penyerahan Jaminan Pelaksanaan sebesar 5% dari nilai kontrak, penandatanganan Kontrak Kerja Sama, serta penerbitan SPMK (Surat Perintah Mulai Kerja).', '•'),
        createBullet('Tahap 05 - Pelaksanaan Pengembangan (Agile Sprints): Penyedia mengeksekusi pengembangan kode sistem Next.js 15, PostgreSQL, modul 11 wilayah, Bio Visa tracker, dan Video Wall dengan siklus sprint mingguan serta sprint demo bersama tim pengawas.', '•'),
        createBullet('Tahap 06 - Pengujian Ketat (UAT & Cybersecurity): Uji penerimaan pengguna (UAT) diuji langsung oleh perwakilan Kemenag 11 Kab/Kota, uji beban stress test ratusan transaksi concurrent, serta vulnerability assessment VAPT bebas dari temuan celah kritis OWASP.', '•'),
        createBullet('Tahap 07 - Serah Terima, Bimtek & Masa Garansi SLA: Pelatihan bagi operator & administrator, serah terima kode sumber repositori git, penandatanganan BAST I, berlanjut ke masa garansi operasional 6-12 bulan hingga terbit BAST Final (BAST II).', '•'),

        new Paragraph({ children: [new PageBreak()] }),

        createHeading2('3.2 Flowchart 2: Matriks Persyaratan & Alur Evaluasi Penyedia'),
        createParagraph('Flowchart berikut menjabarkan 4 (empat) pilar persyaratan kualifikasi vendor serta 3 (tiga) tahapan sistem evaluasi kelulusan (Sistem Gugur, Passing Grade 80, dan Kewajaran Biaya):')
    );

    if (hasFc2) {
        docChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 120 },
                children: [
                    new ImageRun({
                        data: fs.readFileSync(fc2Path),
                        transformation: { width: 560, height: 457 },
                        type: 'png'
                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 140 },
                children: [
                    new TextRun({
                        text: 'Gambar 3.2: Matriks Persyaratan Kelayakan & Alur Sistem Evaluasi Kualifikasi Vendor',
                        italics: true,
                        size: 19,
                        color: COLOR_MUTED,
                        font: 'Segoe UI'
                    })
                ]
            })
        );
    }

    docChildren.push(
        createParagraph('Ketentuan Penilaian & Ambang Batas Kelulusan:'),
        createBullet('Tahap 1 (Evaluasi Administrasi - Sistem Gugur): Seluruh berkas perizinan (NIB, KSWP, SPT, Pakta Integritas) diperiksa kelengkapan dan keabsahannya. Ketidaklengkapan 1 (satu) dokumen legalitas mengakibatkan penawaran dinyatakan GUGUR secara otomatis.', '1.'),
        createBullet('Tahap 2 (Evaluasi Teknis - Nilai Ambang Batas / Passing Grade 80): Penilaian teknis menggunakan bobot penilaian: (a) Pendekatan & Metodologi Kerja 25%, (b) Kualifikasi & Sertifikasi Tenaga Ahli 35%, (c) Portofolio Pengalaman Proyek Sejenis 25%, (d) Kualitas Demo Prototype & Arsitektur Sistem 15%. Penawar wajib memperoleh total skor minimal 80 untuk dapat melaju ke tahap berikutnya.', '2.'),
        createBullet('Tahap 3 (Evaluasi Harga & Klarifikasi Biaya): Dilakukan penilaian kewajaran harga terhadap HPS resmi pemerintah, klarifikasi kesesuaian remunerasi tenaga ahli (billing rate), dan klarifikasi faktual sertifikat personel asli sebelum penetapan pemenang.', '3.'),

        new Paragraph({ children: [new PageBreak()] }),

        createHeading2('3.3 Flowchart 3: Alur Serah Terima Pekerjaan, Pengujian Ketat & SLA'),
        createParagraph('Flowchart berikut menggambarkan tahapan pengujian mutu aplikasi, prosedur penyerahan repositori kode sumber, pelatihan bimbingan teknis, serta klasifikasi Service Level Agreement (SLA) selama masa garansi operasional:')
    );

    if (hasFc3) {
        docChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 120 },
                children: [
                    new ImageRun({
                        data: fs.readFileSync(fc3Path),
                        transformation: { width: 560, height: 448 },
                        type: 'png'
                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 140 },
                children: [
                    new TextRun({
                        text: 'Gambar 3.3: Flowchart Pengujian, Serah Terima Kode Sumber (BAST), dan Penjaminan SLA',
                        italics: true,
                        size: 19,
                        color: COLOR_MUTED,
                        font: 'Segoe UI'
                    })
                ]
            })
        );
    }

    docChildren.push(
        createParagraph('Prinsip Utama Serah Terima Hasil Pekerjaan:'),
        createBullet('Uji Penerimaan Bertingkat (UAT): Pengujian mencakup seluruh alur jamaah dari pelosok wilayah hingga Embarkasi Makassar dan integrasi haji.go.id.', '•'),
        createBullet('Ketiadaan Celah Keamanan Kritis: Tim Penguji berhak menolak menandatangani BAST apabila laporan VAPT masih menunjukkan adanya celah keamanan kategori Critical atau High yang belum dimitigasi.', '•'),
        createBullet('Penyerahan Repositori Penuh: Penyedia wajib menyerahkan hak akses administratif repository GitHub/GitLab, commit history lengkap, file environment produksi, dan skema migrasi database.', '•'),
        createBullet('Penjaminan SLA Kritis 24/7: Dukungan teknis siaga 24 jam sehari selama fase operasional keberangkatan dan kepulangan jamaah Papua 1447 H / 2026 M.', '•'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 6. BAB IV: SPESIFIKASI TEKNIS & ARSITEKTUR APLIKASI
    // =========================================================================
    docChildren.push(
        createHeading1('BAB IV: SPESIFIKASI TEKNIS & ARSITEKTUR APLIKASI (SIAP HAJI PAPUA)'),
        createParagraph('Penyedia wajib membangun atau menyesuaikan aplikasi dengan spesifikasi teknis dan standar fungsionalitas yang telah ditetapkan secara ketat sebagai berikut:'),

        createHeading2('4.1 Modul Pemantauan 11 Wilayah Kerja Operasional Papua'),
        createParagraph('Sistem wajib mendukung pembagian wilayah administratif tingkat kabupaten/kota se-Papua secara dinamis dan hierarkis:'),
        createStyledTable(
            ['No', 'Nama Kabupaten / Kota', 'Kloter Konsentrasi', 'Karakteristik & Fokus Pemantauan'],
            [
                ['1', 'Kota Jayapura', 'Kloter 1 & 2 UPG', 'Pusat komando kanwil, populasi jamaah terbesar, validasi terpadu paspor & bio visa.'],
                ['2', 'Kabupaten Keerom', 'Kloter 2 UPG', 'Wilayah perbatasan darat RI-PNG, koordinasi berkas fisik jamaah lintas distrik.'],
                ['3', 'Kabupaten Jayapura', 'Kloter 1 UPG', 'Sentra transportasi Bandara Sentani, pemantauan karantina & manasik kab/kota.'],
                ['4', 'Kabupaten Merauke', 'Kloter 3 UPG', 'Papua Selatan pesisir, pemeriksaan istitha\'ah terpusat RSUD Merauke.'],
                ['5', 'Kabupaten Boven Digoel', 'Kloter 3 UPG', 'Wilayah pedalaman selatan, pemantauan percepatan rekam sidik jari bio visa.'],
                ['6', 'Kabupaten Asmat', 'Kloter 3 UPG', 'Wilayah perairan rawa, monitoring transportasi air menuju titik embarkasi.'],
                ['7', 'Kabupaten Mimika', 'Kloter 2 & 4 UPG', 'Sentra ekonomi Timika, koordinasi kloter gabungan pekerja & masyarakat lokal.'],
                ['8', 'Kabupaten Biak Numfor', 'Kloter 4 UPG', 'Wilayah kepulauan Teluk Cenderawasih, koordinasi penerbangan transit transit.'],
                ['9', 'Kabupaten Kepulauan Yapen', 'Kloter 4 UPG', 'Wilayah kepulauan Serui, pengawalan berkas fisik KTP/SPPH via transportasi laut.'],
                ['10', 'Kabupaten Nabire', 'Kloter 4 UPG', 'Papua Tengah pesisir, sentra logistik koper dan seragam batik haji.'],
                ['11', 'Kabupaten Jayawijaya', 'Kloter 4 UPG', 'Pegunungan Tengah (Wamena), pemantauan khusus adaptasi fisik & kesehatan lansia.']
            ],
            [6, 26, 22, 46]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        createHeading2('4.2 Modul Executive Command Center & Early Warning Engine'),
        createParagraph('Pusat Kendali Pengambilan Keputusan menyajikan indikator kesiapan gabungan secara real-time:'),
        createBullet('Readiness Score Otomatis: Menghitung persentase kesiapan per jamaah, per kabupaten, dan per kloter berdasarkan formula bobot terpadu (Dokumen 30%, Medis 30%, Manasik 20%, Pelunasan BPIH 20%).', 'a.'),
        createBullet('Early Warning Engine: Mendeteksi secara cerdas jamaah dengan risiko tinggi tertinggal (misal: Paspor belum terbit dalam H-30, pelunasan BPIH belum tuntas, hasil lab RSUD belum keluar).', 'b.'),
        createBullet('Decision Support System (DSS): Simulasi alokasi kuota cadangan jamaah untuk mengantisipasi potensi jamaah yang batal/tunda berangkat tanpa merugikan antrean resmi.', 'c.'),
        createBullet('Ekspor Laporan Kedinasan Otomatis: Generator dokumen resmi siap cetak format PDF dan Excel dengan kop dinas resmi Kementerian Haji dan Umrah Wilayah Papua.', 'd.'),

        createHeading2('4.3 Modul Video Wall NOC Aula Komando'),
        createParagraph('Tampilan visual layar lebar (NOC Display) yang dirancang khusus untuk layar resolusi tinggi (4K/Ultra-Wide) di ruang rapat komando:'),
        createBullet('Layout Dark Theme Obsidian & Emas Kemenhaj: Tampilan profesional, kontras tinggi, minim gangguan visual, dan hemat konsumsi daya layar komando.', '•'),
        createBullet('Auto-Refresh & Polling Aman: Pembaruan data real-time berkala setiap 30 detik tanpa memerlukan refresh manual oleh operator.', '•'),
        createBullet('Peta Geospasial Distribusi Kesiapan: Visualisasi status hijau/kuning/merah di 11 wilayah kerja operasional Papua.', '•'),

        createHeading2('4.4 Modul Administrasi, Bio Visa & Paspor Tracker'),
        createBullet('Verifikasi Paspor 3 Kata Nama: Validasi kesesuaian penulisan nama jamaah sesuai regulasi keimigrasian Arab Saudi.', '•'),
        createBullet('Sinkronisasi Status Bio Visa: Pelacakan progres perekaman sidik jari dan foto wajah via aplikasi Saudi Visa Bio.', '•'),
        createBullet('Rekonsiliasi Pelunasan BPIH: Pemantauan konfirmasi setoran lunas BPIH melalui Bank Penerima Setoran (BPS-BPIH).', '•'),

        createHeading2('4.5 Modul Istitha\'ah Medis RSUD & Vaksinasi ICV'),
        createBullet('Pemeriksaan Kesehatan Terpadu: Pencatatan diagnosa medis administratif dari dokter pemeriksa RSUD kabupaten/kota.', '•'),
        createBullet('Penetapan Status Istitha\'ah: Kategori Memenuhi Syarat, Memenuhi Syarat dengan Pendampingan Obat/Alat, Tidak Memenuhi Syarat Sementara, atau Tidak Memenuhi Syarat Mutlak.', '•'),
        createBullet('Monitoring Vaksinasi Wajib: Pencatatan vaksin Meningitis Meningokokus dan Polio dengan penerbitan sertifikat ICV terverifikasi.', '•'),

        createHeading2('4.6 Portal Cek Estimasi Porsi Mandiri & Integrasi haji.go.id'),
        createBullet('Layanan Publik Cepat: Akses mandiri bagi calon jamaah dan keluarga untuk memeriksa nomor porsi, perkiraan tahun keberangkatan, dan status verifikasi.', '•'),
        createBullet('Integrasi Identitas Resmi: Tautan dan penyelarasan tema antarmuka dengan portal resmi Kementerian Haji dan Umrah RI (haji.go.id).', '•'),

        createHeading2('4.7 Tumpukan Teknologi (Technology Stack) yang Dipersyaratkan'),
        createStyledTable(
            ['Lapisan Sistem', 'Teknologi Terpilih', 'Spesifikasi & Standar yang Dipersyaratkan'],
            [
                ['Frontend Framework', 'Next.js 15 (App Router) + React 19', 'Server-Side Rendering (SSR), Server Actions, performa kilat, SEO internal terpadu.'],
                ['Bahasa Pemrograman', 'TypeScript 5.7+ Strict Mode', 'Keamanan pengetikan tipe data (type-safety), bebas bug runtime undefined.'],
                ['Styling & UI Tokens', 'Tailwind CSS v4 + Lucide Icons', 'Sistem token warna Kemenhaj (Obsidian, Royal Gold, Emerald, Ivory), responsif mobile.'],
                ['Database Engine', 'PostgreSQL 16+ (Neon Cloud DB)', 'Mendukung serverless connection pooling, JSONB, backup point-in-time recovery.'],
                ['ORM / Query Layer', 'Prisma ORM v6+', 'Type-safe schema modeling, migrasi deklaratif, proteksi mutlak SQL Injection.'],
                ['Autentikasi & Sesi', 'Jose JWT + Web Crypto API', 'Token berbasis HTTP-Only cookies, SameSite=Strict, Secure flags, anti-CSRF/XSS.'],
                ['Kriptografi & Enkripsi', 'Hash-WASM + AES-256-GCM', 'Field-level encryption data sensitif jamaah, blind indexing untuk pencarian aman.'],
                ['Ekspor Laporan', 'jsPDF, jsPDF-AutoTable, SheetJS (XLSX)', 'Generator laporan PDF/Excel langsung di sisi klien/server dengan tata letak resmi.']
            ],
            [22, 28, 50]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 7. BAB V: PENGUJIAN, PENERIMAAN HASIL PEKERJAAN & BAST
    // =========================================================================
    docChildren.push(
        createHeading1('BAB V: PENGUJIAN, PENERIMAAN HASIL PEKERJAAN & BAST'),
        createParagraph('Penyedia wajib mengikuti prosedur penjaminan kualitas mutu dan serah terima hasil pekerjaan yang terstruktur secara ketat:'),

        createHeading2('5.1 User Acceptance Testing (UAT)'),
        createParagraph('UAT dilaksanakan oleh Tim Teknis Kemenag/Kemenhaj bersama perwakilan petugas operasional dari 11 Kabupaten/Kota. UAT menguji seluruh skenario kasus penggunaan (use cases):'),
        createBullet('Pengujian alur pendaftaran dan sinkronisasi porsi jamaah.', '1.'),
        createBullet('Pengujian penandaan status paspor, bio visa, dan penerbitan rekomendasi istitha\'ah medis RSUD.', '2.'),
        createBullet('Pengujian pembagian kelompok regu (Karu), kelompok rombongan (Karom), dan penempatan 4 Kloter Papua.', '3.'),
        createBullet('Pengujian mode tampilan Video Wall NOC pada resolusi layar aula komando.', '4.'),
        createBullet('Pengujian hak akses RBAC: Memastikan akun peran daerah (misal Admin Merauke) tidak dapat mengubah data jamaah di wilayah lain (misal Jayawijaya).', '5.'),

        createHeading2('5.2 Pengujian Keamanan Siber (VAPT OWASP Top 10)'),
        createParagraph('Penyedia wajib melakukan pengujian kerentanan aplikasi (Vulnerability Assessment and Penetration Testing) dengan kriteria kelulusan mutlak:'),
        createBullet('Zero Critical Vulnerability: Tidak ditemukan celah tingkat kritis (SQL Injection, Remote Code Execution, Authentication Bypass).', '•'),
        createBullet('Zero High Vulnerability: Tidak ditemukan celah tingkat tinggi (Broken Access Control, Sensitive Data Exposure, Cross-Site Scripting berisiko tinggi).', '•'),
        createBullet('Laporan Resmi VAPT: Penyedia menyerahkan laporan pengujian VAPT lengkap disertai bukti remediasi (patching) terhadap seluruh temuan.', '•'),

        createHeading2('5.3 Prosedur Serah Terima (BAST I dan BAST II)'),
        createParagraph('Mekanisme penerbitan Berita Acara Serah Terima Pekerjaan dilakukan dalam 2 (dua) tingkatan:'),
        createStyledTable(
            ['Tingkat BAST', 'Prasyarat Penerbitan', 'Luaran / Dokumen Yang Diserahkan', 'Implikasi Hak & Pembayaran'],
            [
                ['BAST Tingkat I (Penyelesaian Fisik 100%)', '• Seluruh fitur lolos uji UAT 100%\n• Lolos audit VAPT keamanan\n• Bimtek operator & admin tuntas', '• Full Source Code & Git Repository\n• System Design Document (SDD)\n• Buku Panduan Admin & User Manual\n• Kredensial Database & Cloud', 'Pencairan pembayaran prestasi pekerjaan sebesar 95% (atau 100% dengan menyerahkan Jaminan Pemeliharaan 5%).'],
                ['BAST Tingkat II (Final Handover Pasca Garansi)', '• Masa garansi 6-12 bulan selesai\n• Kepatuhan penanganan tiket SLA\n• Sistem stabil selama musim haji', '• Laporan Rekapitulasi Pemeliharaan\n• Update patch perbaikan terakhir\n• Berita Acara Evaluasi Kinerja Sistem', 'Pengembalian Jaminan Pemeliharaan (5%) kepada Penyedia dan pelepasan tanggung jawab kontrak formal.']
            ],
            [22, 28, 28, 22]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 8. BAB VI: SERVICE LEVEL AGREEMENT (SLA), JAMINAN & PEMELIHARAAN
    // =========================================================================
    docChildren.push(
        createHeading1('BAB VI: SERVICE LEVEL AGREEMENT (SLA), JAMINAN & PEMELIHARAAN'),
        createParagraph('Selama masa pemeliharaan (maintenance period) dan masa operasional aktif haji 1447 H / 2026 M, Penyedia terikat secara hukum pada Service Level Agreement (SLA) sebagai berikut:'),

        createHeading2('6.1 Matriks Klasifikasi Insiden & Waktu Tanggap SLA'),
        createStyledTable(
            ['Tingkat Keparahan', 'Definisi Masalah', 'Waktu Respons Maksimal', 'Waktu Penyelesaian Solusi'],
            [
                ['Severity 1 (Kritis / Critical)', 'Sistem lumpuh total (down), database corrupt, kebocoran data, atau kegagalan fatal pada hari H keberangkatan kloter.', 'Maksimal 15 - 30 Menit (Dukungan Siaga 24/7)', 'Maksimal 2 Jam Solusi Pulih (Workaround / Permanent Patch).'],
                ['Severity 2 (Mayor / High)', 'Fitur vital tidak dapat digunakan (misal: tombol verifikasi bio visa error, ekspor manifest kloter gagal), sistem masih menyala.', 'Maksimal 1 Jam (Jam Operasional)', 'Maksimal 6 Jam Kerja Operasional.'],
                ['Severity 3 (Minor / Low)', 'Gangguan minor tampilan antarmuka, kesalahan pengetikan teks, bug filter data non-kritis yang memiliki jalur alternatif.', 'Maksimal 4 Jam', 'Maksimal 24 Jam Kerja.']
            ],
            [20, 36, 22, 22]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        createHeading2('6.2 Sanksi Denda Keterlambatan Pemenuhan SLA'),
        createParagraph('Apabila Penyedia gagal memenuhi target waktu penyelesaian insiden kritis (Severity 1) yang disebabkan oleh kesalahan kode atau kelalaian teknis penyedia, dikenakan denda keterlambatan sebesar 1‰ (satu permil) per hari dari nilai jaminan pemeliharaan, serta dapat dipertimbangkan dalam evaluasi reputasi rekanan pemerintah.'),

        createHeading2('6.3 Kepemilikan Hak Kekayaan Intelektual (Hak Cipta 100% Milik Negara)'),
        createParagraph('Seluruh hak kekayaan intelektual (Intellectual Property Rights), hak cipta kode sumber (source code), skema basis data, dan dokumentasi sistem yang dihasilkan dari pengadaan ini adalah MUTLAK MENJADI MILIK KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA. Penyedia dilarang keras menjual kembali, mengklaim lisensi eksklusif, maupun menanamkan logika enkripsi proprietary (vendor lock-in) yang membatasi hak pemerintah untuk mengembangkan sistem di masa depan.'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 9. BAB VII: KETENTUAN PENGAJUAN PENAWARAN & FORMULIR
    // =========================================================================
    docChildren.push(
        createHeading1('BAB VII: KETENTUAN PENGAJUAN PENAWARAN & EVALUASI'),
        createParagraph('Peserta tender yang berminat mengajukan penawaran wajib menyampaikan berkas penawaran yang disusun rapi dalam 3 (tiga) bundel / map terpisah melalui portal SPSE / LPSE:'),

        createHeading2('7.1 Struktur Dokumen Penawaran'),
        createBullet('Dokumen Penawaran Administrasi & Kualifikasi: Memuat surat penawaran bermaterai, NIB, NPWP, bukti KSWP valid, SPT tahunan, akta pendirian, sertifikasi ISO, dan Pakta Integritas.', 'Map A -'),
        createBullet('Dokumen Penawaran Teknis: Memuat pemahaman KAK, metodologi rekayasa Agile, arsitektur sistem, matriks kepatuhan fitur, jadwal kerja WBS, serta CV dan sertifikat keaslian seluruh Tenaga Ahli Inti.', 'Map B -'),
        createBullet('Dokumen Penawaran Biaya: Memuat surat penawaran harga total, rincian biaya langsung personel (remunerasi tenaga ahli per bulan), dan rincian biaya langsung non-personel (server cloud, domain, akomodasi bimtek).', 'Map C -'),

        createHeading2('7.2 Checklist Formulir Kelengkapan Berkas Pengadaan'),
        createStyledTable(
            ['No', 'Uraian Dokumen Persyaratan', 'Bentuk Dokumen', 'Status Wajib'],
            [
                ['1', 'Surat Penawaran Administrasi & Harga', 'Asli bermaterai Rp 10.000 ditandatangani Direktur', 'WAJIB MUTLAK'],
                ['2', 'Nomor Induk Berusaha (NIB) KBLI 62019/62011/62020', 'Salinan NIB OSS RBA terverifikasi', 'WAJIB MUTLAK'],
                ['3', 'Bukti KSWP Valid & SPT Pajak Tahunan Terakhir', 'Tangkapan layar DJP Online & Bukti Penerimaan Elektronik', 'WAJIB MUTLAK'],
                ['4', 'Pakta Integritas Bebas KKN', 'Asli bermaterai Rp 10.000 format resmi LKPP', 'WAJIB MUTLAK'],
                ['5', 'Surat Pernyataan Kesanggupan SLA & Penyerahan Source Code', 'Asli bermaterai pernyataan bebas vendor lock-in', 'WAJIB MUTLAK'],
                ['6', 'Dokumen Metodologi & Rencana Kerja (WBS)', 'Buku Penawaran Teknis Analisis Sistem', 'WAJIB MUTLAK'],
                ['7', 'Daftar Riwayat Hidup & Sertifikat Personel Tenaga Ahli', 'Salinan Ijazah, KTP, Sertifikat PMP/CEH/Cloud resmi', 'WAJIB MUTLAK'],
                ['8', 'Salinan Sertifikat ISO 9001:2015 & ISO 27001:2022', 'Salinan sertifikat akreditasi KAN / Internasional', 'NILAI TAMBAH']
            ],
            [6, 42, 34, 18]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        createCallout('PENUTUP & KONTAK RESMI PANITIA PENGADAAN', 'Dokumen panduan dan persyaratan teknis ini ditetapkan untuk menjadi pedoman bagi seluruh calon penyedia dan panitia pengadaan. Apabila terdapat hal yang memerlukan klarifikasi teknis lebih lanjut, calon penyedia dapat mengajukan pertanyaan melalui forum resmi Aanwijzing pada portal SPSE atau menghubungi Panitia Pengadaan Bidang PHU Kanwil Kemenhaj Papua, Jl. Raya Abepura, Entrop, Distrik Jayapura Selatan, Kota Jayapura.'),

        new Paragraph({ spacing: { before: 200, after: 100 } }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
                new TextRun({
                    text: 'Ditetapkan di : Jayapura\nPada tanggal : 15 Oktober 2026\n\nPejabat Pembuat Komitmen (PPK)\nBidang Penyelenggaraan Haji dan Umrah\nKanwil Kementerian Haji dan Umrah Provinsi Papua\n\n\n\n',
                    size: 20,
                    font: 'Segoe UI'
                }),
                new TextRun({
                    text: '( H. Ahmad Syarifuddin, S.Ag., M.Si. )\n',
                    bold: true,
                    underline: {},
                    size: 20,
                    font: 'Segoe UI'
                }),
                new TextRun({
                    text: 'NIP. 19780315 200501 1 004',
                    bold: true,
                    size: 19,
                    font: 'Segoe UI'
                })
            ]
        })
    );

    // Create the full Document instance with Header and Footer
    const doc = new Document({
        title: 'Dokumen Panduan dan Persyaratan Pengadaan Aplikasi SIAP HAJI PAPUA',
        description: 'Kerangka Acuan Kerja, Persyaratan Teknis, Flowchart Alur Pengadaan, dan SLA Aplikasi SIAP HAJI PAPUA 2026',
        creator: 'Kementerian Haji dan Umrah RI - Kanwil Papua',
        styles: {
            default: {
                document: {
                    run: {
                        font: 'Segoe UI',
                        size: 21,
                        color: COLOR_TEXT
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch
                            bottom: 1440,
                            left: 1440,
                            right: 1440
                        }
                    }
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: 'Kementerian Haji dan Umrah RI • Kanwil Papua | Panduan Pengadaan SIAP HAJI PAPUA v1.0',
                                        italics: true,
                                        size: 16,
                                        color: COLOR_MUTED,
                                        font: 'Segoe UI'
                                    })
                                ]
                            })
                        ]
                    })
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: 'Dokumen Pengadaan Resmi Kedinasan  |  Halaman ',
                                        size: 16,
                                        color: COLOR_MUTED,
                                        font: 'Segoe UI'
                                    }),
                                    PageNumber.CURRENT,
                                    new TextRun({
                                        text: ' dari ',
                                        size: 16,
                                        color: COLOR_MUTED,
                                        font: 'Segoe UI'
                                    }),
                                    PageNumber.TOTAL_PAGES
                                ]
                            })
                        ]
                    })
                },
                children: docChildren
            }
        ]
    });

    const targetFile = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/PANDUAN_DAN_PERSYARATAN_PENGADAAN_APLIKASI_SIAP_HAJI_PAPUA.docx';
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(targetFile, buffer);
    console.log(`Document successfully generated! Saved to: ${targetFile} (Size: ${buffer.length} bytes)`);
}

buildDocument().catch(err => {
    console.error('Error generating document:', err);
    process.exit(1);
});
