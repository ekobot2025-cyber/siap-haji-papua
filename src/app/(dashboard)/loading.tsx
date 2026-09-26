import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-200 rounded" />
          <div className="h-6 w-64 bg-slate-200 rounded" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 bg-slate-100 rounded-xl" />
              <div className="h-3 w-12 bg-slate-100 rounded" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded" />
            <div className="h-2 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-8 bg-slate-100 rounded" />
              <div className="h-4 w-40 bg-slate-200 rounded flex-1" />
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-emerald-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator text */}
      <div className="text-center py-2">
        <span className="text-xs text-slate-400 font-medium">Memuat data dari server...</span>
      </div>
    </div>
  );
}
