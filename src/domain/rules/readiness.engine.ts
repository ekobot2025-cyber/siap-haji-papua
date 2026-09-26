import type {
  ComponentScoreDetail,
  ReadinessCalculationResult,
  ReadinessCategory,
} from '../entities/readiness.types';

export interface ReadinessRuleConfig {
  componentCode: string;
  name: string;
  weightPercentage: number;
  isActive: boolean;
}

export interface JamaahDataForEvaluation {
  id: string;
  porsiNumber: string;
  nikEncrypted: string;
  kkNumberEncrypted?: string | null;
  fullName: string;
  birthDate: Date;
  address: string;
  phoneEncrypted?: string | null;
  status: string;
  // Metadata for components
  simulatedComponents?: {
    identityCompleted?: boolean;
    adminSettled?: boolean;
    docsVerified?: boolean;
    healthPassed?: boolean;
    manasikAttended?: boolean;
    kloterAssigned?: boolean;
  };
}

export class ReadinessEngine {
  /**
   * Evaluates readiness score for a single jamaah against configured rules.
   * Internal Decision-Support Metric: Does not represent final official departure decree.
   */
  public static calculate(
    jamaah: JamaahDataForEvaluation,
    rules: ReadinessRuleConfig[]
  ): ReadinessCalculationResult {
    // 1. Filter active rules and validate total weight
    const activeRules = rules.filter((r) => r.isActive);
    const totalWeight = activeRules.reduce((sum, r) => sum + r.weightPercentage, 0);

    // Normalize weights if not exactly 100 (safeguard against misconfiguration)
    const weightFactor = totalWeight > 0 ? 100 / totalWeight : 1;

    const breakdown: Record<string, ComponentScoreDetail> = {};
    let totalScore = 0;

    for (const rule of activeRules) {
      const normalizedWeight = rule.weightPercentage * weightFactor;
      const detail = this.evaluateComponent(rule.componentCode, rule.name, normalizedWeight, jamaah);
      breakdown[rule.componentCode] = detail;
      totalScore += detail.weightedScore;
    }

    // Round total score to 2 decimal places
    totalScore = Math.min(100, Math.max(0, Math.round(totalScore * 100) / 100));

    // Determine category based on configurable thresholds
    let category: ReadinessCategory = 'PRIORITAS';
    let categoryLabel = 'Prioritas Intervensi';

    if (totalScore >= 90) {
      category = 'SIAP';
      categoryLabel = 'Kesiapan Lengkap';
    } else if (totalScore >= 75) {
      category = 'HAMPIR_SIAP';
      categoryLabel = 'Hampir Siap';
    } else if (totalScore >= 50) {
      category = 'PERLU_TINDAK_LANJUT';
      categoryLabel = 'Perlu Tindak Lanjut';
    }

    return {
      totalScore,
      category,
      categoryLabel,
      breakdown,
      calculatedAt: new Date(),
    };
  }

