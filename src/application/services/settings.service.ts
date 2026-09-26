import { prisma } from '@/infrastructure/database/prisma.client';
import { AuditService } from './audit.service';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface AppConfig {
  appName: string;
  tagline: string;
  organizerName: string;
  organizerAddress: string;
  contactEmail: string;
  contactPhone: string;
  logoAppUrl: string;
  logoInstitutionUrl: string;
  nationalMinistryName?: string;
  nationalPortalUrl?: string;
  provincialPortalUrl?: string;
  activeSeasonId?: string;
  activeSeasonName?: string;
}

const DEFAULT_SETTINGS: Record<string, string> = {
  APP_NAME: 'SIAP HAJI PAPUA',
  APP_TAGLINE: 'Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap',
  ORGANIZER_NAME: 'Kantor Wilayah Kementerian Agama Provinsi Papua',
  ORGANIZER_ADDRESS: 'Jl. Raya Abepura, Entrop, Distrik Jayapura Selatan, Kota Jayapura, Papua 99224',
  CONTACT_EMAIL: 'kanwilpapua@kemenag.go.id',
  CONTACT_PHONE: '(0967) 537427',
  LOGO_APP_URL: '/assets/branding/app-icon.png',
  LOGO_INSTITUTION_URL: '/assets/branding/logo-horizontal.svg',
  NATIONAL_MINISTRY_NAME: 'Kementerian Haji dan Umrah Republik Indonesia',
  NATIONAL_PORTAL_URL: 'https://haji.go.id',
  PROVINCIAL_PORTAL_URL: 'https://papua.kemenag.go.id',
};

let cachedConfig: AppConfig | null = null;
let cachedConfigExpiry = 0;

export class SettingsService {
  /**
   * Retrieves all key-value settings as a strongly-typed object (Cached for 60 seconds)
   */
  public static async getAppConfig(): Promise<AppConfig> {
    const now = Date.now();
    if (cachedConfig && now < cachedConfigExpiry) {
      return cachedConfig;
    }

    try {
      const records = await prisma.systemSetting.findMany();
      const settingsMap: Record<string, string> = { ...DEFAULT_SETTINGS };

      for (const record of records) {
        settingsMap[record.settingKey] = record.settingValue;
      }

      // Find active hajj season
      const activeSeason = await prisma.hajjSeason.findFirst({
        where: { isActive: true },
      });

      const config: AppConfig = {
        appName: settingsMap.APP_NAME || DEFAULT_SETTINGS.APP_NAME,
        tagline: settingsMap.APP_TAGLINE || DEFAULT_SETTINGS.APP_TAGLINE,
        organizerName: settingsMap.ORGANIZER_NAME || DEFAULT_SETTINGS.ORGANIZER_NAME,
        organizerAddress: settingsMap.ORGANIZER_ADDRESS || DEFAULT_SETTINGS.ORGANIZER_ADDRESS,
        contactEmail: settingsMap.CONTACT_EMAIL || DEFAULT_SETTINGS.CONTACT_EMAIL,
        contactPhone: settingsMap.CONTACT_PHONE || DEFAULT_SETTINGS.CONTACT_PHONE,
        logoAppUrl: settingsMap.LOGO_APP_URL || DEFAULT_SETTINGS.LOGO_APP_URL,
        logoInstitutionUrl: settingsMap.LOGO_INSTITUTION_URL || DEFAULT_SETTINGS.LOGO_INSTITUTION_URL,
        nationalMinistryName: settingsMap.NATIONAL_MINISTRY_NAME || DEFAULT_SETTINGS.NATIONAL_MINISTRY_NAME,
        nationalPortalUrl: settingsMap.NATIONAL_PORTAL_URL || DEFAULT_SETTINGS.NATIONAL_PORTAL_URL,
        provincialPortalUrl: settingsMap.PROVINCIAL_PORTAL_URL || DEFAULT_SETTINGS.PROVINCIAL_PORTAL_URL,
        activeSeasonId: activeSeason?.id,
        activeSeasonName: activeSeason?.seasonName || 'Musim Haji 1447 H / 2026 M',
      };

      cachedConfig = config;
      cachedConfigExpiry = now + 60 * 1000; // Cache 60 detik

      return config;
    } catch {
      return {
        appName: DEFAULT_SETTINGS.APP_NAME,
        tagline: DEFAULT_SETTINGS.APP_TAGLINE,
        organizerName: DEFAULT_SETTINGS.ORGANIZER_NAME,
        organizerAddress: DEFAULT_SETTINGS.ORGANIZER_ADDRESS,
        contactEmail: DEFAULT_SETTINGS.CONTACT_EMAIL,
        contactPhone: DEFAULT_SETTINGS.CONTACT_PHONE,
        logoAppUrl: DEFAULT_SETTINGS.LOGO_APP_URL,
        logoInstitutionUrl: DEFAULT_SETTINGS.LOGO_INSTITUTION_URL,
        nationalMinistryName: DEFAULT_SETTINGS.NATIONAL_MINISTRY_NAME,
        nationalPortalUrl: DEFAULT_SETTINGS.NATIONAL_PORTAL_URL,
        provincialPortalUrl: DEFAULT_SETTINGS.PROVINCIAL_PORTAL_URL,
        activeSeasonName: 'Musim Haji 1447 H / 2026 M',
      };
    }
  }

  /**
   * Update setting with audit trail
   */
  public static async updateSetting(
    key: string,
    value: string,
    session: UserSessionPayload,
    ipAddress?: string
  ): Promise<void> {
    const existing = await prisma.systemSetting.findUnique({
      where: { settingKey: key },
    });

    const beforeState = existing ? { value: existing.settingValue } : null;

    await prisma.systemSetting.upsert({
      where: { settingKey: key },
      update: {
        settingValue: value,
        updatedBy: session.userId,
      },
      create: {
        settingKey: key,
        settingValue: value,
        settingGroup: 'GENERAL',
        updatedBy: session.userId,
      },
    });

    await AuditService.log({
      actorId: session.userId,
      actorUsername: session.username,
      actorRole: session.roles[0],
      action: 'SETTING_CHANGE',
      module: 'SYSTEM',
      recordId: key,
      beforeState,
      afterState: { value },
      ipAddress,
    });
  }
}
