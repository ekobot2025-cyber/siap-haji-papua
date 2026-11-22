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

# Fonts
$fontTitle = [System.Drawing.Font]::new("Segoe UI", [float]18, [System.Drawing.FontStyle]::Bold)
$fontSub = [System.Drawing.Font]::new("Segoe UI", [float]10, [System.Drawing.FontStyle]::Regular)
$fontStepNum = [System.Drawing.Font]::new("Segoe UI", [float]11, [System.Drawing.FontStyle]::Bold)
$fontStepTitle = [System.Drawing.Font]::new("Segoe UI", [float]12, [System.Drawing.FontStyle]::Bold)
$fontStepDesc = [System.Drawing.Font]::new("Segoe UI", [float]9.5, [System.Drawing.FontStyle]::Regular)
$fontBadge = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Bold)
$fontColTitle = [System.Drawing.Font]::new("Segoe UI", [float]10.5, [System.Drawing.FontStyle]::Bold)
$fontColSub = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Regular)
$fontItem = [System.Drawing.Font]::new("Segoe UI", [float]8.8, [System.Drawing.FontStyle]::Regular)
$fontBoldItem = [System.Drawing.Font]::new("Segoe UI", [float]9.0, [System.Drawing.FontStyle]::Bold)
$fontEvalHeader = [System.Drawing.Font]::new("Segoe UI", [float]12, [System.Drawing.FontStyle]::Bold)
$fontESHeader = [System.Drawing.Font]::new("Segoe UI", [float]9.5, [System.Drawing.FontStyle]::Bold)
$fontESMethod = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Bold)
$fontESRule = [System.Drawing.Font]::new("Segoe UI", [float]8.5, [System.Drawing.FontStyle]::Regular)

$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 240, 138))
$darkTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))
$grayTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(71, 85, 105))

# ==============================================================================
# FLOWCHART 1: SIKLUS LENGKAP PENGADAAN APLIKASI PEMERINTAH
# ==============================================================================
$w = 1200
$h = 1450
$bmp1 = New-Object System.Drawing.Bitmap $w, $h
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g1.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g1.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

# Header Banner
$headerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 58, 138))
$g1.FillRectangle($headerBrush, 0, 0, $w, 110)
$headerBrush.Dispose()

$g1.DrawString("FLOWCHART ALUR PENGADAAN APLIKASI PEMERINTAH", $fontTitle, $whiteBrush, 50, 22)
$g1.DrawString("SIAP HAJI PAPUA - Sesuai Perpres No. 16/2018 jo No. 12/2021 dan Standar SPBE Perpres No. 95/2018", $fontSub, $goldBrush, 50, 62)

