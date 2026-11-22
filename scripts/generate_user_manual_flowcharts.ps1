Add-Type -AssemblyName System.Drawing

function Draw-RoundedRectangle {
    param(
        [System.Drawing.Graphics]$g,
        [System.Drawing.Brush]$brush,
        [System.Drawing.Pen]$pen,
        [float]$x, [float]$y, [float]$width, [float]$height, [float]$radius
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2.0
    $path.AddArc($x, $y, $diameter, $diameter, 180.0, 90.0)
    $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270.0, 90.0)
    $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0.0, 90.0)
    $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90.0, 90.0)
    $path.CloseFigure()

    if ($brush -ne $null) { $g.FillPath($brush, $path) }
    if ($pen -ne $null) { $g.DrawPath($pen, $path) }
    $path.Dispose()
}

function Draw-Arrow {
    param(
        [System.Drawing.Graphics]$g,
        [System.Drawing.Color]$color,
        [float]$width,
        [float]$x1, [float]$y1, [float]$x2, [float]$y2
    )
    $pen = New-Object System.Drawing.Pen $color, $width
    $cap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap 6.0, 6.0, $true
    $pen.CustomEndCap = $cap
    $g.DrawLine($pen, $x1, $y1, $x2, $y2)
    $cap.Dispose()
    $pen.Dispose()
}

$diagDir = "d:\8 PROJECT\2026\DEV\KEMENHAJ\siap_haji\docs"
if (!(Test-Path $diagDir)) { New-Item -ItemType Directory -Force -Path $diagDir }

# Standard Fonts
$fontTitle = [System.Drawing.Font]::new("Segoe UI", [float]17, [System.Drawing.FontStyle]::Bold)
$fontSub = [System.Drawing.Font]::new("Segoe UI", [float]10, [System.Drawing.FontStyle]::Regular)
$fontStepNum = [System.Drawing.Font]::new("Segoe UI", [float]11, [System.Drawing.FontStyle]::Bold)
$fontStepTitle = [System.Drawing.Font]::new("Segoe UI", [float]11.5, [System.Drawing.FontStyle]::Bold)
$fontStepDesc = [System.Drawing.Font]::new("Segoe UI", [float]9.2, [System.Drawing.FontStyle]::Regular)
$fontBadge = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Bold)
$fontCardH = [System.Drawing.Font]::new("Segoe UI", [float]10.5, [System.Drawing.FontStyle]::Bold)
$fontCardSub = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Regular)
$fontItem = [System.Drawing.Font]::new("Segoe UI", [float]8.8, [System.Drawing.FontStyle]::Regular)

$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 240, 138))
$darkTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))
$grayTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(71, 85, 105))

# ==============================================================================
# FLOWCHART 1: ALUR OPERASIONAL PENGGUNAAN APLIKASI END-TO-END (1200 x 1450)
# ==============================================================================
$w = 1200
$h = 1450
$bmp1 = New-Object System.Drawing.Bitmap $w, $h
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g1.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g1.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

# Header Banner (Royal Emerald & Obsidian)
$headerBrush1 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(6, 78, 59))
$g1.FillRectangle($headerBrush1, 0, 0, $w, 110)
$headerBrush1.Dispose()

$g1.DrawString("FLOWCHART ALUR OPERASIONAL PENGGUNAAN APLIKASI (END-TO-END)", $fontTitle, $whiteBrush, 50, 22)
$g1.DrawString("SIAP HAJI PAPUA - Siklus Layanan Jamaah dari 11 Kabupaten/Kota hingga Embarkasi Makassar (UPG)", $fontSub, $goldBrush, 50, 62)

