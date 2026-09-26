'use client';

import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { SmartHajjPassModal } from '@/components/jamaah/SmartHajjPassModal';

interface SmartPassProps {
  jamaah: {
    fullName: string;
    porsiNumber: string;
    regionName: string;
    bloodType: string;
    age: number;
    gender: string;
    kloterCode: string;
    kloterNumber: number;
    embarkation: string;
    airline: string;
    flightNumber: string;
    seatNumber: string;
    groupName: string;
    dormitoryDate: string;
    departureDate: string;
  };
}

export function SmartPassModalClient({ jamaah }: SmartPassProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#c39e2d] text-gray-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#f5de88]"
      >
        <QrCode className="w-4 h-4 text-gray-950" />
        <span>Buka Smart Hajj Pass (Digital)</span>
      </button>

      <SmartHajjPassModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        jamaah={jamaah}
      />
    </>
  );
}
