import React, { useState } from 'react';
import { Save, ChevronDown, ChevronUp, Lightbulb, X, MapPin, Clock, Calendar, Home, Users, Edit } from 'lucide-react';

interface JobPosting {
  id?: number;
  jobNumber?: string;
  jobType: 'regular' | 'spot'; // 定期 or スポット
  address: string;
  nearestStation: string;
  accessTime: string;
  accessMethod: string;
  carParking: boolean;
  
  // スポット用
  spotDate?: string;
  spotStartTime?: string;
  spotEndTime?: string;
  acceptNewKirari?: boolean; // 新人きらりさんOKフラグ
  consideringRegular?: boolean; // 相性次第では定期でお願いしたいフラグ
  
  // スポット用：将来の定期訪問の希望スケジュール
  futureRegularCourseDuration?: string;
  futureRegularCustomDuration?: string;
  futureRegularFrequencyPeriod?: 'monthly' | 'weekly' | 'biweekly';
  futureRegularFrequencyCount?: number;
  futureRegularWeeklySchedule?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  
  // 定期用
  startPreference: 'asap' | 'scheduled';
  startDate?: string;
  courseDuration: string;
  customDuration?: string;
  frequencyPeriod?: 'monthly' | 'weekly' | 'biweekly';
  frequencyCount?: number;
  weeklySchedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  
  servicePriorities: Array<{
    service: string;
    priority: number;
  }>;
  
  // 料理の�����細
  cookingDetails?: {
    mainDishCount?: number; // メインの品数
    mainServings?: number; // メインの人数分
    sideDishCount?: number; // 副菜の品数
    sideServings?: number; // 副菜の人数分
    soupCount?: number; // 汁物の品数
    soupServings?: number; // 汁物の人数分
    dishCount?: string; // 旧フィールド（互換性のため残す）
    servings?: string; // 旧フィールド（互換性のため残す）
    when?: string;
    babyFood?: string;
    menu?: string;
    ingredients?: string;
    hasAllergy?: string;
    allergyItems?: string[];
    allergyOther?: string;
    cookingNotes?: string;
    tastePreferences?: string[]; // 好きな味付け
    shoppingDuration?: number; // 買い物の追加時間（分）
  };
  
  // 掃除の詳細
  cleaningDetails?: {
    hasWaterArea?: string;
    waterAreas?: string[];
    otherAreas?: string[];
  };
  
  familyType: string;
  familyDetails: Array<{
    relation: string;
    age: string;
    gender?: string;
  }>;
  housingType: string;
  apartmentFloor?: string;
  hasElevator?: boolean;
  hasStairs?: boolean;
  hasHandrail?: boolean;
  genderPreference?: string; // きらりさんの性別希望
  foreignLanguagePreference?: string; // 日本語以外のコミュニケーション希望（希望する/しない）
  foreignLanguageType?: string; // 希望する言語（英語/中国語/その他）
  foreignLanguageOther?: string; // その他の言語
  homePresence: string;
  appealMessage: string;
  specialOffer?: number; // スペシャルオファー（1時間あたりの上乗せ額・税抜）
  specialOfferReasons?: string[]; // スペシャルオファーをつける理由（複数選択可）
  specialOfferOtherReason?: string; // スペシャルオファーのその他の理由
  status: 'draft' | 'open' | 'paused' | 'matched' | 'closed';
}

interface JobPostingEditProps {
  posting?: JobPosting;
  onSave: (posting: JobPosting) => void;
  onCancel: () => void;
  userAddress?: string;
  initialJobType?: 'regular' | 'spot'; // 初期タイプ
  basicInfo?: any; // 基本情報
  onNavigateHome?: () => void; // ホーム画面に戻るコールバック
}

const daysOfWeek = [
  { value: 'mon', label: '月' },
  { value: 'tue', label: '火' },
  { value: 'wed', label: '水' },
  { value: 'thu', label: '木' },
  { value: 'fri', label: '金' },
  { value: 'sat', label: '土' },
  { value: 'sun', label: '日' },
];

const serviceOptions = [
  '料理',
  '買い物',
  '掃除',
  '片付け',
  '育児',
  '送迎',
  '洗濯',
];

// スポット用サービス（料理と掃除のみ）
const spotServiceOptions = ['料理', '掃除'];

// 定期用サービス（全て）
const regularServiceOptions = serviceOptions;

