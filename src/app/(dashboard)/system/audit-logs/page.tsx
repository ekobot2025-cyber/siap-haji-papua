import React from 'react';
import { notFound } from 'next/navigation';
import { History, ShieldCheck, User, Clock, Globe, ArrowRight, AlertTriangle } from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { AuditService } from '@/application/services/audit.service';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface AuditLogsPageProps {
  searchParams: Promise<{
    page?: string;
    module?: string;
    action?: string;
  }>;
}

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  // Guard: Only Super Admin, Prov Admin, and Executive Leader can view audit trail
  const allowed = session?.roles.some((r) => ['SUPER_ADMIN', 'PROV_ADMIN', 'LEADER'].includes(r));
  if (!allowed) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-900">Akses Audit Trail Dibatasi</h2>
        <p className="text-sm text-red-700 mt-2">
          Hanya peran Administrator Provinsi dan Pimpinan Eksekutif yang memiliki wewenang untuk memeriksa log audit keamanan.
        </p>
      </div>
    );
  }

  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const data = await AuditService.listLogs({ page, pageSize: 20, module: params.module, action: params.action });
  const { items, meta } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white font-bold flex items-center justify-center shadow-xs">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1A1410]">Jejak Audit Sistem (Append-Only)</h1>
            <p className="text-xs text-gray-500">
              Rekaman mutasi data, login, dan akses data sensitif sesuai UU PDP & regulasi Kementerian Haji dan Umrah
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#8a6d2b] bg-[#fbf8ee] px-3 py-1.5 rounded-full border border-[#e8dfc8]">
          <ShieldCheck className="w-4 h-4 text-[#b8941e]" />
          <span>Immutable Audit Ledger</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#e8dfc8] text-gray-600 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Waktu (WIT)</th>
                <th className="py-3 px-4">Aktor / Pengguna</th>
                <th className="py-3 px-4">Aksi & Modul</th>
                <th className="py-3 px-4">ID Rekaman</th>
                <th className="py-3 px-4">Perubahan State (Before $\to$ After)</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Belum ada rekaman audit log
                  </td>
                </tr>
              ) : (
                items.map((log) => {
                  let parsedBefore = null;
                  let parsedAfter = null;
                  try {
                    if (log.beforeState) parsedBefore = JSON.parse(log.beforeState);
                    if (log.afterState) parsedAfter = JSON.parse(log.afterState);
                  } catch {
                    // Ignore json parse error
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-gray-600 text-xs">
                        {new Date(log.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      {/* Actor */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{log.actorUsername || 'SYSTEM'}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">
                          {log.actorRole || 'SYSTEM'}
                        </div>
                      </td>

                      {/* Action & Module */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${
                            log.action === 'FAILED_LOGIN'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : log.action === 'UNMASK'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : log.action === 'CREATE'
                              ? 'bg-[#fbf8ee] text-[#8a6d2b] border-[#e8dfc8]'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {log.action}
                        </span>
                        <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                          Modul: {log.module}
                        </div>
                      </td>

                      {/* Record ID */}
                      <td className="py-3 px-4 font-mono text-xs text-gray-700">
                        {log.recordId ? `${log.recordId.slice(0, 12)}...` : '-'}
                      </td>

                      {/* State Changes */}
                      <td className="py-3 px-4 text-xs font-mono max-w-xs truncate text-gray-600">
                        {parsedAfter ? JSON.stringify(parsedAfter) : log.afterState || '-'}
                      </td>

                      {/* IP */}
                      <td className="py-3 px-4 text-right font-mono text-xs text-gray-500">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