  private static evaluateComponent(
    code: string,
    name: string,
    weight: number,
    jamaah: JamaahDataForEvaluation
  ): ComponentScoreDetail {
    const sim = jamaah.simulatedComponents || {};

    switch (code) {
      case 'IDENTITAS': {
        const hasNik = Boolean(jamaah.nikEncrypted);
        const hasKk = Boolean(jamaah.kkNumberEncrypted);
        const hasAddress = Boolean(jamaah.address);
        const hasPhone = Boolean(jamaah.phoneEncrypted);

        const items = [
          { label: 'Nomor Porsi & Identitas Utama Terdaftar', isCompleted: true },
          { label: 'Data NIK Terverifikasi', isCompleted: hasNik },
          { label: 'Data Kartu Keluarga (KK)', isCompleted: hasKk || sim.identityCompleted === true },
          { label: 'Alamat & Kontak Keluarga Aktif', isCompleted: hasAddress && (hasPhone || sim.identityCompleted === true) },
        ];

        const completedCount = items.filter((i) => i.isCompleted).length;
        const score = Math.round((completedCount / items.length) * 100);

        return {
          code,
          name,
          weight,
          score,
          weightedScore: (score / 100) * weight,
          status: score === 100 ? 'COMPLETE' : score >= 50 ? 'IN_PROGRESS' : 'ATTENTION',
          itemsChecklist: items,
        };
      }

      case 'ADMINISTRASI': {
        const isSettled = sim.adminSettled ?? (jamaah.status === 'SIAP_BERANGKAT' || jamaah.status === 'BERKAS_LENGKAP');
        const items = [
          { label: 'Setoran Awal BPIH Terkonfirmasi', isCompleted: true },
          { label: 'Pelunasan BPIH Tahap Berjalan', isCompleted: isSettled },
          { label: 'Penerbitan Surat Pendaftaran Pergi Haji (SPPH)', isCompleted: true },
        ];

        const completedCount = items.filter((i) => i.isCompleted).length;
        const score = Math.round((completedCount / items.length) * 100);

        return {
          code,
          name,
          weight,
          score,
          weightedScore: (score / 100) * weight,
          status: score === 100 ? 'COMPLETE' : 'IN_PROGRESS',
          itemsChecklist: items,
        };
      }

      case 'DOKUMEN': {
        const docsValid = sim.docsVerified ?? (jamaah.status === 'SIAP_BERANGKAT');
        const items = [
          { label: 'Paspor RI Berlaku Minimal 6 Bulan', isCompleted: docsValid },
          { label: 'Visa Haji Terbit & Tervalidasi', isCompleted: docsValid && sim.adminSettled !== false },
          { label: 'KTP & Akta/Buku Nikah Terunggah', isCompleted: true },
          { label: 'Pasfoto Standar Haji (Latar Putih)', isCompleted: true },
        ];

        const completedCount = items.filter((i) => i.isCompleted).length;
        const score = Math.round((completedCount / items.length) * 100);

        return {
          code,
          name,
          weight,
          score,
          weightedScore: (score / 100) * weight,
          status: score === 100 ? 'COMPLETE' : score >= 50 ? 'IN_PROGRESS' : 'ATTENTION',
          itemsChecklist: items,
        };
      }

      case 'KESEHATAN': {
        const healthOk = sim.healthPassed ?? (jamaah.status === 'SIAP_BERANGKAT');
        const items = [
          { label: 'Pemeriksaan Kesehatan Tahap 1 (Puskesmas)', isCompleted: true },
          { label: 'Pemeriksaan Kesehatan Tahap 2 (RSUD)', isCompleted: healthOk },
          { label: 'Status Istitha\'ah Kesehatan Terbit', isCompleted: healthOk },
          { label: 'Vaksinasi Wajib (Meningitis/Polio)', isCompleted: healthOk },
        ];

        const completedCount = items.filter((i) => i.isCompleted).length;
        const score = Math.round((completedCount / items.length) * 100);

        return {
          code,
          name,
          weight,
          score,
          weightedScore: (score / 100) * weight,
          status: score === 100 ? 'COMPLETE' : 'ATTENTION',
          itemsChecklist: items,
        };
      }

      case 'MANASIK': {
        const attended = sim.manasikAttended ?? true;
        const items = [
          { label: 'Bimbingan Manasik Tingkat KUA (Kecamatan)', isCompleted: attended },
          { label: 'Bimbingan Manasik Tingkat Kabupaten/Kota', isCompleted: attended },
          { label: 'Praktik Lapangan & Manasik Massal', isCompleted: attended },
        ];

        const completedCount = items.filter((i) => i.isCompleted).length;
        const score = Math.round((completedCount / items.length) * 100);

        return {
          code,
          name,
          weight,
          score,
          weightedScore: (score / 100) * weight,
          status: score === 100 ? 'COMPLETE' : 'IN_PROGRESS',
          itemsChecklist: items,
        };
      }

      case 'KLOTER': {
        const kloterOk = sim.kloterAssigned ?? (jamaah.status === 'SIAP_BERANGKAT');
        const items = [
          { label: 'Penetapan Nomor Kloter Jamaah', isCompleted: kloterOk },
          { label: 'Penempatan Regu & Rombongan', isCompleted: kloterOk },
          { label: 'Alokasi Seat Penerbangan & Asrama', isCompleted: kloterOk },
        ];

        const completedCount = items.filter((i) => i.isCompleted).length;
        const score = Math.round((completedCount / items.length) * 100);

        return {
          code,
          name,
          weight,
          score,
          weightedScore: (score / 100) * weight,
          status: score === 100 ? 'COMPLETE' : 'PENDING',
          itemsChecklist: items,
        };
      }

      default: {
        return {
          code,
          name,
          weight,
          score: 100,
          weightedScore: weight,
          status: 'COMPLETE',
          itemsChecklist: [{ label: 'Komponen umum terkonfirmasi', isCompleted: true }],
        };
      }
    }
  }
}
