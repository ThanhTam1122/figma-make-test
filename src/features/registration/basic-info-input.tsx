import React, { useState } from 'react';
import { MapPin, Train, Home, Users, ChevronRight, Loader2 } from 'lucide-react';
import { FloorPicker } from '@/shared/ui/floor-picker';

interface BasicInfo {
  postalCode: string;
  prefecture: string;
  city: string;
  town: string; // 町域名
  streetAddress: string; // 番地
  housingType: 'detached' | 'apartment'; // 戸建て／集合住宅
  building: string; // 建物名・部屋番号（集合住宅の場合のみ）
  // 集合住宅の追加情報
  apartmentHasElevator?: boolean; // エレベーター有無
  apartmentFloorNumber?: string; // お住まいの階数
  // 戸建ての追加情報
  hasIndoorStairs?: boolean; // 室内階段有無
  hasHandrails?: boolean; // 手すり有無
  nearestStation: string;
  accessTime: string;
  accessMethod: 'walk' | 'bus';
  busRideTime?: string; // 乗車時間
  busStopToHomeTime?: string; // バス停から徒歩
  busStopName?: string; // バス停名（任意）
  carParking: boolean;
  bicycleParking?: boolean; // 自転車通勤可
  buildingType: 'house' | 'apartment' | 'mansion';
  buildingName?: string;
  roomNumber?: string;
  floor?: string;
  hasElevator?: boolean;
  hasAutoLock?: boolean;
  accessNotes?: string;
  roomCount?: string;
  familyType: string;
  familyDetails: Array<{
    relation: string;
    age: string;
    gender?: string; // 子どもの性別
  }>;
  hasPets: boolean; // ペットの有無
  pets: Array<{
    type: string; // 犬、猫、その他小動物
    count: string; // 匹数
    breed?: string; // 犬種（犬の場合のみ）
  }>;
  familyPhoto?: File;
  address: string; // 後方互換性のため残す
  hasSteepSlope?: boolean; // 急な坂道の有無
  interferenceDegree?: string; // おせっかい度
}

interface BasicInfoInputProps {
  onComplete: (info: BasicInfo) => void;
}