$steps1 = @(
    @{
        Num = "01";
        Phase = "PENDAFTARAN & VALIDASI BERKAS FISIK JAMAAH";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Bg = [System.Drawing.Color]::FromArgb(240, 249, 255);
        Border = [System.Drawing.Color]::FromArgb(186, 230, 253);
        Badge = "ADMIN KEMENAG KAB/KOTA";
        Tasks = @(
            "[+] Buka Menu 'Data Jamaah' -> Klik 'Tambah Jamaah' (/jamaah/new)",
            "[+] Input NIK, Nomor Porsi 10 Digit, Nama Lengkap, dan Wilayah Domisili",
            "[+] Verifikasi Berkas Fisik: KTP, Kartu Keluarga, dan Lembar SPPH Asli",
            "[+] Upload Berkas Digital & Simpan ke Basis Data Terenkripsi"
        )
    },
    @{
        Num = "02";
        Phase = "PEMERIKSAAN LAB & PENETAPAN ISTITHA'AH MEDIS RSUD";
        Color = [System.Drawing.Color]::FromArgb(13, 148, 136);
        Bg = [System.Drawing.Color]::FromArgb(240, 253, 250);
        Border = [System.Drawing.Color]::FromArgb(153, 246, 228);
        Badge = "DOKTER PEMERIKSA RSUD";
        Tasks = @(
            "[+] Login Petugas Kesehatan RSUD -> Masuk Menu 'Pemeriksaan Kesehatan'",
            "[+] Input Rekam Medis: Tekanan Darah, Riwayat Penyakit Menular, Hasil Lab",
            "[+] Tetapkan Status Istitha'ah: Memenuhi Syarat (MS) / TMS Sementara / TMS",
            "[+] Catat Vaksinasi Wajib: Meningitis Meningokokus & Polio (Sertifikat ICV)"
        )
    },
    @{
        Num = "03";
        Phase = "VALIDASI PASPOR RI (3 KATA NAMA) & SINKRONISASI BIO VISA";
        Color = [System.Drawing.Color]::FromArgb(180, 83, 9);
        Bg = [System.Drawing.Color]::FromArgb(254, 252, 232);
        Border = [System.Drawing.Color]::FromArgb(254, 240, 138);
        Badge = "ADMIN SEKSI PHU WILAYAH";
        Tasks = @(
            "[+] Akses Tab 'Administrasi' pada Profil Jamaah 360",
            "[+] Verifikasi Nama di Paspor RI (Minimal 3 Kata Sesuai Syarat Arab Saudi)",
            "[+] Cek Masa Berlaku Paspor (Minimal 6 Bulan Sebelum Jadwal Keberangkatan)",
            "[+] Sinkronisasi Rekam Biometrik (Sidik Jari & Wajah via Saudi Visa Bio)"
        )
    },
    @{
        Num = "04";
        Phase = "REKONSILIASI PELUNASAN BPIH & BPS-BPIH";
        Color = [System.Drawing.Color]::FromArgb(109, 40, 217);
        Bg = [System.Drawing.Color]::FromArgb(250, 245, 255);
        Border = [System.Drawing.Color]::FromArgb(233, 213, 255);
        Badge = "OPERATOR SINKRONISASI BPIH";
        Tasks = @(
            "[+] Verifikasi Bukti Setor Lunas Biaya Perjalanan Ibadah Haji (BPIH)",
            "[+] Cocokkan Data Konfirmasi Pelunasan Bank Penerima Setoran (BPS)",
            "[+] Update Status Pelunasan ke 'LUNAS BPIH' pada Sistem SIAP HAJI",
            "[+] Sistem Otomatis Mengunci Kuota Jamaah Siap Berangkat 2026 M"
        )
    },
    @{
        Num = "05";
        Phase = "PENATAAN 4 KLOTER PAPUA, ROMBONGAN (KAROM) & REGU (KARU)";
        Color = [System.Drawing.Color]::FromArgb(29, 78, 216);
        Bg = [System.Drawing.Color]::FromArgb(239, 246, 255);
        Border = [System.Drawing.Color]::FromArgb(191, 219, 254);
        Badge = "PETUGAS KLOTER & KANWIL";
        Tasks = @(
            "[+] Buka Menu 'Manajemen Kloter' (/kloter) -> Pilih Kloter 1, 2, 3, atau 4 UPG",
            "[+] Alokasikan Jamaah Siap Berangkat ke dalam Rombongan & Regu",
            "[+] Tunjuk Ketua Rombongan (Karom) dan Ketua Regu (Karu)",
            "[+] Terbitkan Manifest Resmi Kloter & Cetak Stiker Koper Jamaah"
        )
    },
    @{
        Num = "06";
        Phase = "PENERBITAN SMART HAJJ PASS & INTEGRASI KARTU NUSUK";
        Color = [System.Drawing.Color]::FromArgb(190, 24, 93);
        Bg = [System.Drawing.Color]::FromArgb(253, 242, 248);
        Border = [System.Drawing.Color]::FromArgb(251, 207, 232);
        Badge = "SEKSI LAYANAN JAMAAH";
        Tasks = @(
            "[+] Generate 'Smart Hajj Pass' Digital dengan QR Code Pengenal Terenkripsi",
            "[+] Sinkronisasi Kartu Pintar Nusuk (Akses Hotel Makkah, Tenda Arafah-Mina)",
            "[+] Jamaah dan Keluarga Dapat Mengunduh Kartu via Portal '/portal-jamaah'",
            "[+] Pembagian Gelang Identitas Logam Tahan Karat di Kantor Kemenag Kab/Kota"
        )
    },
    @{
        Num = "07";
        Phase = "MONITORING EMBARKASI MAKASSAR & PUSAT KENDALI OPERASIONAL";
        Color = [System.Drawing.Color]::FromArgb(21, 128, 61);
        Bg = [System.Drawing.Color]::FromArgb(240, 253, 244);
        Border = [System.Drawing.Color]::FromArgb(187, 247, 208);
        Badge = "PIMPINAN & TIM NOC AULA";
        Tasks = @(
            "[+] Pimpinan Memantau Pergerakan Jamaah via 'Video Wall NOC' (/video-wall)",
            "[+] Deteksi Kendala Lapangan via 'Early Warning Engine' & Action Center",
            "[+] Koordinasi dengan PPIH Embarkasi Hasanuddin Makassar (UPG)",
            "[+] Ekspor Laporan Kedinasan Real-Time (PDF/Excel) untuk Pimpinan & Media"
        )
    }
)