$steps1 = @(
    @{
        Num = "01";
        Phase = "PERENCANAAN & PENYUSUNAN DOKUMEN PENGADAAN";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Bg = [System.Drawing.Color]::FromArgb(240, 249, 255);
        Border = [System.Drawing.Color]::FromArgb(186, 230, 253);
        Badge = "PPK / TIM TEKNIS KANWIL";
        Tasks = @(
            "[+] Identifikasi Kebutuhan Sistem & User Requirements 11 Kab/Kota",
            "[+] Penyusunan Kerangka Acuan Kerja (KAK) & Spesifikasi Teknis",
            "[+] Penyusunan Harga Perkiraan Sendiri (HPS / Owner Estimate)",
            "[+] Pemilihan Metode: E-Katalog / Tender Cepat / Seleksi Terbuka"
        )
    },
    @{
        Num = "02";
        Phase = "PERSIAPAN & PENGUMUMAN PEMILIHAN PENYEDIA";
        Color = [System.Drawing.Color]::FromArgb(180, 83, 9);
        Bg = [System.Drawing.Color]::FromArgb(254, 252, 232);
        Border = [System.Drawing.Color]::FromArgb(254, 240, 138);
        Badge = "POKJA PEMILIHAN / LPSE";
        Tasks = @(
            "[+] Reviu KAK, Spesifikasi Teknis, dan HPS bersama PPK",
            "[+] Penetapan Dokumen Pemilihan & Lembar Data Pemilihan (LDP)",
            "[+] Pengumuman Paket Pekerjaan di Portal SPSE / LPSE Kemenag RI",
            "[+] Pendaftaran Penyedia & Pemberian Penjelasan (Aanwijzing)"
        )
    },
    @{
        Num = "03";
        Phase = "PENGAJUAN PENAWARAN & EVALUASI PENYEDIA";
        Color = [System.Drawing.Color]::FromArgb(109, 40, 217);
        Bg = [System.Drawing.Color]::FromArgb(250, 245, 255);
        Border = [System.Drawing.Color]::FromArgb(233, 213, 255);
        Badge = "POKJA / TIM EVALUASI";
        Tasks = @(
            "[+] Pemasukan Dokumen (Administrasi, Kualifikasi, Teknis, Biaya)",
            "[+] Evaluasi Administrasi & Kualifikasi (NIB KBLI, Pajak, ISO 27001)",
            "[+] Evaluasi Teknis: Metodologi, Tenaga Ahli, Demo Mockup/Prototype",
            "[+] Pembuktian Kualifikasi Faktual & Penetapan Calon Pemenang"
        )
    },
    @{
        Num = "04";
        Phase = "PENETAPAN PEMENANG & PENANDATANGANAN KONTRAK";
        Color = [System.Drawing.Color]::FromArgb(15, 118, 110);
        Bg = [System.Drawing.Color]::FromArgb(240, 253, 250);
        Border = [System.Drawing.Color]::FromArgb(153, 246, 228);
        Badge = "PPK & PENYEDIA TERPILIH";
        Tasks = @(
            "[+] Penerbitan Surat Penetapan Pemenang (SPPBJ) & Masa Sanggah",
            "[+] Penyerahan Jaminan Pelaksanaan (5% dari Nilai Kontrak)",
            "[+] Penandatanganan Surat Perjanjian Kontrak Kerja Sama",
            "[+] Surat Perintah Mulai Kerja (SPMK) & Kick-off Meeting"
        )
    },
    @{
        Num = "05";
        Phase = "PELAKSANAAN PENGEMBANGAN SISTEM (AGILE SPRINTS)";
        Color = [System.Drawing.Color]::FromArgb(29, 78, 216);
        Bg = [System.Drawing.Color]::FromArgb(239, 246, 255);
        Border = [System.Drawing.Color]::FromArgb(191, 219, 254);
        Badge = "TIM PENGEMBANG / VENDOR";
        Tasks = @(
            "[+] Inception & Finalisasi Software Requirement Specification (SRS)",
            "[+] Sprint Siklus 1-4: Core Command Center, 11 Wilayah, Bio Visa",
            "[+] Integrasi SISKOHAT, Pelunasan BPIH, Istithaah RSUD, Video Wall",
            "[+] Demo Berkala Mingguan & Sprint Review bersama Tim Pengawas"
        )
    },
    @{
        Num = "06";
        Phase = "PENGUJIAN KETAT (UAT, PERFORMANCE & CYBERSECURITY)";
        Color = [System.Drawing.Color]::FromArgb(190, 24, 93);
        Bg = [System.Drawing.Color]::FromArgb(253, 242, 248);
        Border = [System.Drawing.Color]::FromArgb(251, 207, 232);
        Badge = "TIM PENGUJI & AUDITOR IT";
        Tasks = @(
            "[+] User Acceptance Testing (UAT) komprehensif oleh 11 Kab/Kota",
            "[+] Stress Testing & Load Testing (Simulasi Beban Akses Massal)",
            "[+] Vulnerability Assessment & Penetration Testing (OWASP Top 10)",
            "[+] Remediasi Seluruh Temuan Celah Keamanan (Zero Critical/High)"
        )
    },
    @{
        Num = "07";
        Phase = "SERAH TERIMA, ALIH TEKNOLOGI & MASA GARANSI (SLA)";
        Color = [System.Drawing.Color]::FromArgb(21, 128, 61);
        Bg = [System.Drawing.Color]::FromArgb(240, 253, 244);
        Border = [System.Drawing.Color]::FromArgb(187, 247, 208);
        Badge = "PPK, TIM PENERIMA & VENDOR";
        Tasks = @(
            "[+] Penyerahan Source Code Penuh, DB Schema, CI/CD, Dokumentasi",
            "[+] Bimbingan Teknis (Bimtek) & Transfer Knowledge Admin/Operator",
            "[+] Penandatanganan BAST I (Berita Acara Serah Terima Pekerjaan)",
            "[+] Masa Garansi & Pemeliharaan 6-12 Bulan (SLA P1-P3) -> BAST II"
        )
    }
)

$currY = 135
$boxW = 1080
$boxH = 145
$arrowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(100, 116, 139)), 2.5

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

    $badgeW = 230
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

