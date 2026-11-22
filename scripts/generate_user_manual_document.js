const fs = require('fs');
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
    PageBreak
} = docx;

// Table styling helper
const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
};

// Color Palette Constants
const COLOR_PRIMARY = '064E3B'; // Deep Forest Emerald
const COLOR_SECONDARY = '0F172A'; // Obsidian Dark
const COLOR_ACCENT = 'B45309'; // Royal Amber Gold
const COLOR_NAVY = '1E3A8A'; // Command Navy
const COLOR_TEXT = '1E293B'; // Charcoal Dark Text
const COLOR_MUTED = '64748B'; // Muted Slate
const COLOR_BG_HEADER = '064E3B'; // Emerald Header
const COLOR_BG_ROW_ALT = 'F8FAFC'; // Light Gray Alt Row

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
                size: options.size || 21,
                color: options.color || COLOR_TEXT,
                font: 'Segoe UI'
            })
        ]
    });
}

function createStep(num, title, description) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 80, line: 260 },
        children: [
            new TextRun({
                text: `Langkah ${num}: ${title} — `,
                bold: true,
                size: 21,
                color: COLOR_PRIMARY,
                font: 'Segoe UI'
            }),
            new TextRun({
                text: description,
                size: 21,
                color: COLOR_TEXT,
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

function createCallout(title, text, borderColor = '059669', bgColor = 'ECFDF5', titleColor = '047857', textColor = '064E3B') {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: borderColor },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: borderColor },
            left: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
            right: { style: BorderStyle.SINGLE, size: 2, color: borderColor },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: bgColor, type: ShadingType.CLEAR },
                        margins: { top: 160, bottom: 160, left: 200, right: 200 },
                        children: [
                            new Paragraph({
                                spacing: { after: 60 },
                                children: [
                                    new TextRun({
                                        text: '  ' + title.toUpperCase(),
                                        bold: true,
                                        size: 21,
                                        color: titleColor,
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
                                        color: textColor,
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

async function buildUserManual() {
    console.log('Building User Manual & Operational Flowcharts Document for SIAP HAJI PAPUA...');

    const logoPath = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/logo-kemenhaj.png';
    const fc1Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_1_alur_layanan.png';
    const fc2Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_2_rbac_peran.png';
    const fc3Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_3_early_warning.png';
    const fc4Path = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/fc_user_4_cek_porsi_noc.png';

    const hasLogo = fs.existsSync(logoPath);
    const hasFc1 = fs.existsSync(fc1Path);
    const hasFc2 = fs.existsSync(fc2Path);
    const hasFc3 = fs.existsSync(fc3Path);
    const hasFc4 = fs.existsSync(fc4Path);

    const docChildren = [];

    // =========================================================================
    // 1. COVER PAGE
    // =========================================================================
    if (hasLogo) {
        docChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 250, after: 180 },
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
            spacing: { before: 80, after: 60 },
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
            spacing: { before: 0, after: 160 },
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
            spacing: { before: 40, after: 180 },
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
            spacing: { before: 180, after: 80 },
            children: [
                new TextRun({
                    text: 'BUKU PANDUAN PENGGUNAAN APLIKASI DAN FLOWCHART OPERASIONAL',
                    bold: true,
                    size: 30,
                    color: COLOR_PRIMARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 120 },
            children: [
                new TextRun({
                    text: 'SIAP HAJI PAPUA v1.0',
                    bold: true,
                    size: 38,
                    color: COLOR_ACCENT,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 260 },
            children: [
                new TextRun({
                    text: 'Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua\nPanduan Pengoperasian Command Center 11 Wilayah, Early Warning Engine, Video Wall NOC, Istitha\'ah RSUD, dan Penataan 4 Kloter Papua',
                    italics: true,
                    size: 20,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 260, after: 40 },
            children: [
                new TextRun({
                    text: 'Kode Dokumen : JUKNIS-OP/PHU-PAPUA/2026/001\nEdisi : Versi 1.0 (Produksi / Operasional Resmi)\nMusim Haji Aktif : 1447 Hijriah / 2026 Masehi\nTarget Pengguna : Super Admin, Petugas Wilayah, Dokter RSUD, Petugas Kloter, Eksekutif & Jamaah',
                    bold: true,
                    size: 20,
                    color: COLOR_TEXT,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 0 },
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
    // 2. LEMBAR PENGESAHAN PETUNJUK OPERASIONAL
    // =========================================================================
    docChildren.push(
        createHeading1('LEMBAR PENGESAHAN PETUNJUK OPERASIONAL'),
        createParagraph('Buku Panduan Penggunaan Aplikasi dan Flowchart Operasional "SIAP HAJI PAPUA v1.0" ini telah diperiksa, diuji coba fungsional, dan disahkan sebagai Petunjuk Teknis Resmi (Standard Operating Procedure / SOP) bagi seluruh aparatur sipil negara, dokter pemeriksa kesehatan, dan petugas haji di lingkungan Kementerian Haji dan Umrah Wilayah Provinsi Papua dan Kantor Kemenag 11 Kabupaten/Kota.'),
        new Paragraph({ spacing: { after: 200 } }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            margins: { top: 140, bottom: 140, left: 140, right: 140 },
                            children: [
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Disusun & Diverifikasi Oleh:\nKepala Bidang PHU Kanwil Papua', bold: true, size: 20, font: 'Segoe UI' })] }),
                                new Paragraph({ spacing: { before: 550, after: 80 } }),
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( H. Ahmad Syarifuddin, S.Ag., M.Si. )\nNIP. 19780315 200501 1 004', bold: true, size: 19, font: 'Segoe UI' })] })
                            ]
                        }),
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            margins: { top: 140, bottom: 140, left: 140, right: 140 },
                            children: [
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Disetujui & Ditetapkan Oleh:\nKepala Kantor Wilayah Kemenhaj Papua', bold: true, size: 20, font: 'Segoe UI' })] }),
                                new Paragraph({ spacing: { before: 550, after: 80 } }),
                                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( Dr. H. Klemens Rumabar, M.Pd. )\nNIP. 19710822 199803 1 002', bold: true, size: 19, font: 'Segoe UI' })] })
                            ]
                        })
                    ]
                })
            ]
        }),
        new Paragraph({ spacing: { after: 200 } }),
        createCallout('PETUNJUK KEBIJAKAN INTEGRITAS DATA', 'Aplikasi SIAP HAJI PAPUA memproses data penting dan dokumen identitas resmi jamaah haji (KTP, NIK, Paspor RI, Rekam Medis, BPIH). Seluruh petugas wajib menjaga kerahasiaan kata sandi (password), tidak meminjamkan akun kepada pihak lain, dan senantiasa melakukan Logout setelah selesai bertugas. Pelanggaran terhadap integritas data dapat dikenakan sanksi sesuai UU ITE dan UU Pelindungan Data Pribadi (UU PDP).'),
        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 3. BAB I: PENDAHULUAN & PENGENALAN SISTEM
    // =========================================================================
    docChildren.push(
        createHeading1('BAB I: PENDAHULUAN & PENGENALAN SISTEM'),
        createHeading2('1.1 Filosofi dan Konsep Sistem'),
        createParagraph('SIAP HAJI PAPUA bukan sekadar sistem pencatatan database biasa, melainkan platform komando digital terpadu (Hajj Provincial Command Center) yang dibangun untuk menjawab tantangan geografis dan koordinasi penyelenggaraan ibadah haji di Provinsi Papua.'),
        createParagraph('Sistem ini menghubungkan seluruh pihak dalam siklus tertutup: MONITOR → IDENTIFY → PRIORITIZE → ACTION → RESOLVE. Dengan prinsip ini, pimpinan kanwil dan petugas daerah dapat memantau secara real-time jamaah yang siap, mendeteksi berkas yang tertunda, dan mengintervensi kendala sebelum jadwal keberangkatan kloter.'),

        createHeading2('1.2 Cakupan 11 Wilayah Kerja & Konsentrasi 4 Kloter'),
        createParagraph('Sistem membagi wilayah operasional ke dalam 11 Kabupaten/Kota yang diberangkatkan terkonsentrasi dalam 4 Kloter melalui Embarkasi Hasanuddin Makassar (UPG):'),
        createStyledTable(
            ['Wilayah Kerja', 'Konsentrasi Kloter', 'Karakteristik Operasional', 'RSUD Pemeriksa Utama'],
            [
                ['Kota Jayapura', 'Kloter 1 & 2 UPG', 'Pusat komando kanwil, populasi jamaah terbesar, bandara transit Sentani.', 'RSUD Dok II Jayapura'],
                ['Kab. Keerom', 'Kloter 2 UPG', 'Wilayah perbatasan darat RI-PNG, monitoring jemaah pelosok perkebunan.', 'RSUD Kwaingga Keerom'],
                ['Kab. Jayapura', 'Kloter 1 UPG', 'Wilayah Sentani & Danau Jayapura, sentra akomodasi transit keberangkatan.', 'RSUD Yowari Kab. Jayapura'],
                ['Kab. Merauke', 'Kloter 3 UPG', 'Sentra Papua Selatan pesisir, pemeriksaan istitha\'ah terpusat RSUD.', 'RSUD Merauke'],
                ['Kab. Boven Digoel', 'Kloter 3 UPG', 'Wilayah pedalaman selatan, percepatan rekam biometrik sidik jari Bio Visa.', 'RSUD Boven Digoel (Tanah Merah)'],
                ['Kab. Asmat', 'Kloter 3 UPG', 'Wilayah perairan sungai & rawa, mobilisasi jemaah via transportasi laut.', 'RSUD Agats Asmat'],
                ['Kab. Mimika', 'Kloter 2 & 4 UPG', 'Sentra ekonomi Timika, pergerakan bandara Mozes Kilangin.', 'RSUD Mimika'],
                ['Kab. Biak Numfor', 'Kloter 4 UPG', 'Wilayah kepulauan Teluk Cenderawasih, penerbangan transit Frans Kaisiepo.', 'RSUD Biak'],
                ['Kab. Kepulauan Yapen', 'Kloter 4 UPG', 'Wilayah kepulauan Serui, pengawalan berkas fisik KTP/SPPH via kapal perintis.', 'RSUD Serui'],
                ['Kab. Nabire', 'Kloter 4 UPG', 'Papua Tengah pesisir, sentra logistik koper dan seragam batik jamaah.', 'RSUD Nabire'],
                ['Kab. Jayawijaya', 'Kloter 4 UPG', 'Pegunungan Tengah (Wamena), pemantauan adaptasi fisik jamaah lansia.', 'RSUD Wamena']
            ],
            [22, 18, 38, 22]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        createHeading2('1.3 Alamat Akses & Kebutuhan Perangkat Sistem'),
        createBullet('Alamat URL Server Publik: https://siap-haji-papua.vercel.app (Tersinkronisasi dengan portal kementerian haji.go.id)', '•'),
        createBullet('Alamat URL Server Lokal / Intranet: http://localhost:3000 (Untuk simulasi offline / posko aula)', '•'),
        createBullet('Peramban Web yang Direkomendasikan: Google Chrome v110+, Microsoft Edge v110+, atau Mozilla Firefox v115+ (Pastikan JavaScript aktif).', '•'),
        createBullet('Spesifikasi Perangkat Minimal: PC/Laptop Intel Core i3 / RAM 4GB, Layar minimal resolusi 1366x768 (atau Full HD 1920x1080 untuk Command Center, 4K untuk Video Wall).', '•'),

        createHeading2('1.4 Matriks Peran Pengguna & Kredensial Pengujian (Demo Mode)'),
        createParagraph('Aplikasi dilengkapi fitur Quick-Login (Mode Demo) pada halaman `/login` untuk memudahkan pengujian operasional tanpa harus mengetik kata sandi manual:'),
        createStyledTable(
            ['Peran Pengguna (Role)', 'Username / Akun', 'Cakupan Hak Akses', 'Modul Utama Yang Diakses'],
            [
                ['Super Admin Komando', 'admin_kanwil', 'Seluruh 11 Wilayah Provinsi Papua (Full Akses)', 'Master Data, Settings, Audit Logs, Command Center, Laporan.'],
                ['Admin Wilayah (Kab/Kota)', 'admin_jayapura\nadmin_merauke', 'Terkunci khusus wilayah kabupaten/kota binaannya', 'Data Jamaah, Berkas Paspor, Bio Visa, BPIH, Smart Hajj Pass.'],
                ['Petugas Kesehatan', 'dokter_rsud', 'Pemeriksaan medis & laboratorium se-Provinsi', 'Pemeriksaan Kesehatan, Penetapan Istitha\'ah MS/TMS, Vaksin ICV.'],
                ['Petugas Kloter', 'petugas_kloter1', 'Manajemen Kloter 1 s.d. 4 UPG Hasanuddin', 'Alokasi Rombongan Karom, Regu Karu, Manifest Kloter, Stiker.'],
                ['Pimpinan Eksekutif', 'kakanwil_papua', 'Read-Only Eksekutif tingkat Provinsi & Pimpinan', 'Executive Dashboard, Video Wall NOC, Early Warning, Simulasi Kuota.']
            ],
            [24, 22, 28, 26]
        ),
        new Paragraph({ spacing: { after: 140 } }),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 4. BAB II: FLOWCHART LENGKAP PENGGUNAAN APLIKASI
    // =========================================================================
    docChildren.push(
        createHeading1('BAB II: FLOWCHART LENGKAP PENGGUNAAN APLIKASI'),
        createParagraph('Bab ini menyajikan 4 (empat) diagram alir (Flowchart) visual lengkap yang memetakan seluruh alur operasional sistem, hak akses peran, deteksi dini masalah, serta pemanfaatan portal publik dan ruang kendali.'),

        createHeading2('2.1 Flowchart 1: Alur Operasional Penggunaan Aplikasi End-to-End'),
        createParagraph('Diagram berikut memetakan perjalanan data dan layanan jamaah dari pendaftaran pertama di pelosok kabupaten/kota hingga keberangkatan via Embarkasi Makassar:')
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
                        text: 'Gambar 2.1: Flowchart Alur Operasional Layanan Jamaah End-to-End (Tahap 01 s.d. 07)',
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
        createParagraph('Uraian Pelaksanaan 7 Tahapan Operasional:'),
        createStep('01', 'Pendaftaran & Berkas Fisik', 'Admin Kemenag Kab/Kota menerima berkas pendaftaran calon jamaah, memvalidasi SPPH, KTP, dan KK, kemudian menginput ke menu Tambah Jamaah (/jamaah/new). Data disimpan ke basis data terenkripsi.'),
        createStep('02', 'Pemeriksaan Medis RSUD', 'Dokter pemeriksa RSUD kabupaten/kota mengakses menu Pemeriksaan Kesehatan (/kesehatan), menginput hasil laboratorium dan menetapkan kategori Istitha\'ah (MS / TMS Sementara / TMS Mutlak) serta mencatat vaksinasi ICV Meningitis & Polio.'),
        createStep('03', 'Paspor & Bio Visa Saudi', 'Admin PHU kabupaten/kota memeriksa nama pada paspor RI (wajib minimal 3 kata nama), memverifikasi masa berlaku minimal 6 bulan, dan menyinkronkan status perekaman biometrik sidik jari Saudi Bio Visa.'),
        createStep('04', 'Rekonsiliasi BPIH Bank', 'Operator memverifikasi bukti setoran lunas Biaya Perjalanan Ibadah Haji (BPIH) dari Bank Penerima Setoran (BPS-BPIH), mengupdate status menjadi Lunas BPIH, dan mengunci kuota keberangkatan aktif.'),
        createStep('05', 'Penataan 4 Kloter Papua', 'Petugas Kloter Kanwil membuka menu Kloter (/kloter), menempatkan jamaah lunas ke dalam 4 Kloter konsentrasi Embarkasi Makassar (UPG), membagi regu (Karu) dan rombongan (Karom), lalu menerbitkan manifest.'),
        createStep('06', 'Smart Pass & Kartu Nusuk', 'Sistem mengenerate kartu digital Smart Hajj Pass ber-QR Code untuk jamaah (/portal-jamaah), disinkronkan dengan smart card Nusuk Kementerian Haji Saudi untuk akses hotel, Mina, dan Arafah.'),
        createStep('07', 'Monitoring NOC & Embarkasi', 'Pimpinan memantau pergerakan kloter, deteksi anomali paspor via Video Wall NOC (/video-wall), dan mengekspor laporan kedinasan resmi (PDF/Excel) untuk Kemenhaj Pusat dan Forkopimda.'),

        new Paragraph({ children: [new PageBreak()] }),

        createHeading2('2.2 Flowchart 2: Alur Peran Pengguna & Hak Akses (RBAC)'),
        createParagraph('Diagram berikut menjelaskan hierarki peran pengguna, proses autentikasi token JWT, dan proteksi isolasi data wilayah (Row-Level Security):')
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
                        text: 'Gambar 2.2: Flowchart Matriks Peran Pengguna, Login JWT, dan Row-Level Authorization',
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
        createParagraph('Prinsip Keamanan Berlapis (Defense in Depth):'),
        createBullet('Row-Level Authorization (RLS): Pembatasan data tidak hanya dilakukan di antarmuka (UI), tetapi dipaksakan di query backend Prisma ORM. Admin Kemenag Merauke secara mutlak tidak dapat membaca atau memanipulasi data jamaah Jayawijaya atau Mimika.', '1.'),
        createBullet('Sensitive Data Masking: Nomor Induk Kependudukan (NIK) dan nomor telepon jamaah disamarkan (contoh: 917101******0003) untuk melindungi privasi sesuai UU PDP No. 27/2022. Pembukaan masking hanya diberikan kepada Super Admin yang memiliki hak otorisasi penuh.', '2.'),
        createBullet('Immutable Audit Trail: Setiap klik login, pembaruan data, penghapusan, dan ekspor laporan dicatat secara permanen di database audit logs dengan mencantumkan ID pengguna, peran, alamat IP, dan waktu peristiwa.', '3.'),

        new Paragraph({ children: [new PageBreak()] }),

        createHeading2('2.3 Flowchart 3: Early Warning Engine & Action Center'),
        createParagraph('Diagram berikut memetakan mekanisme deteksi dini potensi keterlambatan berkas serta alur kerja penugasan tindakan perbaikan:')
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
                        text: 'Gambar 2.3: Flowchart Deteksi Dini Hambatan Berkas, Klasifikasi Prioritas & Action Center',
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
        createParagraph('Logika Penanganan Bottleneck & Hitung Ulang Kesiapan:'),
        createBullet('Pendeteksian Otomatis: Rule Engine mengevaluasi status dokumen jamaah terhadap jadwal keberangkatan. Jika paspor belum terbit dalam rentang H-30 atau belum lunas BPIH, kartu peringatan otomatis muncul.', '•'),
        createBullet('Triase Prioritas Masalah: Masalah diklasifikasikan ke dalam 3 tingkatan: Critical (Merah - waktu < 14 hari), Warning (Kuning - waktu 15-30 hari), dan Attention (Biru - kelengkapan berkas fisik).', '•'),
        createBullet('Penugasan & Resolusi: Petugas ditugaskan mendampingi jamaah ke Imigrasi atau RSUD. Setelah masalah tuntas, petugas mengklik tombol "Hitung Ulang Indeks Kesiapan" (Recalculate) untuk memperbarui skor ke 100%.', '•'),

        new Paragraph({ children: [new PageBreak()] }),

        createHeading2('2.4 Flowchart 4: Portal Mandiri Cek Porsi & Video Wall NOC'),
        createParagraph('Diagram berikut memetakan alur pengecekan porsi mandiri oleh calon jamaah serta pengoperasian display Video Wall NOC di aula komando kanwil:')
    );

    if (hasFc4) {
        docChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 120 },
                children: [
                    new ImageRun({
                        data: fs.readFileSync(fc4Path),
                        transformation: { width: 560, height: 443 },
                        type: 'png'
                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 140 },
                children: [
                    new TextRun({
                        text: 'Gambar 2.4: Flowchart Layanan Publik Cek Porsi Jamaah & Pengoperasian Video Wall NOC Aula',
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
        createParagraph('Fasilitas Unggulan Dua Jalur:'),
        createBullet('Jalur Jamaah (Layanan Publik): Dapat diakses gratis melalui peramban HP/laptop di /cek-porsi. Cukup masukkan nomor porsi 10 digit, sistem langsung menyajikan estimasi tahun keberangkatan, status dokumen, dan tautan Smart Pass.', '•'),
        createBullet('Jalur Pimpinan (Video Wall NOC): Dirancang khusus untuk monitor display ultra-wide / TV 4K aula komando di /video-wall. Menampilkan statistik live 11 kabupaten, grafik kloter, dan auto-refresh setiap 30 detik tanpa reload halaman.', '•'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 5. BAB III: PANDUAN LANGKAH-DEMI-LANGKAH PER MODUL APLIKASI
    // =========================================================================
    docChildren.push(
        createHeading1('BAB III: PANDUAN LANGKAH-DEMI-LANGKAH (SOP) PER MODUL'),
        createParagraph('Bab ini merupakan panduan praktis pengoperasian setiap fitur dan tombol pada aplikasi SIAP HAJI PAPUA:'),

        createHeading2('3.1 Prosedur Masuk Sistem (Login) & Pengenalan Navigasi'),
        createStep('1', 'Buka Halaman Login', 'Arahkan browser ke alamat https://siap-haji-papua.vercel.app/login atau klik tombol "Masuk Command Center" pada halaman beranda.'),
        createStep('2', 'Gunakan Akun Demo atau Kredensial Resmi', 'Untuk keperluan simulasi, Anda dapat langsung mengklik salah satu tombol peran (Super Admin, Admin Jayapura, Dokter RSUD, Petugas Kloter, atau Kakanwil) pada kotak "Uji Coba Cepat (Demo Mode)". Untuk penggunaan resmi, ketik username dan password Anda lalu klik "Masuk ke Sistem".'),
        createStep('3', 'Memahami Tata Letak Navigasi', 'Setelah berhasil login, Anda akan diarahkan ke Dashboard. Di sebelah kiri terdapat Menu Sidebar (Data Jamaah, Administrasi, Kesehatan, Manasik, Kloter, Monitoring, Laporan, dan Pengaturan Sistem). Di sebelah kanan atas terdapat indikator musim haji aktif (1447 H / 2026 M), notifikasi sistem, dan tombol profil/keluar.'),

        createHeading2('3.2 Pengoperasian Modul Data Jamaah Papua 360°'),
        createStep('1', 'Melihat Tabel Data Jamaah (/jamaah)', 'Klik menu "Data Jamaah". Halaman ini menampilkan tabel data seluruh jamaah binaan wilayah Anda dengan informasi Nama, NIK (termasking), Nomor Porsi, Wilayah Asal, Usia, Status Kesiapan, dan Kloter.'),
        createStep('2', 'Menggunakan Filter Wilayah & Status', 'Gunakan filter dropdown di bagian atas tabel untuk menyaring jamaah berdasarkan Kabupaten/Kota, Status Dokumen (Lengkap/Belum), Status Medis (Istitha\'ah/Belum), dan Kloter.'),
        createStep('3', 'Menambahkan Jamaah Baru (/jamaah/new)', 'Klik tombol emas "+ Tambah Jamaah Baru" di pojok kanan atas. Isi formulir: Nomor Porsi (10 digit angka), NIK (16 digit), Nama Lengkap, Tempat & Tanggal Lahir, Jenis Kelamin, Alamat Domisili, Kabupaten/Kota, dan Nomor Telepon. Klik tombol "Simpan Data Jamaah".'),
        createStep('4', 'Membuka Profil Jamaah 360° (/jamaah/[id])', 'Klik nama jamaah pada tabel. Anda akan masuk ke halaman Profil Jamaah 360° yang memiliki 5 tab: (1) Profil Personal, (2) Berkas & Dokumen, (3) Rekam Medis RSUD, (4) Alokasi Kloter & Regu, dan (5) Riwayat Audit.'),

        createHeading2('3.3 Modul Administrasi Dokumen, Paspor & Bio Visa'),
        createStep('1', 'Validasi Berkas Paspor RI', 'Buka tab "Administrasi" atau menu Dokumen. Periksa nomor paspor jamaah, tanggal penerbitan, dan masa kadaluarsa (wajib berlaku minimal 6 bulan setelah tanggal kepulangan haji). Periksa nama paspor: pastikan minimal terdiri dari 3 kata (contoh: "MUHAMMAD YUSUF WAMENA"). Klik tombol hijau "Verifikasi Paspor".'),
        createStep('2', 'Sinkronisasi Status Saudi Bio Visa', 'Periksa apakah jamaah telah menyelesaikan perekaman biometrik via aplikasi Saudi Visa Bio. Jika telah selesai, ubah status menjadi "Bio Visa Tersinkronisasi" dan simpan.'),
        createStep('3', 'Verifikasi Pelunasan BPIH', 'Cek konfirmasi setoran dari Bank Penerima Setoran (BPS-BPIH). Masukkan nomor bukti transaksi dan ubah status pelunasan menjadi "Lunas BPIH". Sistem akan otomatis menaikkan komponen skor kesiapan pelunasan menjadi 100%.'),

        createHeading2('3.4 Modul Pemeriksaan Kesehatan & Istitha\'ah Medis RSUD (Khusus Dokter)'),
        createStep('1', 'Masuk Akun Dokter RSUD', 'Login menggunakan akun Petugas Kesehatan RSUD pemeriksa.'),
        createStep('2', 'Akses Menu Pemeriksaan Kesehatan (/kesehatan)', 'Pilih nama jamaah yang akan diperiksa kesehatannya. Masukkan data tanda vital (Tekanan Darah Sistolik/Diastolik, Gula Darah, Hemoglobin).'),
        createStep('3', 'Tetapkan Status Istitha\'ah Kesehatan', 'Pilih salah satu dari 4 opsi keputusan medis resmi kementerian: (a) Memenuhi Syarat Istitha\'ah Kesehatan (MS), (b) Memenuhi Syarat dengan Pendampingan Obat/Alat, (c) Tidak Memenuhi Syarat Sementara (perlu pengobatan lanjutan), atau (d) Tidak Memenuhi Syarat Mutlak.'),
        createStep('4', 'Catat Vaksinasi Wajib ICV', 'Centang vaksin Meningitis Meningokokus dan Polio setelah jamaah disuntik. Masukkan nomor batch vaksin dan tanggal penyuntikan. Klik "Simpan Rekomendasi Medis".'),

        createHeading2('3.5 Modul Manajemen Kloter, Rombongan (Karom) & Regu (Karu)'),
        createStep('1', 'Membuka Menu Kloter (/kloter)', 'Pilih kloter yang ingin dikelola: Kloter 1 UPG, Kloter 2 UPG, Kloter 3 UPG, atau Kloter 4 UPG.'),
        createStep('2', 'Alokasi Jamaah ke Kloter', 'Pilih daftar jamaah yang telah berstatus "Siap Berangkat" (Readiness Score 100%). Klik tombol "Masukkan ke Kloter Ini".'),
        createStep('3', 'Penataan Rombongan & Regu', 'Setiap kloter dibagi ke dalam 9-10 Rombongan (Karom) dan masing-masing rombongan dibagi ke dalam 4-5 Regu (Karu). Pilih jamaah yang ditunjuk sebagai Ketua Rombongan atau Ketua Regu.'),
        createStep('4', 'Mencetak Manifest & Label Identitas', 'Klik tombol "Cetak Manifest Kloter (PDF)" untuk mencetak lembar manifes resmi berstandar Embarkasi Makassar dan Saudi Airlines.'),

        createHeading2('3.6 Modul Action Center & Penanganan Peringatan Dini'),
        createStep('1', 'Membuka Action Center (/action-center)', 'Menu ini menampilkan seluruh kendala yang terdeteksi otomatis oleh Early Warning Engine.'),
        createStep('2', 'Tinjau Tiket Masalah', 'Klik pada kartu kendala (contoh: "21 Jamaah Jayapura Paspor Belum Terbit H-30").'),
        createStep('3', 'Tugaskan Tindak Lanjut', 'Ketik catatan tindak lanjut, pilih petugas pelaksana di daerah, dan tetapkan batas waktu penyelesaian.'),
        createStep('4', 'Tutup Tiket & Hitung Ulang', 'Setelah berkas selesai diurus di lapangan, ubah status tiket menjadi "Resolved". Terakhir, klik tombol emas "Hitung Ulang Indeks Kesiapan" di pojok kanan atas Dashboard untuk memperbarui skor wilayah.'),

        createHeading2('3.7 Modul Video Wall NOC & Ruang Komando Aula'),
        createStep('1', 'Akses Menu Video Wall (/video-wall)', 'Buka tautan Video Wall pada browser komputer yang tersambung ke TV layar lebar atau proyektor aula komando.'),
        createStep('2', 'Aktifkan Mode Layar Penuh', 'Tekan tombol F11 pada keyboard untuk mengaktifkan tampilan Fullscreen tanpa bilah browser.'),
        createStep('3', 'Fitur Monitoring Otomatis', 'Layar akan memperbarui data statistik 11 wilayah dan progres kloter secara otomatis setiap 30 detik tanpa perlu intervensi operator.'),

        createHeading2('3.8 Modul Ekspor Laporan Kedinasan (/laporan)'),
        createStep('1', 'Pilih Jenis Laporan', 'Tersedia Laporan Rekapitulasi Kesiapan 11 Kab/Kota, Laporan Status Istitha\'ah Medis, Laporan Pelunasan BPIH, dan Manifest Kloter.'),
        createStep('2', 'Pilih Format Ekspor', 'Klik tombol "Ekspor PDF Resmi" untuk mencetak dokumen format portrait/landscape dengan kop resmi dinas, atau klik "Ekspor Excel (XLSX)" untuk mengunduh data mentah tabular untuk analisis spreadsheet.'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 6. BAB IV: PANDUAN PENGGUNAAN LAYANAN PUBLIK (UNTUK WARGA)
    // =========================================================================
    docChildren.push(
        createHeading1('BAB IV: PANDUAN PENGGUNAAN LAYANAN PUBLIK (UNTUK WARGA)'),
        createParagraph('Bagian ini dapat dicetak secara terpisah atau dipublikasikan sebagai panduan mandiri bagi calon jamaah haji Papua dan keluarga:'),

        createHeading2('4.1 Cara Mengecek Estimasi Keberangkatan Porsi Mandiri'),
        createStep('1', 'Akses Portal Cek Porsi', 'Buka browser di ponsel cerdas (HP) atau komputer, lalu ketik alamat: https://siap-haji-papua.vercel.app/cek-porsi'),
        createStep('2', 'Masukkan Nomor Porsi Haji', 'Ketik 10 digit nomor porsi haji Anda (nomor ini tertera pada bukti setoran awal pendaftaran haji di bank atau Kemenag).'),
        createStep('3', 'Klik Tombol "Periksa Porsi Sekarang"', 'Sistem akan memverifikasi nomor porsi Anda langsung ke basis data terpadu.'),
        createStep('4', 'Membaca Informasi Hasil Pengecekan', 'Halaman akan menampilkan: Nama Lengkap Jamaah, Kabupaten/Kota Pendaftaran, Perkiraan Musim Keberangkatan (1447 H / 2026 M), Status Validasi Paspor, Status Rekam Bio Visa, Status Istitha\'ah Medis RSUD, dan Status Pelunasan BPIH.'),

        createHeading2('4.2 Mengunduh Smart Hajj Pass Digital'),
        createParagraph('Jamaah yang telah berstatus siap berangkat dapat mengunduh kartu digital Smart Hajj Pass yang memuat QR Code identitas resmi. Kartu ini dapat disimpan di galeri ponsel atau dicetak sebagai kartu gantung pengenal saat mengikuti manasik dan pelepasan kloter di daerah.'),

        new Paragraph({ spacing: { after: 140 } }),

        createHeading2('4.3 Layanan Informasi & Pengaduan (Helpdesk)'),
        createParagraph('Jika terdapat ketidaksesuaian data (misal: ejaan nama berbeda dengan KTP, nomor telepon berganti, atau belum menerima jadwal pemeriksaan kesehatan di RSUD), jamaah dapat menghubungi Seksi PHU Kemenag Kabupaten/Kota domisili atau mengirim pesan melalui portal pengaduan resmi Kanwil Kemenhaj Papua.'),

        new Paragraph({ children: [new PageBreak()] })
    );

    // =========================================================================
    // 7. BAB V: PANDUAN PENANGANAN MASALAH (TROUBLESHOOTING & FAQ)
    // =========================================================================
    docChildren.push(
        createHeading1('BAB V: PANDUAN PENANGANAN MASALAH (TROUBLESHOOTING & FAQ)'),
        createParagraph('Tabel berikut menyajikan solusi cepat terhadap kendala teknis dan operasional yang paling sering ditemui:'),
        createStyledTable(
            ['Gejala Kendala / Error', 'Penyebab Umum', 'Langkah Solusi Pemecahan Masalah'],
            [
                ['Gagal login ("Kredensial Tidak Valid")', 'Salah mengetik username/password, tombol CapsLock aktif, atau akun dinonaktifkan.', 'Periksa kembali huruf besar/kecil. Jika menggunakan mode demo, klik langsung tombol peran. Jika akun resmi lupa password, hubungi Super Admin Kanwil.'],
                ['Tabel jamaah kosong / tidak muncul data wilayah lain', 'Akun Anda memiliki peran Region Admin (terkunci hanya pada 1 kabupaten binaan).', 'Ini adalah fitur keamanan Row-Level Security resmi. Region Admin hanya berwenang mengelola jamaah di kabupatennya sendiri.'],
                ['Skor Kesiapan belum naik setelah berkas diunggah', 'Indeks kesiapan sistem belum dihitung ulang di cache server.', 'Buka halaman Dashboard atau Action Center, lalu klik tombol emas "Hitung Ulang Indeks Kesiapan" (Recalculate) di pojok kanan atas.'],
                ['Layar Video Wall NOC terpotong atau berantakan', 'Resolusi layar display komputer belum optimal atau bilah browser aktif.', 'Tekan tombol keyboard F11 untuk beralih ke mode Fullscreen. Pastikan resolusi layar PC minimal Full HD (1920x1080) atau 4K.'],
                ['Ekspor PDF Laporan tidak terunduh', 'Fitur pop-up blocker pada peramban web memblokir jendela unduhan otomatis.', 'Izinkan pop-up untuk situs siap-haji-papua.vercel.app pada ikon gembok di sebelah kiri bilah alamat browser, lalu klik tombol ekspor kembali.'],
                ['Status Bio Visa gagal tersinkronisasi', 'Perekaman biometrik pada aplikasi Saudi Visa Bio belum terkonfirmasi sistem kementerian.', 'Pastikan jamaah telah menerima konfirmasi email sukses dari Kedutaan Saudi, lalu lakukan pembaruan status manual di tab Administrasi.']
            ],
            [26, 30, 44]
        ),
        new Paragraph({ spacing: { after: 180 } }),

        createCallout('KONTAK RESMI DUKUNGAN TEKNIS KANWIL PAPUA', 'Tim Helpdesk IT Penyelenggaraan Haji dan Umrah (PHU) Kanwil Kementerian Haji dan Umrah Provinsi Papua standby selama hari kerja dan siaga 24/7 pada musim operasional haji aktif. Alamat: Jl. Raya Abepura, Entrop, Distrik Jayapura Selatan, Kota Jayapura, Papua 99224. Telepon: (0967) 537427 • Email Bantuan: phu.papua@haji.go.id • Portal Informasi: haji.go.id'),

        new Paragraph({ spacing: { before: 200, after: 100 } }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
                new TextRun({
                    text: 'Ditetapkan di : Jayapura\nPada tanggal : 15 Oktober 2026\n\nKepala Bidang Penyelenggaraan Haji dan Umrah\nKanwil Kementerian Haji dan Umrah Provinsi Papua\n\n\n\n',
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

    // Create the full Document instance
    const doc = new Document({
        title: 'Buku Panduan Penggunaan Aplikasi dan Flowchart SIAP HAJI PAPUA',
        description: 'Petunjuk Teknis Operasional, SOP Penggunaan, dan 4 Flowchart Alur Pelayanan Haji Papua 1447 H / 2026 M',
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
                            top: 1440,
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
                                        text: 'Kemenhaj RI • Kanwil Papua | Panduan Penggunaan & SOP SIAP HAJI PAPUA v1.0',
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
                                        text: 'Panduan Penggunaan Aplikasi SIAP HAJI PAPUA  |  Halaman ',
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

    const targetFile = 'd:/8 PROJECT/2026/DEV/KEMENHAJ/siap_haji/docs/BUKU_PANDUAN_PENGGUNAAN_DAN_FLOWCHART_SIAP_HAJI_PAPUA.docx';
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(targetFile, buffer);
    console.log(`User Manual successfully generated! Saved to: ${targetFile} (Size: ${buffer.length} bytes)`);
}

buildUserManual().catch(err => {
    console.error('Error generating User Manual:', err);
    process.exit(1);
});