$currY = 135
$boxW = 1080
$boxH = 145

for ($i = 0; $i -lt $steps1.Count; $i++) {
    $st = $steps1[$i]
    $stepBgBrush = New-Object System.Drawing.SolidBrush $st.Bg
    $stepBorderPen = New-Object System.Drawing.Pen $st.Border, 1.8
    $primaryBrush = New-Object System.Drawing.SolidBrush $st.Color

    Draw-RoundedRectangle $g1 $stepBgBrush $stepBorderPen 60 $currY $boxW $boxH 10
    $g1.FillRectangle($primaryBrush, 60, $currY, 12, $boxH)

    $circleBrush = New-Object System.Drawing.SolidBrush $st.Color
    $g1.FillEllipse($circleBrush, 90, ($currY + 20), 48, 48)
    $circleBrush.Dispose()
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g1.DrawString($st.Num, $fontStepNum, $whiteBrush, 114, ($currY + 44), $sfCenter)

    $g1.DrawString($st.Phase, $fontStepTitle, $primaryBrush, 155, ($currY + 18))

    $badgeW = 240
    $badgeH = 26
    $badgeBg = New-Object System.Drawing.SolidBrush $st.Color
    $g1.FillRectangle($badgeBg, ($w - 60 - $badgeW - 15), ($currY + 18), $badgeW, $badgeH)
    $g1.DrawString($st.Badge, $fontBadge, $whiteBrush, ($w - 60 - ($badgeW / 2) - 15), ($currY + 31), $sfCenter)
    $badgeBg.Dispose()

    $col1X = 155
    $col2X = 640
    $taskY1 = $currY + 58
    $taskY2 = $currY + 88

    $g1.DrawString($st.Tasks[0], $fontStepDesc, $darkTextBrush, $col1X, $taskY1)
    $g1.DrawString($st.Tasks[1], $fontStepDesc, $darkTextBrush, $col1X, $taskY2)
    $g1.DrawString($st.Tasks[2], $fontStepDesc, $darkTextBrush, $col2X, $taskY1)
    $g1.DrawString($st.Tasks[3], $fontStepDesc, $darkTextBrush, $col2X, $taskY2)

    if ($i -lt ($steps1.Count - 1)) {
        Draw-Arrow $g1 ([System.Drawing.Color]::FromArgb(100, 116, 139)) 2.5 600 ($currY + $boxH) 600 ($currY + $boxH + 32)
    }

    $stepBgBrush.Dispose()
    $stepBorderPen.Dispose()
    $primaryBrush.Dispose()

    $currY += ($boxH + 35)
}

$bmp1.Save("$diagDir\fc_user_1_alur_layanan.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$bmp1.Dispose()
Write-Host "Flowchart User 1 OK"

# ==============================================================================
# FLOWCHART 2: ALUR PERAN PENGGUNA & HAK AKSES (RBAC) (1200 x 980)
# ==============================================================================
$w2 = 1200
$h2 = 980
$bmp2 = New-Object System.Drawing.Bitmap $w2, $h2
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g2.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$hBrush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 41, 59))
$g2.FillRectangle($hBrush2, 0, 0, $w2, 110)
$hBrush2.Dispose()