$bmp1.Save("$diagDir\flowchart_1_siklus_pengadaan.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$bmp1.Dispose()
Write-Host "Flowchart 1 OK"

# ==============================================================================
# FLOWCHART 2: PERSYARATAN & KUALIFIKASI PENYEDIA
# ==============================================================================
$w2 = 1200
$h2 = 980
$bmp2 = New-Object System.Drawing.Bitmap $w2, $h2
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g2.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$hBrush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))
$g2.FillRectangle($hBrush2, 0, 0, $w2, 110)
$hBrush2.Dispose()

$g2.DrawString("MATRIKS PERSYARATAN & VERIFIKASI KUALIFIKASI PENYEDIA", $fontTitle, $whiteBrush, 50, 22)
$g2.DrawString("Kriteria Wajib Kelayakan Vendor Pengembang Aplikasi SIAP HAJI PAPUA", $fontSub, $goldBrush, 50, 62)

$pillars = @(
    @{
        Title = "1. KUALIFIKASI LEGALITAS";
        Sub = "Izin Usaha & Status Pajak";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Items = @(
            "- NIB KBLI 62019 / 62011 / 62020",
            "- NPWP & Status Wajib Pajak Valid (KSWP)",
            "- SPT Tahunan Pajak Tahun Terakhir",
            "- Akta Pendirian & SK Kemenkumham",
            "- Surat Pakta Integritas Resmi",
            "- Bebas Daftar Hitam (Blacklist LKPP)"
        )
    },
    @{
        Title = "2. KAPABILITAS TEKNIS";
        Sub = "Portofolio & Pengalaman";
        Color = [System.Drawing.Color]::FromArgb(180, 83, 9);
        Items = @(
            "- Pengalaman min. 3 th Web Enterprise",
            "- Memiliki min. 1 kontrak sejenis",
            "- Portofolio Sistem Informasi Pemerintahan",
            "- Metodologi Agile & Clean Architecture",
            "- Mitigasi Risiko & Security Safeguard",
            "- Sertifikasi ISO 9001 & ISO 27001"
        )
    },
    @{
        Title = "3. TENAGA AHLI INTI";
        Sub = "Kualifikasi SDM Tim";
        Color = [System.Drawing.Color]::FromArgb(109, 40, 217);
        Items = @(
            "- Project Manager (PMP / SKA Madya)",
            "- Cloud/Solution Architect Bersertifikat",
            "- Senior Full-Stack Engineer (Next.js/TS)",
            "- Database Administrator (PostgreSQL)",
            "- Cybersecurity Specialist (CEH/CISSP)",
            "- UI/UX Designer Human-Centered"
        )
    },
    @{
        Title = "4. PROTOKOL KEAMANAN";
        Sub = "Standar Siber & UU PDP";
        Color = [System.Drawing.Color]::FromArgb(21, 128, 61);
        Items = @(
            "- Kepatuhan UU No. 27/2022 UU PDP",
            "- Enkripsi AES-256 & Masking NIK Otomatis",
            "- Kesiapan Audit Vulnerability / Pentest",
            "- Source Code 100% Hak Milik Negara",
            "- Perjanjian Kerahasiaan Data (NDA)",
            "- SLA Siaga 24/7 Musim Haji Papua"
        )
    }
)

$colW = 255
$colH = 430
$startY = 140
$spacing = 20
$startX = 50

for ($c = 0; $c -lt $pillars.Count; $c++) {
    $p = $pillars[$c]
    $x = $startX + ($c * ($colW + $spacing))

    $cardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $cardBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(226, 232, 240)), 1.5
    Draw-RoundedRectangle $g2 $cardBg $cardBorder $x $startY $colW $colH 8
    $cardBg.Dispose()
    $cardBorder.Dispose()

    $headerBg = New-Object System.Drawing.SolidBrush $p.Color
    Draw-RoundedRectangle $g2 $headerBg $null $x $startY $colW 60 8
    $g2.FillRectangle($headerBg, $x, ($startY + 45), $colW, 15)

    $g2.DrawString($p.Title, $fontColTitle, $whiteBrush, ($x + 12), ($startY + 12))
    $g2.DrawString($p.Sub, $fontColSub, $goldBrush, ($x + 12), ($startY + 34))
    $headerBg.Dispose()

    $itemY = $startY + 75
    foreach ($item in $p.Items) {
        $g2.DrawString($item, $fontItem, $darkTextBrush, (New-Object System.Drawing.RectangleF ($x + 10), $itemY, ($colW - 20), 55))
        $itemY += 56
    }
}

