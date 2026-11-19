import { BERHAK_LUNAS_PAPUA_1448, type JamaahBerhakLunas } from '@/data/berhak-lunas-papua';

export interface BerhakLunasSummary {
  total: number;
  urutCount: number;
  lunasTundaCount: number;
  plansiaCount: number;
  seasonHijri: number;
  source: string;
  lastUpdated: string;
  regencyBreakdown: { name: string; count: number; percentage: number }[];
  ageGroups: {
    under40: number;
    age40to59: number;
    age60to74: number;
    age75Plus: number;
  };
}

export interface BerhakLunasFilterOptions {
  search?: string;
  kabKota?: string;
  kategori?: string;
  page?: number;
  pageSize?: number;
}

export class BerhakLunasService {
  /**
   * Menghasilkan ringkasan statistik komprehensif data Berhak Lunas 1448 H Provinsi Papua
   */
  public static getSummary(): BerhakLunasSummary {
    const total = BERHAK_LUNAS_PAPUA_1448.length;
    let urutCount = 0;
    let lunasTundaCount = 0;
    let plansiaCount = 0;

    let under40 = 0;
    let age40to59 = 0;
    let age60to74 = 0;
    let age75Plus = 0;

    const regencyMap = new Map<string, number>();

    for (const item of BERHAK_LUNAS_PAPUA_1448) {
      if (item.kategori === 'URUT') urutCount++;
      else if (item.kategori === 'LUNAS TUNDA') lunasTundaCount++;
      else if (item.kategori === 'PLANSIA') plansiaCount++;

      if (item.usia < 40) under40++;
      else if (item.usia <= 59) age40to59++;
      else if (item.usia <= 74) age60to74++;
      else age75Plus++;

      const count = regencyMap.get(item.kabKota) || 0;
      regencyMap.set(item.kabKota, count + 1);
    }

    const regencyBreakdown = Array.from(regencyMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      urutCount,
      lunasTundaCount,
      plansiaCount,
      seasonHijri: 1448,
      source: 'Satu Data Kementerian Haji & Umrah RI (satudata.haji.go.id)',
      lastUpdated: '19 November 2026',
      regencyBreakdown,
      ageGroups: {
        under40,
        age40to59,
        age60to74,
        age75Plus,
      },
    };
  }

  /**
   * Mengambil daftar data dengan fitur filter dan pagination
   */
  public static list(options: BerhakLunasFilterOptions = {}): {
    items: JamaahBerhakLunas[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    const { search, kabKota, kategori, page = 1, pageSize = 15 } = options;

    let filtered = BERHAK_LUNAS_PAPUA_1448;

    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.porsi.includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          item.alamat.toLowerCase().includes(q)
      );
    }

    if (kabKota && kabKota !== 'ALL') {
      filtered = filtered.filter(
        (item) => item.kabKota.toLowerCase() === kabKota.toLowerCase()
      );
    }

    if (kategori && kategori !== 'ALL') {
      filtered = filtered.filter(
        (item) => item.kategori.toLowerCase() === kategori.toLowerCase()
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const offset = (validPage - 1) * pageSize;
    const items = filtered.slice(offset, offset + pageSize);

    return {
      items,
      total,
      page: validPage,
      pageSize,
      totalPages,
    };
  }
}