$g2.DrawString("FLOWCHART ALUR PERAN PENGGUNA & HAK AKSES (RBAC)", $fontTitle, $whiteBrush, 50, 22)
$g2.DrawString("Manajemen Hak Akses & Pembatasan Otorisasi Wilayah Kerja (Row-Level Security) SIAP HAJI PAPUA", $fontSub, $goldBrush, 50, 62)

$roles = @(
    @{
        Title = "SUPER_ADMIN / PROV";
        Sub = "Administrator Utama Kanwil";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Items = @(
            "- Akses Penuh Seluruh 11 Wilayah",
            "- Manajemen Pengguna & Hak Akses",
            "- Konfigurasi Musim & Formula Skor",
            "- Master Wilayah, Bank BPS, RSUD",
            "- Akses Audit Trail Log Immutability",
            "- Ekspor Laporan Rekapitulasi Provinsi"
        )
    },
    @{
        Title = "REGION_ADMIN";
        Sub = "Admin Seksi PHU Kab/Kota";
        Color = [System.Drawing.Color]::FromArgb(180, 83, 9);
        Items = @(
            "- Terkunci Khusus Wilayahnya Sendiri",
            "- Tambah & Edit Data Jamaah Domisili",
            "- Verifikasi Berkas Fisik & Paspor RI",
            "- Sinkronisasi Status Saudi Bio Visa",
            "- Rekonsiliasi Pelunasan BPIH Bank",
            "- Penerbitan Smart Pass Jamaah Daerah"
        )
    },
    @{
        Title = "PETUGAS_KESEHATAN";
        Sub = "Dokter Pemeriksa RSUD";
        Color = [System.Drawing.Color]::FromArgb(13, 148, 136);
        Items = @(
            "- Akses Modul Pemeriksaan Medis",
            "- Input Hasil Lab & Rekam Medis",
            "- Penetapan Status Istitha'ah Medis",
            "- Pencatatan Vaksinasi Meningitis/Polio",
            "- Rujukan Jamaah Risti ke RSUD Provinsi",
            "- Riwayat Alergi & Kebutuhan Khusus"
        )
    },
    @{
        Title = "LEADER & OFFICER";
        Sub = "Pimpinan / Forkopimda / Kloter";
        Color = [System.Drawing.Color]::FromArgb(109, 40, 217);
        Items = @(
            "- Mode Executive Command Center",
            "- Akses Video Wall NOC Aula Rapat",
            "- Simulasi Alokasi Kuota Cadangan",
            "- Penataan Manifest 4 Kloter Papua",
            "- Penunjukan Karom dan Karu Regu",
            "- Cetak Laporan PDF/Excel Kedinasan"
        )
    }
)

$colW = 255
$colH = 430
$startY = 140
$spacing = 20
$startX = 50

for ($c = 0; $c -lt $roles.Count; $c++) {
    $p = $roles[$c]
    $x = $startX + ($c * ($colW + $spacing))

    $cardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $cardBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(226, 232, 240)), 1.5
    Draw-RoundedRectangle $g2 $cardBg $cardBorder $x $startY $colW $colH 8
    $cardBg.Dispose()
    $cardBorder.Dispose()

    $headerBg = New-Object System.Drawing.SolidBrush $p.Color
    Draw-RoundedRectangle $g2 $headerBg $null $x $startY $colW 60 8
    $g2.FillRectangle($headerBg, $x, ($startY + 45), $colW, 15)

    $g2.DrawString($p.Title, $fontCardH, $whiteBrush, ($x + 12), ($startY + 12))
    $g2.DrawString($p.Sub, $fontCardSub, $goldBrush, ($x + 12), ($startY + 34))
    $headerBg.Dispose()

    $itemY = $startY + 75
    foreach ($item in $p.Items) {
        $g2.DrawString($item, $fontItem, $darkTextBrush, (New-Object System.Drawing.RectangleF ($x + 10), $itemY, ($colW - 20), 55))
        $itemY += 56
    }
}