# Bottom Evaluation System Banner
$evalY = $startY + $colH + 30
$evalW = $w2 - 100
$evalH = 260
$evalBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(241, 245, 249))
$evalBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(203, 213, 225)), 2
Draw-RoundedRectangle $g2 $evalBg $evalBorder 50 $evalY $evalW $evalH 10
$evalBg.Dispose()
$evalBorder.Dispose()

$g2.DrawString("ALUR SISTEM EVALUASI & PENENTUAN KELULUSAN (SISTEM NILAI AMBANG BATAS)", $fontEvalHeader, $darkTextBrush, 75, ($evalY + 18))

$evalSteps = @(
    @{ Stage = "TAHAP 1: EVALUASI ADMINISTRASI"; Method = "Sistem Gugur (Pass / Fail)"; Rule = "Memeriksa kelengkapan berkas izin usaha, NIB, pajak, dan pakta integritas. Jika 1 syarat tidak terpenuhi langsung gugur." ; Color = [System.Drawing.Color]::FromArgb(3, 105, 161) },
    @{ Stage = "TAHAP 2: EVALUASI TEKNIS & PRESENTASI"; Method = "Nilai Ambang Batas (Min. 80 Poin)"; Rule = "Penilaian metodologi, kompetensi tenaga ahli, portofolio sistem, arsitektur sistem, dan uji demo prototype." ; Color = [System.Drawing.Color]::FromArgb(180, 83, 9) },
    @{ Stage = "TAHAP 3: EVALUASI HARGA & KLARIFIKASI"; Method = "Kewajaran Biaya & Negosiasi"; Rule = "Evaluasi kewajaran penawaran harga terhadap HPS resmi, pembuktian keaslian sertifikat, dan penetapan pemenang." ; Color = [System.Drawing.Color]::FromArgb(21, 128, 61) }
)

$eStepW = 330
$eStepH = 160
$eStepY = $evalY + 60
$eSpacing = 30
$eStartX = 75

for ($es = 0; $es -lt $evalSteps.Count; $es++) {
    $item = $evalSteps[$es]
    $ex = $eStartX + ($es * ($eStepW + $eSpacing))

    $boxBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $boxBorder = New-Object System.Drawing.Pen $item.Color, 1.8
    Draw-RoundedRectangle $g2 $boxBg $boxBorder $ex $eStepY $eStepW $eStepH 8

    $tBrush = New-Object System.Drawing.SolidBrush $item.Color

    $g2.DrawString($item.Stage, $fontESHeader, $tBrush, ($ex + 12), ($eStepY + 12))
    $g2.DrawString("Metode: " + $item.Method, $fontESMethod, $darkTextBrush, ($ex + 12), ($eStepY + 35))
    $g2.DrawString($item.Rule, $fontESRule, $grayTextBrush, (New-Object System.Drawing.RectangleF ($ex + 12), ($eStepY + 58), ($eStepW - 24), 90))

    if ($es -lt ($evalSteps.Count - 1)) {
        Draw-Arrow $g2 $item.Color 2.0 ($ex + $eStepW + 5) ($eStepY + ($eStepH / 2)) ($ex + $eStepW + $eSpacing - 5) ($eStepY + ($eStepH / 2))
    }

    $boxBg.Dispose()
    $boxBorder.Dispose()
    $tBrush.Dispose()
}

$bmp2.Save("$diagDir\flowchart_2_persyaratan_penyedia.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()
Write-Host "Flowchart 2 OK"

# ==============================================================================
# FLOWCHART 3: SERAH TERIMA, PENGUJIAN & SLA
# ==============================================================================
$w3 = 1200
$h3 = 960
$bmp3 = New-Object System.Drawing.Bitmap $w3, $h3
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g3.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g3.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$hBrush3 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(4, 47, 46))
$g3.FillRectangle($hBrush3, 0, 0, $w3, 110)
$hBrush3.Dispose()

$g3.DrawString("FLOWCHART PENGUJIAN, SERAH TERIMA HASIL PEKERJAAN & SLA", $fontTitle, $whiteBrush, 50, 22)
$g3.DrawString("Tahapan Verifikasi UAT, Uji Keamanan Siber, Transfer Source Code & Penjaminan SLA", $fontSub, $goldBrush, 50, 62)

