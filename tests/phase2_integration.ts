import { prisma } from '../src/infrastructure/database/prisma.client';
import { AuthService } from '../src/application/services/auth.service';
import { DocumentService } from '../src/application/services/document.service';
import { AdministrationService } from '../src/application/services/administration.service';
import { HealthService } from '../src/application/services/health.service';
import { ManasikService } from '../src/application/services/manasik.service';
import { KloterService } from '../src/application/services/kloter.service';
import { WarningService } from '../src/application/services/warning.service';
import { ActionCenterService } from '../src/application/services/action-center.service';
import { ReadinessService } from '../src/application/services/readiness.service';
import { verifySessionToken } from '../src/infrastructure/security/jwt';

async function runPhase2Tests() {
  console.log('🚀 [TEST RUNNER] Menjalankan Pengujian Komprehensif Phase 2 (Operations)...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Autentikasi Pengguna Demo
    console.log('--- 1. Autentikasi Admin Provinsi & Scoped Admin Kab/Kota ---');
    const authProv = await AuthService.login('adminprov', 'AdminPapua2026!');
    assert(Boolean(authProv.token), 'Login Admin Provinsi (adminprov) berhasil');
    const sessionProv = authProv.session;
    assert(sessionProv !== null, 'JWT Session Admin Provinsi tervalidasi');

    const authBiak = await AuthService.login('adminbiak', 'AdminPapua2026!');
    assert(Boolean(authBiak.token), 'Login Admin Biak Numfor (adminbiak) berhasil');
    const sessionBiak = authBiak.session;
    assert(sessionBiak !== null && sessionBiak.regionId !== null, 'Session Admin Biak memiliki regionId scope');

    // 2. Action Center Stats & Categories Check
    console.log('\n--- 2. Action Center: 4 Pilar Operasional & Pipeline Status ---');
    const statsProv = await ActionCenterService.getStats(sessionProv!);
    assert(statsProv.categories.DOKUMEN === 21, `Pilar Dokumen terekam tepat 21 item (aktual: ${statsProv.categories.DOKUMEN})`);
    assert(statsProv.categories.PEMERIKSAAN === 17, `Pilar Pemeriksaan terekam tepat 17 item (aktual: ${statsProv.categories.PEMERIKSAAN})`);
    assert(statsProv.categories.ADMINISTRASI === 19, `Pilar Administrasi terekam tepat 19 item (aktual: ${statsProv.categories.ADMINISTRASI})`);
    assert(statsProv.categories.MANASIK === 8, `Pilar Manasik terekam tepat 8 item (aktual: ${statsProv.categories.MANASIK})`);
    const totalCategorized = statsProv.categories.DOKUMEN + statsProv.categories.PEMERIKSAAN + statsProv.categories.ADMINISTRASI + statsProv.categories.MANASIK;
    assert(totalCategorized === 65, `Total 4 pilar operasional tepat 65 item (aktual: ${totalCategorized})`);
    assert(statsProv.totalOpen >= 60, `Antrean terbuka terkelola aktif: ${statsProv.totalOpen} item`);

    // 3. Early Warning Engine Check
    console.log('\n--- 3. Early Warning Engine: Severity Matrix ---');
    const warningList = await WarningService.listWarnings({}, sessionProv!);
    assert(warningList.items.length > 0, `Peringatan dini terdeteksi: ${warningList.items.length} item aktif`);
    assert(warningList.stats.critical > 0, `Peringatan CRITICAL terdeteksi: ${warningList.stats.critical} kasus`);
    assert(warningList.stats.warning > 0, `Peringatan WARNING terdeteksi: ${warningList.stats.warning} kasus`);

    // 4. Desk Verifikasi Dokumen & Live Readiness Recalculation
    console.log('\n--- 4. Desk Verifikasi Dokumen & Reaktif Skor Kesiapan ---');
    const docItems = await DocumentService.listDocuments({ status: 'DITOLAK' }, sessionProv!);
    assert(docItems.items.length > 0, `Ditemukan ${docItems.items.length} berkas yang ditolak/revisi`);

    const docToVerify = docItems.items[0];
    const initialScore = await prisma.readinessScore.findUnique({ where: { jamaahId: docToVerify.jamaahId } });

    // Verifikasi dokumen tersebut
    const verifiedDoc = await DocumentService.verifyDocument(
      docToVerify.id,
      'VERIFY',
      'Pengujian otomatis: berkas telah dicek dan valid',
      sessionProv!
    );
    assert(verifiedDoc.status === 'TERVERIFIKASI', 'Status berkas berubah menjadi TERVERIFIKASI');

    // Cek Audit Trail
    const latestAudit = await prisma.auditLog.findFirst({
      where: { recordId: docToVerify.id, action: 'VERIFY_DOCUMENT' },
      orderBy: { createdAt: 'desc' },
    });
    assert(latestAudit !== null, 'Audit log Append-Only VERIFY_DOCUMENT berhasil tercatat');

    // Cek Recalculate Readiness Score
    const updatedScore = await prisma.readinessScore.findUnique({ where: { jamaahId: docToVerify.jamaahId } });
    assert(
      (updatedScore?.totalScore || 0) >= (initialScore?.totalScore || 0),
      `Readiness Score terhitung ulang reaktif: ${initialScore?.totalScore} -> ${updatedScore?.totalScore}`
    );

    // 5. Administrasi BPIH Update & Auto-Resolve Action Item
    console.log('\n--- 5. Administrasi BPIH & Auto-Resolve Action Center ---');
    const pendingBpih = await prisma.administrationRecord.findFirst({
      where: { stageName: 'PELUNASAN_BPIH', status: 'PERLU_TINDAK_LANJUT' },
      include: { jamaah: true },
    });
    assert(pendingBpih !== null, 'Ditemukan jamaah dengan status BPIH PERLU_TINDAK_LANJUT');

    if (pendingBpih) {
      await AdministrationService.updateRecord(
        pendingBpih.id,
        {
          status: 'SELESAI',
          amountPaid: 35000000.0,
          paymentReference: 'BSI-TEST-AUTO-2026',
          notes: 'Pelunasan disetujui via pengujian integrasi',
        },
        sessionProv!
      );

      const resolvedAction = await prisma.actionItem.findFirst({
        where: { jamaahId: pendingBpih.jamaahId, category: 'ADMINISTRASI' },
        orderBy: { updatedAt: 'desc' },
      });
      assert(
        resolvedAction?.status === 'RESOLVED',
        'Action item ADMINISTRASI otomatis ter-RESOLVE saat pelunasan BPIH selesai'
      );
    }

    // 6. Monitoring Kesehatan Administratif
    console.log('\n--- 6. Monitoring Kesehatan & Vaksinasi Wajib ---');
    const healthItem = await prisma.healthMonitoring.findFirst({
      include: { jamaah: true },
    });
    assert(healthItem !== null, 'Data monitoring kesehatan tersedia');

    if (healthItem) {
      const updatedHealth = await HealthService.updateRecord(
        healthItem.id,
        {
          istithaahStatus: 'MEMENUHI_SYARAT',
          administrativeStatus: 'SELESAI',
          isVaccineMeningitis: true,
          isVaccinePolio: true,
          notesNonMedical: 'Vaksinasi lengkap dan siap terbang',
        },
        sessionProv!
      );
      assert(updatedHealth.isVaccineMeningitis === true, 'Vaksinasi Meningitis terkonfirmasi');
      assert(updatedHealth.istithaahStatus === 'MEMENUHI_SYARAT', 'Status Istitha\'ah Memenuhi Syarat');
    }

    // 7. Bimbingan Manasik & Simulator Presensi QR
    console.log('\n--- 7. Bimbingan Manasik & Presensi QR Scanner ---');
    const manasikEvents = await ManasikService.listEvents(undefined, sessionProv!);
    assert(manasikEvents.length >= 4, `4 Sesi Manasik tersedia (aktual: ${manasikEvents.length})`);

    const targetJamaah = await prisma.jamaah.findFirst();
    const attendance = await ManasikService.recordAttendance(
      manasikEvents[0].id,
      targetJamaah!.id,
      'HADIR',
      'QR_SCAN',
      sessionProv!
    );
    assert(attendance.status === 'HADIR', 'Presensi metode QR_SCAN berhasil terekam');

    // 8. Kloter Command Center & Manifest Internal
    console.log('\n--- 8. Kloter Command Center & Flight Manifest ---');
    const kloters = await KloterService.listKloters();
    assert(kloters.length === 4, `4 Kloter Papua terdaftar (Kloter 01 - 04)`);

    const kloter01 = await KloterService.getKloterDetail(kloters[0].id);
    assert(kloter01 !== null, 'Detail Kloter 01 berhasil dimuat');
    assert(kloter01!.members.length > 0, `Manifest Kloter 01 terisi: ${kloter01!.members.length} jamaah`);
    assert(kloter01!.officers.length >= 4, `Petugas Kloter 01 terdaftar: ${kloter01!.officers.length} orang (TPHI, TPIHI, TKHI, TPHD)`);

    // 9. Row-Level Authorization (RLA) Scoping Verification
    console.log('\n--- 9. Row-Level Authorization (RLA) Scoping & Boundary Check ---');
    const biakStats = await ActionCenterService.getStats(sessionBiak!);
    assert(
      biakStats.totalOpen < statsProv.totalOpen,
      `RLA Scoping Teruji: Action Item Biak (${biakStats.totalOpen}) < Total Provinsi (${statsProv.totalOpen})`
    );

    // Coba Admin Biak verifikasi dokumen milik Kota Jayapura (harus ditolak RLA)
    const jprDoc = await prisma.jamaahDocument.findFirst({
      where: { jamaah: { region: { code: 'JPR' } } },
    });
    if (jprDoc) {
      let rlaBlocked = false;
      try {
        await DocumentService.verifyDocument(jprDoc.id, 'VERIFY', 'Hacking attempt', sessionBiak!);
      } catch (err: any) {
        if (err.message.includes('Akses ditolak') || err.message.includes('kewenangan')) {
          rlaBlocked = true;
        }
      }
      assert(rlaBlocked, 'RLA Boundary Sukses: Admin Biak DITOLAK saat mencoba verifikasi dokumen Kota Jayapura');
    }

    console.log('\n============================================================');
    console.log(`HASIL AKHIR PENGUJIAN PHASE 2: ${passed} PASS, ${failed} FAIL`);
    console.log('============================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during Phase 2 tests:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
