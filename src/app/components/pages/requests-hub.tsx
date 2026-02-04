import React, { useState } from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { ApplicationsList } from '../applications/applications-list';
import { ApplicationForm } from '../applications/application-form';

interface RequestsHubProps {
  userType: 'client' | 'supporter';
  onOpenChat?: (applicantId: number) => void;
}

export function RequestsHub({ userType, onOpenChat }: RequestsHubProps) {
  const [currentView, setCurrentView] = useState<'menu' | 'applications'>('menu');
  const [selectedApplicationType, setSelectedApplicationType] = useState<string | null>(null);

  const handleSubmitApplication = (data: any) => {
    console.log('Submit application:', data);
    alert('申請を送信しました！');
    setSelectedApplicationType(null);
  };

  // メニュー表示
  if (currentView === 'menu') {
    return (
      <div className="pb-20">
        <div className="bg-primary text-primary-foreground p-6">
          <h2 className="text-xl font-bold mb-2">申請</h2>
          <p className="text-sm opacity-90">各種申請の手続き</p>
        </div>

        <div className="p-4 space-y-3">
          {/* 各種申請 */}
          <button
            onClick={() => setCurrentView('applications')}
            className="w-full bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold">各種申請</h3>
                  <p className="text-sm text-muted-foreground">
                    コース変更・解約・鍵預かりなど
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // 各種申請表示
  if (currentView === 'applications') {
    return (
      <div>
        <div className="bg-white border-b border-border p-4 sticky top-0 z-10">
          <button
            onClick={() => setCurrentView('menu')}
            className="text-primary hover:underline text-sm"
          >
            ← 申請メニューに戻る
          </button>
        </div>
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
      </div>
    );
  }

  return null;
}