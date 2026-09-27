import { PrismaClient } from '@prisma/client';
import { hashPassword, encryptData, hashBlindIndex } from '../src/infrastructure/security/crypto';
import { ReadinessEngine } from '../src/domain/rules/readiness.engine';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [SEED] Memulai inisialisasi basis data SIAP HAJI PAPUA...');

  // 1. SYSTEM SETTINGS (INSTITUTION-AGNOSTIC)
  const defaultSettings = [
    { key: 'APP_NAME', value: 'SIAP HAJI PAPUA', group: 'BRANDING', desc: 'Nama resmi aplikasi' },
    { key: 'APP_TAGLINE', value: 'Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap', group: 'BRANDING', desc: 'Slogan sistem' },
    { key: 'ORGANIZER_NAME', value: 'Penyelenggara Haji dan Umrah Provinsi Papua', group: 'GENERAL', desc: 'Nama instansi/penyelenggara (dinamis)' },
    { key: 'ORGANIZER_ADDRESS', value: 'Jl. Raya Abepura - Kotaraja, Kota Jayapura, Papua 99225', group: 'GENERAL', desc: 'Alamat sekretariat' },
    { key: 'CONTACT_EMAIL', value: 'layanan@siaphaji.papua.go.id', group: 'GENERAL', desc: 'Email resmi pengaduan' },
    { key: 'CONTACT_PHONE', value: '(0967) 581-229', group: 'GENERAL', desc: 'Call center komando' },
    { key: 'LOGO_APP_URL', value: '/assets/branding/logo-kemenhaj.png', group: 'BRANDING', desc: 'Ikon aplikasi' },
    { key: 'LOGO_INSTITUTION_URL', value: '/assets/branding/logo-horizontal.svg', group: 'BRANDING', desc: 'Logo horizontal instansi' },
  ];

  for (const s of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { settingKey: s.key },
      update: { settingValue: s.value, description: s.desc },
      create: { settingKey: s.key, settingValue: s.value, settingGroup: s.group, description: s.desc, isPublic: true },
    });
  }
  console.log('✓ System Settings terkonfigurasi (Institution-Agnostic)');

  // 2. MASTER WILAYAH (REGIONS) PAPUA
  const regionsData = [
    { code: 'REG-PAPUA-PROV', name: 'Provinsi Papua', type: 'PROVINSI', lat: -2.5337, lng: 140.7181 },
    { code: 'REG-JPR-KOTA', name: 'Kota Jayapura', type: 'KOTA', lat: -2.5337, lng: 140.7181 },
    { code: 'REG-KEEROM', name: 'Kabupaten Keerom', type: 'KABUPATEN', lat: -3.3100, lng: 140.6100 },
    { code: 'REG-JPR-KAB', name: 'Kabupaten Jayapura', type: 'KABUPATEN', lat: -2.6288, lng: 140.4883 },
    { code: 'REG-MRK', name: 'Kabupaten Merauke', type: 'KABUPATEN', lat: -8.4991, lng: 140.4011 },
    { code: 'REG-BVD', name: 'Kabupaten Boven Digoel', type: 'KABUPATEN', lat: -6.0967, lng: 140.3025 },
    { code: 'REG-ASMAT', name: 'Kabupaten Asmat', type: 'KABUPATEN', lat: -5.4667, lng: 138.3000 },
    { code: 'REG-MMK', name: 'Kabupaten Mimika', type: 'KABUPATEN', lat: -4.5469, lng: 136.8837 },
    { code: 'REG-BIAK', name: 'Kabupaten Biak Numfor', type: 'KABUPATEN', lat: -1.0500, lng: 136.0000 },
    { code: 'REG-YAPEN', name: 'Kabupaten Kepulauan Yapen', type: 'KABUPATEN', lat: -1.7800, lng: 136.2300 },
    { code: 'REG-NBR', name: 'Kabupaten Nabire', type: 'KABUPATEN', lat: -3.3667, lng: 135.4833 },
    { code: 'REG-JWY', name: 'Kabupaten Jayawijaya', type: 'KABUPATEN', lat: -4.0833, lng: 138.9500 },
  ];

  const regionMap = new Map<string, string>();
  for (const r of regionsData) {
    const created = await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name, type: r.type, latitude: r.lat, longitude: r.lng, isActive: true },
      create: { code: r.code, name: r.name, type: r.type, latitude: r.lat, longitude: r.lng, isActive: true },
    });
    regionMap.set(r.code, created.id);
  }
  console.log('✓ Master Wilayah Papua berhasil dimuat (11 Kabupaten/Kota + 1 Provinsi)');

  // 3. MUSIM HAJI (HAJJ SEASONS)
  const season = await prisma.hajjSeason.upsert({
    where: { id: 'season-1447-2026' },
    update: { isActive: true },
    create: {
      id: 'season-1447-2026',
      yearHijri: 1447,
      yearGregorian: 2026,
      seasonName: 'Musim Haji 1447 H / 2026 M',
      quotaTotal: 1080,
      quotaRegular: 1030,
      quotaReserved: 50,
      departureStartDate: new Date('2026-05-10'),
      returnEndDate: new Date('2026-06-25'),
      isActive: true,
    },
  });
  console.log(`✓ Musim Haji Aktif: ${season.seasonName}`);

  // 4. ROLES & DEMO ACCOUNTS
  const rolesData = [
    { code: 'SUPER_ADMIN', name: 'Super Admin Provinsi', desc: 'Akses penuh seluruh modul, keamanan, dan pengaturan sistem' },
    { code: 'PROV_ADMIN', name: 'Admin / Petugas Provinsi', desc: 'Operasional komando dan verifikasi tingkat provinsi' },
    { code: 'REGION_ADMIN', name: 'Admin Kabupaten / Kota', desc: 'Operasional dan verifikasi terbatas pada wilayahnya (RLA Scoped)' },
    { code: 'OFFICER', name: 'Petugas / Kloter', desc: 'Pemantauan checklist jamaah dan bimbingan manasik' },
    { code: 'LEADER', name: 'Pimpinan Eksekutif', desc: 'Executive Monitoring read-only dashboard pimpinan' },
    { code: 'PETUGAS_KESEHATAN', name: 'Petugas Kesehatan Haji', desc: 'Pemeriksaan kesehatan, penetapan istitha’ah, dan vaksinasi jamaah' },
  ];

  const roleMap = new Map<string, string>();
  for (const ro of rolesData) {
    const roleRecord = await prisma.role.upsert({
      where: { code: ro.code },
      update: { name: ro.name, description: ro.desc },
      create: { code: ro.code, name: ro.name, description: ro.desc, isSystemRole: true },
    });
    roleMap.set(ro.code, roleRecord.id);
  }

  // Demo Password for all accounts: AdminPapua2026!
  const defaultHash = await hashPassword('AdminPapua2026!');

  const usersData = [
    {
      username: 'superadmin',
      email: 'superadmin@siaphaji.papua.go.id',
      fullName: 'Super Administrator Provinsi',
      role: 'SUPER_ADMIN',
      regionCode: 'REG-PAPUA-PROV',
    },
    {
      username: 'pimpinan',
      email: 'pimpinan@siaphaji.papua.go.id',
      fullName: 'Kakanwil / Pimpinan Komando',
      role: 'LEADER',
      regionCode: 'REG-PAPUA-PROV',
    },
    {
      username: 'adminprov',
      email: 'admin.prov@siaphaji.papua.go.id',
      fullName: 'Admin Operasional Provinsi',
      role: 'PROV_ADMIN',
      regionCode: 'REG-PAPUA-PROV',
    },
    {
      username: 'petugaskesehatan',
      email: 'petugas.kesehatan@siaphaji.papua.go.id',
      fullName: 'dr. Siti Rahmawati, Sp.PD (Tim Medis Haji)',
      role: 'PETUGAS_KESEHATAN',
      regionCode: 'REG-PAPUA-PROV',
    },
    {
      username: 'adminkotajpr',
      email: 'admin.kotajpr@siaphaji.papua.go.id',
      fullName: 'Admin Wilayah Kota Jayapura',
      role: 'REGION_ADMIN',
      regionCode: 'REG-JPR-KOTA',
    },
    {
      username: 'adminbiak',
      email: 'admin.biak@siaphaji.papua.go.id',
      fullName: 'Admin Wilayah Kab. Biak Numfor',
      role: 'REGION_ADMIN',
      regionCode: 'REG-BIAK',
    },
    {
      username: 'petugaskloter',
      email: 'petugas01@siaphaji.papua.go.id',
      fullName: 'H. Abdul Karim, S.Ag (Ketua Kloter 01)',
      role: 'OFFICER',
      regionCode: 'REG-JPR-KOTA',
    },
  ];

  for (const u of usersData) {
    const regionId = regionMap.get(u.regionCode);
    const roleId = roleMap.get(u.role)!;

    const userRecord = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        fullName: u.fullName,
        email: u.email,
        regionId,
        passwordHash: defaultHash,
        isActive: true,
      },
      create: {
        username: u.username,
        email: u.email,
        fullName: u.fullName,
        passwordHash: defaultHash,
        regionId,
        isActive: true,
      },
    });

    // Assign Role
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: userRecord.id, roleId } },
      update: {},
      create: { userId: userRecord.id, roleId },
    });
  }
  console.log('✓ 6 Akun Demo Berhasil Dibuat (Password: AdminPapua2026!)');

  // 5. READINESS ENGINE RULES (CONFIGURABLE FOR 1447H / 2026M)
  const defaultRules = [
    { componentCode: 'IDENTITAS', name: 'Identitas & Biodata', weightPercentage: 10.0, evaluationLogic: 'EVAL_IDENTITY', sortOrder: 1 },
    { componentCode: 'ADMINISTRASI', name: 'Administrasi & Keuangan (BPIH)', weightPercentage: 20.0, evaluationLogic: 'EVAL_ADMIN', sortOrder: 2 },
    { componentCode: 'DOKUMEN', name: 'Kelengkapan Dokumen (Paspor/Visa)', weightPercentage: 20.0, evaluationLogic: 'EVAL_DOCS', sortOrder: 3 },
    { componentCode: 'KESEHATAN', name: 'Pemeriksaan Kesehatan & Istitha\'ah', weightPercentage: 20.0, evaluationLogic: 'EVAL_HEALTH', sortOrder: 4 },
    { componentCode: 'MANASIK', name: 'Bimbingan Manasik Haji', weightPercentage: 15.0, evaluationLogic: 'EVAL_MANASIK', sortOrder: 5 },
    { componentCode: 'KLOTER', name: 'Penempatan Kloter & Rombongan', weightPercentage: 15.0, evaluationLogic: 'EVAL_KLOTER', sortOrder: 6 },
  ];

  for (const r of defaultRules) {
    await prisma.readinessRule.upsert({
      where: { seasonId_componentCode: { seasonId: season.id, componentCode: r.componentCode } },
      update: { weightPercentage: r.weightPercentage, name: r.name, sortOrder: r.sortOrder, isActive: true },
      create: {
        seasonId: season.id,
        componentCode: r.componentCode,
        name: r.name,
        weightPercentage: r.weightPercentage,
        evaluationLogic: r.evaluationLogic,
        sortOrder: r.sortOrder,
        isActive: true,
      },
    });
  }
  console.log('✓ Aturan Readiness Engine terkonfigurasi (Total Bobot: 100%)');

  // 6. SEED 200 SYNTHETIC JAMAAH (DATA DEMO)
  console.log('⏳ Mengenerate 200 data jamaah sintetis dengan enkripsi & blind index...');

  const firstNamesMale = ['Ahmad', 'Muhammad', 'Abdul', 'Ali', 'Yusuf', 'Ibrahim', 'Umar', 'Hasan', 'Faisal', 'Zulkifli', 'Bambang', 'Slamet', 'Agus', 'Wahyudi', 'Arif', 'Basuki', 'Daud', 'Ismail', 'Ridwan', 'Mansur'];
  const firstNamesFemale = ['Siti', 'Fatimah', 'Nur', 'Aisyah', 'Aminah', 'Khadijah', 'Zahra', 'Mariam', 'Halimah', 'Dewi', 'Sri', 'Rahayu', 'Fitri', 'Salma', 'Rukmini', 'Kartini', 'Haryati', 'Nurul', 'Indah', 'Rohani'];
  const lastNames = ['Papare', 'Tabuni', 'Kogoya', 'Rumbiak', 'Mansoben', 'Rumkabu', 'Wanimbo', 'Wenda', 'Subarjo', 'Pratama', 'Hidayat', 'Kurniawan', 'Saputra', 'Al-Habsyi', 'Siregar', 'Harahap', 'Nasution', 'Kusuma', 'Santoso', 'Wijaya'];

  const districts = ['Jayapura Utara', 'Jayapura Selatan', 'Abepura', 'Heram', 'Muara Tami', 'Sentani', 'Sentani Timur', 'Biak Kota', 'Samofa', 'Yendidori', 'Arso', 'Skanto'];

  const availableRegions = [
    regionMap.get('REG-JPR-KOTA')!,
    regionMap.get('REG-JPR-KAB')!,
    regionMap.get('REG-BIAK')!,
    regionMap.get('REG-KEEROM')!,
    regionMap.get('REG-MRK')!,
    regionMap.get('REG-MMK')!,
    regionMap.get('REG-BVD')!,
    regionMap.get('REG-ASMAT')!,
    regionMap.get('REG-YAPEN')!,
    regionMap.get('REG-NBR')!,
    regionMap.get('REG-JWY')!,
  ];

  // Distribution weights: Kota Jayapura ~40%, Kab Jayapura ~20%, Biak ~15%, Keerom ~10%, etc.
  const rulesForEngine = defaultRules.map((r) => ({
    componentCode: r.componentCode,
    name: r.name,
    weightPercentage: r.weightPercentage,
    isActive: true,
  }));

  // 7. PHASE 2: DOKUMEN TYPES & DOKUMEN JAMAAH
  console.log('⏳ Menyiapkan master jenis dokumen dan 200 berkas jamaah...');
  const docTypesData = [
    { code: 'PASPOR', name: 'Paspor RI (Berlaku Min. 6 Bulan)', isRequired: true, sortOrder: 1 },
    { code: 'VISA', name: 'Visa Haji Arab Saudi', isRequired: true, sortOrder: 2 },
    { code: 'KTP', name: 'KTP Elektronik Domisili Papua', isRequired: true, sortOrder: 3 },
    { code: 'KK', name: 'Kartu Keluarga (KK)', isRequired: true, sortOrder: 4 },
    { code: 'FOTO', name: 'Pasfoto Haji (Latar Putih 80% Wajah)', isRequired: true, sortOrder: 5 },
    { code: 'VAKSIN', name: 'Sertifikat Vaksinasi Meningitis Internasional', isRequired: true, sortOrder: 6 },
  ];

  const docTypeMap = new Map<string, string>();
  for (const dt of docTypesData) {
    const created = await prisma.documentType.upsert({
      where: { code: dt.code },
      update: { name: dt.name, isRequired: dt.isRequired, sortOrder: dt.sortOrder },
      create: { code: dt.code, name: dt.name, isRequired: dt.isRequired, sortOrder: dt.sortOrder },
    });
    docTypeMap.set(dt.code, created.id);
  }

  // 8. PHASE 2: KLOTER & GROUPS
  console.log('⏳ Menyiapkan 4 Kloter Papua dan pembagian Regu/Rombongan...');
  const kloterData = [
    { number: 1, code: 'UPG-01', embarkation: 'Embarkasi Hasanuddin Makassar (UPG)', airline: 'Garuda Indonesia', flight: 'GA-1101', capacity: 360, status: 'SIAP' },
    { number: 2, code: 'UPG-02', embarkation: 'Embarkasi Hasanuddin Makassar (UPG)', airline: 'Garuda Indonesia', flight: 'GA-1102', capacity: 360, status: 'SIAP' },
    { number: 3, code: 'UPG-03', embarkation: 'Embarkasi Hasanuddin Makassar (UPG)', airline: 'Saudia Airlines', flight: 'SV-5501', capacity: 360, status: 'PERSIAPAN' },
    { number: 4, code: 'UPG-04', embarkation: 'Embarkasi Hasanuddin Makassar (UPG)', airline: 'Saudia Airlines', flight: 'SV-5502', capacity: 360, status: 'PERSIAPAN' },
  ];

  await prisma.officer.deleteMany({});
  await prisma.group.deleteMany({});

  const kloterMap = new Map<number, string>();
  for (const k of kloterData) {
    const depDate = new Date('2026-05-12T08:00:00Z');
    depDate.setDate(depDate.getDate() + (k.number - 1) * 3);
    const dormDate = new Date(depDate);
    dormDate.setDate(dormDate.getDate() - 1);
    const retDate = new Date(depDate);
    retDate.setDate(retDate.getDate() + 40);

    const createdK = await prisma.kloter.upsert({
      where: { kloterCode: k.code },
      update: {
        capacityTotal: k.capacity,
        airlineName: k.airline,
        flightNumber: k.flight,
        status: k.status,
      },
      create: {
        seasonId: season.id,
        kloterNumber: k.number,
        kloterCode: k.code,
        embarkationName: k.embarkation,
        airlineName: k.airline,
        flightNumber: k.flight,
        capacityTotal: k.capacity,
        dormitoryInDate: dormDate,
        flightDepartureDate: depDate,
        flightReturnDate: retDate,
        status: k.status,
      },
    });
    kloterMap.set(k.number, createdK.id);

    // Create Rombongan 1-4 & Regu 1-4 for each Kloter
    for (let r = 1; r <= 4; r++) {
      await prisma.group.create({
        data: {
          kloterId: createdK.id,
          groupType: 'ROMBONGAN',
          groupNumber: r,
          name: `Rombongan ${r} Kloter ${k.code}`,
        },
      });
    }

    // Create 4 Official Kloter Officers (TPHI, TPIHI, TKHI, TPHD)
    const officerRoles = [
      { role: 'TPHI', name: `H. Ahmad Zarkasi, S.Ag (Ketua Kloter ${k.code})`, phone: '08114800101' },
      { role: 'TPIHI', name: `Drs. H. Syarifuddin, M.Pd (Pembimbing Ibadah ${k.code})`, phone: '08114800102' },
      { role: 'TKHI', name: `dr. Sarah Wulandari, Sp.PD (Dokter Kloter ${k.code})`, phone: '08114800103' },
      { role: 'TPHD', name: `H. M. Mansyur (Pelayanan Umum & Akomodasi ${k.code})`, phone: '08114800104' },
    ];

    const petugaskloterUser = await prisma.user.findFirst({ where: { username: 'petugaskloter' } });

    for (let oIdx = 0; oIdx < officerRoles.length; oIdx++) {
      const off = officerRoles[oIdx];
      await prisma.officer.create({
        data: {
          seasonId: season.id,
          kloterId: createdK.id,
          fullName: off.name,
          roleType: off.role,
          phoneEncrypted: encryptData(off.phone),
          status: 'ACTIVE',
          userId: (k.number === 1 && oIdx === 0 && petugaskloterUser) ? petugaskloterUser.id : undefined,
        },
      });
    }
  }

  // 9. PHASE 2: MANASIK EVENTS
  console.log('⏳ Menyiapkan Bimbingan Manasik dan jadwal terpadu...');
  const manasikList = [
    { title: 'Manasik Tingkat Distrik/KUA Sesi 1: Fiqih Ibadah Haji & Thaharah', session: 1, date: new Date('2026-03-10'), reg: 'REG-JPR-KOTA', timeStart: '08:30', timeEnd: '12:00', loc: 'Masjid Raya Baiturrahim Jayapura', speaker: 'Drs. H. Syamsuddin, M.Ag' },
    { title: 'Manasik Tingkat Distrik/KUA Sesi 2: Rukun, Wajib, dan Larangan Ihram', session: 2, date: new Date('2026-03-24'), reg: 'REG-JPR-KOTA', timeStart: '08:30', timeEnd: '12:00', loc: 'Masjid Raya Baiturrahim Jayapura', speaker: 'H. Abdul Rasyid, Lc' },
    { title: 'Manasik Tingkat Kabupaten/Kota Sesi 3: Kebijakan Pemerintah & Layanan Saudi', session: 3, date: new Date('2026-04-05'), reg: 'REG-JPR-KOTA', timeStart: '09:00', timeEnd: '14:00', loc: 'Aula Asrama Haji Kotaraja Jayapura', speaker: 'Kabid Penyelenggaraan Haji Papua' },
    { title: 'Praktik Lapangan & Manasik Massal Sesi 4: Simulasi Tawaf, Sa\'i & Lempar Jamrah', session: 4, date: new Date('2026-04-18'), reg: 'REG-JPR-KOTA', timeStart: '07:30', timeEnd: '13:00', loc: 'Stadion Mandala Kota Jayapura', speaker: 'Tim Pembimbing Ibadah Kloter' },
    { title: 'Manasik Terpadu Biak Numfor Sesi 1 & 2', session: 1, date: new Date('2026-03-15'), reg: 'REG-BIAK', timeStart: '08:30', timeEnd: '14:00', loc: 'Gedung Kemenag Biak', speaker: 'Ustadz H. Marwan' },
  ];

  await prisma.manasikAttendance.deleteMany({});
  await prisma.manasikEvent.deleteMany({});

  const manasikMap = new Map<number, string>();
  for (let idx = 0; idx < manasikList.length; idx++) {
    const m = manasikList[idx];
    const event = await prisma.manasikEvent.create({
      data: {
        seasonId: season.id,
        regionId: regionMap.get(m.reg) || availableRegions[0],
        title: m.title,
        sessionNumber: m.session,
        eventDate: m.date,
        startTime: m.timeStart,
        endTime: m.timeEnd,
        location: m.loc,
        speakerName: m.speaker,
        topicDescription: 'Materi bimbingan manasik resmi Provinsi Papua.',
        isActive: true,
      },
    });
    manasikMap.set(idx + 1, event.id);
  }

  // 10. PHASE 2: WARNING RULES & ACTION ITEMS
  console.log('⏳ Menyiapkan aturan Early Warning Engine...');
  const warningRulesData = [
    { code: 'CRIT_DEPART_DOC', name: 'Keberangkatan Kritis: Paspor / Visa Belum Lengkap', severity: 'CRITICAL', desc: 'Keberangkatan < 14 hari tetapi paspor atau visa belum terverifikasi' },
    { code: 'CRIT_HEALTH_ISTITHAAH', name: 'Kesehatan Kritis: Istitha\'ah Belum Memenuhi', severity: 'CRITICAL', desc: 'Pemeriksaan tahap 2 atau vaksin wajib belum selesai menjelang keberangkatan' },
    { code: 'WARN_READINESS_LOW', name: 'Kesiapan Lambat: Indeks Kesiapan < 80%', severity: 'WARNING', desc: 'Sisa waktu < 30 hari tetapi capaian kesiapan masih di bawah batas aman' },
    { code: 'ATTN_DOC_PENDING', name: 'Menunggu Verifikasi: Dokumen Belum Diproses > 5 Hari', severity: 'ATTENTION', desc: 'Berkas paspor/KTP telah diunggah tetapi belum divalidasi verifikator' },
    { code: 'ATTN_MANASIK_ABSENT', name: 'Presensi Manasik: Absen Lebih dari 2 Sesi', severity: 'ATTENTION', desc: 'Jamaah belum menghadiri minimal bimbingan wajib' },
  ];

  const ruleMap = new Map<string, string>();
  for (const wr of warningRulesData) {
    const createdRule = await prisma.warningRule.upsert({
      where: { ruleCode: wr.code },
      update: { name: wr.name, severity: wr.severity, description: wr.desc },
      create: {
        ruleCode: wr.code,
        name: wr.name,
        severity: wr.severity,
        conditionExpression: JSON.stringify({ code: wr.code }),
        description: wr.desc,
        isActive: true,
      },
    });
    ruleMap.set(wr.code, createdRule.id);
  }

  // Clean old demo jamaah for clean re-run
  await prisma.actionItem.deleteMany({});
  await prisma.warningEvent.deleteMany({});
  await prisma.manasikAttendance.deleteMany({});
  await prisma.healthMonitoring.deleteMany({});
  await prisma.administrationRecord.deleteMany({});
  await prisma.documentVerification.deleteMany({});
  await prisma.jamaahDocument.deleteMany({});
  await prisma.kloterMember.deleteMany({});
  await prisma.readinessScore.deleteMany({ where: { seasonId: season.id } });
  await prisma.jamaah.deleteMany({ where: { seasonId: season.id } });

  // Get Super Admin, Prov Admin, and Jamaah Demo IDs for task assignments
  const adminUser = await prisma.user.findFirst({ where: { username: 'superadmin' } });
  const provUser = await prisma.user.findFirst({ where: { username: 'adminprov' } });
  const jamaahUser = await prisma.user.findFirst({ where: { username: 'jamaahdemo' } });

  let docIncompleteCount = 0;
  let healthIncompleteCount = 0;
  let adminIncompleteCount = 0;
  let manasikIncompleteCount = 0;

  for (let i = 1; i <= 200; i++) {
    const isMale = i % 2 === 0;
    const fName = isMale
      ? firstNamesMale[i % firstNamesMale.length]
      : firstNamesFemale[i % firstNamesFemale.length];
    const lName = lastNames[(i * 3 + 7) % lastNames.length];
    const fullName = `${fName} ${lName}`;

    // Synthetic Porsi: 2700192000 + i (10 Digits)
    const porsiNumber = (2700192000 + i).toString();

    // Synthetic NIK: 917101 + DDMMYY + 0001 (16 Digits)
    const birthYear = 1950 + (i % 45); // Ages between 31 and 76
    const birthMonth = ((i % 12) + 1).toString().padStart(2, '0');
    const birthDay = ((i % 28) + 1).toString().padStart(2, '0');
    const birthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
    const age = 2026 - birthYear;
    const isPriorityElderly = age >= 65;

    const fakeNik = `917101${birthDay}${birthMonth}${birthYear.toString().slice(-2)}${(1000 + i).toString()}`;
    const fakeKk = `917101${(200000 + i).toString()}`;
    const fakePhone = `0812${(40000000 + i).toString()}`;

    // Encrypt sensitive fields
    const nikEncrypted = encryptData(fakeNik);
    const nikHash = hashBlindIndex(fakeNik);
    const kkNumberEncrypted = encryptData(fakeKk);
    const phoneEncrypted = encryptData(fakePhone);

    // Pick region based on weighted index across 11 official Papua regencies
    let regionId = availableRegions[0]; // Kota Jayapura default
    if (i > 80 && i <= 110) regionId = availableRegions[1]; // Kab Jayapura
    else if (i > 110 && i <= 130) regionId = availableRegions[2]; // Biak
    else if (i > 130 && i <= 145) regionId = availableRegions[3]; // Keerom
    else if (i > 145 && i <= 160) regionId = availableRegions[4]; // Merauke
    else if (i > 160 && i <= 175) regionId = availableRegions[5]; // Mimika
    else if (i > 175 && i <= 185) regionId = availableRegions[6]; // Boven Digoel
    else if (i > 185 && i <= 190) regionId = availableRegions[7]; // Asmat
    else if (i > 190 && i <= 195) regionId = availableRegions[8]; // Yapen
    else if (i > 195 && i <= 200) regionId = availableRegions[9]; // Nabire
    else if (i > 200) regionId = availableRegions[10]; // Jayawijaya

    // Simulate readiness factors
    // Exact non-overlapping allocations:
    // i in 1..21  -> 21 DOKUMEN issues
    // i in 22..38 -> 17 PEMERIKSAAN issues
    // i in 39..57 -> 19 ADMINISTRASI issues
    // i in 58..65 -> 8 MANASIK issues
    // i > 65      -> SIAP BERANGKAT (Complete)
    const isDocIssue = i >= 1 && i <= 21;
    const isHealthIssue = i >= 22 && i <= 38;
    const isAdminIssue = i >= 39 && i <= 57;
    const isManasikIssue = i >= 58 && i <= 65;

    let docsVerified = !isDocIssue;
    let healthPassed = !isHealthIssue;
    let adminSettled = !isAdminIssue;
    let manasikAttended = !isManasikIssue;
    let kloterAssigned = true;

    if (isDocIssue) docIncompleteCount++;
    if (isHealthIssue) healthIncompleteCount++;
    if (isAdminIssue) adminIncompleteCount++;
    if (isManasikIssue) manasikIncompleteCount++;

    let simStatus = 'SIAP_BERANGKAT';
    if (!docsVerified || !healthPassed || !adminSettled) {
      simStatus = isDocIssue ? 'PERLU_TINDAK_LANJUT' : 'DALAM_PROSES';
    }

    const createdJamaah = await prisma.jamaah.create({
      data: {
        userId: (i === 1 && jamaahUser) ? jamaahUser.id : undefined,
        seasonId: season.id,
        regionId,
        porsiNumber,
        nikEncrypted,
        nikHash,
        kkNumberEncrypted,
        fullName,
        birthPlace: isMale ? 'Jayapura' : 'Biak',
        birthDate,
        gender: isMale ? 'MALE' : 'FEMALE',
        maritalStatus: 'MARRIED',
        address: `Jl. Cenderawasih No. ${i}, Kelurahan Gurabesi`,
        district: districts[i % districts.length],
        subDistrict: 'Gurabesi',
        postalCode: '99111',
        phoneEncrypted,
        bloodType: ['A', 'B', 'AB', 'O'][i % 4],
        occupation: ['PNS', 'Wiraswasta', 'Guru', 'Pensiunan', 'Petani / Nelayan', 'Pedagang'][i % 6],
        registrationYear: 2012 + (i % 5),
        estimatedDepartureYear: 2026,
        status: simStatus,
        dataSource: 'DEMO',
        isPriorityElderly,
        elderlyAge: isPriorityElderly ? age : null,
      },
    });

    // A. Create Documents for Jamaah
    const docTypes = ['PASPOR', 'VISA', 'KTP', 'KK', 'FOTO', 'VAKSIN'];
    for (const dtCode of docTypes) {
      let docStatus = 'TERVERIFIKASI';
      let rejectionReason: string | undefined;

      if (isDocIssue && dtCode === 'PASPOR') {
        if (i <= 7) {
          docStatus = 'DITOLAK';
          rejectionReason = 'Scan paspor buram dan masa berlaku kurang dari 6 bulan. Mohon perpanjangan.';
        } else {
          docStatus = 'MENUNGGU_VERIFIKASI';
        }
      } else if (isDocIssue && dtCode === 'VISA') {
        docStatus = 'MENUNGGU_VERIFIKASI';
      }

      const doc = await prisma.jamaahDocument.create({
        data: {
          jamaahId: createdJamaah.id,
          documentTypeId: docTypeMap.get(dtCode)!,
          documentNumber: dtCode === 'PASPOR' ? `B${8000000 + i}` : undefined,
          status: docStatus,
          rejectionReason,
          filePath: `/uploads/demo/${createdJamaah.id}_${dtCode.toLowerCase()}.pdf`,
          fileSizeBytes: 245000,
          mimeType: 'application/pdf',
          dataSource: 'DEMO',
          uploadedAt: new Date(),
        },
      });

      if (docStatus === 'TERVERIFIKASI' && adminUser) {
        await prisma.documentVerification.create({
          data: {
            jamaahDocumentId: doc.id,
            action: 'VERIFY',
            notes: 'Berkas fisik dan biometrik tervalidasi lengkap.',
            verifiedById: adminUser.id,
          },
        });
      } else if (docStatus === 'DITOLAK' && adminUser) {
        await prisma.documentVerification.create({
          data: {
            jamaahDocumentId: doc.id,
            action: 'REJECT',
            notes: rejectionReason || 'Berkas ditolak verifikator',
            verifiedById: adminUser.id,
          },
        });
      }
    }

    // B. Create Administration Records
    await prisma.administrationRecord.create({
      data: {
        jamaahId: createdJamaah.id,
        stageName: 'SETORAN_AWAL',
        amountPaid: 25000000,
        paymentReference: `BPS-BPIH-${1000 + i}`,
        status: 'SELESAI',
        completionDate: new Date('2018-04-12'),
        dataSource: 'DEMO',
      },
    });

    await prisma.administrationRecord.create({
      data: {
        jamaahId: createdJamaah.id,
        stageName: 'PELUNASAN_BPIH',
        amountPaid: adminSettled ? 31250000 : 0,
        paymentReference: adminSettled ? `LUNAS-2026-${1000 + i}` : undefined,
        status: adminSettled ? 'SELESAI' : 'PERLU_TINDAK_LANJUT',
        completionDate: adminSettled ? new Date('2026-02-15') : undefined,
        notes: adminSettled ? 'Pelunasan lunas via Bank Penerima Setoran' : 'Batas pelunasan mendekati tenggat waktu',
        dataSource: 'DEMO',
      },
    });

    await prisma.administrationRecord.create({
      data: {
        jamaahId: createdJamaah.id,
        stageName: 'SPPH',
        paymentReference: `SPPH-PAPUA-${1000 + i}`,
        status: 'SELESAI',
        completionDate: new Date('2018-04-15'),
        dataSource: 'DEMO',
      },
    });

    // C. Create Health Monitoring Records
    await prisma.healthMonitoring.create({
      data: {
        jamaahId: createdJamaah.id,
        checkupStage: 'TAHAP_1_PUSKESMAS',
        examinationDate: new Date('2026-01-20'),
        locationName: 'Puskesmas Jayapura',
        istithaahStatus: 'MEMENUHI_SYARAT',
        administrativeStatus: 'SELESAI',
        dataSource: 'DEMO',
      },
    });

    await prisma.healthMonitoring.create({
      data: {
        jamaahId: createdJamaah.id,
        checkupStage: 'TAHAP_2_RSUD',
        examinationDate: healthPassed ? new Date('2026-02-28') : undefined,
        locationName: 'RSUD Jayapura / RSUD Biak',
        istithaahStatus: healthPassed ? (isPriorityElderly ? 'MEMENUHI_DENGAN_PENDAMPING' : 'MEMENUHI_SYARAT') : 'DITUNDA',
        isVaccineMeningitis: healthPassed,
        isVaccinePolio: healthPassed,
        administrativeStatus: healthPassed ? 'SELESAI' : 'PERLU_TINDAK_LANJUT',
        notesNonMedical: healthPassed ? 'Kesiapan fisik & vaksinasi lengkap' : 'Hasil lab tahap 2 tertunda, perlu rujukan ulang',
        dataSource: 'DEMO',
      },
    });

    // D. Create Manasik Attendances
    const mEventId = manasikMap.get(1);
    if (mEventId) {
      await prisma.manasikAttendance.create({
        data: {
          eventId: mEventId,
          jamaahId: createdJamaah.id,
          status: manasikAttended ? 'HADIR' : 'TIDAK_HADIR',
          attendanceMethod: 'QR_SCAN',
        },
      });
    }

    // E. Assign Kloter & Seats
    const kloterNum = (i % 4) + 1;
    const kId = kloterMap.get(kloterNum)!;
    const seatRow = Math.ceil(i / 6);
    const seatCol = ['A', 'B', 'C', 'D', 'E', 'F'][i % 6];
    await prisma.kloterMember.create({
      data: {
        kloterId: kId,
        jamaahId: createdJamaah.id,
        seatNumber: `${seatRow}-${seatCol}`,
      },
    });

    // F. Compute Readiness via Engine
    const calculation = ReadinessEngine.calculate(
      {
        id: createdJamaah.id,
        porsiNumber: createdJamaah.porsiNumber,
        nikEncrypted: createdJamaah.nikEncrypted,
        kkNumberEncrypted: createdJamaah.kkNumberEncrypted,
        fullName: createdJamaah.fullName,
        birthDate: createdJamaah.birthDate,
        address: createdJamaah.address,
        phoneEncrypted: createdJamaah.phoneEncrypted,
        status: createdJamaah.status,
        simulatedComponents: {
          identityCompleted: true,
          adminSettled,
          docsVerified,
          healthPassed,
          manasikAttended,
          kloterAssigned,
        },
      },
      rulesForEngine
    );

    await prisma.readinessScore.create({
      data: {
        jamaahId: createdJamaah.id,
        seasonId: season.id,
        totalScore: calculation.totalScore,
        category: calculation.category,
        componentBreakdown: JSON.stringify(calculation.breakdown),
        lastCalculatedAt: calculation.calculatedAt,
      },
    });

    // G. Create Warning Event & Action Item if issue detected
    if (isDocIssue) {
      const wEvent = await prisma.warningEvent.create({
        data: {
          ruleId: ruleMap.get('CRIT_DEPART_DOC')!,
          jamaahId: createdJamaah.id,
          regionId,
          severity: 'CRITICAL',
          title: `Paspor / Visa Belum Lengkap: ${createdJamaah.fullName}`,
          reason: 'Berkas paspor RI belum diverifikasi atau visa belum terbit < 30 hari keberangkatan',
          status: 'OPEN',
        },
      });

      await prisma.actionItem.create({
        data: {
          warningEventId: wEvent.id,
          jamaahId: createdJamaah.id,
          category: 'DOKUMEN',
          title: `Verifikasi Berkas Paspor: ${createdJamaah.fullName} (${createdJamaah.porsiNumber})`,
          description: `Hubungi jamaah di ${createdJamaah.district || 'wilayah setempat'} untuk percepatan upload scan paspor asli.`,
          assignedToUserId: adminUser?.id,
          assignedByUserId: provUser?.id,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: i % 2 === 0 ? 'IN_PROGRESS' : 'OPEN',
          priority: 'URGENT',
          notes: 'Petugas wilayah telah dihubungi via koordinasi internal.',
        },
      });
    }

    if (isHealthIssue) {
      const wEvent = await prisma.warningEvent.create({
        data: {
          ruleId: ruleMap.get('CRIT_HEALTH_ISTITHAAH')!,
          jamaahId: createdJamaah.id,
          regionId,
          severity: 'CRITICAL',
          title: `Hasil Istitha'ah Tertunda: ${createdJamaah.fullName}`,
          reason: 'Pemeriksaan tahap 2 RSUD belum tuntas atau status istitha\'ah masih ditunda',
          status: 'OPEN',
        },
      });

      await prisma.actionItem.create({
        data: {
          warningEventId: wEvent.id,
          jamaahId: createdJamaah.id,
          category: 'PEMERIKSAAN',
          title: `Tindak Lanjut Tes Lab Tahap 2: ${createdJamaah.fullName}`,
          description: 'Koordinasi dengan Dinkes / RSUD rujukan untuk jadwal ulang pemeriksaan kesehatan.',
          assignedToUserId: provUser?.id,
          assignedByUserId: adminUser?.id,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          status: 'OPEN',
          priority: 'HIGH',
        },
      });
    }

    if (isAdminIssue) {
      const wEvent = await prisma.warningEvent.create({
        data: {
          ruleId: ruleMap.get('WARN_READINESS_LOW')!,
          jamaahId: createdJamaah.id,
          regionId,
          severity: 'WARNING',
          title: `Pelunasan BPIH Belum Tuntas: ${createdJamaah.fullName}`,
          reason: 'Batas pelunasan tahap berjalan mendekati tenggat waktu nasional',
          status: 'OPEN',
        },
      });

      await prisma.actionItem.create({
        data: {
          warningEventId: wEvent.id,
          jamaahId: createdJamaah.id,
          category: 'ADMINISTRASI',
          title: `Konfirmasi Pelunasan BPIH: ${createdJamaah.fullName}`,
          description: 'Cek mutasi bank BPS-BPIH atas nomor porsi terkait.',
          assignedToUserId: provUser?.id,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'OPEN',
          priority: 'MEDIUM',
        },
      });
    }

    if (isManasikIssue) {
      const wEvent = await prisma.warningEvent.create({
        data: {
          ruleId: ruleMap.get('ATTN_MANASIK_ABSENT')!,
          jamaahId: createdJamaah.id,
          regionId,
          severity: 'ATTENTION',
          title: `Kehadiran Manasik Rendah: ${createdJamaah.fullName}`,
          reason: 'Jamaah belum menghadiri bimbingan manasik wajib di KUA setempat',
          status: 'OPEN',
        },
      });

      await prisma.actionItem.create({
        data: {
          warningEventId: wEvent.id,
          jamaahId: createdJamaah.id,
          category: 'MANASIK',
          title: `Pemberitahuan Manasik Susulan: ${createdJamaah.fullName}`,
          description: 'Kirim materi manasik daring dan jadwalkan sesi pengayaan mandiri.',
          status: 'OPEN',
          priority: 'LOW',
        },
      });
    }
  }

  // 11. RECORD INITIAL AUDIT LOG
  await prisma.auditLog.create({
    data: {
      actorUsername: 'SYSTEM_INSTALLER',
      actorRole: 'SUPER_ADMIN',
      action: 'CREATE',
      module: 'SYSTEM',
      recordId: season.id,
      beforeState: null,
      afterState: JSON.stringify({
        message: 'Database Phase 2 initialized with Documents, Health, Admin, Kloter, Manasik, and Action Items',
        docIncomplete: docIncompleteCount,
        healthIncomplete: healthIncompleteCount,
        adminIncomplete: adminIncompleteCount,
        manasikIncomplete: manasikIncompleteCount,
      }),
      dataSource: 'DEMO',
    },
  });

  console.log(`✅ [PHASE 2 SEED SUKSES]`);
  console.log(`   - Dokumen Perlu Tindak Lanjut : ${docIncompleteCount} Jamaah`);
  console.log(`   - Pemeriksaan Perlu Perhatian  : ${healthIncompleteCount} Jamaah`);
  console.log(`   - Administrasi Belum Lunas     : ${adminIncompleteCount} Jamaah`);
  console.log(`   - Manasik Butuh Pendampingan   : ${manasikIncompleteCount} Jamaah`);
  console.log(`   - 4 Kloter & Manifest Internal : Terisi`);
  console.log('------------------------------------------------------------');
  console.log('AKUN DEMO YANG TERSEDIA (Semua Password: AdminPapua2026!)');
  console.log('1. Super Admin   : superadmin   (Akses Penuh)');
  console.log('2. Pimpinan      : pimpinan     (Executive Monitoring Read-Only)');
  console.log('3. Admin Prov    : adminprov    (Operasional Komando Provinsi)');
  console.log('4. Admin Kota    : adminkotajpr (Scoped Wilayah: Kota Jayapura)');
  console.log('5. Admin Biak    : adminbiak    (Scoped Wilayah: Kab. Biak Numfor)');
  console.log('6. Petugas       : petugaskloter(Checklist Kloter 01)');
  console.log('------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
