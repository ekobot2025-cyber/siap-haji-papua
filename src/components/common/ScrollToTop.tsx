'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Periksa posisi scroll window maupun document
      const currentScrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (currentScrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Periksa status scroll saat pertama kali mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // Fallback kompatibilitas browser
    if (document.documentElement) {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (document.body) {
      document.body.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform no-print ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke halaman paling atas"
        title="Kembali ke Atas"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0A3E2F] hover:bg-[#15803D] text-[#D4AF37] hover:text-white shadow-xl hover:shadow-2xl border-2 border-[#D4AF37]/70 hover:border-[#D4AF37] transition-all duration-200 active:scale-90 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-1" />

        {/* Floating Tooltip Label */}
        <span className="absolute right-full mr-3 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900/90 backdrop-blur-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700">
          Kembali ke Atas
        </span>
      </button>
    </div>
  );
}
