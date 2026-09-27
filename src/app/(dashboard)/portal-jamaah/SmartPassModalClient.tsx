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
        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
      >
        <QrCode className="w-4 h-4 text-white" />
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
