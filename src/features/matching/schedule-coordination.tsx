import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X as XIcon, Clock } from 'lucide-react';

interface ScheduleCoordinationProps {
  matchingId: number;
  userType: 'client' | 'supporter';
  onComplete: () => void;
}

interface ScheduleProposal {
  days: string[];
  timeStart: string;
  timeEnd: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function ScheduleCoordination({ matchingId, userType, onComplete }: ScheduleCoordinationProps) {
  const [step, setStep] = useState<'weekly-schedule' | 'first-visit'>('weekly-schedule');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeStart, setTimeStart] = useState('10:00');
  const [timeEnd, setTimeEnd] = useState('12:00');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // 2026年1月
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([
    '2026-01-20',
    '2026-01-21',
    '2026-01-22',
    '2026-01-27',
    '2026-01-28',
    '2026-01-29',
  ]);

  // モックの提案データ
  const proposal: ScheduleProposal | null =
    userType === 'client'
      ? {
          days: ['tue', 'wed'],
          timeStart: '10:00',
          timeEnd: '12:00',
          status: 'pending',
        }
      : null;

  const daysOfWeek = [
    { value: 'mon', label: '月' },
    { value: 'tue', label: '火' },
    { value: 'wed', label: '水' },
    { value: 'thu', label: '木' },
    { value: 'fri', label: '金' },
    { value: 'sat', label: '土' },
    { value: 'sun', label: '日' },
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmitWeeklySchedule = () => {
    console.log('Submit weekly schedule:', { selectedDays, timeStart, timeEnd });
    setStep('first-visit');
  };

  const handleApproveProposal = () => {
    console.log('Approve proposal');
    setStep('first-visit');
  };

  const handleRejectProposal = () => {
    console.log('Reject proposal');
    // TODO: 差し戻し処理
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // 前月の空白
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isDateAvailable = (day: number | null) => {
    if (!day) return false;
    const dateStr = formatDate(day);
    return availableDates.includes(dateStr);
  };

  const isDateSelected = (day: number | null) => {
    if (!day) return false;
    return selectedDate === formatDate(day);
  };

  const handleDateClick = (day: number | null) => {
    if (!day || !isDateAvailable(day)) return;
    setSelectedDate(formatDate(day));
  };

  const handleConfirmFirstVisit = () => {
    console.log('Confirm first visit:', selectedDate);
    onComplete();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">スケジュール調整</h2>
        <p className="text-sm opacity-90">
          {step === 'weekly-schedule'
            ? '定期訪問の曜日・時間を設定します'
            : '初回訪問日を選択します'}
        </p>
      </div>

      {step === 'weekly-schedule' ? (
        <div className="p-4 space-y-6">
          {/* サポーター：提案フォーム / ユーザー：承認画面 */}
          {userType === 'supporter' && !proposal ? (
            <div className="bg-white rounded-lg border border-border p-4 space-y-4">
              <h3 className="font-bold">訪問可能な曜日・時間を選択</h3>

              <div>
                <label className="block mb-3 font-medium">訪問可能な曜日（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedDays.includes(day.value)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">開始時間</label>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={e => setTimeStart(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">終了時間</label>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={e => setTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitWeeklySchedule}
                disabled={selectedDays.length === 0}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                提案を送信
              </button>
            </div>
          ) : userType === 'client' && proposal ? (
            <div className="bg-white rounded-lg border border-border p-4 space-y-4">
              <h3 className="font-bold">サポーターからの提案</h3>

              <div className="p-4 bg-accent rounded-lg space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">訪問曜日</label>
                  <p className="font-medium">
                    {proposal.days.map(d => daysOfWeek.find(day => day.value === d)?.label).join('・')}
                    曜日
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">訪問時間</label>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <p className="font-medium">
                      {proposal.timeStart}〜{proposal.timeEnd}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRejectProposal}
                  className="flex-1 py-3 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 flex items-center justify-center gap-2"
                >
                  <XIcon size={18} />
                  差し戻す
                </button>
                <button
                  onClick={handleApproveProposal}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  承諾する
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* カレンダー選択 */}
          <div className="bg-white rounded-lg border border-border p-4">
            <h3 className="font-bold mb-4">初回訪問日を選択</h3>

            {userType === 'supporter' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="text-blue-800">
                  訪問可能な日程を選択してください。ユーザーがこの中から初回訪問日を決定します。
                </p>
              </div>
            )}

            {userType === 'client' && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <p className="text-green-800">
                  サポーターが提示した候補日から、初回訪問日を選択してください。
                </p>
              </div>
            )}

            {/* カレンダーヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPreviousMonth} className="p-2 hover:bg-accent rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <h4 className="font-bold">
                {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
              </h4>
              <button onClick={goToNextMonth} className="p-2 hover:bg-accent rounded-lg">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダーグリッド */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const available = isDateAvailable(day);
                const selected = isDateSelected(day);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={!available}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                      !day
                        ? ''
                        : selected
                        ? 'bg-primary text-primary-foreground font-bold'
                        : available
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                        : 'text-muted-foreground opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary rounded-lg">
                <p className="text-sm text-muted-foreground">選択中の日付</p>
                <p className="font-bold text-primary">{selectedDate}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleConfirmFirstVisit}
            disabled={!selectedDate}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {userType === 'supporter' ? '候補日を送信' : '初回訪問日を確定'}
          </button>
        </div>
      )}
    </div>
  );
}