$phases3 = @(
    @{
        Title = "TAHAP 1: PENGUJIAN KETAT";
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161);
        Steps = @(
            "1.1 User Acceptance Testing (UAT)",
            "- Pengujian fungsi 11 Wilayah & Bio Visa",
            "- Verifikasi hak akses RBAC peran sistem",
            "1.2 Security & Penetration Testing",
            "- Pemindaian kerentanan OWASP Top 10",
            "- Remediasi celah: Zero Critical / High",
            "1.3 Performance & Load Testing",
            "- Simulasi beban puncak pendaftar & portal"
        )
    },
    @{
        Title = "TAHAP 2: SERAH TERIMA KODE & DOK";
        Color = [System.Drawing.Color]::FromArgb(180, 83, 9);
        Steps = @(
            "2.1 Penyerahan Source Code Penuh",
            "- Full Git Repository & Commit History",
            "- Dilarang enkripsi kode sumber vendor",
            "2.2 Dokumentasi Resmi Lengkap",
            "- System Design Document (SDD) & API",
            "- Manual Book Super Admin & Operator",
            "2.3 Akses Cloud & Database",
            "- Kredensial DB Neon, Cloud Run, SSL"
        )
    },
    @{
        Title = "TAHAP 3: BIMTEK & SERAH TERIMA I";
        Color = [System.Drawing.Color]::FromArgb(109, 40, 217);
        Steps = @(
            "3.1 Pelatihan & Transfer Knowledge",
            "- Bimtek Operator & Dokter 11 Wilayah",
            "- Workshop Administrator IT Kanwil",
            "3.2 Berita Acara UAT & Pelatihan",
            "- Penandatanganan BA UAT Tim Teknis",
            "3.3 BAST Tingkat I (Penyelesaian Fisik)",
            "- Penerbitan BAST Pekerjaan Tahap I",
            "- Pembayaran Prestasi Hasil Pekerjaan"
        )
    },
    @{
        Title = "TAHAP 4: MASA GARANSI & SLA";
        Color = [System.Drawing.Color]::FromArgb(21, 128, 61);
        Steps = @(
            "4.1 Pemeliharaan & Monitoring",
            "- Standby operasional haji 1447 H / 2026 M",
            "4.2 Service Level Agreement (SLA)",
            "- Critical (P1): Respon < 30m, Solusi < 2j",
            "- High (P2): Respon < 2j, Solusi < 6j",
            "- Minor (P3): Respon < 4j, Solusi < 24j",
            "4.3 BAST Tingkat II (Final Handover)",
            "- Penyerahan akhir setelah masa garansi"
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

    $g3.DrawString($p.Title, $fontColTitle, $whiteBrush, ($x + 12), ($startY3 + 18))
    $headerBg.Dispose()

    $itemY = $startY3 + 70

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

# Bottom Summary Card: SLA Classification
$slaY = $startY3 + $colH3 + 25
$slaW = $w3 - 100
$slaH = 200
$slaBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 253, 244))
$slaBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(187, 247, 208)), 2
Draw-RoundedRectangle $g3 $slaBg $slaBorder 50 $slaY $slaW $slaH 10
$slaBg.Dispose()
$slaBorder.Dispose()

$fontSlaH = [System.Drawing.Font]::new("Segoe UI", [float]11.5, [System.Drawing.FontStyle]::Bold)
$greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(21, 128, 61))
$g3.DrawString("MATRIKS SERVICE LEVEL AGREEMENT (SLA) & KONSEKUENSI LAYANAN", $fontSlaH, $greenBrush, 75, ($slaY + 16))
$greenBrush.Dispose()

$slaRows = @(
    "[1] Severity 1 (Kritis - Server Down / Database Gangguan): Respon maks 15-30 menit, Solusi maks 2 jam (24/7 Support). Denda 1/1000 per hari jika terlambat.",
    "[2] Severity 2 (Mayor - Fitur Inti Macet / Ekspor Gagal): Respon maks 1 jam, Solusi maks 6 jam pada jam kerja operasional.",
    "[3] Severity 3 (Minor - Bug Tampilan UI / Penyesuaian Minor): Respon maks 4 jam, Solusi maks 24 jam.",
    "[4] Kewajiban Hak Cipta (IPR): Seluruh kode sumber, dokumentasi, dan hak cipta diserahkan 100% tanpa royalti kepada Kementerian/Pemerintah."
)

$slaRowY = $slaY + 50
$fontSlaText = [System.Drawing.Font]::new("Segoe UI", [float]9.0, [System.Drawing.FontStyle]::Regular)
foreach ($row in $slaRows) {
    $g3.DrawString($row, $fontSlaText, $darkTextBrush, (New-Object System.Drawing.RectangleF 75, $slaRowY, ($slaW - 50), 35))
    $slaRowY += 32
}

$bmp3.Save("$diagDir\flowchart_3_serah_terima_uat.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose()
$bmp3.Dispose()
Write-Host "Flowchart 3 OK"