# Bottom Card: Login Flow & Security Principle
$secY = $startY + $colH + 30
$secW = $w2 - 100
$secH = 260
$secBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(241, 245, 249))
$secBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(203, 213, 225)), 2
Draw-RoundedRectangle $g2 $secBg $secBorder 50 $secY $secW $secH 10
$secBg.Dispose()
$secBorder.Dispose()

$fontSecHeader = [System.Drawing.Font]::new("Segoe UI", [float]12, [System.Drawing.FontStyle]::Bold)
$g2.DrawString("MEKANISME LOGIN AMAN, TOKEN JWT & ROW-LEVEL AUTHORIZATION", $fontSecHeader, $darkTextBrush, 75, ($secY + 18))

$secSteps = @(
    @{ Stage = "1. LOGIN & AUTHENTICATION"; Method = "Argon2id Hash + Jose JWT"; Rule = "Pengguna login di /login -> Verifikasi username, password hash Argon2id -> Terbitkan cookie sesi HTTP-Only Secure SameSite."; Color = [System.Drawing.Color]::FromArgb(3, 105, 161) },
    @{ Stage = "2. ROLE & REGION SCOPE"; Method = "Row-Level Authorization"; Rule = "Sistem memeriksa token sesi di server. Jika Region Admin Jayapura, query database otomatis difilter WHERE regionId = 'Jayapura'."; Color = [System.Drawing.Color]::FromArgb(180, 83, 9) },
    @{ Stage = "3. SENSITIVE DATA MASKING"; Method = "AES-256 + Blind Index"; Rule = "Data sensitif (NIK, No Telp) disamarkan (masking) otomatis di tampilan. Hanya Super Admin berwenang melihat data tanpa penyamaran."; Color = [System.Drawing.Color]::FromArgb(21, 128, 61) }
)

$sStepW = 330
$sStepH = 160
$sStepY = $secY + 60
$sSpacing = 30
$sStartX = 75

for ($ss = 0; $ss -lt $secSteps.Count; $ss++) {
    $item = $secSteps[$ss]
    $sx = $sStartX + ($ss * ($sStepW + $sSpacing))

    $boxBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $boxBorder = New-Object System.Drawing.Pen $item.Color, 1.8
    Draw-RoundedRectangle $g2 $boxBg $boxBorder $sx $sStepY $sStepW $sStepH 8

    $tBrush = New-Object System.Drawing.SolidBrush $item.Color

    $fontSHeader = [System.Drawing.Font]::new("Segoe UI", [float]9.5, [System.Drawing.FontStyle]::Bold)
    $fontSMethod = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Bold)
    $fontSRule = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Regular)

    $g2.DrawString($item.Stage, $fontSHeader, $tBrush, ($sx + 12), ($sStepY + 12))
    $g2.DrawString("Metode: " + $item.Method, $fontSMethod, $darkTextBrush, ($sx + 12), ($sStepY + 35))
    $g2.DrawString($item.Rule, $fontSRule, $grayTextBrush, (New-Object System.Drawing.RectangleF ($sx + 12), ($sStepY + 58), ($sStepW - 24), 90))

    if ($ss -lt ($secSteps.Count - 1)) {
        Draw-Arrow $g2 $item.Color 2.0 ($sx + $sStepW + 5) ($sStepY + ($sStepH / 2)) ($sx + $sStepW + $sSpacing - 5) ($sStepY + ($sStepH / 2))
    }

    $boxBg.Dispose()
    $boxBorder.Dispose()
    $tBrush.Dispose()
}

$bmp2.Save("$diagDir\fc_user_2_rbac_peran.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()
Write-Host "Flowchart User 2 OK"

# ==============================================================================
# FLOWCHART 3: EARLY WARNING ENGINE & ACTION CENTER (1200 x 960)
# ==============================================================================
$w3 = 1200
$h3 = 960
$bmp3 = New-Object System.Drawing.Bitmap $w3, $h3
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g3.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g3.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$hBrush3 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(127, 29, 29))
$g3.FillRectangle($hBrush3, 0, 0, $w3, 110)
$hBrush3.Dispose()

$g3.DrawString("FLOWCHART EARLY WARNING ENGINE & ACTION CENTER", $fontTitle, $whiteBrush, 50, 22)
$g3.DrawString("Siklus Deteksi Dini Hambatan Berkas, Pengelompokan Prioritas, dan Alur Kerja Penyelesaian Kendala", $fontSub, $goldBrush, 50, 62)

