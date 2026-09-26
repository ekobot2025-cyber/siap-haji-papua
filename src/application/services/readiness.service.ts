import { prisma } from '@/infrastructure/database/prisma.client';
import { ReadinessEngine, type ReadinessRuleConfig } from '@/domain/rules/readiness.engine';
import { AuditService } from './audit.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export class ReadinessService {
  /**
   * Get active readiness rules for a given season or create defaults if missing
   */
  public static async getSeasonRules(seasonId: string): Promise<ReadinessRuleConfig[]> {
    let rules = await prisma.readinessRule.findMany({
      where: { seasonId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (rules.length === 0) {
      // Seed default demo rules if none exist yet
      const defaultRules = [
        { componentCode: 'IDENTITAS', name: 'Identitas & Biodata', weightPercentage: 10.0, evaluationLogic: 'EVAL_IDENTITY', sortOrder: 1 },
        { componentCode: 'ADMINISTRASI', name: 'Administrasi & Keuangan (BPIH)', weightPercentage: 20.0, evaluationLogic: 'EVAL_ADMIN', sortOrder: 2 },
        { componentCode: 'DOKUMEN', name: 'Kelengkapan Dokumen (Paspor/Visa)', weightPercentage: 20.0, evaluationLogic: 'EVAL_DOCS', sortOrder: 3 },
        { componentCode: 'KESEHATAN', name: 'Pemeriksaan Kesehatan & Istitha\'ah', weightPercentage: 20.0, evaluationLogic: 'EVAL_HEALTH', sortOrder: 4 },
        { componentCode: 'MANASIK', name: 'Bimbingan Manasik Haji', weightPercentage: 15.0, evaluationLogic: 'EVAL_MANASIK', sortOrder: 5 },
        { componentCode: 'KLOTER', name: 'Penempatan Kloter & Rombongan', weightPercentage: 15.0, evaluationLogic: 'EVAL_KLOTER', sortOrder: 6 },
      ];

      for (const r of defaultRules) {
        await prisma.readinessRule.create({
          data: {
            seasonId,
            componentCode: r.componentCode,
            name: r.name,
            weightPercentage: r.weightPercentage,
            evaluationLogic: r.evaluationLogic,
            sortOrder: r.sortOrder,
            isActive: true,
          },
        });
      }

      rules = await prisma.readinessRule.findMany({
        where: { seasonId, isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    }

    return rules.map((r) => ({
      componentCode: r.componentCode,
      name: r.name,
      weightPercentage: r.weightPercentage,
      isActive: r.isActive,
    }));
  }

  /**
   * Recalculates and persists readiness score for a specific Jamaah
   */
  public static async recalculateJamaah(
    jamaahId: string,
    simulatedComponents?: {
      identityCompleted?: boolean;
      adminSettled?: boolean;
      docsVerified?: boolean;
      healthPassed?: boolean;
      manasikAttended?: boolean;
      kloterAssigned?: boolean;
    }
  ) {
    const jamaah = await prisma.jamaah.findUnique({
      where: { id: jamaahId },
      include: {
        documents: {
          include: { documentType: true },
        },
        administrationRecords: true,
        healthRecords: true,
        manasikAttendances: true,
        kloterMembership: true,
      },
    });

    if (!jamaah) {
      throw new Error(`Jamaah with id ${jamaahId} not found`);
    }

    // Resolve live component states from relational DB if not explicitly simulated
    const isPassportVerified = jamaah.documents.some(
      (d) => d.documentType.code === 'PASPOR' && d.status === 'TERVERIFIKASI'
    );
    const isBpihSettled = jamaah.administrationRecords.some(
      (a) => a.stageName === 'PELUNASAN_BPIH' && a.status === 'SELESAI'
    );
    const isHealthPassed = jamaah.healthRecords.some(
      (h) => ['MEMENUHI_SYARAT', 'MEMENUHI_DENGAN_PENDAMPING'].includes(h.istithaahStatus)
    );
    const hasAttendedManasik = jamaah.manasikAttendances.some(
      (m) => m.status === 'HADIR'
    );
    const isKloterAssigned = Boolean(jamaah.kloterMembership);

    const effectiveComponents = {
      identityCompleted: simulatedComponents?.identityCompleted ?? (Boolean(jamaah.nikEncrypted) && Boolean(jamaah.kkNumberEncrypted)),
      adminSettled: simulatedComponents?.adminSettled ?? isBpihSettled,
      docsVerified: simulatedComponents?.docsVerified ?? isPassportVerified,
      healthPassed: simulatedComponents?.healthPassed ?? isHealthPassed,
      manasikAttended: simulatedComponents?.manasikAttended ?? hasAttendedManasik,
      kloterAssigned: simulatedComponents?.kloterAssigned ?? isKloterAssigned,
    };

    const rules = await this.getSeasonRules(jamaah.seasonId);
    const result = ReadinessEngine.calculate(
      {
        id: jamaah.id,
        porsiNumber: jamaah.porsiNumber,
        nikEncrypted: jamaah.nikEncrypted,
        kkNumberEncrypted: jamaah.kkNumberEncrypted,
        fullName: jamaah.fullName,
        birthDate: jamaah.birthDate,
        address: jamaah.address,
        phoneEncrypted: jamaah.phoneEncrypted,
        status: jamaah.status,
        simulatedComponents: effectiveComponents,
      },
      rules
    );

    const saved = await prisma.readinessScore.upsert({
      where: { jamaahId: jamaah.id },
      update: {
        totalScore: result.totalScore,
        category: result.category,
        componentBreakdown: JSON.stringify(result.breakdown),
        lastCalculatedAt: result.calculatedAt,
      },
      create: {
        jamaahId: jamaah.id,
        seasonId: jamaah.seasonId,
        totalScore: result.totalScore,
        category: result.category,
        componentBreakdown: JSON.stringify(result.breakdown),
        lastCalculatedAt: result.calculatedAt,
      },
    });

    return { ...saved, breakdown: result.breakdown };
  }

  /**
   * Batch recalculation of all jamaah in a hajj season
   */
  public static async recalculateAllInSeason(seasonId: string, session?: UserSessionPayload) {
    const rules = await this.getSeasonRules(seasonId);
    const allJamaah = await prisma.jamaah.findMany({
      where: { seasonId },
    });

    let count = 0;
    for (const j of allJamaah) {
      const result = ReadinessEngine.calculate(
        {
          id: j.id,
          porsiNumber: j.porsiNumber,
          nikEncrypted: j.nikEncrypted,
          kkNumberEncrypted: j.kkNumberEncrypted,
          fullName: j.fullName,
          birthDate: j.birthDate,
          address: j.address,
          phoneEncrypted: j.phoneEncrypted,
          status: j.status,
        },
        rules
      );

      await prisma.readinessScore.upsert({
        where: { jamaahId: j.id },
        update: {
          totalScore: result.totalScore,
          category: result.category,
          componentBreakdown: JSON.stringify(result.breakdown),
          lastCalculatedAt: result.calculatedAt,
        },
        create: {
          jamaahId: j.id,
          seasonId: j.seasonId,
          totalScore: result.totalScore,
          category: result.category,
          componentBreakdown: JSON.stringify(result.breakdown),
          lastCalculatedAt: result.calculatedAt,
        },
      });
      count++;
    }

    if (session) {
      await AuditService.log({
        actorId: session.userId,
        actorUsername: session.username,
        actorRole: session.roles[0],
        action: 'RECALCULATE_READINESS',
        module: 'READINESS',
        recordId: seasonId,
        afterState: { processedCount: count },
      });
    }

    return { processedCount: count };
  }
}
