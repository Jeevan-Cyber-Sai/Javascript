'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppStore, EmergencyType } from '@/lib/store';
import CPRGuide from '@/components/CPRGuide';
import EmergencyGuides from '@/components/EmergencyGuides';

export default function ARPage() {
  const params = useParams();
  const router = useRouter();
  const emergencyType = params.type as EmergencyType;

  const handleClose = () => {
    router.push('/home');
  };

  // Route to appropriate guide component based on emergency type
  if (emergencyType === 'cpr') {
    return <CPRGuide onClose={handleClose} />;
  }

  // Other emergency types
  return <EmergencyGuides type={emergencyType} onClose={handleClose} />;
}
