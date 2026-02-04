import React, { useState } from 'react';
import { ChevronRight, User, Phone, Mail, Home, Users, FileText, Bell, Lock, LogOut, MapPin, Camera, Eye, EyeOff } from 'lucide-react';

interface ProfilePageProps {
  userType: 'client' | 'supporter';
}

export function ProfilePage({ userType }: ProfilePageProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSection, setEditSection] = useState<string>('');

  // モックデータ
  const clientProfile = {
    name: '鈴木 太郎',
    nameKana: 'スズキ タロウ',
    phone: '090-1234-5678',
    email: 'suzuki@example.com',
    postalCode: '100-0001',
    address: '東京都千代田区千代田1-1-1',
    // アクセス情報（公開）
    nearestStation: '東京駅',
    accessTime: '15',
    accessMethod: 'walk' as const,
    carParking: true,
    buildingType: 'apartment' as const,
    buildingName: 'サンシャインマンション',
    roomNumber: '305',
    hasAutoLock: true,
    accessNotes: 'オートロックあり。建物入口の呼び出しボタンで305を押してください。',
    // 家族構成（公開）
    familyMembers: [
      { name: '鈴木 花子', relation: '配偶者', age: '40代' },
      { name: '鈴木 一郎', relation: '子', age: '10歳' },
    ],
    // 間取り（公開）
    floorPlan: '3LDK',
    squareMeters: '70',
    // メッセージ（公開・任意）
    publicMessage: '明るく清潔な家を保ちたいと思っています。丁寧にお掃除していただける方を募集しております。',
    // 写真（公開・任意）
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      { id: 2, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    ],
  };

  const supporterProfile = {
    name: '佐藤 明美',
    nameKana: 'サトウ アケミ',
    phone: '080-9876-5432',
    email: 'sato@example.com',
    postalCode: '150-0001',
    address: '東京都渋谷区神宮前1-1-1',
    bio: '家事代行歴5年のベテランサポーターです。丁寧な清掃と心のこもったサービスを心がけています。お客様に喜んでいただけることが私の一番の喜びです。',
    certifications: ['家事代行士2級', '整理収納アドバイザー1級'],
    workingHours: '平日 9:00-17:00',
  };

  const profile = userType === 'client' ? clientProfile : supporterProfile;

  const handleEdit = (section: string) => {
    setEditSection(section);
    setShowEditModal(true);
  };

  const menuItems = [
    {
      icon: Bell,
      label: '通知設定',
      action: () => {},
    },
    {
      icon: Lock,
      label: 'パスワード変更',
      action: () => {},
    },
    {
      icon: FileText,
      label: '利用規約',
      action: () => {},
    },
    {
      icon: LogOut,
      label: 'ログアウト',
      action: () => {},
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-4">
      <div className="p-4 space-y-6">
        <h2>設定・プロフィール</h2>

        {/* プロフィール情報 */}
        <section className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-accent/50">
            <h3 className="text-sm">基本情報</h3>
          </div>
          
          <button
            onClick={() => handleEdit('name')}
            className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors border-b border-border"
          >
            <div className="flex items-start gap-3">
              <User className="text-primary mt-1" size={20} />
              <div className="text-left">
                <div className="text-sm text-muted-foreground mb-1">氏名</div>
                <div className="font-medium">{profile.name}</div>
                <div className="text-sm text-muted-foreground">{profile.nameKana}</div>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
          </button>

          <button
            onClick={() => handleEdit('contact')}
            className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors border-b border-border"
          >
            <div className="flex items-start gap-3">
              <Phone className="text-primary mt-1" size={20} />
              <div className="text-left">
                <div className="text-sm text-muted-foreground mb-1">電話番号</div>
                <div className="font-medium">{profile.phone}</div>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
          </button>

          <button
            onClick={() => handleEdit('email')}
            className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors border-b border-border"
          >
            <div className="flex items-start gap-3">
              <Mail className="text-primary mt-1" size={20} />
              <div className="text-left">
                <div className="text-sm text-muted-foreground mb-1">メールアドレス</div>
                <div className="font-medium">{profile.email}</div>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
          </button>

          <button
            onClick={() => handleEdit('address')}
            className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-start gap-3">
              <Home className="text-primary mt-1" size={20} />
              <div className="text-left">
                <div className="text-sm text-muted-foreground mb-1">住所</div>
                <div className="font-medium">〒{profile.postalCode}</div>
                <div className="text-sm text-muted-foreground mt-1">{profile.address}</div>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
          </button>
        </section>

        {/* ご利用者様専用：家族構成 */}
        {userType === 'client' && (
          <>
            <section className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-accent/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">家族構成</h3>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Eye size={14} />
                    <span>公開</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleEdit('family')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Users className="text-primary mt-1" size={20} />
                  <div className="text-left space-y-2">
                    {clientProfile.familyMembers.map((member, index) => (
                      <div key={index}>
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({member.relation})</span>
                        <span className="text-sm text-muted-foreground ml-2">({member.age})</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>
            </section>

            {/* 公開プロフィール情報 */}
            <section className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-accent/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">サポーターへ公開する情報</h3>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Eye size={14} />
                    <span>公開</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  この情報は案件ページでサポーターに表示されます
                </p>
              </div>

              {/* アクセス情報 */}
              <button
                onClick={() => handleEdit('access')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors border-b border-border"
              >
                <div className="flex items-start gap-3 flex-1">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div className="text-left flex-1">
                    <div className="text-sm text-muted-foreground mb-1">アクセス情報</div>
                    <div className="text-sm space-y-1">
                      <p>最寄駅: {clientProfile.nearestStation} 徒歩{clientProfile.accessTime}分</p>
                      {clientProfile.carParking && (
                        <p className="text-xs text-muted-foreground">車通勤可（駐車場あり）</p>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>

              {/* 間取り */}
              <button
                onClick={() => handleEdit('floorplan')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors border-b border-border"
              >
                <div className="flex items-start gap-3">
                  <Home className="text-primary mt-1" size={20} />
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground mb-1">間取り</div>
                    <div className="font-medium">{clientProfile.floorPlan} ({clientProfile.squareMeters}㎡)</div>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>

              {/* メッセージ */}
              <button
                onClick={() => handleEdit('publicMessage')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors border-b border-border"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div className="text-left flex-1">
                    <div className="text-sm text-muted-foreground mb-1">メッセージ（任意）</div>
                    <p className="text-sm leading-relaxed">
                      {clientProfile.publicMessage || '未設定'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>

              {/* 写真 */}
              <button
                onClick={() => handleEdit('photos')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Camera className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div className="text-left flex-1">
                    <div className="text-sm text-muted-foreground mb-2">写真（任意）</div>
                    {clientProfile.photos.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {clientProfile.photos.map(photo => (
                          <div key={photo.id} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                            <img src={photo.url} alt="室内写真" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">未設定</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>
            </section>
          </>
        )}

        {/* サポーター専用：自己紹介 */}
        {userType === 'supporter' && (
          <>
            <section className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-accent/50">
                <h3 className="text-sm">自己紹介</h3>
              </div>
              <button
                onClick={() => handleEdit('bio')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div className="text-left flex-1">
                    <p className="text-sm leading-relaxed">{supporterProfile.bio}</p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>
            </section>

            <section className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-accent/50">
                <h3 className="text-sm">資格・スキル</h3>
              </div>
              <button
                onClick={() => handleEdit('certifications')}
                className="w-full p-4 flex items-start justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div className="text-left space-y-1">
                    {supporterProfile.certifications.map((cert, index) => (
                      <div key={index} className="text-sm font-medium">
                        • {cert}
                      </div>
                    ))}
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0 mt-1" size={20} />
              </button>
            </section>
          </>
        )}

        {/* その他の設定 */}
        <section className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-accent/50">
            <h3 className="text-sm">その他</h3>
          </div>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full p-4 flex items-center justify-between hover:bg-accent transition-colors ${
                  index < menuItems.length - 1 ? 'border-b border-border' : ''
                } ${item.danger ? 'text-destructive' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={item.danger ? 'text-destructive' : 'text-primary'} size={20} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="text-muted-foreground" size={20} />
              </button>
            );
          })}
        </section>

        {/* バージョン情報 */}
        <div className="text-center text-sm text-muted-foreground">
          <p>きらりライフサポート v1.0.0</p>
        </div>
      </div>

      {/* 編集モーダル */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3>
                {editSection === 'name' && '氏名の変更'}
                {editSection === 'contact' && '電話番号の変更'}
                {editSection === 'email' && 'メールアドレスの変更'}
                {editSection === 'address' && '住所の変更'}
                {editSection === 'family' && '家族構成の変更'}
                {editSection === 'bio' && '自己紹介の編集'}
                {editSection === 'certifications' && '資格・スキルの編集'}
                {editSection === 'access' && 'アクセス情報の変更'}
                {editSection === 'floorplan' && '間取りの変更'}
                {editSection === 'publicMessage' && 'メッセージの変更'}
                {editSection === 'photos' && '写真の変更'}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {editSection === 'name' && (
                <>
                  <div>
                    <label className="block mb-2">氏名</label>
                    <input
                      type="text"
                      defaultValue={profile.name}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">氏名（カナ）</label>
                    <input
                      type="text"
                      defaultValue={profile.nameKana}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                </>
              )}

              {editSection === 'contact' && (
                <div>
                  <label className="block mb-2">電話番号</label>
                  <input
                    type="tel"
                    defaultValue={profile.phone}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  />
                </div>
              )}

              {editSection === 'email' && (
                <div>
                  <label className="block mb-2">メールアドレス</label>
                  <input
                    type="email"
                    defaultValue={profile.email}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  />
                </div>
              )}

              {editSection === 'address' && (
                <>
                  <div>
                    <label className="block mb-2">郵便番号</label>
                    <input
                      type="text"
                      defaultValue={profile.postalCode}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">住所</label>
                    <input
                      type="text"
                      defaultValue={profile.address}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                  
                  {/* アクセス情報（ご利用者様のみ） */}
                  {userType === 'client' && (
                    <>
                      <div className="pt-3 border-t border-border">
                        <h4 className="font-medium mb-3 text-sm">アクセス情報</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          ※ サポーターへ自動的に共有されます
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block mb-2 text-sm">最寄駅</label>
                            <input
                              type="text"
                              defaultValue={clientProfile.nearestStation}
                              placeholder="例：東京駅"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block mb-2 text-sm">所要時間（分）</label>
                              <input
                                type="text"
                                defaultValue={clientProfile.accessTime}
                                placeholder="15"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm">交通手段</label>
                              <select
                                defaultValue={clientProfile.accessMethod}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                              >
                                <option value="walk">徒歩</option>
                                <option value="bus">バス</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="carParking"
                              defaultChecked={clientProfile.carParking}
                              className="w-4 h-4"
                            />
                            <label htmlFor="carParking" className="text-sm">
                              車通勤可（自宅に無料駐車場あり）
                            </label>
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm">建物タイプ</label>
                            <select
                              defaultValue={clientProfile.buildingType}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                            >
                              <option value="apartment">マンション</option>
                              <option value="house">戸建て</option>
                              <option value="condo">アパート</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block mb-2 text-sm">建物名</label>
                              <input
                                type="text"
                                defaultValue={clientProfile.buildingName}
                                placeholder="例：サンシャインマンション"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm">部屋番号</label>
                              <input
                                type="text"
                                defaultValue={clientProfile.roomNumber}
                                placeholder="例：305"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="hasAutoLock"
                              defaultChecked={clientProfile.hasAutoLock}
                              className="w-4 h-4"
                            />
                            <label htmlFor="hasAutoLock" className="text-sm">
                              オートロックあり
                            </label>
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm">補足・注意事項</label>
                            <textarea
                              defaultValue={clientProfile.accessNotes}
                              placeholder="建物の入り方、駐車場の場所など"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {editSection === 'family' && userType === 'client' && (
                <div className="space-y-3">
                  {clientProfile.familyMembers.map((member, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">家族 {index + 1}</span>
                        <button className="text-destructive text-sm">削除</button>
                      </div>
                      <input
                        type="text"
                        defaultValue={member.name}
                        placeholder="氏名"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                      <input
                        type="text"
                        defaultValue={member.relation}
                        placeholder="続柄"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                      <input
                        type="text"
                        defaultValue={member.age}
                        placeholder="年齢"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-primary text-primary rounded-lg hover:bg-accent">
                    + 家族を追加
                  </button>
                </div>
              )}

              {editSection === 'bio' && userType === 'supporter' && (
                <div>
                  <label className="block mb-2">自己紹介</label>
                  <textarea
                    defaultValue={supporterProfile.bio}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    rows={6}
                  />
                </div>
              )}

              {editSection === 'certifications' && userType === 'supporter' && (
                <div className="space-y-2">
                  {supporterProfile.certifications.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={cert}
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                      <button className="px-3 text-destructive">削除</button>
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-primary text-primary rounded-lg hover:bg-accent">
                    + 資格を追加
                  </button>
                </div>
              )}

              {editSection === 'access' && userType === 'client' && (
                <div className="space-y-3">
                  <div>
                    <label className="block mb-2">最寄駅</label>
                    <input
                      type="text"
                      defaultValue={clientProfile.nearestStation}
                      placeholder="例：東京駅"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2">所要時間（分）</label>
                      <input
                        type="text"
                        defaultValue={clientProfile.accessTime}
                        placeholder="15"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">交通手段</label>
                      <select
                        defaultValue={clientProfile.accessMethod}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      >
                        <option value="walk">徒歩</option>
                        <option value="bus">バス</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="carParking"
                      defaultChecked={clientProfile.carParking}
                      className="w-4 h-4"
                    />
                    <label htmlFor="carParking" className="text-sm">
                      車通勤可（自宅に無料駐車場あり）
                    </label>
                  </div>
                  
                  <div>
                    <label className="block mb-2">建物タイプ</label>
                    <select
                      defaultValue={clientProfile.buildingType}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    >
                      <option value="apartment">マンション</option>
                      <option value="house">戸建て</option>
                      <option value="condo">アパート</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2">建物名</label>
                      <input
                        type="text"
                        defaultValue={clientProfile.buildingName}
                        placeholder="例：サンシャインマンション"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">部屋番号</label>
                      <input
                        type="text"
                        defaultValue={clientProfile.roomNumber}
                        placeholder="例：305"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasAutoLock"
                      defaultChecked={clientProfile.hasAutoLock}
                      className="w-4 h-4"
                    />
                    <label htmlFor="hasAutoLock" className="text-sm">
                      オートロックあり
                    </label>
                  </div>
                  
                  <div>
                    <label className="block mb-2">補足・注意事項</label>
                    <textarea
                      defaultValue={clientProfile.accessNotes}
                      placeholder="建物の入り方、駐車場の場所など"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {editSection === 'floorplan' && userType === 'client' && (
                <div className="space-y-3">
                  <div>
                    <label className="block mb-2">間取り</label>
                    <input
                      type="text"
                      defaultValue={clientProfile.floorPlan}
                      placeholder="例：3LDK"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">平方メートル</label>
                    <input
                      type="text"
                      defaultValue={clientProfile.squareMeters}
                      placeholder="例：70"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                </div>
              )}

              {editSection === 'publicMessage' && userType === 'client' && (
                <div>
                  <label className="block mb-2">メッセージ（任意）</label>
                  <textarea
                    defaultValue={clientProfile.publicMessage}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    rows={6}
                  />
                </div>
              )}

              {editSection === 'photos' && userType === 'client' && (
                <div className="space-y-3">
                  <div>
                    <label className="block mb-2">写真（任意）</label>
                    <input
                      type="file"
                      multiple
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    // TODO: 実際の保存処理
                  }}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}