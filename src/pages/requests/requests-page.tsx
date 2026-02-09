import React, { useState } from 'react';
import { ApplicationsList } from '@/features/applications/applications-list';
import { ApplicationForm } from '@/features/applications/application-form';

interface RequestsPageProps {
  userType: 'client' | 'supporter';
}

export function RequestsPage({ userType }: RequestsPageProps) {
  const [selectedApplicationType, setSelectedApplicationType] = useState<string | null>(null);

  const handleSubmitApplication = (data: any) => {
    console.log('Submit application:', data);
    alert('申請を送信しました！');
    setSelectedApplicationType(null);
  };

  return (
    <>
      <ApplicationsList
        userType={userType}
        onCreateApplication={(typeId) => setSelectedApplicationType(typeId)}
      />
      
      {selectedApplicationType && (
        <ApplicationForm
          applicationTypeId={selectedApplicationType}
          userType={userType}
          onClose={() => setSelectedApplicationType(null)}
          onSubmit={handleSubmitApplication}
        />
      )}
    </>
  );
}