$phases3 = @(
    @{
        Title = "1. DETEKSI DINI SISTEM";
        Color = [System.Drawing.Color]::FromArgb(220, 38, 38);
        Steps = @(
            "1.1 Engine Evaluasi Otomatis",
            "- Sistem memindai seluruh data jamaah",
            "- Evaluasi aturan tenggat waktu H-30/H-14",
            "1.2 Jenis Peringatan Dini",
            "- Paspor belum terbit / belum diverifikasi",
            "- Pelunasan BPIH belum konfirmasi bank",
            "- Penetapan medis RSUD tertunda",
            "- Bio Visa gagal rekam biometrik"
        )
    },
    @{
        Title = "2. KLASIFIKASI PRIORITAS";
        Color = [System.Drawing.Color]::FromArgb(217, 119, 6);
        Steps = @(
            "2.1 Critical (Merah - Kritis)",
            "- Waktu sisa < 14 hari keberangkatan",
            "- Risiko mutlak gagal berangkat kloter",
            "2.2 Warning (Kuning - Peringatan)",
            "- Waktu sisa 15-30 hari keberangkatan",
            "- Dokumen masih berproses di instansi",
            "2.3 Attention (Biru - Perhatian)",
            "- Berkas pendukung belum lengkap"
        )
    },
    @{
        Title = "3. TINDAK LANJUT ACTION";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Steps = @(
            "3.1 Buka Menu Action Center",
            "- Tinjau daftar kartu masalah per wilayah",
            "3.2 Penugasan Tindak Lanjut",
            "- Tunjuk petugas penanggung jawab",
            "- Tentukan tenggat waktu (deadline)",
            "3.3 Eksekusi di Lapangan",
            "- Petugas mendampingi jamaah ke RSUD",
            "- Koordinasi darurat ke Kantor Imigrasi"
        )
    },
    @{
        Title = "4. RESOLVE & RECALCULATE";
        Color = [System.Drawing.Color]::FromArgb(21, 128, 61);
        Steps = @(
            "4.1 Verifikasi Penyelesaian",
            "- Petugas mengunggah bukti penyelesaian",
            "- Menandai status issue 'RESOLVED'",
            "4.2 Recalculate Readiness",
            "- Klik tombol 'Hitung Ulang Indeks'",
            "- Readiness Score otomatis naik ke 100%",
            "4.3 Tiket Peringatan Ditutup",
            "- Indikator wilayah kembali hijau aman"
        )
    }
)

$colW3 = 255
$colH3 = 540
$startY3 = 140

for ($c = 0; $c -lt $phases3.Count; $c++) {
    $p = $phases3[$c]
    $x = $startX + ($c * ($colW3 + $spacing))

    $cardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $cardBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(226, 232, 240)), 1.5
    Draw-RoundedRectangle $g3 $cardBg $cardBorder $x $startY3 $colW3 $colH3 8
    $cardBg.Dispose()
    $cardBorder.Dispose()

    $headerBg = New-Object System.Drawing.SolidBrush $p.Color
    Draw-RoundedRectangle $g3 $headerBg $null $x $startY3 $colW3 55 8
    $g3.FillRectangle($headerBg, $x, ($startY3 + 40), $colW3, 15)

    $g3.DrawString($p.Title, $fontCardH, $whiteBrush, ($x + 12), ($startY3 + 18))
    $headerBg.Dispose()

    $itemY = $startY3 + 70
    $fontBoldItem = [System.Drawing.Font]::new("Segoe UI", [float]9.0, [System.Drawing.FontStyle]::Bold)

    foreach ($item in $p.Steps) {
        if ($item.StartsWith("1.") -or $item.StartsWith("2.") -or $item.StartsWith("3.") -or $item.StartsWith("4.")) {
            $tColor = New-Object System.Drawing.SolidBrush $p.Color
            $g3.DrawString($item, $fontBoldItem, $tColor, ($x + 10), $itemY)
            $tColor.Dispose()
            $itemY += 28
        } else {
            $g3.DrawString($item, $fontItem, $darkTextBrush, ($x + 10), $itemY)
            $itemY += 24
        }
    }

    if ($c -lt ($phases3.Count - 1)) {
        Draw-Arrow $g3 ([System.Drawing.Color]::FromArgb(148, 163, 184)) 2.5 ($x + $colW3 + 2) ($startY3 + 200) ($x + $colW3 + $spacing - 2) ($startY3 + 200)
    }
}