export function JobPostingEdit({ posting, onSave, onCancel, userAddress = '東京都渋谷区道玄坂1-2-3', initialJobType = 'regular', basicInfo, onNavigateHome }: JobPostingEditProps) {
  // 基本情報がある場合はそれを使用、ない場合はモックデータ
  const userAccessInfo = basicInfo || {
    address: '東京都千代田区千代田1-1-1',
    nearestStation: '東京駅',
    accessTime: '15',
    accessMethod: 'walk' as const,
    carParking: true,
    buildingType: 'apartment' as const,
    buildingName: 'サンシャインマンション',
    roomNumber: '305',
    hasAutoLock: true,
    accessNotes: 'オートロックあり。建物入口の呼び出しボタンで305を押してください。',
  };
  
  const [formData, setFormData] = useState<JobPosting>(
    posting || {
      jobNumber: `JOB${Date.now().toString().slice(-6)}`,
      address: userAccessInfo.address,
      nearestStation: userAccessInfo.nearestStation,
      accessTime: userAccessInfo.accessTime,
      accessMethod: userAccessInfo.accessMethod,
      carParking: userAccessInfo.carParking,
      jobType: initialJobType,
      startPreference: 'asap',
      courseDuration: '2',
      frequencyPeriod: 'weekly',
      frequencyCount: 1,
      weeklySchedule: [],
      servicePriorities: [],
      familyType: basicInfo?.familyType || '',
      familyDetails: basicInfo?.familyDetails || [],
      housingType: basicInfo?.housingType || '',
      genderPreference: '',
      foreignLanguagePreference: '',
      foreignLanguageType: '',
      homePresence: '',
      appealMessage: '',
      specialOffer: 0,
      status: 'draft',
      // スポットの場合は料理のデフォルト値を設定
      cookingDetails: initialJobType === 'spot' ? (() => {
        // 家族構成の人数を取得（本人含む）
        const familyCount = basicInfo?.familyDetails?.length || 4;
        return {
          mainDishCount: 2,
          mainServings: familyCount,
          sideDishCount: 3,
          sideServings: familyCount,
          soupCount: 1,
          soupServings: familyCount,
          shoppingDuration: 0,
        };
      })() : undefined,
    }
  );

  const [showScheduleCalendar, setShowScheduleCalendar] = useState(false);
  const [showFutureScheduleCalendar, setShowFutureScheduleCalendar] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleServicePriorityToggle = (service: string) => {
    const existing = formData.servicePriorities.find(s => s.service === service);
    
    if (existing) {
      // 既に選択されているサービスをクリック → 削除
      setFormData(prev => ({
        ...prev,
        servicePriorities: prev.servicePriorities.filter(s => s.service !== service),
      }));
    } else {
      // 新規選択
      if (formData.jobType === 'spot') {
        // スポットの場合：既存の選択を削除して、新しいサービスを追加（排他的選択）
        const updates: Partial<JobPosting> = {
          servicePriorities: [{ service, priority: 1 }],
        };
        
        // 料理を選択した場合、デフォルト値を設定
        if (service === '料理' && !formData.cookingDetails) {
          // 家族構成の人数を取得（本人含む）
          const familyCount = formData.familyDetails?.length || 4;
          updates.cookingDetails = {
            mainDishCount: 2,
            mainServings: familyCount,
            sideDishCount: 3,
            sideServings: familyCount,
            soupCount: 1,
            soupServings: familyCount,
            shoppingDuration: 0,
          };
        }
        
        setFormData(prev => ({
          ...prev,
          ...updates,
        }));
      } else {
        // 定期の場合：優先度管理
        if (existing) {
          if (existing.priority === 3) {
            // 優先度3なら削除
            setFormData(prev => ({
              ...prev,
              servicePriorities: prev.servicePriorities.filter(s => s.service !== service),
            }));
          } else {
            // 優先度を上げる
            setFormData(prev => ({
              ...prev,
              servicePriorities: prev.servicePriorities.map(s =>
                s.service === service ? { ...s, priority: s.priority + 1 } : s
              ),
            }));
          }
        } else {
          // 新規追加（優先度1）
          setFormData(prev => ({
            ...prev,
            servicePriorities: [...prev.servicePriorities, { service, priority: 1 }],
          }));
        }
      }
    }
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyDetails: [...prev.familyDetails, { relation: '', age: '' }],
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.filter((_, i) => i !== index),
    }));
  };

  const updateFamilyMember = (index: number, field: 'relation' | 'age' | 'gender', value: string) => {
    setFormData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // スポットの場合のみ確認モーダルを表示
    if (formData.jobType === 'spot') {
      setShowPublishConfirm(true);
    } else {
      onSave(formData);
      setShowSuccessModal(true);
    }
  };

  const handleConfirmPublish = () => {
    setShowPublishConfirm(false);
    setShowSuccessModal(true);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 2:
        return 'bg-green-100 text-green-700 border-green-300';
      case 3:
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return '';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return '優先度1';
      case 2:
        return '優先度2';
      case 3:
        return '優先度3';
      default:
        return '';
    }
  };

  // 見つかりやすさを計算（0-100のスコア）
  const calculateDiscoverabilityScore = () => {
    let score = 0;
    
    // TODO: 実際の基準に基づいて計算ロジックを調整
    // 仮の計算ロジック
    
    // サポート概要が設定されている（+20点）
    if (formData.servicePriorities.length > 0) score += 20;
    
    // 家族構成が設定されている（+15点）- 基本情報から自動反映されているの��カ��ント
    if (formData.familyType) score += 15;
    
    // 間取りが設定されている（+15点）- 基本情報から自動���映されているのでカウント
    if (formData.housingType) score += 15;
    
    // 在宅状況が設定されている（+10点）
    if (formData.homePresence) score += 10;
    
    // アピールメッセージが設定されている（+20点）
    if (formData.appealMessage.trim()) score += 20;
    
    // 定期の場合
    if (formData.jobType === 'regular') {
      // スケジュールが設定されている（+10点）
      if (formData.weeklySchedule.length > 0) score += 10;
      // すぐ開始可能（+10点）
      if (formData.startPreference === 'asap') score += 10;
    } else {
      // スポットの場合、日時が設定されている（+20点）
      if (formData.spotDate && formData.spotStartTime && formData.spotEndTime) score += 20;
    }
    
    return Math.min(score, 100);
  };

  const getDiscoverabilityLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getDiscoverabilityData = (level: 'low' | 'medium' | 'high') => {
    const data = {
      low: {
        emoji: '😣',
        label: '',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        barColor: 'bg-red-500',
      },
      medium: {
        emoji: '😐',
        label: '',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        barColor: 'bg-amber-500',
      },
      high: {
        emoji: '😊',
        label: '',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        barColor: 'bg-green-500',
      },
    };
    return data[level];
  };

  const getDiscoverabilityHints = (): string[] => {
    const hints: string[] = [];
    
    if (formData.servicePriorities.length === 0) {
      hints.push('サポート概要を選択すると見つかりやすくなります');
    }
    if (!formData.homePresence) {
      hints.push('在宅状況を選択すると見つかりやすくなります');
    }
    if (!formData.appealMessage.trim()) {
      hints.push('アピールメッセージを記入すると見つかりやすくなります');
    }
    if (formData.jobType === 'regular') {
      if (formData.weeklySchedule.length === 0) {
        hints.push('希望曜日・時間帯を設定すると見つかりやすくなります');
      }
      if (formData.startPreference === 'scheduled') {
        hints.push('すぐに開始可能にすると見つかりやすくなります');
      }
    } else {
      if (!formData.spotDate || !formData.spotStartTime || !formData.spotEndTime) {
        hints.push('訪問希望日時を設定すると見つかりやすくなります');
      }
    }
    
    return hints.slice(0, 3); // 最大3つまで表示
  };

  const discoverabilityScore = calculateDiscoverabilityScore();
  const discoverabilityLevel = getDiscoverabilityLevel(discoverabilityScore);
  const discoverabilityData = getDiscoverabilityData(discoverabilityLevel);
  const discoverabilityHints = getDiscoverabilityHints();

  // 募集内容入力画面での必須項目（基本情報は除く）
  const hasRequiredFieldsForPosting = () => {
    const hasService = formData.servicePriorities.length > 0;
    const hasPresence = !!formData.homePresence;

    if (formData.jobType === 'spot') {
      const hasSpotDate = !!formData.spotDate && !!formData.spotStartTime && !!formData.spotEndTime;
      return hasService && hasPresence && hasSpotDate;
    } else {
      return hasService && hasPresence;
    }
  };

  const showDiscoverabilityGauge = hasRequiredFieldsForPosting();

  // 登録進捗は75%から開始（募集内容入力は最終ステップ）
  const registrationProgress = 75;

  return (
    <>
      {/* ヘッダー（進捗バー付き） */}
      <div className="bg-primary text-primary-foreground p-6 -mx-4 -mt-4 mb-4">
        <h2 className="text-xl font-bold mb-2">依頼内容を教えてください</h2>
        <p className="text-sm opacity-90">
          あともう少しで完了です！
        </p>
        
        {/* プログレスバー */}
        <div className="mt-4">
          <div className="w-full h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-all duration-300"
              style={{ width: `${registrationProgress}%` }}
            />
          </div>
          <p className="text-xs mt-2 opacity-75">{registrationProgress}% 完了</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 見つかりやすさゲージ（スクロール追従・コンパクト版・上部固定） */}
        <div className="sticky top-0 z-10 -mx-4 px-4 pt-2 pb-3 bg-background">
          {showDiscoverabilityGauge ? (
            <div className={`p-2.5 rounded-lg border ${discoverabilityData.borderColor} ${discoverabilityData.bgColor}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lightbulb size={14} className={discoverabilityData.color} />
                <span className="text-xs font-medium">見つかりやすさ</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full overflow-visible">
                  <div
                    className={`h-full ${discoverabilityData.barColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${discoverabilityScore}%` }}
                  />
                </div>
                <span className="text-3xl flex-shrink-0">{discoverabilityData.emoji}</span>
              </div>
              {discoverabilityHints.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                  💡 {discoverabilityHints[0]}
                </p>
              )}
            </div>
          ) : (
            <div className="p-2.5 rounded-lg border border-gray-300 bg-gray-50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-gray-500" />
                  <span className="text-xs font-medium">見つかりやすさ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl">❓</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                入力を進めると見つかりやすさがわかります
              </p>
            </div>
          )}
        </div>

        {/* スポット用：訪問希望日時 */}
        {formData.jobType === 'spot' && (
          <div className="space-y-3">
            <h3 className="font-bold">訪問希望日時</h3>
            
            <div>
              <label className="block mb-2 text-sm font-medium">希望日</label>
              <input
                type="date"
                value={formData.spotDate || ''}
                onChange={e => setFormData(prev => ({ ...prev, spotDate: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">開始時刻</label>
              <input
                type="time"
                value={formData.spotStartTime || ''}
                onChange={e => {
                  const startTime = e.target.value;
                  setFormData(prev => {
                    // 開始時刻が設定されたら、自動的に3時間 + 買い物時間後を終了時刻に設定
                    if (startTime) {
                      const [hours, minutes] = startTime.split(':').map(Number);
                      const shoppingHours = (prev.cookingDetails?.shoppingDuration || 0) / 60;
                      const totalHours = 3 + shoppingHours;
                      const endHours = hours + Math.floor(totalHours);
                      const endMinutes = minutes + (totalHours % 1) * 60;
                      const finalEndHours = endHours + Math.floor(endMinutes / 60);
                      const finalEndMinutes = Math.floor(endMinutes % 60);
                      const endTime = `${String(finalEndHours).padStart(2, '0')}:${String(finalEndMinutes).padStart(2, '0')}`;
                      return { ...prev, spotStartTime: startTime, spotEndTime: endTime };
                    }
                    return { ...prev, spotStartTime: startTime };
                  });
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                💡 スポット利用は3時間固定です
                {formData.cookingDetails?.shoppingDuration ? (
                  <span className="block mt-1">
                    （買い物オプション+30分を含みます）
                  </span>
                ) : null}
              </p>
            </div>

            {/* 相性次第では定期でお願いしたい */}
            <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
              <input
                type="checkbox"
                id="consideringRegular"
                checked={formData.consideringRegular || false}
                onChange={e => setFormData(prev => ({ ...prev, consideringRegular: e.target.checked }))}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="consideringRegular" className="text-sm font-medium cursor-pointer">
                相性次第では定期でお願いしたい
              </label>
            </div>
          </div>
        )}

        {/* スポット用：定期訪問を依頼する可能性がある場合の希望スケジュール */}
        {formData.jobType === 'spot' && formData.consideringRegular && (
          <div className="space-y-3 bg-blue-50/50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">定期を依頼する可能性がある場合のスケジュール</h3>
            <p className="text-sm text-blue-700 mb-3">
              スケジュールを入れておくと、引き続きお願いできるきらりさんが見つかりやすくなります🔍
            </p>

            {/* コース（作業時間） */}
            <div>
              <label className="block mb-2 text-sm font-medium">希望コース（1回あたりの作業時間）</label>
              <select
                value={formData.futureRegularCourseDuration || ''}
                onChange={e => setFormData(prev => ({ ...prev, futureRegularCourseDuration: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              >
                <option value="">未定</option>
                <option value="1">1時間</option>
                <option value="1.5">1.5時間</option>
                <option value="2">2時間</option>
                <option value="2.5">2.5時間</option>
                <option value="3">3時間</option>
                <option value="3.5">3.5時間</option>
                <option value="4">4時間</option>
                <option value="custom">4時間以上（直接入力）</option>
              </select>
              {formData.futureRegularCourseDuration === 'custom' && (
                <input
                  type="text"
                  value={formData.futureRegularCustomDuration || ''}
                  onChange={e => setFormData(prev => ({ ...prev, futureRegularCustomDuration: e.target.value }))}
                  placeholder="例：5時間"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-white mt-2"
                />
              )}
            </div>

            {/* 利用頻度 */}
            <div>
              <label className="block mb-2 text-sm font-medium">希望利用頻度</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    value={formData.futureRegularFrequencyPeriod || 'weekly'}
                    onChange={e => setFormData(prev => ({ ...prev, futureRegularFrequencyPeriod: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  >
                    <option value="monthly">月</option>
                    <option value="weekly">毎週</option>
                    <option value="biweekly">隔週</option>
                  </select>
                </div>
                <div>
                  <select
                    value={formData.futureRegularFrequencyCount || '1'}
                    onChange={e => setFormData(prev => ({ ...prev, futureRegularFrequencyCount: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num}回</option>
                    ))}
                  </select>
                </div>
              </div>
              {formData.futureRegularCourseDuration && (
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.futureRegularFrequencyPeriod === 'monthly' && `月${formData.futureRegularFrequencyCount || 1}回の利用`}
                  {formData.futureRegularFrequencyPeriod === 'weekly' && `週${formData.futureRegularFrequencyCount || 1}回の利用`}
                  {formData.futureRegularFrequencyPeriod === 'biweekly' && `隔週${formData.futureRegularFrequencyCount || 1}回の利用`}
                </p>
              )}
            </div>

            {/* 曜日・時間帯選択 */}
            <div>
              <label className="block mb-2 text-sm font-medium">希望曜日・時間帯</label>
              <button
                type="button"
                onClick={() => setShowFutureScheduleCalendar(!showFutureScheduleCalendar)}
                className="w-full px-4 py-3 border border-border rounded-lg hover:bg-white bg-white flex items-center justify-between"
              >
                <span>
                  {(formData.futureRegularWeeklySchedule && formData.futureRegularWeeklySchedule.length > 0)
                    ? `${formData.futureRegularWeeklySchedule.length}件の時間帯を設定済み`
                    : 'カレンダーで選択する'}
                </span>
                {showFutureScheduleCalendar ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {showFutureScheduleCalendar && (
                <div className="mt-3 p-4 border border-border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground mb-3">
                    ※実際のカレンダーUIで曜日と時間帯を帯で選択
                  </p>
                  <div className="space-y-2">
                    {daysOfWeek.map(day => (
                      <div key={day.value} className="flex items-center gap-2">
                        <span className="w-8 font-medium">{day.label}</span>
                        <input
                          type="time"
                          placeholder="開始"
                          className="flex-1 px-2 py-1 border border-border rounded bg-white text-sm"
                        />
                        <span>〜</span>
                        <input
                          type="time"
                          placeholder="終了"
                          className="flex-1 px-2 py-1 border border-border rounded bg-white text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 定期用：コース・頻度・スケジュール */}
        {formData.jobType === 'regular' && (
          <>
            {/* サポート開始希望時期 */}
            <div>
              <label className="block mb-2 font-medium">サポート開始希望時期</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="startPreference"
                    value="asap"
                    checked={formData.startPreference === 'asap'}
                    onChange={e => setFormData(prev => ({ ...prev, startPreference: 'asap' }))}
                  />
                  <span>きらりさんが見つかり次第すぐ</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="startPreference"
                    value="scheduled"
                    checked={formData.startPreference === 'scheduled'}
                    onChange={e => setFormData(prev => ({ ...prev, startPreference: 'scheduled' }))}
                  />
                  <span>日付指定</span>
                </label>
                {formData.startPreference === 'scheduled' && (
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background ml-6"
                  />
                )}
              </div>
            </div>

            {/* コース（作業時間） */}
            <div>
              <label className="block mb-2 font-medium">コース（1回あたりの作業時間）</label>
              <select
                value={formData.courseDuration}
                onChange={e => setFormData(prev => ({ ...prev, courseDuration: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
              >
                <option value="1">1時間</option>
                <option value="1.5">1.5時間</option>
                <option value="2">2時間</option>
                <option value="2.5">2.5時間</option>
                <option value="3">3時間</option>
                <option value="3.5">3.5時間</option>
                <option value="4">4時間</option>
                <option value="custom">4時間以上（直接入力）</option>
              </select>
              {formData.courseDuration === 'custom' && (
                <input
                  type="text"
                  value={formData.customDuration || ''}
                  onChange={e => setFormData(prev => ({ ...prev, customDuration: e.target.value }))}
                  placeholder="例：5時間"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background mt-2"
                />
              )}
            </div>

            {/* 利用頻度 */}
            <div>
              <label className="block mb-2 font-medium">利用頻度</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    value={formData.frequencyPeriod || 'weekly'}
                    onChange={e => setFormData(prev => ({ ...prev, frequencyPeriod: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  >
                    <option value="monthly">月</option>
                    <option value="weekly">毎週</option>
                    <option value="biweekly">隔週</option>
                  </select>
                </div>
                <div>
                  <select
                    value={formData.frequencyCount || '1'}
                    onChange={e => setFormData(prev => ({ ...prev, frequencyCount: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num}回</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.frequencyPeriod === 'monthly' && `月${formData.frequencyCount || 1}回の利用`}
                {formData.frequencyPeriod === 'weekly' && `週${formData.frequencyCount || 1}回の利用`}
                {formData.frequencyPeriod === 'biweekly' && `隔週${formData.frequencyCount || 1}回の利用`}
              </p>
            </div>

            {/* 曜日・時間帯選択 */}
            <div>
              <label className="block mb-2 font-medium">希望曜日・時間帯</label>
              <button
                type="button"
                onClick={() => setShowScheduleCalendar(!showScheduleCalendar)}
                className="w-full px-4 py-3 border border-border rounded-lg hover:bg-accent flex items-center justify-between"
              >
                <span>
                  {formData.weeklySchedule.length > 0
                    ? `${formData.weeklySchedule.length}件の時間帯を設定済み`
                    : 'カレンダーで選択する'}
                </span>
                {showScheduleCalendar ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {showScheduleCalendar && (
                <div className="mt-3 p-4 border border-border rounded-lg bg-accent">
                  <p className="text-sm text-muted-foreground mb-3">
                    ※実際のカレンダーUIで曜日と時間帯を帯で選択
                  </p>
                  <div className="space-y-2">
                    {daysOfWeek.map(day => (
                      <div key={day.value} className="flex items-center gap-2">
                        <span className="w-8 font-medium">{day.label}</span>
                        <input
                          type="time"
                          placeholder="開始"
                          className="flex-1 px-2 py-1 border border-border rounded bg-white text-sm"
                        />
                        <span>〜</span>
                        <input
                          type="time"
                          placeholder="終了"
                          className="flex-1 px-2 py-1 border border-border rounded bg-white text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* サポート概要（優先度設定） */}
        <div>
          <label className="block mb-2 font-medium">
            {formData.jobType === 'spot' ? '依頼内容' : 'サポート概要（優先度1〜3まで選択可能）'}
          </label>
          {formData.jobType !== 'spot' && (
            <p className="text-xs text-muted-foreground mb-3">
              ※タップするごとに優先度が上がります（1→2→3→削除）
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {(formData.jobType === 'spot' ? spotServiceOptions : regularServiceOptions).map(service => {
              const priority = formData.servicePriorities.find(s => s.service === service);
              const isSelected = !!priority;
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServicePriorityToggle(service)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors relative ${
                    isSelected
                      ? `${getPriorityColor(priority.priority)} border-2`
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {service}
                  {/* スポットの場合は優先度バッジを表示しない */}
                  {isSelected && formData.jobType !== 'spot' && (
                    <span className="absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full bg-white border border-border shadow-sm">
                      {priority.priority}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ス���ットで料理または掃除が選択されている場合のガイド */}


          {formData.servicePriorities.length > 0 && !(formData.jobType === 'spot' && formData.servicePriorities.length > 0) && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium mb-2">選択中のサポート：</p>
              <div className="space-y-1">
                {formData.servicePriorities
                  .sort((a, b) => a.priority - b.priority)
                  .map(item => (
                    <div key={item.service} className="text-sm flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(item.priority)}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                      <span>{item.service}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 料理の詳細 */}
        {formData.servicePriorities.some(s => s.service === '料理') && (
          <div className="space-y-4 border border-orange-200 bg-orange-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🍳</span>
              <span>料理の希望詳細</span>
            </h3>
            
            {formData.jobType === 'spot' && (
              <p className="text-sm text-orange-700 bg-white/50 p-3 rounded-lg border border-orange-200">
                💡 品数と人数分はデフォルト値が入っています。必要に応じて調整してください。
              </p>
            )}

            {/* 品数 */}
            <div className="space-y-3">
              <label className="block mb-2 text-sm font-medium">品数</label>
              
              {/* メイン */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  <span>🍖</span>
                  <span className="text-sm font-medium">メイン</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.cookingDetails?.mainDishCount || 2}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, mainDishCount: parseInt(e.target.value) },
                    }))}
                    className="w-16 px-2 py-1.5 border border-border rounded-lg bg-white text-center"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">品</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.cookingDetails?.mainServings || formData.familyDetails?.length || 4}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, mainServings: parseInt(e.target.value) },
                    }))}
                    className="w-16 px-2 py-1.5 border border-border rounded-lg bg-white text-center"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">人分</span>
                </div>
              </div>

              {/* 副菜 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  <span>🥬</span>
                  <span className="text-sm font-medium">副菜</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.cookingDetails?.sideDishCount || 3}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, sideDishCount: parseInt(e.target.value) },
                    }))}
                    className="w-16 px-2 py-1.5 border border-border rounded-lg bg-white text-center"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">品</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.cookingDetails?.sideServings || formData.familyDetails?.length || 4}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, sideServings: parseInt(e.target.value) },
                    }))}
                    className="w-16 px-2 py-1.5 border border-border rounded-lg bg-white text-center"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">人分</span>
                </div>
              </div>

              {/* 汁物 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  <span>🍲</span>
                  <span className="text-sm font-medium">汁物</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.cookingDetails?.soupCount || 1}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, soupCount: parseInt(e.target.value) },
                    }))}
                    className="w-16 px-2 py-1.5 border border-border rounded-lg bg-white text-center"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">品</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.cookingDetails?.soupServings || formData.familyDetails?.length || 4}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, soupServings: parseInt(e.target.value) },
                    }))}
                    className="w-16 px-2 py-1.5 border border-border rounded-lg bg-white text-center"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">人分</span>
                </div>
              </div>
            </div>

            {/* めしあがるタイミング */}
            <div>
              <label className="block mb-2 text-sm font-medium">めしあがるタイミング</label>
              <div className="border-2 border-gray-300 rounded-lg p-3 bg-white space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingWhen"
                    checked={formData.cookingDetails?.when === 'same-day'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, when: 'same-day' },
                    }))}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm">当日</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingWhen"
                    checked={formData.cookingDetails?.when === 'next-day'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, when: 'next-day' },
                    }))}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm">翌日以降</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingWhen"
                    checked={formData.cookingDetails?.when === 'both'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, when: 'both' },
                    }))}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm">両方</span>
                </label>
              </div>
            </div>

            {/* 離乳食 */}
            <div>
              <label className="block mb-2 text-sm font-medium">離乳食</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cookingDetails: { ...prev.cookingDetails, babyFood: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors bg-white ${
                    formData.cookingDetails?.babyFood === 'yes'
                      ? 'border-primary text-primary font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cookingDetails: { ...prev.cookingDetails, babyFood: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors bg-white ${
                    formData.cookingDetails?.babyFood === 'no'
                      ? 'border-primary text-primary font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  なし
                </button>
              </div>
            </div>

            {/* メニュー */}
            <div>
              <label className="block mb-2 text-sm font-medium">メニュー</label>
              <div className="border-2 border-gray-300 rounded-lg p-3 bg-white space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingMenu"
                    checked={formData.cookingDetails?.menu === 'all-request'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, menu: 'all-request' },
                    }))}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm">全部リクエスト</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingMenu"
                    checked={formData.cookingDetails?.menu === 'partial-request'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, menu: 'partial-request' },
                    }))}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm">一部リクエスト</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingMenu"
                    checked={formData.cookingDetails?.menu === 'all-omakase'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      cookingDetails: { ...prev.cookingDetails, menu: 'all-omakase' },
                    }))}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm">全部おまかせ</span>
                </label>
              </div>
            </div>

            {/* 食材 */}
            <div>
              <label className="block mb-2 text-sm font-medium">食材</label>
              <p className="text-xs text-muted-foreground mb-2">※オプションです。必要に応じて選択してください。</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => {
                    const newShoppingDuration = 0;
                    // 終了時刻を再計算（買い物時間を除く）
                    let newEndTime = prev.spotEndTime;
                    if (prev.spotStartTime && prev.jobType === 'spot') {
                      const [hours, minutes] = prev.spotStartTime.split(':').map(Number);
                      const totalHours = 3; // 買い物なし
                      const endHours = hours + Math.floor(totalHours);
                      const endMinutes = minutes;
                      newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
                    }
                    return {
                      ...prev,
                      cookingDetails: { 
                        ...prev.cookingDetails, 
                        ingredients: 'self-prepare',
                        shoppingDuration: newShoppingDuration,
                      },
                      spotEndTime: newEndTime,
                    };
                  })}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors bg-white ${
                    formData.cookingDetails?.ingredients === 'self-prepare'
                      ? 'border-primary text-primary font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  自分で用意する
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => {
                    const newShoppingDuration = 30;
                    // 終了時刻を再計算（買い物時間を含む）
                    let newEndTime = prev.spotEndTime;
                    if (prev.spotStartTime && prev.jobType === 'spot') {
                      const [hours, minutes] = prev.spotStartTime.split(':').map(Number);
                      const totalHours = 3.5; // 3時間 + 30分
                      const endHours = hours + Math.floor(totalHours);
                      const endMinutes = minutes + (totalHours % 1) * 60;
                      const finalEndHours = endHours + Math.floor(endMinutes / 60);
                      const finalEndMinutes = Math.floor(endMinutes % 60);
                      newEndTime = `${String(finalEndHours).padStart(2, '0')}:${String(finalEndMinutes).padStart(2, '0')}`;
                    }
                    return {
                      ...prev,
                      cookingDetails: { 
                        ...prev.cookingDetails, 
                        ingredients: 'request-shopping',
                        shoppingDuration: newShoppingDuration,
                      },
                      spotEndTime: newEndTime,
                    };
                  })}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors bg-white ${
                    formData.cookingDetails?.ingredients === 'request-shopping'
                      ? 'border-primary text-primary font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  買い物から依頼する
                </button>
              </div>
              
              {/* 買い物オプション選択時の追加料金表示 */}
              {formData.cookingDetails?.ingredients === 'request-shopping' && (
                <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                  <p className="text-sm text-orange-800">
                    ✨ <span className="font-medium">買い物オプション</span>を追加しました<br />
                    <span className="text-xs">+30分（1,500円）が作業時間に追加されます</span>
                  </p>
                </div>
              )}
            </div>

            {/* 味の好み */}
            <div>
              <label className="block mb-2 text-sm font-medium">好きな味付け（複数選択可）</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'rich', label: '濃い' },
                  { value: 'light', label: '薄い' },
                  { value: 'heavy', label: 'こってり' },
                  { value: 'refreshing', label: 'さっぱり' },
                  { value: 'sweet', label: '甘い' },
                  { value: 'spicy', label: '辛い' },
                  { value: 'sour', label: 'すっぱい' },
                ].map(taste => {
                  const isSelected = formData.cookingDetails?.tastePreferences?.includes(taste.value);
                  return (
                    <button
                      key={taste.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => {
                          const currentPreferences = prev.cookingDetails?.tastePreferences || [];
                          const newPreferences = isSelected
                            ? currentPreferences.filter(t => t !== taste.value)
                            : [...currentPreferences, taste.value];
                          return {
                            ...prev,
                            cookingDetails: { ...prev.cookingDetails, tastePreferences: newPreferences },
                          };
                        });
                      }}
                      className={`py-2 px-3 rounded-lg border-2 transition-colors text-sm bg-white ${
                        isSelected
                          ? 'border-primary text-primary font-medium'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {taste.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* アレルギー */}
            <div>
              <label className="block mb-2 text-sm font-medium">アレルギー</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cookingDetails: { ...prev.cookingDetails, hasAllergy: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors bg-white ${
                    formData.cookingDetails?.hasAllergy === 'yes'
                      ? 'border-primary text-primary font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cookingDetails: { ...prev.cookingDetails, hasAllergy: 'no', allergyItems: [], allergyOther: '' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors bg-white ${
                    formData.cookingDetails?.hasAllergy === 'no'
                      ? 'border-primary text-primary font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  なし
                </button>
              </div>

              {/* アレルギーの詳細入力 */}
              {formData.cookingDetails?.hasAllergy === 'yes' && (
                <div className="mt-3 space-y-3">
                  <p className="text-xs text-muted-foreground">特定原材料8品目から選択してください</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'えび', 'かに', '小麦', 'そば', '卵', '乳', '落花生', 'くるみ'
                    ].map(allergen => {
                      const isSelected = formData.cookingDetails?.allergyItems?.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          type="button"
                          onClick={() => {
                            const current = formData.cookingDetails?.allergyItems || [];
                            const updated = isSelected
                              ? current.filter(a => a !== allergen)
                              : [...current, allergen];
                            setFormData(prev => ({
                              ...prev,
                              cookingDetails: { ...prev.cookingDetails, allergyItems: updated },
                            }));
                          }}
                          className={`py-1.5 px-2 rounded-lg border-2 text-xs transition-colors bg-white ${
                            isSelected
                              ? 'border-red-400 text-red-600 font-medium'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {allergen}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block mb-2 text-xs font-medium">その他のアレルギー（自由入力）</label>
                    <input
                      type="text"
                      value={formData.cookingDetails?.allergyOther || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        cookingDetails: { ...prev.cookingDetails, allergyOther: e.target.value },
                      }))}
                      placeholder="例：はちみつ、ナッツ類全般、もも、りんご"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* その他気をつけること */}
            <div>
              <label className="block mb-2 text-sm font-medium">その他気をつけること</label>
              <textarea
                value={formData.cookingDetails?.cookingNotes || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  cookingDetails: { ...prev.cookingDetails, cookingNotes: e.target.value },
                }))}
                placeholder="例：薄味でお願いします。油は控えめでヘルシーに仕上げてください。"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* 掃除の詳細 */}
        {formData.servicePriorities.some(s => s.service === '掃除') && (
          <div className="space-y-4 border border-blue-200 bg-blue-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🧹</span>
              <span>掃除の希望詳細</span>
            </h3>

            {/* 掃除箇所 */}
            <div>
              <label className="block mb-3 text-sm font-medium">掃除箇所</label>
              
              {/* 水回り */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium">水回り</label>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      cleaningDetails: { ...prev.cleaningDetails, hasWaterArea: 'yes' },
                    }))}
                    className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                      formData.cleaningDetails?.hasWaterArea === 'yes'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    あり
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      cleaningDetails: { ...prev.cleaningDetails, hasWaterArea: 'no', waterAreas: [] },
                    }))}
                    className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                      formData.cleaningDetails?.hasWaterArea === 'no'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    なし
                  </button>
                </div>

                {/* 水回りの詳細選択 */}
                {formData.cleaningDetails?.hasWaterArea === 'yes' && (
                  <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-primary/20">
                    {['お風呂', 'トイレ', '洗面所', 'キッチン'].map(area => {
                      const isSelected = formData.cleaningDetails?.waterAreas?.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => {
                            const current = formData.cleaningDetails?.waterAreas || [];
                            const updated = isSelected
                              ? current.filter(a => a !== area)
                              : [...current, area];
                            setFormData(prev => ({
                              ...prev,
                              cleaningDetails: { ...prev.cleaningDetails, waterAreas: updated },
                            }));
                          }}
                          className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                            isSelected
                              ? 'border-blue-300 bg-blue-100 text-blue-700 border-2'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* その他のエリア */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium">その他のエリア</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['リビング', '寝室', '子ども部屋', '書斎', '玄関', '廊下'].map(area => {
                    const isSelected = formData.cleaningDetails?.otherAreas?.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => {
                          const current = formData.cleaningDetails?.otherAreas || [];
                          const updated = isSelected
                            ? current.filter(a => a !== area)
                            : [...current, area];
                          setFormData(prev => ({
                            ...prev,
                            cleaningDetails: { ...prev.cleaningDetails, otherAreas: updated },
                          }));
                        }}
                        className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'border-blue-300 bg-blue-100 text-blue-700 border-2'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 掃除機がけ */}
            <div>
              <label className="block mb-2 text-sm font-medium">掃除機がけ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cleaningDetails: { ...prev.cleaningDetails, vacuum: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.cleaningDetails?.vacuum === 'yes'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cleaningDetails: { ...prev.cleaningDetails, vacuum: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.cleaningDetails?.vacuum === 'no'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
              </div>
            </div>

            {/* 雑巾掛け */}
            <div>
              <label className="block mb-2 text-sm font-medium">雑巾掛け</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cleaningDetails: { ...prev.cleaningDetails, mopping: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.cleaningDetails?.mopping === 'yes'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    cleaningDetails: { ...prev.cleaningDetails, mopping: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.cleaningDetails?.mopping === 'no'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 育児の詳細 */}
        {formData.jobType === 'regular' && formData.servicePriorities.some(s => s.service === '育児') && (
          <div className="space-y-4 border border-purple-200 bg-purple-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>👶</span>
              <span>育児の希望詳細</span>
            </h3>

            {/* 対象のお子さんの年齢 */}
            <div>
              <label className="block mb-2 text-sm font-medium">対象のお子さんの年齢</label>
              <input
                type="number"
                min="0"
                max="18"
                value={formData.childcareDetails?.childAge || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  childcareDetails: { ...prev.childcareDetails, childAge: e.target.value },
                }))}
                placeholder="例：3"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              />
            </div>

            {/* 対象のお子さんの性別 */}
            <div>
              <label className="block mb-2 text-sm font-medium">対象のお子さんの性別</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    childcareDetails: { ...prev.childcareDetails, childGender: 'male' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.childcareDetails?.childGender === 'male'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  男の子
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    childcareDetails: { ...prev.childcareDetails, childGender: 'female' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.childcareDetails?.childGender === 'female'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  女の子
                </button>
              </div>
            </div>

            {/* 保護者不在の時間 */}
            <div>
              <label className="block mb-2 text-sm font-medium">保護者不在の時間</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    childcareDetails: { ...prev.childcareDetails, parentAbsent: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.childcareDetails?.parentAbsent === 'yes'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    childcareDetails: { ...prev.childcareDetails, parentAbsent: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.childcareDetails?.parentAbsent === 'no'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
              </div>

              {/* シッターオプション必須の注意書き */}
              {formData.childcareDetails?.parentAbsent === 'yes' && 
               formData.childcareDetails?.childAge && 
               parseInt(formData.childcareDetails.childAge) <= 2 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ⚠️ <span className="font-medium">0〜2歳で保護者不在の場合、シッターオプションが必須となります。</span>
                  </p>
                </div>
              )}
            </div>

            {/* サポート内容を選択 */}
            <div>
              <label className="block mb-2 text-sm font-medium">サポート内容（複数選択可）</label>
              <div className="grid grid-cols-2 gap-2">
                {['室内遊び', '屋外遊び', '食事介助', 'お風呂介助', '声かけ・見守り'].map(item => {
                  const isSelected = formData.childcareDetails?.supportItems?.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        const current = formData.childcareDetails?.supportItems || [];
                        const updated = isSelected
                          ? current.filter(i => i !== item)
                          : [...current, item];
                        setFormData(prev => ({
                          ...prev,
                          childcareDetails: { ...prev.childcareDetails, supportItems: updated },
                        }));
                      }}
                      className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'border-purple-300 bg-purple-100 text-purple-700 border-2'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* 0歳の場合の追加選択肢 */}
              {formData.childcareDetails?.childAge === '0' && (
                <div className="mt-3">
                  <label className="block mb-2 text-xs font-medium text-purple-700">0歳児専用サポート</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['ミルクをあげる', '沐浴', 'おむつ替え', '寝かしつけ'].map(item => {
                      const isSelected = formData.childcareDetails?.supportItems?.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            const current = formData.childcareDetails?.supportItems || [];
                            const updated = isSelected
                              ? current.filter(i => i !== item)
                              : [...current, item];
                            setFormData(prev => ({
                              ...prev,
                              childcareDetails: { ...prev.childcareDetails, supportItems: updated },
                            }));
                          }}
                          className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                            isSelected
                              ? 'border-purple-300 bg-purple-100 text-purple-700 border-2'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 買い物の詳細 */}
        {formData.jobType === 'regular' && formData.servicePriorities.some(s => s.service === '買い物') && (
          <div className="space-y-4 border border-green-200 bg-green-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🛒</span>
              <span>買い物の希望詳細</span>
            </h3>

            {/* 場所（名称・住所など） */}
            <div>
              <label className="block mb-2 text-sm font-medium">場所（名称・住所など）</label>
              <textarea
                value={formData.shoppingDetails?.location || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  shoppingDetails: { ...prev.shoppingDetails, location: e.target.value },
                }))}
                placeholder="例：〇〇スーパー（東京都〇〇区〇〇1-2-3）"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                rows={2}
              />
            </div>

            {/* 自宅からの徒歩距離 */}
            <div>
              <label className="block mb-2 text-sm font-medium">自宅からの徒歩距離</label>
              <input
                type="text"
                value={formData.shoppingDetails?.walkingDistance || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  shoppingDetails: { ...prev.shoppingDetails, walkingDistance: e.target.value },
                }))}
                placeholder="例：徒歩5分"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              />
            </div>
          </div>
        )}

        {/* 送迎の詳細 */}
        {formData.jobType === 'regular' && formData.servicePriorities.some(s => s.service === '送迎') && (
          <div className="space-y-4 border border-pink-200 bg-pink-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🚗</span>
              <span>送迎の希望詳細</span>
            </h3>

            {/* 送り／迎え */}
            <div>
              <label className="block mb-2 text-sm font-medium">送り／迎え（複数選択可）</label>
              <div className="grid grid-cols-2 gap-3">
                {['送り', '迎え'].map(type => {
                  const isSelected = formData.transportDetails?.types?.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        const current = formData.transportDetails?.types || [];
                        const updated = isSelected
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        setFormData(prev => ({
                          ...prev,
                          transportDetails: { ...prev.transportDetails, types: updated },
                        }));
                      }}
                      className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 対象のお子さんの年齢 */}
            <div>
              <label className="block mb-2 text-sm font-medium">対象のお子さんの年齢</label>
              <input
                type="number"
                min="0"
                max="18"
                value={formData.transportDetails?.childAge || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  transportDetails: { ...prev.transportDetails, childAge: e.target.value },
                }))}
                placeholder="例：5"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              />
            </div>

            {/* 対象のお子さんの性別 */}
            <div>
              <label className="block mb-2 text-sm font-medium">対象のお子さんの性別</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    transportDetails: { ...prev.transportDetails, childGender: 'male' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.transportDetails?.childGender === 'male'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  男の子
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    transportDetails: { ...prev.transportDetails, childGender: 'female' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.transportDetails?.childGender === 'female'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  女の子
                </button>
              </div>
            </div>

            {/* 保護者同伴 */}
            <div>
              <label className="block mb-2 text-sm font-medium">保護者同伴</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    transportDetails: { ...prev.transportDetails, parentAccompany: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.transportDetails?.parentAccompany === 'yes'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    transportDetails: { ...prev.transportDetails, parentAccompany: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.transportDetails?.parentAccompany === 'no'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
              </div>

              {/* シッターオプション必須の注意書き */}
              {formData.transportDetails?.parentAccompany === 'no' && 
               formData.transportDetails?.childAge && 
               parseInt(formData.transportDetails.childAge) <= 2 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ⚠️ <span className="font-medium">0〜2歳で保護者同伴なしの場合、シッターオプションが必須となります。</span>
                  </p>
                </div>
              )}
            </div>

            {/* 送り／迎え場所 */}
            <div>
              <label className="block mb-2 text-sm font-medium">送り／迎え場所（施設名称、住所）</label>
              <textarea
                value={formData.transportDetails?.place || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  transportDetails: { ...prev.transportDetails, place: e.target.value },
                }))}
                placeholder="例：〇〇保育園（東京都〇〇区〇〇1-2-3）"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                rows={2}
              />
            </div>

            {/* 移動手段 */}
            <div>
              <label className="block mb-2 text-sm font-medium">移動手段（複数選択可）</label>
              <div className="grid grid-cols-3 gap-2">
                {['徒歩', '電車', 'バス', 'タクシー', 'その他'].map(method => {
                  const isSelected = formData.transportDetails?.methods?.includes(method);
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        const current = formData.transportDetails?.methods || [];
                        const updated = isSelected
                          ? current.filter(m => m !== method)
                          : [...current, method];
                        setFormData(prev => ({
                          ...prev,
                          transportDetails: { ...prev.transportDetails, methods: updated },
                        }));
                      }}
                      className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'border-pink-300 bg-pink-100 text-pink-700 border-2'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 自宅からの所要時間 */}
            <div>
              <label className="block mb-2 text-sm font-medium">自宅からの所要時間</label>
              <input
                type="text"
                value={formData.transportDetails?.travelTime || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  transportDetails: { ...prev.transportDetails, travelTime: e.target.value },
                }))}
                placeholder="例：徒歩10分、電車15分"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              />
            </div>

            {/* 送り／迎えの到着時間 */}
            <div>
              <label className="block mb-2 text-sm font-medium">送り／迎えの到着時間</label>
              <input
                type="text"
                value={formData.transportDetails?.arrivalTime || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  transportDetails: { ...prev.transportDetails, arrivalTime: e.target.value },
                }))}
                placeholder="例：送り 8:30まで、迎え 17:00"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white"
              />
            </div>
          </div>
        )}

        {/* 洗濯の詳細 */}
        {formData.jobType === 'regular' && formData.servicePriorities.some(s => s.service === '洗濯') && (
          <div className="space-y-4 border border-cyan-200 bg-cyan-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>👕</span>
              <span>洗濯の希望詳細</span>
            </h3>

            {/* 回す／干す／たたむ */}
            <div>
              <label className="block mb-2 text-sm font-medium">作業内容（複数選択可��</label>
              <div className="grid grid-cols-3 gap-2">
                {['回す', '干す', 'たたむ'].map(task => {
                  const isSelected = formData.laundryDetails?.tasks?.includes(task);
                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => {
                        const current = formData.laundryDetails?.tasks || [];
                        const updated = isSelected
                          ? current.filter(t => t !== task)
                          : [...current, task];
                        setFormData(prev => ({
                          ...prev,
                          laundryDetails: { ...prev.laundryDetails, tasks: updated },
                        }));
                      }}
                      className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'border-cyan-300 bg-cyan-100 text-cyan-700 border-2'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      {task}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* アイロンがけ */}
            <div>
              <label className="block mb-2 text-sm font-medium">アイロンがけ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    laundryDetails: { ...prev.laundryDetails, ironing: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.laundryDetails?.ironing === 'yes'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    laundryDetails: { ...prev.laundryDetails, ironing: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.laundryDetails?.ironing === 'no'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
              </div>
            </div>

            {/* クリーニング店への持ち込み */}
            <div>
              <label className="block mb-2 text-sm font-medium">クリーニング店への持ち込み</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    laundryDetails: { ...prev.laundryDetails, dryCleaning: 'yes' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.laundryDetails?.dryCleaning === 'yes'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    laundryDetails: { ...prev.laundryDetails, dryCleaning: 'no' },
                  }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    formData.laundryDetails?.dryCleaning === 'no'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 片付けの詳細 */}
        {formData.jobType === 'regular' && formData.servicePriorities.some(s => s.service === '片付け') && (
          <div className="space-y-4 border border-amber-200 bg-amber-50/30 rounded-lg p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>📦</span>
              <span>片付けの希望詳細</span>
            </h3>

            {/* 場所 */}
            <div>
              <label className="block mb-2 text-sm font-medium">場所（複数選択可）</label>
              <div className="grid grid-cols-2 gap-2">
                {['リビング', '寝室', '子ども部屋', '書斎', '玄関', '廊下', 'お風呂', 'トイレ', '洗面所', 'キッチン'].map(area => {
                  const isSelected = formData.organizingDetails?.areas?.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => {
                        const current = formData.organizingDetails?.areas || [];
                        const updated = isSelected
                          ? current.filter(a => a !== area)
                          : [...current, area];
                        setFormData(prev => ({
                          ...prev,
                          organizingDetails: { ...prev.organizingDetails, areas: updated },
                        }));
                      }}
                      className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'border-amber-300 bg-amber-100 text-amber-700 border-2'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>

              {/* その他欄 */}
              <div className="mt-3">
                <label className="block mb-2 text-xs font-medium">その他の場所</label>
                <input
                  type="text"
                  value={formData.organizingDetails?.otherArea || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    organizingDetails: { ...prev.organizingDetails, otherArea: e.target.value },
                  }))}
                  placeholder="例：ベランダ、クローゼット、倉庫など"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* きらりさんの性別希望 */}
        <div>
          <label className="block mb-2 font-medium">きらりさんの性別希望</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genderPreference"
                value="female"
                checked={formData.genderPreference === 'female'}
                onChange={e => setFormData(prev => ({ ...prev, genderPreference: e.target.value }))}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span>女性</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genderPreference"
                value="male"
                checked={formData.genderPreference === 'male'}
                onChange={e => setFormData(prev => ({ ...prev, genderPreference: e.target.value }))}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span>男性</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genderPreference"
                value="any"
                checked={formData.genderPreference === 'any'}
                onChange={e => setFormData(prev => ({ ...prev, genderPreference: e.target.value }))}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span>どちらでも</span>
            </label>
          </div>
        </div>

        {/* 日本語以外でのコミュニケーション希望 */}
        <div>
          <label className="block mb-2 font-medium">日本語以外でのコミュニケーションを希望しますか</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  foreignLanguagePreference: 'yes'
                }));
              }}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                formData.foreignLanguagePreference === 'yes'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-foreground hover:border-primary/50'
              }`}
            >
              希望する
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  foreignLanguagePreference: 'no',
                  foreignLanguageType: '',
                  foreignLanguageOther: ''
                }));
              }}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                formData.foreignLanguagePreference === 'no'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-foreground hover:border-primary/50'
              }`}
            >
              しない
            </button>
          </div>
        </div>

        {/* 希望する言語（「希望する」を選択した場合のみ表示） */}
        {formData.foreignLanguagePreference === 'yes' && (
          <div>
            <label className="block mb-2 font-medium">希望する言語</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="foreignLanguageType"
                  value="english"
                  checked={formData.foreignLanguageType === 'english'}
                  onChange={e => setFormData(prev => ({ ...prev, foreignLanguageType: e.target.value, foreignLanguageOther: '' }))}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span>英語</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="foreignLanguageType"
                  value="chinese"
                  checked={formData.foreignLanguageType === 'chinese'}
                  onChange={e => setFormData(prev => ({ ...prev, foreignLanguageType: e.target.value, foreignLanguageOther: '' }))}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span>中国語</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="foreignLanguageType"
                  value="other"
                  checked={formData.foreignLanguageType === 'other'}
                  onChange={e => setFormData(prev => ({ ...prev, foreignLanguageType: e.target.value }))}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span>その他</span>
              </label>
            </div>
            
            {/* 「その他」を選択した場合の入力欄 */}
            {formData.foreignLanguageType === 'other' && (
              <div className="mt-3">
                <label className="block mb-2 text-sm font-medium">その他の言語を入力してください</label>
                <input
                  type="text"
                  value={formData.foreignLanguageOther || ''}
                  onChange={e => setFormData(prev => ({ ...prev, foreignLanguageOther: e.target.value }))}
                  placeholder="例：スペイン語、フランス語など"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>
            )}
          </div>
        )}

        {/* 在宅状況 */}
        <div>
          <label className="block mb-2 font-medium">サポート中の在宅状況</label>
          {formData.jobType === 'spot' && (
            <p className="text-xs text-muted-foreground mb-2">※最初の1時間と最後の10分はご在宅をお願いしております</p>
          )}
          {formData.jobType === 'spot' ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, homePresence: 'always' }))}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.homePresence === 'always'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-foreground hover:border-primary/50'
                }`}
              >
                完全在宅
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, homePresence: 'sometimes' }))}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.homePresence === 'sometimes'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-foreground hover:border-primary/50'
                }`}
              >
                途中不在
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, homePresence: 'always' }))}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.homePresence === 'always'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-foreground hover:border-primary/50'
                }`}
              >
                基本在宅
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, homePresence: 'sometimes' }))}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.homePresence === 'sometimes'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-foreground hover:border-primary/50'
                }`}
              >
                ときどき在宅
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, homePresence: 'rarely' }))}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.homePresence === 'rarely'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-foreground hover:border-primary/50'
                }`}
              >
                基本不在
              </button>
            </div>
          )}
        </div>

        {/* アピールメッセージ */}
        <div>
          <label className="block mb-2 font-medium">きらりさんへのアピールメッセージ</label>
          <textarea
            value={formData.appealMessage}
            onChange={e => setFormData(prev => ({ ...prev, appealMessage: e.target.value }))}
            placeholder="例：明るく丁寧な方を希望しています。ペット（犬）がいますので、動物が苦手でない方だと助かります。"
            className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
            rows={4}
          />
        </div>

        {/* スペシャルオファー */}
        <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">⭐</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">スペシャルオファー</h3>
              <p className="text-sm text-muted-foreground">
                きらりさんが見つかりやすくなるよう、ご利用料金に上乗せし、きらりさんへの還元額をアップさせるオプションです
              </p>
            </div>
          </div>

          {/* つける/つけない の2択 */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                specialOffer: 0,
                specialOfferReasons: [],
                specialOfferOtherReason: ''
              }))}
              className={`py-2.5 px-4 rounded-lg border-2 transition-colors font-medium ${
                formData.specialOffer === 0
                  ? 'border-orange-500 bg-orange-100 text-orange-700'
                  : 'border-border hover:bg-accent'
              }`}
            >
              つけない
            </button>
            <button
              type="button"
              onClick={() => {
                // 「つける」を選択した場合、デフォルトで200円に設定
                if (formData.specialOffer === 0) {
                  setFormData(prev => ({ ...prev, specialOffer: 200 }));
                }
              }}
              className={`py-2.5 px-4 rounded-lg border-2 transition-colors font-medium ${
                formData.specialOffer > 0
                  ? 'border-orange-500 bg-orange-100 text-orange-700'
                  : 'border-border hover:bg-accent'
              }`}
            >
              つける
            </button>
          </div>

          {/* 「つける」を選択した場合のみ理由選択と金額選択肢を表示 */}
          {formData.specialOffer > 0 && (
            <div className="space-y-3">
              {/* 理由を選択 */}
              <div>
                <label className="block mb-2 text-sm font-medium">スペシャルオファーをつける理由（複数選択可）</label>
                <div className="border-2 border-gray-300 rounded-lg p-3 bg-white space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialOfferReasons?.includes('early-start') || false}
                      onChange={e => {
                        const reasons = formData.specialOfferReasons || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialOfferReasons: [...reasons, 'early-start'] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialOfferReasons: reasons.filter(r => r !== 'early-start') 
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    />
                    <span className="text-sm">早く利用開始したい</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialOfferReasons?.includes('far-from-station') || false}
                      onChange={e => {
                        const reasons = formData.specialOfferReasons || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialOfferReasons: [...reasons, 'far-from-station'] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialOfferReasons: reasons.filter(r => r !== 'far-from-station') 
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    />
                    <span className="text-sm">自宅が駅から遠い</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialOfferReasons?.includes('other') || false}
                      onChange={e => {
                        const reasons = formData.specialOfferReasons || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialOfferReasons: [...reasons, 'other'] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialOfferReasons: reasons.filter(r => r !== 'other'),
                            specialOfferOtherReason: ''
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    />
                    <span className="text-sm">その他</span>
                  </label>
                  
                  {/* 「その他」を選択した場合の入力欄 */}
                  {formData.specialOfferReasons?.includes('other') && (
                    <div className="ml-7">
                      <textarea
                        value={formData.specialOfferOtherReason || ''}
                        onChange={e => setFormData(prev => ({ ...prev, specialOfferOtherReason: e.target.value }))}
                        placeholder="理由を詳しく教えてください"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 金額選択 */}
              <div>
                <label className="block mb-2 text-sm font-medium">1時間あたりの上乗せ額（税抜）</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[200, 300, 400, 500, 600, 800, 1000, 1200, 1500].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, specialOffer: amount }))}
                      className={`py-2 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.specialOffer === amount
                          ? 'border-orange-500 bg-orange-100 text-orange-700 font-bold'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      +{amount.toLocaleString()}円
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground flex-shrink-0">それ以上：</span>
                  <input
                    type="number"
                    value={formData.specialOffer > 1500 ? formData.specialOffer : ''}
                    onChange={e => {
                      const value = parseInt(e.target.value) || 0;
                      if (value >= 200) {
                        setFormData(prev => ({ ...prev, specialOffer: value }));
                      }
                    }}
                    placeholder="1600円〜"
                    min="200"
                    step="100"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-sm"
                  />
                  <span className="text-sm text-muted-foreground">円</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 料金シミュレーション */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-lg">¥</span>
            </div>
            <h3 className="font-bold text-lg">料金シミュレーション</h3>
          </div>

          {formData.jobType === 'regular' && formData.courseDuration && (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 space-y-2">
                {formData.frequencyPeriod && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">月額目安</span>
                      <span className="font-bold text-2xl text-primary">
                        {(() => {
                          const hourlyRate = formData.courseDuration === '1' ? 3300 :
                                            formData.courseDuration === '2' ? 3000 :
                                            formData.courseDuration === '2.5' ? 2850 :
                                            formData.courseDuration === '3' ? 2600 :
                                            formData.courseDuration === '3.5' ? 2500 : 2400;
                          const hours = parseFloat(formData.courseDuration);
                          const count = parseInt(formData.frequencyCount) || 1;
                          let monthlyCount = count;
                          
                          // 週の場合は×4、隔週の場合は×2で月あたり回数を計算
                          if (formData.frequencyPeriod === 'weekly') {
                            monthlyCount = count * 4;
                          } else if (formData.frequencyPeriod === 'biweekly') {
                            monthlyCount = count * 2;
                          }
                          
                          const baseAmount = hours * hourlyRate * monthlyCount;
                          const specialOfferAmount = (formData.specialOffer || 0) * hours * monthlyCount;
                          return (baseAmount + specialOfferAmount).toLocaleString('ja-JP', { maximumFractionDigits: 0 });
                        })()}円
                      </span>
                    </div>
                    {formData.specialOffer > 0 && (
                      <div className="flex justify-between items-center text-sm text-orange-600">
                        <span>（うちスペシャルオファー）</span>
                        <span className="font-medium">
                          +{(() => {
                            const hours = parseFloat(formData.courseDuration);
                            const count = parseInt(formData.frequencyCount) || 1;
                            let monthlyCount = count;
                            if (formData.frequencyPeriod === 'weekly') {
                              monthlyCount = count * 4;
                            } else if (formData.frequencyPeriod === 'biweekly') {
                              monthlyCount = count * 2;
                            }
                            return ((formData.specialOffer || 0) * hours * monthlyCount).toLocaleString('ja-JP');
                          })()}円
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground text-right">
                      ※税抜価格・概算です
                    </p>
                  </>
                )}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">
                  ⏰ 深夜早朝（20:00-翌8:00）のご利用は1時間あたり400円の追加料金がかかります
                </p>
              </div>
            </div>
          )}

          {formData.jobType === 'spot' && formData.spotDate && formData.spotStartTime && formData.spotEndTime && (
            <div className="space-y-3">
              {/* 合計金額のみ表示 */}
              <div className="bg-white rounded-lg p-3">
                {(() => {
                  const start = formData.spotStartTime.split(':').map(Number);
                  const end = formData.spotEndTime.split(':').map(Number);
                  const startMinutes = start[0] * 60 + start[1];
                  const endMinutes = end[0] * 60 + end[1];
                  
                  // 深夜時間帯（20:00-翌8:00）の計算
                  const nightStart = 20 * 60;
                  const nightEnd = 8 * 60;
                  let nightMinutes = 0;
                  
                  if (start[0] >= 20) {
                    if (end[0] >= 20 || end[0] < 8) {
                      if (end[0] >= 20) {
                        nightMinutes = endMinutes - startMinutes;
                      } else {
                        nightMinutes = (24 * 60 - startMinutes) + endMinutes;
                      }
                    }
                  } else if (start[0] < 8) {
                    if (end[0] < 8) {
                      nightMinutes = endMinutes - startMinutes;
                    } else if (end[0] >= 20) {
                      nightMinutes = (nightEnd - startMinutes) + (endMinutes - nightStart);
                    } else {
                      nightMinutes = nightEnd - startMinutes;
                    }
                  } else if (start[0] < 20 && end[0] >= 20) {
                    nightMinutes = endMinutes - nightStart;
                  }
                  
                  const nightHours = nightMinutes / 60;
                  const totalMinutes = endMinutes - startMinutes;
                  const totalHours = totalMinutes / 60;
                  const regularHours = totalHours - nightHours;
                  
                  const regularFee = regularHours * 3800;
                  const nightFee = nightHours * (3800 + 400);
                  const baseFee = regularFee + nightFee;
                  const specialOfferFee = (formData.specialOffer || 0) * totalHours;
                  const totalFee = baseFee + specialOfferFee;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">合計金額</span>
                        <span className="font-bold text-2xl text-primary">
                          {Math.ceil(totalFee).toLocaleString()}円
                        </span>
                      </div>
                      {formData.specialOffer > 0 && (
                        <div className="flex justify-between items-center text-sm text-orange-600">
                          <span>（うちスペシャルオファー）</span>
                          <span className="font-medium">
                            +{Math.ceil(specialOfferFee).toLocaleString()}円
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground text-right">
                        ※税抜価格・概算です
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">
                  ⏰ 深夜早朝（20:00-翌8:00）のご利用は1時間あたり400円の追加料金がかかります
                </p>
              </div>
            </div>
          )}

          {!formData.jobType && (
            <p className="text-sm text-muted-foreground text-center py-2">
              サポートタイプを選択すると料金が表示されます
            </p>
          )}
          
          {formData.jobType === 'regular' && !formData.courseDuration && (
            <p className="text-sm text-muted-foreground text-center py-2">
              コースを選択すると料金が表示されます
            </p>
          )}

          {formData.jobType === 'spot' && (!formData.spotDate || !formData.spotStartTime || !formData.spotEndTime) && (
            <p className="text-sm text-muted-foreground text-center py-2">
              訪問希望日時を入力すると料金が表示されます
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => onSave(formData)}
            disabled={!hasRequiredFieldsForPosting()}
            className={`flex-1 py-3 rounded-lg font-medium ${
              hasRequiredFieldsForPosting()
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            保存
          </button>
        </div>
      </form>

      {/* 公開確認モーダル（スポットのみ） */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-lg">募集を公開しますか？</h3>
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* 新人きらりさんマッチングオプション */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptNewKirari || false}
                    onChange={e => setFormData(prev => ({ ...prev, acceptNewKirari: e.target.checked }))}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🌟</span>
                      <span className="font-bold text-purple-900">新人きらりさんとマッチングしてもよい</span>
                    </div>
                    <p className="text-sm text-purple-800 mb-2">
                      経験は浅いですが、やる気満々の新人きらりさんとのマッチングも検討します
                    </p>
                    <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-3 border border-amber-300">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎁</span>
                        <div>
                          <p className="font-bold text-amber-900 text-base">
                            評価にご協力いただけた方は、2,000円割引！
                          </p>
                          <p className="text-xs text-amber-800 mt-1">
                            サポート後のアンケートにご協力いただくと、次回のご利用時に割引が適用されます
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  戻る
                </button>
                <button
                  onClick={handleConfirmPublish}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-bold"
                >
                  公開する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* プレビューモーダル */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">募集詳細</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    きらりさんからはこのように見えます
                  </p>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-accent rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 案件詳細プレビュー */}
            <div className="p-6 space-y-6">
              {/* タイトル・ステータス */}
              <div>
                <h4 className="font-bold text-lg mb-2">
                  {formData.jobType === 'spot' ? 'スポット' : '定期'} - {formData.servicePriorities.map(s => s.service).join('・')}
                </h4>
                <div className="inline-block">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">募集中</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* エリア */}
                <div>
                  <label className="text-sm text-muted-foreground">エリア</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-primary" />
                    <p className="font-medium">{formData.address.includes('区') ? formData.address.split('区')[0] + '区周辺' : formData.address}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ※詳細住所はマッチング成立後に表示されます
                  </p>
                </div>

                {/* 訪問日時・頻度 */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    {formData.jobType === 'spot' ? '訪問希望日時' : '訪問頻度'}
                  </label>
                  {formData.jobType === 'spot' ? (
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <p className="font-medium">{formData.spotDate || '未設定'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <p className="font-medium">
                          {formData.spotStartTime || '未設定'} 〜 {formData.spotEndTime || '未設定'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <p className="font-medium">
                          {formData.frequencyPeriod === 'weekly' ? '週' : formData.frequencyPeriod === 'biweekly' ? '隔週' : '月'}
                          {formData.frequencyCount}回
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 定期の場合：希望曜日・時間 */}
                {formData.jobType === 'regular' && formData.weeklySchedule.length > 0 && (
                  <>
                    <div>
                      <label className="text-sm text-muted-foreground">希望曜日</label>
                      <p className="font-medium mt-1">
                        {formData.weeklySchedule.map(s => s.day).join('・')}曜日
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">希望時間</label>
                      {formData.weeklySchedule.map((schedule, idx) => (
                        <div key={idx} className="flex items-center gap-2 mt-1">
                          <Clock size={16} className="text-primary" />
                          <p className="font-medium">
                            {schedule.day}曜日 {schedule.startTime}〜{schedule.endTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* コース時間 */}
                <div>
                  <label className="text-sm text-muted-foreground">コース時間</label>
                  <p className="font-medium mt-1">
                    {formData.jobType === 'regular' ? (
                      formData.courseDuration === 'custom' 
                        ? `${formData.customDuration}時間` 
                        : `${formData.courseDuration}時間`
                    ) : (
                      formData.spotStartTime && formData.spotEndTime 
                        ? `${formData.spotStartTime}〜${formData.spotEndTime}` 
                        : '未設定'
                    )}
                  </p>
                </div>

                {/* 依頼内容（サポート概要） */}
                <div>
                  <label className="text-sm text-muted-foreground">依頼内容</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.servicePriorities.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                      >
                        優先度{service.priority}: {service.service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 料理の詳細 */}
                {formData.servicePriorities.some(s => s.service === '料理') && formData.cookingDetails && (
                  <div className="border-l-4 border-primary pl-3">
                    <label className="text-sm font-medium text-primary">料理の詳細</label>
                    <div className="mt-2 space-y-2 text-sm">
                      {formData.cookingDetails.dishCount && (
                        <div>
                          <span className="text-muted-foreground">品数：</span>
                          <span className="font-medium">{formData.cookingDetails.dishCount}</span>
                        </div>
                      )}
                      {formData.cookingDetails.servings && (
                        <div>
                          <span className="text-muted-foreground">人数：</span>
                          <span className="font-medium">{formData.cookingDetails.servings}</span>
                        </div>
                      )}
                      {formData.cookingDetails.when && (
                        <div>
                          <span className="text-muted-foreground">作るタイミング：</span>
                          <span className="font-medium">{formData.cookingDetails.when}</span>
                        </div>
                      )}
                      {formData.cookingDetails.babyFood && (
                        <div>
                          <span className="text-muted-foreground">離乳食：</span>
                          <span className="font-medium">{formData.cookingDetails.babyFood}</span>
                        </div>
                      )}
                      {formData.cookingDetails.menu && (
                        <div>
                          <span className="text-muted-foreground">献立：</span>
                          <span className="font-medium">{formData.cookingDetails.menu}</span>
                        </div>
                      )}
                      {formData.cookingDetails.ingredients && (
                        <div>
                          <span className="text-muted-foreground">食材：</span>
                          <span className="font-medium">{formData.cookingDetails.ingredients}</span>
                        </div>
                      )}
                      {formData.cookingDetails.hasAllergy === 'yes' && (
                        <div>
                          <span className="text-muted-foreground">アレルギー：</span>
                          <span className="font-medium">
                            {formData.cookingDetails.allergyItems?.join('、')}
                            {formData.cookingDetails.allergyOther && ` / ${formData.cookingDetails.allergyOther}`}
                          </span>
                        </div>
                      )}
                      {formData.cookingDetails.cookingNotes && (
                        <div>
                          <span className="text-muted-foreground">備考：</span>
                          <p className="font-medium whitespace-pre-wrap">{formData.cookingDetails.cookingNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 掃除の詳細 */}
                {formData.servicePriorities.some(s => s.service === '掃除') && formData.cleaningDetails && (
                  <div className="border-l-4 border-primary pl-3">
                    <label className="text-sm font-medium text-primary">掃除の詳細</label>
                    <div className="mt-2 space-y-2 text-sm">
                      {formData.cleaningDetails.hasWaterArea === 'yes' && formData.cleaningDetails.waterAreas && (
                        <div>
                          <span className="text-muted-foreground">水周り：</span>
                          <span className="font-medium">{formData.cleaningDetails.waterAreas.join('、')}</span>
                        </div>
                      )}
                      {formData.cleaningDetails.otherAreas && formData.cleaningDetails.otherAreas.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">その他の掃除場所：</span>
                          <span className="font-medium">{formData.cleaningDetails.otherAreas.join('、')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 在宅状況 */}
                {formData.homePresence && (
                  <div>
                    <label className="text-sm text-muted-foreground">在宅状況</label>
                    <p className="font-medium mt-1">{formData.homePresence}</p>
                  </div>
                )}

                {/* 家族構成 */}
                {formData.familyType && (
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users size={14} />
                      家族構成
                    </label>
                    <p className="font-medium mt-1">{formData.familyType}</p>
                    {formData.familyDetails && formData.familyDetails.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.familyDetails.map((member, idx) => (
                          <div key={idx} className="text-sm flex gap-2">
                            <span className="text-muted-foreground">{member.relation}：</span>
                            <span className="font-medium">
                              {member.age}
                              {member.gender && ` / ${member.gender}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 住居情報 */}
                {formData.housingType && (
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Home size={14} />
                      住居情報
                    </label>
                    <div className="mt-1 space-y-1">
                      <p className="font-medium">{formData.housingType}</p>
                      {formData.housingType === 'マンション' && formData.apartmentFloor && (
                        <div className="text-sm space-y-1">
                          <p><span className="text-muted-foreground">階数：</span>{formData.apartmentFloor}</p>
                          {formData.hasElevator !== undefined && (
                            <p><span className="text-muted-foreground">エレベーター：</span>{formData.hasElevator ? 'あり' : 'なし'}</p>
                          )}
                          {formData.hasStairs !== undefined && (
                            <p><span className="text-muted-foreground">階段：</span>{formData.hasStairs ? 'あり' : 'なし'}</p>
                          )}
                          {formData.hasHandrail !== undefined && (
                            <p><span className="text-muted-foreground">手すり：</span>{formData.hasHandrail ? 'あり' : 'なし'}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* アクセス情報 */}
                {formData.nearestStation && (
                  <div>
                    <label className="text-sm text-muted-foreground">アクセス</label>
                    <div className="mt-1 space-y-1">
                      <p className="font-medium">
                        {formData.nearestStation}から{formData.accessMethod === 'walk' ? '徒歩' : 'バス'}{formData.accessTime}分
                      </p>
                      {formData.carParking && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <span>🚗</span>
                          <span>駐車場あり</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* きらりさんの性別希望 */}
                {formData.genderPreference && (
                  <div>
                    <label className="text-sm text-muted-foreground">きらりさんの性別希望</label>
                    <p className="font-medium mt-1">{formData.genderPreference}</p>
                  </div>
                )}

                {/* 日本語以外のコミュニケーション */}
                {formData.foreignLanguagePreference === 'yes' && (
                  <div>
                    <label className="text-sm text-muted-foreground">日本語以外のコミュニケーション</label>
                    <p className="font-medium mt-1">
                      {formData.foreignLanguageType === 'その他' && formData.foreignLanguageOther 
                        ? formData.foreignLanguageOther 
                        : formData.foreignLanguageType}
                    </p>
                  </div>
                )}

                {/* アピールメッセージ */}
                {formData.appealMessage && (
                  <div>
                    <label className="text-sm text-muted-foreground">アピールメッセージ</label>
                    <p className="leading-relaxed mt-1 whitespace-pre-wrap">{formData.appealMessage}</p>
                  </div>
                )}

                {/* スペシャルオファー */}
                {formData.specialOffer && formData.specialOffer > 0 && (
                  <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⭐</span>
                      <span className="font-bold text-orange-700">スペシャルオファー</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">上乗せ額：</span><span className="font-bold text-orange-700">+{formData.specialOffer.toLocaleString()}円/時間</span></p>
                      {formData.specialOfferReasons && formData.specialOfferReasons.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">理由：</span>
                          <div className="mt-1 space-y-1">
                            {formData.specialOfferReasons.includes('early-start') && (
                              <p className="text-xs">• 早く利用開始したい</p>
                            )}
                            {formData.specialOfferReasons.includes('far-from-station') && (
                              <p className="text-xs">• 自宅が駅から遠い</p>
                            )}
                            {formData.specialOfferReasons.includes('other') && formData.specialOfferOtherReason && (
                              <p className="text-xs">• その他：{formData.specialOfferOtherReason}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* スポット：新人きらりさんOK */}
                {formData.jobType === 'spot' && formData.acceptNewKirari && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌟</span>
                      <span className="font-bold text-purple-900">新人きらりさんOK</span>
                    </div>
                    <p className="text-xs text-purple-800 mt-1">
                      評価にご協力いただけた方は、2,000円割引！
                    </p>
                  </div>
                )}

                {/* スポット：定期への意向 */}
                {formData.jobType === 'spot' && formData.consideringRegular && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💡</span>
                      <span className="font-bold text-blue-900">定期利用も検討中</span>
                    </div>
                    {formData.futureRegularFrequencyPeriod && formData.futureRegularCourseDuration && (
                      <div className="text-sm space-y-1">
                        <p className="text-blue-800">
                          <span className="text-muted-foreground">希望頻度：</span>
                          {formData.futureRegularFrequencyPeriod === 'weekly' ? '週' : 
                           formData.futureRegularFrequencyPeriod === 'biweekly' ? '隔週' : '月'}
                          {formData.futureRegularFrequencyCount || 1}回
                        </p>
                        <p className="text-blue-800">
                          <span className="text-muted-foreground">希望時間：</span>
                          {formData.futureRegularCourseDuration === 'custom' 
                            ? `${formData.futureRegularCustomDuration}時間` 
                            : `${formData.futureRegularCourseDuration}時間`}
                        </p>
                        {formData.futureRegularWeeklySchedule && formData.futureRegularWeeklySchedule.length > 0 && (
                          <div className="text-blue-800">
                            <span className="text-muted-foreground">希望曜日・時間：</span>
                            <div className="mt-1 space-y-1">
                              {formData.futureRegularWeeklySchedule.map((schedule, idx) => (
                                <p key={idx} className="text-xs">
                                  {schedule.day}曜日 {schedule.startTime}〜{schedule.endTime}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 1回あたりの料金 */}
                <div>
                  <label className="text-sm text-muted-foreground">1回あたりの料金</label>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ¥{calculateTotalPrice().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="sticky bottom-0 bg-white border-t border-border p-4 flex gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                編集する
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  onNavigateHome && onNavigateHome();
                }}
                className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功モーダル */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 text-center space-y-4">
              {/* アニメーション付き絵文字 */}
              <div className="text-7xl animate-bounce">
                🎉
              </div>
              
              {/* タイトル */}
              <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                募集を公開しました！
              </h3>
              
              {/* サブタイトル */}
              <div className="space-y-2">
                <p className="text-lg font-bold text-gray-800">
                  応募をお待ちください 🥳
                </p>
                <p className="text-sm text-gray-600">
                  素敵なきらりさんとのマッチングをお楽しみに！
                </p>
              </div>

              {/* キラキラエフェクト */}
              <div className="flex justify-center gap-3 text-3xl">
                <span className="animate-pulse">✨</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>💫</span>
              </div>

              {/* ボタン */}
              <button
                onClick={() => {
                  onSave(formData);
                  setShowSuccessModal(false);
                  setShowPreviewModal(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                公開内容を確認する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}