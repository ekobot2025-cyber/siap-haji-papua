import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/infrastructure/database/prisma.client';
import { maskNik, maskPhone } from '@/infrastructure/security/masking';
import { decryptData } from '@/infrastructure/security/crypto';

const publicCheckSchema = z.object({
  porsiNumber: z.string().regex(/^\d{10}$/, 'Nomor Porsi harus 10 digit angka'),
  birthYear: z.number().int().min(1920).max(2015, 'Tahun lahir tidak valid'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = publicCheckSchema.parse(body);

    const jamaah = await prisma.jamaah.findUnique({
      where: { porsiNumber: validated.porsiNumber },
      include: {
        region: { select: { name: true, code: true } },
        season: { select: { seasonName: true, yearHijri: true, yearGregorian: true } },
        readinessScore: true,
        kloterMembership: {
          include: {
            kloter: {
              select: {
                kloterNumber: true,
                kloterCode: true,
                embarkationName: true,
                flightDepartureDate: true,
                airlineName: true,
                flightNumber: true,
              },
            },
            group: { select: { name: true, groupType: true } },
          },
        },
        documents: {
          select: {
            documentType: { select: { name: true, code: true } },
            status: true,
            rejectionReason: true,
          },
        },
        administrationRecords: {
          select: { stageName: true, status: true, amountPaid: true },
        },
        healthRecords: {
          select: {
            checkupStage: true,
            istithaahStatus: true,
            isVaccineMeningitis: true,
            isVaccinePolio: true,
            administrativeStatus: true,
          },
        },
        manasikAttendances: {
          select: { status: true, checkInTime: true },
        },
        actionItems: {
          where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } },
          select: { title: true, description: true, priority: true },
        },
      },
    });

    if (!jamaah || jamaah.deletedAt) {
      return NextResponse.json(
        { success: false, message: 'Nomor Porsi tidak ditemukan pada basis data haji Provinsi Papua.' },
        { status: 404 }
      );
    }

    // Verify birth year for UU PDP safety verification
    const jamaahBirthYear = new Date(jamaah.birthDate).getFullYear();
    if (jamaahBirthYear !== validated.birthYear) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tahun lahir tidak sesuai dengan data terdaftar pada Nomor Porsi ini. Mohon verifikasi kembali.',
        },
        { status: 400 }
      );
    }

    const decryptedNik = decryptData(jamaah.nikEncrypted);
    const decryptedPhone = decryptData(jamaah.phoneEncrypted || '');

    let breakdown: any = {};
    if (jamaah.readinessScore?.componentBreakdown) {
      try {
        breakdown = JSON.parse(jamaah.readinessScore.componentBreakdown);
      } catch {
        breakdown = {};
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        porsiNumber: jamaah.porsiNumber,
        fullName: jamaah.fullName,
        nikMasked: maskNik(decryptedNik),
        phoneMasked: maskPhone(decryptedPhone),
        gender: jamaah.gender === 'MALE' ? 'Laki-Laki' : 'Perempuan',
        regionName: jamaah.region.name,
        seasonName: jamaah.season.seasonName,
        estimatedDepartureYear: jamaah.estimatedDepartureYear || 2026,
        status: jamaah.status,
        bloodType: jamaah.bloodType || 'Tidak Tercatat',
        isPriorityElderly: jamaah.isPriorityElderly,
        readiness: {
          score: jamaah.readinessScore?.totalScore || 0,
          category: jamaah.readinessScore?.category || 'DALAM_PROSES',
          breakdown,
        },
        kloter: jamaah.kloterMembership
          ? {
              number: jamaah.kloterMembership.kloter.kloterNumber,
              code: jamaah.kloterMembership.kloter.kloterCode,
              embarkation: jamaah.kloterMembership.kloter.embarkationName,
              departureDate: jamaah.kloterMembership.kloter.flightDepartureDate,
              airline: `${jamaah.kloterMembership.kloter.airlineName || 'Garuda Indonesia'} (${jamaah.kloterMembership.kloter.flightNumber || 'GA-1101'})`,
              seatNumber: jamaah.kloterMembership.seatNumber || 'Akan Diumumkan',
              groupName: jamaah.kloterMembership.group?.name || 'Regu Terdaftar',
            }
          : null,
        documentsSummary: jamaah.documents.map((d) => ({
          name: d.documentType.name,
          code: d.documentType.code,
          status: d.status,
          rejectionReason: d.rejectionReason,
        })),
        bpihStatus: jamaah.administrationRecords.find((a) => a.stageName === 'PELUNASAN_BPIH')?.status || 'BELUM',
        healthStatus: jamaah.healthRecords.find((h) => h.checkupStage === 'TAHAP_2_RSUD')?.istithaahStatus || 'PROSES_PEMERIKSAAN',
        isVaccinated: jamaah.healthRecords.some((h) => h.isVaccineMeningitis && h.isVaccinePolio),
        pendingTasks: jamaah.actionItems.map((a) => a.title),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan pemrosesan' },
      { status: 400 }
    );
  }
}