# Bottom Summary Card: Formula Skor
$formY = $startY3 + $colH3 + 25
$formW = $w3 - 100
$formH = 200
$formBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 242, 242))
$formBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(254, 202, 202)), 2
Draw-RoundedRectangle $g3 $formBg $formBorder 50 $formY $formW $formH 10
$formBg.Dispose()
$formBorder.Dispose()

$fontFormH = [System.Drawing.Font]::new("Segoe UI", [float]11.5, [System.Drawing.FontStyle]::Bold)
$redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 28, 28))
$g3.DrawString("FORMULA BOBOT INDEKS KESIAPAN (READINESS SCORE) & EARLY WARNING LOGIC", $fontFormH, $redBrush, 75, ($formY + 16))
$redBrush.Dispose()

$formRows = @(
    "[1] Komponen Dokumen (Bobot 30%): Paspor RI Valid (3 Kata Nama) + Bio Visa Saudi Tersinkronisasi.",
    "[2] Komponen Kesehatan (Bobot 30%): Penetapan Istitha'ah Medis RSUD (Kategori MS) + Vaksinasi Wajib ICV Lengkap.",
    "[3] Komponen Pelunasan (Bobot 20%): Bukti Setor Lunas BPIH dari BPS-BPIH Terkonfirmasi.",
    "[4] Komponen Manasik & Kloter (Bobot 20%): Kehadiran Manasik min. 80% + Penempatan Kloter Hasanuddin Makassar (UPG)."
)

$formRowY = $formY + 50
foreach ($row in $formRows) {
    $g3.DrawString($row, $fontItem, $darkTextBrush, (New-Object System.Drawing.RectangleF 75, $formRowY, ($formW - 50), 35))
    $formRowY += 32
}

$bmp3.Save("$diagDir\fc_user_3_early_warning.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose()
$bmp3.Dispose()
Write-Host "Flowchart User 3 OK"

# ==============================================================================
# FLOWCHART 4: PORTAL MANDIRI CEK PORSI & VIDEO WALL NOC (1200 x 950)
# ==============================================================================
$w4 = 1200
$h4 = 950
$bmp4 = New-Object System.Drawing.Bitmap $w4, $h4
$g4 = [System.Drawing.Graphics]::FromImage($bmp4)
$g4.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g4.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g4.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$hBrush4 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))
$g4.FillRectangle($hBrush4, 0, 0, $w4, 110)
$hBrush4.Dispose()

$g4.DrawString("FLOWCHART PORTAL MANDIRI CEK PORSI & VIDEO WALL NOC", $fontTitle, $whiteBrush, 50, 22)
$g4.DrawString("Panduan Akses Layanan Publik Calon Jamaah dan Pengoperasian Layar Lebar Aula Komando", $fontSub, $goldBrush, 50, 62)

$modes = @(
    @{
        Title = "JALUR A: CEK PORSI MANDIRI";
        Sub = "Layanan Publik Calon Jamaah";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Steps = @(
            "1. Calon Jamaah Akses /cek-porsi",
            "- Dapat dibuka via Smartphone atau PC",
            "2. Input Nomor Porsi 10 Digit",
            "- Tertera pada lembar bukti pendaftaran",
            "3. Validasi & Query Sistem",
            "- Sistem mencocokkan data SISKOHAT",
            "4. Tampilan Hasil Informasi:",
            "- Nama Lengkap & Kabupaten/Kota Asal",
            "- Estimasi Tahun Keberangkatan (1447H)",
            "- Status Kesiapan: Paspor, Visa, Medis",
            "5. Cetak / Unduh Smart Hajj Pass"
        )
    },
    @{
        Title = "JALUR B: VIDEO WALL NOC";
        Sub = "Layar Komando Aula Kanwil";
        Color = [System.Drawing.Color]::FromArgb(21, 128, 61);
        Steps = @(
            "1. Operator Akses /video-wall",
            "- Hubungkan PC Komando ke Layar 4K",
            "2. Masuk Mode Fullscreen (F11)",
            "- Tampilan Obsidian Emas Kemenhaj",
            "3. Panel Informasi Real-Time:",
            "- Ringkasan Kesiapan 11 Kab/Kota",
            "- Grafik Kesiapan 4 Kloter Papua (UPG)",
            "- Peta Geospasial Distribusi Jamaah",
            "4. Fitur Auto-Refresh 30 Detik",
            "- Pembaruan data tanpa reload manual",
            "5. Alert Visual Saat Ada Isu Kritis"
        )
    }
)

