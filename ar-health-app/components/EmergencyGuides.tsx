'use client';

import { useState } from 'react';
import { getTranslation } from '@/lib/translations';
import { useAppStore, EmergencyType } from '@/lib/store';
import { Phone, ArrowLeft } from 'lucide-react';

interface EmergencyGuidesProps {
  type: EmergencyType;
  onClose: () => void;
}

export default function EmergencyGuides({ type, onClose }: EmergencyGuidesProps) {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const handleEmergencyCall = () => {
    window.location.href = 'tel:112';
  };

  const guides: Record<Exclude<EmergencyType, 'cpr'>, { title: string; steps: string[] }> = {
    choking: {
      title: t('choking'),
      steps: [
        'Encourage the person to cough',
        'Give 5 back blows between shoulder blades',
        'Give 5 abdominal thrusts (Heimlich maneuver)',
        'Alternate between back blows and thrusts',
        'Call emergency services if obstruction persists',
      ],
    },
    bleeding: {
      title: t('bleeding'),
      steps: [
        'Apply direct pressure to the wound',
        'Elevate the injured area above heart level',
        'Keep pressure for at least 10 minutes',
        'Do not remove objects embedded in wound',
        'Call emergency services for severe bleeding',
      ],
    },
    burns: {
      title: t('burns'),
      steps: [
        'Remove person from heat source',
        'Cool the burn with cool (not cold) running water',
        'Remove tight clothing before swelling',
        'Cover with clean, dry cloth',
        'Call emergency services for severe burns',
      ],
    },
  };

  const guide = guides[type as Exclude<EmergencyType, 'cpr'>];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={onClose}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            {t('back')}
          </button>

          <h1 className="text-4xl font-bold text-red-600 mb-6 text-center">
            {guide.title} - First Aid Guide
          </h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions:</h2>
            <ol className="list-decimal list-inside space-y-4">
              {guide.steps.map((step, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg text-lg border-l-4 border-red-600"
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Important:</strong> These are basic first aid instructions. Always call
              emergency services (112) for serious emergencies. AR guidance for {guide.title} is
              coming soon.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleEmergencyCall}
              className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={24} />
              {t('emergencyCall')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-4 rounded-lg font-bold text-xl hover:bg-gray-600 transition-colors"
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
