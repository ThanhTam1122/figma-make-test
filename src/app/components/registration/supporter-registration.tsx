import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Calendar } from 'lucide-react';

interface SupporterRegistrationProps {
  onComplete: () => void;
}

export function SupporterRegistration({ onComplete }: SupporterRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showInterviewScheduling, setShowInterviewScheduling] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [formData, setFormData] = useState({
    // ステップ1: 基本情報
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    birthdate: '',
    gender: '',
    phone: '',
    email: '',
    area: '',
    // 登録面談日程
    interviewDates: [] as string[],
    agreeTerms: false,
    agreePrivacy: false,
  });

  const steps = [
    { number: 1, title: '基本情報' },
  ];

  const handleNext = () => {
    // 基本情報入力完了 → 登録完了
    console.log('Registration data:', formData);
    setRegistrationCompleted(true);
  };

  const handleInterviewScheduleSubmit = () => {
    // 面談日程選択完了
    console.log('Interview schedule:', formData.interviewDates);
    alert('面談日程を受け付けました！\n運営より具体的な日時をご連絡いたします。');
    setShowInterviewScheduling(false);
    onComplete();
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

  // カレンダー用の関数
  const generateCalendarDates = () => {
    const dates: { date: Date; dateString: string }[] = [];
    const today = new Date();
    
    // 今日から14日分の日程を生成
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      dates.push({ date, dateString });
    }
    
    return dates;
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  // 時間スロットを生成（9:00-20:00を30分刻み）
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  // 空き状況を判定（デモ用：ランダムに空き状況を生成）
  const isSlotAvailable = (dateString: string, time: string) => {
    // 実際の実装では、サーバーから空き状況を取得します
    // デモ用に一部のスロットを埋まっている状態にする
    const hash = dateString + time;
    const num = hash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return num % 3 !== 0; // 約2/3のスロットが空いている状態
  };

  // 選択中のスロットかチェック
  const isSlotSelected = (dateString: string, time: string) => {
    const slotId = `${dateString}_${time}`;
    return formData.interviewDates.includes(slotId);
  };

  // スロットの選択/解除
  const toggleTimeSlot = (dateString: string, time: string) => {
    const slotId = `${dateString}_${time}`;
    toggleArrayValue('interviewDates', slotId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
                  placeholder="花子"
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
                  placeholder="はなこ"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                生年月日 <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) => updateFormData('birthdate', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                性別 <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                required
              >
                <option value="">選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
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

            <div>
              <label className="block mb-1 text-sm font-medium">
                エリア <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.area}
                onChange={(e) => updateFormData('area', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                required
              >
                <option value="">選択してください</option>
                <option value="東京都">東京都</option>
                <option value="神奈川県">神奈川県</option>
                <option value="千葉県">千葉県</option>
                <option value="埼玉県">埼玉県</option>
                <option value="大阪府">大阪府</option>
                <option value="愛知県">愛知県</option>
                <option value="兵庫県">兵庫県</option>
                <option value="福岡県">福岡県</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-accent pb-20">
        <div className="bg-primary text-primary-foreground p-6">
          <h2 className="text-xl font-bold mb-2">サポーター登録</h2>
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
              登録完了
              <Check size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 登録完了ポップアップ */}
      {registrationCompleted && !showInterviewScheduling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-primary-foreground" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">登録完了しました！</h3>
              <p className="text-sm text-muted-foreground">
                ご登録ありがとうございます。<br />
                続けて面談日程を選択しましょう。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRegistrationCompleted(false);
                  onComplete();
                }}
                className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
              >
                あとで
              </button>
              <button
                onClick={() => setShowInterviewScheduling(true)}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                面談日程を選ぶ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 面談日程選択画面 */}
      {showInterviewScheduling && (
        <div className="fixed inset-0 bg-accent z-50 overflow-y-auto pb-20">
          <div className="bg-primary text-primary-foreground p-6">
            <h2 className="text-xl font-bold mb-2">登録面談日程</h2>
            <p className="text-sm opacity-90">ご希望の日程を選択してください</p>
          </div>

          <div className="p-4">
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="space-y-4">
                <h3 className="font-bold mb-4">登録面談日程をご選択ください</h3>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm mb-4">
                  <p className="text-blue-800">
                    <Calendar className="inline-block w-4 h-4 mr-1" />
                    面談が可能な日時を複数選択してください。後ほど運営より具体的な日時をご連絡いたします。
                  </p>
                </div>

                <div>
                  <label className="block mb-3 text-sm font-medium">
                    ご希望の面談日程 <span className="text-destructive">*</span>
                    {formData.interviewDates.length > 0 && (
                      <span className="ml-2 text-primary">
                        （{formData.interviewDates.length}件選択中）
                      </span>
                    )}
                  </label>

                  <div className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                    <span>← 横にスクロールできます →</span>
                  </div>

                  {/* 時間軸カレンダー - 全体スクロール版 */}
                  <div className="border border-border rounded-lg overflow-auto bg-white shadow-sm max-h-[500px]">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr>
                          <th className="sticky left-0 bg-gray-50 p-2 text-xs font-medium text-center border-r-2 border-b-2 border-border min-w-[64px]">
                            時間
                          </th>
                          {generateCalendarDates().map(({ date, dateString }) => {
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            return (
                              <th
                                key={dateString}
                                className={`p-2 text-center border-r border-b-2 border-border min-w-[80px] ${isWeekend ? 'bg-primary/5' : ''}`}
                              >
                                <div className={`text-xs font-medium whitespace-nowrap ${isWeekend ? 'text-primary' : ''}`}>
                                  {formatDateDisplay(dateString)}
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {generateTimeSlots().map((time) => (
                          <tr key={time} className="hover:bg-gray-50">
                            <td className="sticky left-0 bg-white p-2 text-xs text-center border-r-2 border-b border-border font-medium">
                              {time}
                            </td>
                            {generateCalendarDates().map(({ dateString }) => {
                              const available = isSlotAvailable(dateString, time);
                              const selected = isSlotSelected(dateString, time);

                              return (
                                <td
                                  key={`${dateString}_${time}`}
                                  className="border-r border-b border-border p-0"
                                >
                                  <button
                                    type="button"
                                    onClick={() => available && toggleTimeSlot(dateString, time)}
                                    disabled={!available}
                                    className={`w-full h-full p-3 text-xs transition-colors min-h-[40px] ${
                                      selected
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : available
                                        ? 'bg-white hover:bg-primary/10 text-foreground'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    {selected ? '✓' : available ? '○' : '×'}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 凡例 */}
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-4 h-4 bg-white border border-border rounded">○</span>
                      <span>空き</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-4 h-4 bg-primary text-primary-foreground rounded text-center leading-4">✓</span>
                      <span>選択中</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-4 h-4 bg-gray-100 border border-border rounded text-center leading-4">×</span>
                      <span>予約済み</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h3 className="font-bold mb-4">利用規約への同意</h3>

                  <div className="border border-border rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50 text-sm">
                    <h4 className="font-bold mb-2">きらりライフサポート サポーター規約</h4>
                    <p className="mb-3 text-xs text-muted-foreground">
                      本規約は、株式会社きらりライフサポート（以下「当社」）が提供するサポーターサービス（以下「本サービス」）の利用条件を定めるものです。
                    </p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-medium">第1条（適用）</p>
                        <p className="text-muted-foreground">本規約は、本サービスの利用に関する条件を定めたものです。</p>
                      </div>
                      <div>
                        <p className="font-medium">第2条（サービス内容）</p>
                        <p className="text-muted-foreground">当社は、サポーターとご利用者様をマッチングし、家事代行サービスを提供します。</p>
                      </div>
                      <div>
                        <p className="font-medium">第3条（報酬）</p>
                        <p className="text-muted-foreground">サポーターへの報酬は、実施したサービス内容に基づき支払われます。</p>
                      </div>
                      <div>
                        <p className="font-medium">第4条（禁止事項）</p>
                        <p className="text-muted-foreground">本サービスの不正利用、ご利用者への迷惑行為は禁止します。</p>
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
                        <span className="text-destructive">*</span> サポーター規約に同意します
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

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                    <p className="text-amber-800">
                      面談日程を選択の上、「送信する」ボタンを押してください。
                      運営より具体的な日時をご連絡いたします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowInterviewScheduling(false);
                  onComplete();
                }}
                className="flex-1 py-3 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2"
              >
                スキップ
              </button>
              <button
                onClick={handleInterviewScheduleSubmit}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                送信する
                <Check size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}