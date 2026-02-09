import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface ClientRegistrationProps {
  onComplete: () => void;
}

export function ClientRegistration({ onComplete }: ClientRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 基本情報
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    phone: '',
    email: '',
    agreeTerms: false,
    agreePrivacy: false,
  });

  const steps = [
    { number: 1, title: '登録' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // 登録完了
      console.log('Registration data:', formData);
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayValue = (field: string, value: string) => {
    const current = formData[field as keyof typeof formData] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-bold mb-4">基本情報をご入力ください</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  姓 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  placeholder="山田"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  名 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  placeholder="太郎"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  せい <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastNameKana}
                  onChange={(e) => updateFormData('lastNameKana', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  placeholder="やまだ"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  めい <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstNameKana}
                  onChange={(e) => updateFormData('firstNameKana', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  placeholder="たろう"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                電話番号 <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                placeholder="090-1234-5678"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                メールアドレス <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-bold mb-4">利用規約への同意</h3>

              <div className="border border-border rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50 text-sm">
                <h4 className="font-bold mb-2">きらりライフサポート 利用規約</h4>
                <p className="mb-3 text-xs text-muted-foreground">
                  本規約は、株式会社きらりライフサポート（以下「当社」）が提供する家事代行サービス（以下「本サービス」）の利用条件を定めるものです。
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="font-medium">第1条（適用）</p>
                    <p className="text-muted-foreground">本規約は、本サービスの利用に関する条件を定めたものです。</p>
                  </div>
                  <div>
                    <p className="font-medium">第2条（サービス内容）</p>
                    <p className="text-muted-foreground">当社は、ご利用者様とサポーターをマッチングし、家事代行サービスを提供します。</p>
                  </div>
                  <div>
                    <p className="font-medium">第3条（料金）</p>
                    <p className="text-muted-foreground">サービス料金は、ご利用いただくコースにより異なります。</p>
                  </div>
                  <div>
                    <p className="font-medium">第4条（禁止事項）</p>
                    <p className="text-muted-foreground">本サービスの不正利用、サポーターへの迷惑行為は禁止します。</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg bg-white">
                <label className="flex items-start gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateFormData('agreeTerms', e.target.checked)}
                    className="w-4 h-4 mt-0.5"
                  />
                  <span className="text-sm">
                    <span className="text-destructive">*</span> 利用規約に同意します
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={(e) => updateFormData('agreePrivacy', e.target.checked)}
                    className="w-4 h-4 mt-0.5"
                  />
                  <span className="text-sm">
                    <span className="text-destructive">*</span> プライバシーポリシーに同意します
                  </span>
                </label>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="text-blue-800">
                  ご登録内容を確認の上、「登録する」ボタンを押してください。
                  すぐにサービスをご利用いただけます。
                </p>
                <p className="text-blue-700 mt-2 text-xs">
                  ※サポート希望やお支払い方法は、マイページからご登録いただけます。
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-accent pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">ご利用者登録</h2>
        <p className="text-sm opacity-90">きらりライフサポートへようこそ</p>
      </div>

      {/* プログレスバー */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? <Check size={16} /> : step.number}
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* フォームコンテンツ */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-border p-6">
          {renderStepContent()}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} />
              戻る
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
          >
            {currentStep < steps.length ? (
              <>
                次へ
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                登録する
                <Check size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}