$halfW = 525
$halfH = 500
$startY4 = 140

for ($m = 0; $m -lt $modes.Count; $m++) {
    $p = $modes[$m]
    $x = 60 + ($m * ($halfW + 30))

    $cardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $cardBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(226, 232, 240)), 1.5
    Draw-RoundedRectangle $g4 $cardBg $cardBorder $x $startY4 $halfW $halfH 8
    $cardBg.Dispose()
    $cardBorder.Dispose()

    $headerBg = New-Object System.Drawing.SolidBrush $p.Color
    Draw-RoundedRectangle $g4 $headerBg $null $x $startY4 $halfW 60 8
    $g4.FillRectangle($headerBg, $x, ($startY4 + 45), $halfW, 15)

    $fontColT = [System.Drawing.Font]::new("Segoe UI", [float]11, [System.Drawing.FontStyle]::Bold)
    $g4.DrawString($p.Title, $fontColT, $whiteBrush, ($x + 15), ($startY4 + 12))
    $g4.DrawString($p.Sub, $fontCardSub, $goldBrush, ($x + 15), ($startY4 + 34))
    $headerBg.Dispose()

    $itemY = $startY4 + 75
    $fontItemM = [System.Drawing.Font]::new("Segoe UI", [float]9.5, [System.Drawing.FontStyle]::Regular)
    $fontBoldM = [System.Drawing.Font]::new("Segoe UI", [float]9.8, [System.Drawing.FontStyle]::Bold)

    foreach ($item in $p.Steps) {
        if ($item.StartsWith("1.") -or $item.StartsWith("2.") -or $item.StartsWith("3.") -or $item.StartsWith("4.") -or $item.StartsWith("5.")) {
            $tColor = New-Object System.Drawing.SolidBrush $p.Color
            $g4.DrawString($item, $fontBoldM, $tColor, ($x + 15), $itemY)
            $tColor.Dispose()
            $itemY += 28
        } else {
            $g4.DrawString($item, $fontItemM, $darkTextBrush, ($x + 15), $itemY)
            $itemY += 24
        }
    }
}

# Bottom Summary Card: Integrasi haji.go.id
$intY = $startY4 + $halfH + 30
$intW = $w4 - 120
$intH = 220
$intBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 253, 250))
$intBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(153, 246, 228)), 2
Draw-RoundedRectangle $g4 $intBg $intBorder 60 $intY $intW $intH 10
$intBg.Dispose()
$intBorder.Dispose()

$fontIntH = [System.Drawing.Font]::new("Segoe UI", [float]11.5, [System.Drawing.FontStyle]::Bold)
$tealBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(13, 148, 136))
$g4.DrawString("INTEGRASI RESMI HAJI.GO.ID & KEBIJAKAN TRANSPARANSI DATA PUBLIK", $fontIntH, $tealBrush, 85, ($intY + 16))
$tealBrush.Dispose()

$intRows = @(
    "[1] Akses Satu Pintu haji.go.id: Portal SIAP HAJI PAPUA terintegrasi langsung dengan ekosistem digital Kementerian Haji dan Umrah RI.",
    "[2] Perlindungan Privasi Jamaah: Pengecekan mandiri menggunakan masking pada NIK dan nomor kontak untuk mencegah penyalahgunaan data.",
    "[3] Layanan Ramah Lansia: Antarmuka berukuran font besar, kontras warna tinggi, navigasi sederhana tanpa menu berbelit-belit.",
    "[4] Transparansi Kloter & Jadwal: Memberikan kepastian jadwal manasik, keberangkatan dari bandara lokal Papua, hingga penerbangan ke Jeddah/Madinah."
)

$intRowY = $intY + 50
$fontIntText = [System.Drawing.Font]::new("Segoe UI", [float]9.0, [System.Drawing.FontStyle]::Regular)
foreach ($row in $intRows) {
    $g4.DrawString($row, $fontIntText, $darkTextBrush, (New-Object System.Drawing.RectangleF 85, $intRowY, ($intW - 50), 35))
    $intRowY += 32
}

$bmp4.Save("$diagDir\fc_user_4_cek_porsi_noc.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g4.Dispose()
$bmp4.Dispose()
Write-Host "Flowchart User 4 OK"
