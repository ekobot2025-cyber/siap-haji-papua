import 'dotenv/config';
import { prisma } from '../src/infrastructure/database/prisma.client';

async function main() {
  console.log('🔄 Menyelaraskan 9 Kabupaten/Kota Resmi Provinsi Papua (Sesuai Wikipedia & UU DOB)...');

  const officialRegions = [
    { code: 'REG-JPR-KOTA', name: 'Kota Jayapura', type: 'KOTA', coordinates: '2.5337° S, 140.7181° E', transitHub: 'Bandara Internasional Sentani (DJJ)', distanceEmbarkation: '3.5 Jam Udara ke Makassar (UPG)', islandType: 'Ibukota Provinsi / Pesisir Teluk Youtefa' },
    { code: 'REG-JPR-KAB', name: 'Kabupaten Jayapura', type: 'KABUPATEN', coordinates: '2.5855° S, 140.5186° E', transitHub: 'Bandara Internasional Sentani (DJJ)', distanceEmbarkation: '3.5 Jam Udara ke Makassar (UPG)', islandType: 'Daratan Utama / Kawasan Danau Sentani' },
    { code: 'REG-KEEROM', name: 'Kabupaten Keerom', type: 'KABUPATEN', coordinates: '3.2974° S, 140.7715° E', transitHub: 'Transit Darat Trans-Papua ke Jayapura -> Sentani', distanceEmbarkation: 'Transit Jayapura -> UPG', islandType: 'Perbatasan RI - Papua Nugini (Waris/Arso)' },
    { code: 'REG-SARMI', name: 'Kabupaten Sarmi', type: 'KABUPATEN', coordinates: '1.8601° S, 138.7423° E', transitHub: 'Darat Trans-Papua / Perintis ke Sentani', distanceEmbarkation: 'Transit Jayapura -> UPG', islandType: 'Pesisir Utara Samudra Pasifik (Kota Ombak)' },
    { code: 'REG-MAMB-RAYA', name: 'Kabupaten Mamberamo Raya', type: 'KABUPATEN', coordinates: '2.2333° S, 137.9167° E', transitHub: 'Sungai Mamberamo / Perintis Kasonaweja -> Sentani', distanceEmbarkation: 'Transit Udara Perintis -> DJJ -> UPG', islandType: 'Daerah Aliran Sungai (DAS) Mamberamo / Burmeso' },
    { code: 'REG-BIAK', name: 'Kabupaten Biak Numfor', type: 'KABUPATEN', coordinates: '1.1833° S, 136.0833° E', transitHub: 'Bandara Internasional Frans Kaisiepo (BIK)', distanceEmbarkation: '2.5 Jam Udara Langsung ke Makassar (UPG)', islandType: 'Kepulauan Biak Numfor / Teluk Cenderawasih' },
    { code: 'REG-SUPIORI', name: 'Kabupaten Supiori', type: 'KABUPATEN', coordinates: '0.7500° S, 135.6167° E', transitHub: 'Transit Darat/Jembatan ke Biak -> Bandara BIK', distanceEmbarkation: 'Transit Biak -> UPG', islandType: 'Kepulauan Supiori / Sorendiweri' },
    { code: 'REG-YAPEN', name: 'Kabupaten Kepulauan Yapen', type: 'KABUPATEN', coordinates: '1.7833° S, 136.2333° E', transitHub: 'Pelabuhan Serui / Bandara Stevanus Rumbewas -> Biak', distanceEmbarkation: 'Transit Laut/Udara -> Biak -> UPG', islandType: 'Gugusan Kepulauan Yapen (Serui)' },
    { code: 'REG-WAROPEN', name: 'Kabupaten Waropen', type: 'KABUPATEN', coordinates: '2.4000° S, 136.6333° E', transitHub: 'Pelabuhan Botawa / Kapal Cepat -> Serui / Biak', distanceEmbarkation: 'Transit Laut -> Serui -> Biak -> UPG', islandType: 'Pesisir Bakau Teluk Cenderawasih (Botawa)' },
  ];

  const regionIdMap: Record<string, string> = {};

  for (const reg of officialRegions) {
    const record = await prisma.region.upsert({
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
    regionIdMap[reg.code] = record.id;
    console.log(`✅ Wilayah: ${record.code} - ${record.name} (${record.id})`);
  }

  // Re-map any jamaah currently assigned to old regions (Merauke, Mimika, Nabire)
  const oldMappings: Record<string, string> = {
    'REG-MRK': 'REG-MAMB-RAYA',
    'REG-MMK': 'REG-SUPIORI',
    'REG-NBR': 'REG-WAROPEN',
  };

  for (const [oldCode, newCode] of Object.entries(oldMappings)) {
    const oldReg = await prisma.region.findUnique({ where: { code: oldCode } });
    if (oldReg) {
      const targetId = regionIdMap[newCode];
      const updatedCount = await prisma.jamaah.updateMany({
        where: { regionId: oldReg.id },
        data: { regionId: targetId },
      });
      console.log(`🔄 Mengalihkan ${updatedCount.count} jamaah dari ${oldReg.name} ke ${newCode}`);

      // Deactivate old region so it won't show in Papua lists
      await prisma.region.update({
        where: { id: oldReg.id },
        data: { isActive: false },
      });
      console.log(`ℹ️ Wilayah lama ${oldCode} dinonaktifkan.`);
    }
  }

  console.log('🎉 Penyelarasan 9 Kabupaten/Kota Resmi Provinsi Papua SELESAI!');
}

main()
  .catch((e) => {
    console.error('❌ Error sync:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
