'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, EmergencyType } from '@/lib/store';
import { getTranslation } from '@/lib/translations';
import { Phone, LogOut } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { language, setLanguage, logout, user, isAuthenticated } = useAppStore();
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType | null>(null);
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token || !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleEmergencyCall = () => {
    // In India, emergency number is 112 or 108
    window.location.href = 'tel:112';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/login');
  };

  const handleEmergencySelect = (type: EmergencyType) => {
    setSelectedEmergency(type);
    router.push(`/ar/${type}`);
  };

  const emergencyTypes: Array<{ type: EmergencyType; icon: string; color: string }> = [
    { type: 'cpr', icon: '❤️', color: 'bg-red-500' },
    { type: 'choking', icon: '⚠️', color: 'bg-orange-500' },
    { type: 'bleeding', icon: '🩸', color: 'bg-red-600' },
    { type: 'burns', icon: '🔥', color: 'bg-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-red-600">{t('appTitle')}</h1>
            <p className="text-sm text-gray-600">{t('tagline')}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'ta')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
            </select>
            {user && (
              <div className="text-sm text-gray-600">
                {user.name}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t('selectEmergency')}
          </h2>
          <p className="text-gray-600">
            Select the type of emergency to get step-by-step AR guidance
          </p>
        </div>

        {/* Emergency Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {emergencyTypes.map(({ type, icon, color }) => (
            <button
              key={type}
              onClick={() => handleEmergencySelect(type)}
              className={`${color} text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            >
              <div className="text-6xl mb-4">{icon}</div>
              <h3 className="text-2xl font-bold uppercase">{t(type)}</h3>
            </button>
          ))}
        </div>

        {/* Emergency Call Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleEmergencyCall}
            className="bg-red-600 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-red-700 transition-colors flex items-center gap-3 text-lg font-bold animate-pulse-medical"
          >
            <Phone size={24} />
            {t('emergencyCall')}
          </button>
        </div>
      </main>
    </div>
  );
}
