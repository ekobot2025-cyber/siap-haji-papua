import 'dotenv/config';
import { prisma } from '../src/infrastructure/database/prisma.client';

async function main() {
  console.log('🔄 Menyelaraskan 11 Kabupaten/Kota Resmi Penyelenggara Haji Papua...');

  const officialRegions = [
    { code: 'REG-JPR-KOTA', name: 'Kota Jayapura', type: 'KOTA', coordinates: '2.5337° S, 140.7181° E', transitHub: 'Bandara Internasional Sentani (DJJ)', distanceEmbarkation: '3.5 Jam Udara ke Makassar (UPG)', islandType: 'Pusat Pemerintahan / Pesisir Youtefa' },
    { code: 'REG-KEEROM', name: 'Kabupaten Keerom', type: 'KABUPATEN', coordinates: '3.2974° S, 140.7715° E', transitHub: 'Transit Darat Trans-Papua ke Jayapura -> Sentani', distanceEmbarkation: 'Transit Jayapura -> UPG', islandType: 'Wilayah Perbatasan RI-PNG (Arso/Waris)' },
    { code: 'REG-JPR-KAB', name: 'Kabupaten Jayapura', type: 'KABUPATEN', coordinates: '2.5855° S, 140.5186° E', transitHub: 'Bandara Internasional Sentani (DJJ)', distanceEmbarkation: '3.5 Jam Udara ke Makassar (UPG)', islandType: 'Danau Sentani / Hub Utama Embarkasi' },
    { code: 'REG-MRK', name: 'Kabupaten Merauke', type: 'KABUPATEN', coordinates: '8.4991° S, 140.4011° E', transitHub: 'Bandara Mopah Merauke (MKQ) -> UPG', distanceEmbarkation: '3.0 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Dataran Rendah Selatan / Ujung Timur NKRI' },
    { code: 'REG-BVD', name: 'Kabupaten Boven Digoel', type: 'KABUPATEN', coordinates: '6.0967° S, 140.3025° E', transitHub: 'Bandara Tanah Merah (TMH) -> MKQ -> UPG', distanceEmbarkation: 'Transit Perintis Tanah Merah -> Merauke -> UPG', islandType: 'Pedalaman DAS Sungai Digoel / Perbatasan' },
    { code: 'REG-ASMAT', name: 'Kabupaten Asmat', type: 'KABUPATEN', coordinates: '5.4667° S, 138.3000° E', transitHub: 'Bandara Ewer (EWE) -> TIM -> UPG', distanceEmbarkation: 'Transit Speedboat/Ewer -> Timika -> UPG', islandType: 'Kawasan Pesisir Rawa / Kota Papan Agats' },
    { code: 'REG-MMK', name: 'Kabupaten Mimika', type: 'KABUPATEN', coordinates: '4.5469° S, 136.8837° E', transitHub: 'Bandara Mozes Kilangin Timika (TIM) -> UPG', distanceEmbarkation: '2.5 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Kota Industri Timika / Pesisir Laut Arafura' },
    { code: 'REG-BIAK', name: 'Kabupaten Biak Numfor', type: 'KABUPATEN', coordinates: '1.1833° S, 136.0833° E', transitHub: 'Bandara Internasional Frans Kaisiepo (BIK)', distanceEmbarkation: '2.5 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Kepulauan Teluk Cenderawasih / Hub Utara' },
    { code: 'REG-YAPEN', name: 'Kabupaten Kepulauan Yapen', type: 'KABUPATEN', coordinates: '1.7833° S, 136.2333° E', transitHub: 'Pelabuhan Serui / Bandara Stevanus Rumbewas -> Biak', distanceEmbarkation: 'Transit Laut/Udara -> Biak -> UPG', islandType: 'Gugusan Kepulauan Serui / Selat Yapen' },
    { code: 'REG-NBR', name: 'Kabupaten Nabire', type: 'KABUPATEN', coordinates: '3.3667° S, 135.4833° E', transitHub: 'Bandara Douw Aturure Nabire (NBX) -> UPG', distanceEmbarkation: '2.5 Jam Udara ke Makassar (UPG)', islandType: 'Pesisir Teluk Cenderawasih Leher Burung' },
    { code: 'REG-JWY', name: 'Kabupaten Jayawijaya', type: 'KABUPATEN', coordinates: '4.0833° S, 138.9500° E', transitHub: 'Bandara Wamena (WMX) -> Sentani (DJJ)', distanceEmbarkation: 'Transit Udara Wamena -> Sentani -> UPG', islandType: 'Lembah Baliem Pegunungan Tengah Papua' },
  ];

  // Upsert Provinsi Papua
  await prisma.region.upsert({
    where: { code: 'REG-PAPUA-PROV' },
    update: { name: 'Provinsi Papua', type: 'PROVINSI' as any, isActive: true },
    create: { code: 'REG-PAPUA-PROV', name: 'Provinsi Papua', type: 'PROVINSI' as any, isActive: true }
  });

  for (const reg of officialRegions) {
    await prisma.region.upsert({
      where: { code: reg.code },
      update: {
        name: reg.name,
        type: reg.type as any,
        isActive: true,
      },
      create: {
        code: reg.code,
        name: reg.name,
        type: reg.type as any,
        isActive: true,
      },
    });
  }

  // Delete any regions outside this exact list
  const allowedCodes = ['REG-PAPUA-PROV', ...officialRegions.map(r => r.code)];
  const deleted = await prisma.region.deleteMany({
    where: {
      code: { notIn: allowedCodes }
    }
  });
  if (deleted.count > 0) {
    console.log(`🗑️ Menghapus ${deleted.count} wilayah di luar daftar resmi 11 Kabupaten/Kota.`);
  }

  console.log('🎉 Penyelarasan 11 Kabupaten/Kota Resmi Penyelenggara Haji Papua SELESAI!');
}

main()
  .catch((e) => {
    console.error('❌ Error sync:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
