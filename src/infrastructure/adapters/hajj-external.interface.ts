/**
 * External Hajj System Integration Ports (Clean Architecture Adapter Interfaces)
 * RULE: No fake production integrations. All uncredentialed endpoints return NOT_CONNECTED
 * or explicit DEMO provider.
 */

export interface ExternalSyncResult<T> {
  providerName: string;
  isConnected: boolean;
  syncedAt: Date;
  status: 'CONNECTED' | 'NOT_CONNECTED' | 'DEMO_MODE';
  data?: T;
  errorMessage?: string;
}

export interface NationalSiskohatAdapter {
  verifyPorsi(porsiNumber: string): Promise<ExternalSyncResult<{ isValid: boolean; officialStatus?: string }>>;
  syncQuota(yearHijri: number): Promise<ExternalSyncResult<{ quotaTotal: number }>>;
}

export interface NotificationGatewayAdapter {
  sendWhatsAppAlert(phone: string, message: string): Promise<ExternalSyncResult<{ messageId?: string }>>;
  sendSmsAlert(phone: string, message: string): Promise<ExternalSyncResult<{ messageId?: string }>>;
}

/**
 * Safe Mock / Demo Implementation (Default until official government API credentials exist)
 */
export class MockNationalHajjAdapter implements NationalSiskohatAdapter {
  async verifyPorsi(porsiNumber: string): Promise<ExternalSyncResult<{ isValid: boolean; officialStatus?: string }>> {
    return {
      providerName: 'SISKOHAT_ADAPTER_STUB',
      isConnected: false,
      syncedAt: new Date(),
      status: 'NOT_CONNECTED',
      errorMessage: 'Integrasi SISKOHAT Pusat belum terhubung (Memerlukan API Key & MoU Resmi). Menggunakan data internal.',
    };
  }

  async syncQuota(yearHijri: number): Promise<ExternalSyncResult<{ quotaTotal: number }>> {
    return {
      providerName: 'SISKOHAT_ADAPTER_STUB',
      isConnected: false,
      syncedAt: new Date(),
      status: 'NOT_CONNECTED',
      errorMessage: 'Layanan kuota nasional offline/tidak terhubung.',
    };
  }
}