export function BasicInfoInput({ onComplete }: BasicInfoInputProps) {
  const [step, setStep] = useState<'address' | 'family'>('address');
  const [formData, setFormData] = useState<BasicInfo>({
    postalCode: '',
    prefecture: '',
    city: '',
    town: '',
    streetAddress: '',
    housingType: 'apartment',
    building: '',
    address: '',
    nearestStation: '',
    accessTime: '10',
    accessMethod: 'walk',
    carParking: false,
    buildingType: 'apartment',
    roomCount: '',
    familyType: '',
    familyDetails: [],
    hasPets: false,
    pets: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showInterferencePopup, setShowInterferencePopup] = useState(false);
  const [showFloorPicker, setShowFloorPicker] = useState(false);

  // 郵便番号から住所を自動検索
  const searchAddress = async (postalCode: string) => {
    const cleanedPostalCode = postalCode.replace(/-/g, '');
    
    if (cleanedPostalCode.length !== 7 || !/^\d+$/.test(cleanedPostalCode)) {
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanedPostalCode}`);
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setFormData(prev => ({
          ...prev,
          postalCode: postalCode,
          prefecture: result.address1,
          city: result.address2,
          town: result.address3,
          streetAddress: result.address4,
        }));
      } else {
        // 郵便番号が見つからない場合は静かに失敗（手動入力を促す）
        console.log('郵便番号が見つかりませんでした。手動で入力してください。');
      }
    } catch (error) {
      // ネットワークエラーやCORSエラーの場合は静かに失敗
      console.log('郵便番号の自動検索は利用できません。手動で入力してください。', error);
      // エラーを表示せず、ユーザーに手動入力を促す
    } finally {
      setIsSearching(false);
    }
  };

  const handlePostalCodeChange = (value: string) => {
    setFormData(prev => ({ ...prev, postalCode: value }));
    
    const cleanedValue = value.replace(/-/g, '');
    if (cleanedValue.length === 7) {
      searchAddress(value);
    }
  };

  const handleNext = () => {
    if (step === 'address') setStep('family');
  };

  const handleBack = () => {
    if (step === 'family') setStep('address');
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const isStepValid = () => {
    // デモ用にすべてのバリデーションを外す
    return true;
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

  const addPet = () => {
    setFormData(prev => ({
      ...prev,
      pets: [...prev.pets, { type: '', count: '' }],
    }));
  };

  const removePet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.filter((_, i) => i !== index),
    }));
  };

  const updatePet = (index: number, field: 'type' | 'count' | 'breed', value: string) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.map((pet, i) =>
        i === index ? { ...pet, [field]: value } : pet
      ),
    }));
  };

  const progressPercentage = {
    address: 25,
    family: 75,
  }[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">マッチングに必要な情報を入力しよう</h2>
        <p className="text-sm opacity-90">
          登録後、マイページからいつでも変更できます
        </p>
        
        {/* プログレスバー */}
        <div className="mt-4">
          <div className="w-full h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs mt-2 opacity-75">{progressPercentage}% 完了</p>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 p-4 overflow-auto pb-24">
        {/* 住所入力 */}
        {step === 'address' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">住所情報</h3>
                <p className="text-sm text-muted-foreground">ご自宅の住所を入力してください</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              💡 郵便番号を入力すると自動で住所が検索されます
            </p>

            <div>
              <label className="block mb-2 font-medium">
                郵便番号
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={e => handlePostalCodeChange(e.target.value)}
                placeholder="例）150-0001"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              {isSearching && (
                <div className="absolute right-3 top-3">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-2 font-medium">
                  都道府県
                </label>
                <input
                  type="text"
                  value={formData.prefecture}
                  onChange={e => setFormData(prev => ({ ...prev, prefecture: e.target.value }))}
                  placeholder="例）東京都"
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  市区町村
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="例）渋谷区"
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                町域名
              </label>
              <input
                type="text"
                value={formData.town}
                onChange={e => setFormData(prev => ({ ...prev, town: e.target.value }))}
                placeholder="例）道玄坂"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                番地
              </label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={e => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                placeholder="例）1-2"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                戸建て／集合住宅
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, housingType: 'detached' }))}
                  className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                    formData.housingType === 'detached'
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  戸建て
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, housingType: 'apartment' }))}
                  className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                    formData.housingType === 'apartment'
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  集合住宅
                </button>
              </div>
            </div>

            {/* 集合住宅を選択した場合のみ建物名・部屋番号を表示 */}
            {formData.housingType === 'apartment' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">
                    建物名・部屋番号
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={e => setFormData(prev => ({ ...prev, building: e.target.value }))}
                    placeholder="例）サンシャインマンション 305号室"
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                {/* エレベーター有無 */}
                <div>
                  <label className="block mb-2 font-medium">
                    エレベーター
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, apartmentHasElevator: true }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.apartmentHasElevator === true
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      エレベーターあり
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, apartmentHasElevator: false }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.apartmentHasElevator === false
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      階段のみ
                    </button>
                  </div>
                </div>

                {/* お住まいの階数 */}
                <div>
                  <label className="block mb-2 font-medium">
                    お住まいの階数
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowFloorPicker(true)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none text-left flex items-center justify-between"
                  >
                    <span className={formData.apartmentFloorNumber ? '' : 'text-muted-foreground'}>
                      {formData.apartmentFloorNumber ? `${formData.apartmentFloorNumber}階` : '階数を選択'}
                    </span>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 タップして階数を選択してください
                  </p>
                </div>

                {/* 室内階段の有無 */}
                <div>
                  <label className="block mb-2 font-medium">
                    室内階段
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasIndoorStairs: true }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasIndoorStairs === true
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      あり
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasIndoorStairs: false }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasIndoorStairs === false
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>

                {/* 手すりの有無 */}
                <div>
                  <label className="block mb-2 font-medium">
                    手すり
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasHandrails: true }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasHandrails === true
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      あり
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasHandrails: false }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasHandrails === false
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 戸建てを選択した場合のみ階段・手すり情報を表示 */}
            {formData.housingType === 'detached' && (
              <div className="space-y-4">
                {/* 室内階段の有無 */}
                <div>
                  <label className="block mb-2 font-medium">
                    室内階段
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasIndoorStairs: true }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasIndoorStairs === true
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      あり
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasIndoorStairs: false }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasIndoorStairs === false
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      なし（平屋）
                    </button>
                  </div>
                </div>

                {/* 手すりの有無 */}
                <div>
                  <label className="block mb-2 font-medium">
                    手すり
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasHandrails: true }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasHandrails === true
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      あり
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasHandrails: false }))}
                      className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                        formData.hasHandrails === false
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 車通勤可・自転車通勤可 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                <input
                  type="checkbox"
                  id="carParking"
                  checked={formData.carParking}
                  onChange={e => setFormData(prev => ({ ...prev, carParking: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="carParking" className="text-sm">
                  車通勤可（自宅に無料駐車場あり）
                </label>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                <input
                  type="checkbox"
                  id="bicycleParking"
                  checked={formData.bicycleParking || false}
                  onChange={e => setFormData(prev => ({ ...prev, bicycleParking: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="bicycleParking" className="text-sm">
                  自転車通勤可
                </label>
              </div>
            </div>

            {/* 間取り */}
            <div>
              <label className="block mb-2 font-medium">
                間取り
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['ワンルーム', '1K', '1DK', '1LDK', '2DK', '2LDK', '3DK', '3LDK', 'その他'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, roomCount: type }))}
                    className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                      formData.roomCount === type
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {formData.roomCount === 'その他' && (
              <div>
                <label className="block mb-2 text-sm font-medium">間取り詳細</label>
                <input
                  type="text"
                  value={formData.roomCount || ''}
                  onChange={e => setFormData(prev => ({ ...prev, roomCount: e.target.value }))}
                  placeholder="例）5LDK"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                💡 間取り情報は、きらりさんが作業時間の目安を把握するのに役立ちます
              </p>
            </div>
          </div>
        )}

        {/* 家族構成 */}
        {step === 'family' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">家族構成</h3>
                <p className="text-sm text-muted-foreground">ご家族の構成を教えてください</p>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                家族構成
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['単身', '夫婦・カップル', '夫婦＋子ども', 'その他'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, familyType: type }));
                      // 家族構成に応じて家族詳細を自動設定
                      if (type === '単身') {
                        setFormData(prev => ({
                          ...prev,
                          familyType: type,
                          familyDetails: [{ relation: '本人', age: '' }]
                        }));
                      } else if (type === '夫婦・カップル') {
                        setFormData(prev => ({
                          ...prev,
                          familyType: type,
                          familyDetails: [
                            { relation: '本人', age: '' },
                            { relation: '', age: '' }
                          ]
                        }));
                      } else if (type === '夫婦＋子ども') {
                        setFormData(prev => ({
                          ...prev,
                          familyType: type,
                          familyDetails: [
                            { relation: '本人', age: '' },
                            { relation: '', age: '' },
                            { relation: '', age: '' }
                          ]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          familyType: type,
                          familyDetails: [
                            { relation: '本人', age: '' },
                            { relation: '', age: '' }
                          ]
                        }));
                      }
                    }}
                    className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                      formData.familyType === type
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 家族詳細（自動生成） */}
            {formData.familyType && formData.familyType !== 'その他' && (
              <div>
                <label className="block mb-2 font-medium">家族詳細</label>
                <p className="text-xs text-muted-foreground mb-3">
                  本人から見た続柄と年齢を入力してください
                </p>
                <div className="space-y-2">
                  {formData.familyDetails.map((member, index) => {
                    const isChild = member.relation.includes('子ども');
                    // プレースホルダーを動的に設定
                    let relationPlaceholder = '続柄';
                    let agePlaceholder = '35';
                    
                    if (formData.familyType === '夫婦・カップル') {
                      if (index === 0) {
                        relationPlaceholder = '本人'; // 1行目は本人（固定）
                      } else {
                        relationPlaceholder = '夫、妻など';
                      }
                    } else if (formData.familyType === '夫婦＋子ども') {
                      if (index === 0) {
                        relationPlaceholder = '本人'; // 1行目は本人（固定）
                      } else if (index === 1) {
                        relationPlaceholder = '夫、妻など';
                      } else {
                        relationPlaceholder = '長女、長男など';
                        agePlaceholder = '5';
                      }
                    }
                    
                    return (
                      <div key={index}>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={member.relation || ''}
                            onChange={e => updateFamilyMember(index, 'relation', e.target.value)}
                            placeholder={relationPlaceholder}
                            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-input-background"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={member.age || ''}
                              onChange={e => updateFamilyMember(index, 'age', e.target.value)}
                              placeholder={agePlaceholder}
                              className="w-20 px-3 py-2 border border-border rounded-lg bg-input-background text-sm"
                            />
                            <span className="text-muted-foreground text-sm">歳</span>
                          </div>
                          {/* 夫婦＋子どもの場合、子どもの欄は削除可能 */}
                          {formData.familyType === '夫婦＋子ども' && isChild && (
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                            >
                              削除
                            </button>
                          )}
                        </div>
                        
                        {/* すべてのメンバーに性別選択を表示 */}
                        <div className="mt-2 ml-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">性別:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const isChild = member.relation.includes('子ども') || index >= 2;
                                updateFamilyMember(index, 'gender', isChild ? '男の子' : '男性');
                              }}
                              className={`px-3 py-1 rounded-lg border text-sm ${
                                member.gender === '男性' || member.gender === '男の子'
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              {(member.relation.includes('子ども') || index >= 2) ? '男の子' : '男性'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const isChild = member.relation.includes('子ども') || index >= 2;
                                updateFamilyMember(index, 'gender', isChild ? '女の子' : '女性');
                              }}
                              className={`px-3 py-1 rounded-lg border text-sm ${
                                member.gender === '女性' || member.gender === '女の子'
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              {(member.relation.includes('子ども') || index >= 2) ? '女の子' : '女性'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* 夫婦＋子どもの場合、子どもを追加できる */}
                {formData.familyType === '夫婦＋子ども' && (
                  <button
                    type="button"
                    onClick={() => {
                      const childCount = formData.familyDetails.filter(m => m.relation.includes('子ども')).length;
                      setFormData(prev => ({
                        ...prev,
                        familyDetails: [...prev.familyDetails, { relation: `子ども${childCount > 1 ? childCount : ''}`, age: '', gender: '' }]
                      }));
                    }}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    + 子どもを追加
                  </button>
                )}
              </div>
            )}

            {/* その他の場合は自由に追加 */}
            {formData.familyType === 'その他' && (
              <div>
                <label className="block mb-2 font-medium">家族詳細</label>
                <p className="text-xs text-muted-foreground mb-3">
                  本人から見た続柄と年齢を入力してください
                </p>
                <div className="space-y-2">
                {formData.familyDetails.map((member, index) => (
                    <div key={index}>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={member.relation || ''}
                          onChange={e => updateFamilyMember(index, 'relation', e.target.value)}
                          placeholder={index === 0 ? '本人' : index === 1 ? '妹、友人など' : '続柄'}
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-input-background text-sm"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={member.age || ''}
                            onChange={e => updateFamilyMember(index, 'age', e.target.value)}
                            placeholder="35"
                            className="w-20 px-3 py-2 border border-border rounded-lg bg-input-background text-sm"
                          />
                          <span className="text-muted-foreground text-sm">歳</span>
                        </div>
                      </div>
                      
                      {/* すべてのメンバーに性別選択を表示 */}
                      <div className="mt-2 ml-2 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">性別:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateFamilyMember(index, 'gender', '男性')}
                            className={`px-3 py-1 rounded-lg border text-sm ${
                              member.gender === '男性'
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-border hover:bg-accent'
                            }`}
                          >
                            男性
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFamilyMember(index, 'gender', '女性')}
                            className={`px-3 py-1 rounded-lg border text-sm ${
                              member.gender === '女性'
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-border hover:bg-accent'
                            }`}
                          >
                            性
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  + 追加
                </button>
              </div>
            )}

            {/* ペット情報 */}
            <div>
              <label className="block mb-2 font-medium">ペット</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasPets: false, pets: [] }))}
                  className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                    !formData.hasPets
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  なし
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      hasPets: true,
                      // 「あり」を選択したら1匹分を自動生成
                      pets: prev.pets.length === 0 ? [{ type: '', count: '', breed: '' }] : prev.pets
                    }));
                  }}
                  className={`py-2.5 px-3 rounded-lg border-2 transition-colors text-sm ${
                    formData.hasPets
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  あり
                </button>
              </div>

              {/* ペット「あり」を選択した場合のみ詳細入力欄を表示 */}
              {formData.hasPets && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    🐱🐶 ペットの詳細情報を入力してください
                  </p>
                  <div className="space-y-2">
                    {formData.pets.map((pet, index) => (
                      <div key={index} className="space-y-2 p-3 bg-accent/30 rounded-lg">
                        <div className="flex gap-2 items-center">
                          {/* ペットの種類（プルダウン） */}
                          <select
                            value={pet.type}
                            onChange={e => updatePet(index, 'type', e.target.value)}
                            className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-sm"
                          >
                            <option value="">種類を選択</option>
                            <option value="犬">犬</option>
                            <option value="猫">猫</option>
                            <option value="鳥">鳥</option>
                            <option value="へび">へび</option>
                            <option value="その他小動物">その他小動物</option>
                          </select>
                          
                          {/* 匹数 */}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={pet.count || ''}
                              onChange={e => updatePet(index, 'count', e.target.value)}
                              placeholder="1"
                              className="w-16 px-3 py-2 border border-border rounded-lg bg-white text-sm"
                            />
                            <span className="text-muted-foreground text-sm">匹</span>
                          </div>
                          
                          {/* 2匹目以降は削除可能 */}
                          {index >= 1 && (
                            <button
                              type="button"
                              onClick={() => removePet(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                            >
                              削除
                            </button>
                          )}
                          
                          {/* 1匹目は削除ボタンのスペース確保 */}
                          {index === 0 && (
                            <div className="w-[52px]"></div>
                          )}
                        </div>
                        
                        {/* 詳細情報（犬種や動物名など） */}
                        <div>
                          <input
                            type="text"
                            value={pet.breed || ''}
                            onChange={e => updatePet(index, 'breed', e.target.value)}
                            placeholder={
                              pet.type === '犬' ? '犬種（例：柴犬、トイプードル）' :
                              pet.type === '猫' ? '猫種（例：アメリカンショートヘア、雑種）' :
                              pet.type === '鳥' ? '鳥の種類（例：インコ、文鳥）' :
                              pet.type === 'へび' ? '蛇の種類（例：ボールパイソン）' :
                              pet.type === 'その他小動物' ? '動物名（例：ハムスター、ウサギ）' :
                              '詳細情報（品種、種類など）'
                            }
                            className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addPet}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    + ペットを追加
                  </button>
                </div>
              )}
            </div>

            {/* 家族写真アップロード（任意） */}
            <div>
              <label className="block mb-2 font-medium">家族写真（任意）</label>
              <p className="text-xs text-muted-foreground mb-3">
                📷 ご家族の雰囲気がわかる写真があると見つかりやすくなります<br />
                🔒 登録ワーカーのみに公開れます
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // 画像ファイルの処理（実際にはアップロード処理を実装）
                      console.log('Selected file:', file);
                      setFormData(prev => ({ ...prev, familyPhoto: file }));
                    }
                  }}
                  className="hidden"
                  id="familyPhotoUpload"
                />
                <label htmlFor="familyPhotoUpload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary">写真を選択</p>
                    <p className="text-xs text-muted-foreground mt-1">タップして画像を選択</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フッターボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="flex gap-3">
          {step !== 'address' && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-border rounded-lg hover:bg-accent font-medium"
            >
              戻る
            </button>
          )}
          
          {step !== 'family' ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isStepValid()
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              次へ
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowInterferencePopup(true)}
              disabled={!isStepValid()}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isStepValid()
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              次へ
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* おせっかい度選択ポップアップ */}
      {showInterferencePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold">
                「おせっかい度」のご希望<br />を教えてください👵💞
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                きらりさんは、家事代行やベビーシッターの枠を超えて、まるで本当の家族のような関係でサポートしてくれる存在です💓
              </p>
            </div>

            <div className="space-y-2">
              {[
                'たくさんおせっかいを焼いてほしい',
                'ほどほどにおせっかいを焼いてほしい',
                'おせっかいは控えめがいい',
                'おせっかいは特に必要ない'
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, interferenceDegree: option }));
                    setShowInterferencePopup(false);
                    handleComplete();
                  }}
                  className="w-full py-3 px-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-colors text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 階数選択ピッカー */}
      {showFloorPicker && (
        <FloorPicker
          value={formData.apartmentFloorNumber || '1'}
          onChange={(floor) => {
            setFormData(prev => ({ ...prev, apartmentFloorNumber: floor }));
          }}
          onClose={() => setShowFloorPicker(false)}
        />
      )}
    </div>
  );
}