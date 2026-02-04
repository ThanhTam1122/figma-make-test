import React, { useState } from 'react';
import { X, MapPin, Clock, Calendar, MessageCircle, Send, User, Users, Home, Camera } from 'lucide-react';

interface JobPosting {
  id: number;
  title: string;
  client: string;
  area: string;
  fullAddress?: string; // マッチング成立後に表示される詳細住所
  frequency: string;
  preferredDays: string[];
  preferredTimeStart: string;
  preferredTimeEnd: string;
  duration: string;
  serviceType: string[];
  appealMessage: string;
  budget: string;
  postedDate: string;
  status: 'open' | 'paused' | 'reviewing';
}

interface Message {
  id: number;
  sender: 'client' | 'supporter';
  text: string;
  timestamp: string;
}

interface JobDetailModalProps {
  job: JobPosting;
  onClose: () => void;
  onApply: (jobId: number, message: string) => void;
  userType: 'client' | 'supporter';
}

export function JobDetailModal({ job, onClose, onApply, userType }: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'profile' | 'chat'>('details');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // マッチング成立状態（モック: 実際にはマッチング状態をpropsから受け取る）
  const isMatched = false;

  // モック：ユーザーの公開プロフィール情報
  const clientPublicProfile = {
    familyMembers: [
      { name: '鈴木 花子', relation: '配偶者', age: '40代' },
      { name: '鈴木 一郎', relation: '子', age: '10歳' },
    ],
    access: {
      nearestStation: '東京駅',
      accessTime: '15',
      carParking: true,
    },
    floorPlan: '3LDK',
    squareMeters: '70',
    publicMessage: '明るく清潔な家を保ちたいと思っています。丁寧にお掃除していただける方を募集しております。',
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      { id: 2, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    ],
  };

  // モックチャットデータ
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'supporter',
      text: 'こんにちは。ペットについて質問があります。犬種は何でしょうか？',
      timestamp: '2026-01-16 14:30',
    },
    {
      id: 2,
      sender: 'client',
      text: 'トイプードルです。とても人懐っこい子です。',
      timestamp: '2026-01-16 14:45',
    },
  ]);

  const getDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      mon: '月',
      tue: '火',
      wed: '水',
      thu: '木',
      fri: '金',
      sat: '土',
      sun: '日',
    };
    return labels[day] || day;
  };

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: userType === 'client' ? 'client' : 'supporter',
        text: chatMessage,
        timestamp: new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setChatMessage('');
    }
  };

  const handleSubmitApplication = () => {
    onApply(job.id, applicationMessage);
    setShowApplicationForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h3>募集詳細</h3>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-2">{job.title}</h4>
              <div className="inline-block">
                {job.status === 'open' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">募集中</span>
                )}
                {job.status === 'reviewing' && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                    応募受付一時停止中
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">エリア</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-primary" />
                  <p className="font-medium">{job.area}</p>
                </div>
                {!isMatched && userType === 'supporter' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ※詳細住所はマッチング成立後に表示されます
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground">訪問頻度</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-primary" />
                  <p className="font-medium">{job.frequency}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">希望曜日</label>
                <p className="font-medium mt-1">
                  {job.preferredDays.map(getDayLabel).join('・')}曜日
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">希望時間</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={16} className="text-primary" />
                  <p className="font-medium">
                    {job.preferredTimeStart}〜{job.preferredTimeEnd}（{job.duration}時間）
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">依頼内容</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.serviceType.map(service => (
                    <span
                      key={service}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">アピールメッセージ</label>
                <p className="leading-relaxed mt-1">{job.appealMessage}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">1回あたりの料金</label>
                <p className="text-2xl font-bold text-primary mt-1">
                  ¥{Number(job.budget).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* フッターボタン */}
        {userType === 'supporter' && (
          <div className="sticky bottom-0 bg-white border-t border-border p-4">
            {!showApplicationForm ? (
              <div className="space-y-2">
                {/* ご利用者さんのプロフィールを見る・質問するボタン */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <User size={16} />
                    プロフィールを見る
                  </button>
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MessageCircle size={16} />
                    質問する
                  </button>
                </div>

                {/* 応募ボタン */}
                <button
                  onClick={() => setShowApplicationForm(true)}
                  disabled={job.status === 'reviewing'}
                  className={`w-full py-3 rounded-lg text-sm font-medium ${
                    job.status === 'reviewing'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {job.status === 'reviewing' ? '応募受付一時停止中' : 'この案件に応募する'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={applicationMessage}
                  onChange={e => setApplicationMessage(e.target.value)}
                  placeholder="応募メッセージを入力してください（自己紹介、意気込みなど）"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSubmitApplication}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                  >
                    応募する
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* プロフィールモーダル */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>ご利用者さんのプロフィール</h3>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-accent rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">家族構成</label>
                  <div className="flex flex-col gap-1 mt-1">
                    {clientPublicProfile.familyMembers.map((member, index) => (
                      <p key={index} className="font-medium">
                        {isMatched ? `${member.name}（${member.relation}、${member.age}）` : `${member.relation}（${member.age}）`}
                      </p>
                    ))}
                  </div>
                  {!isMatched && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ※お名前はマッチング成立後に表示されます
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">アクセス情報</label>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="font-medium">
                      最寄り駅：{clientPublicProfile.access.nearestStation}
                    </p>
                    <p className="font-medium">
                      駅からのアクセス時間：{clientPublicProfile.access.accessTime}分
                    </p>
                    <p className="font-medium">
                      駐車場：{clientPublicProfile.access.carParking ? 'あり' : 'なし'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">間取り</label>
                  <p className="font-medium mt-1">{clientPublicProfile.floorPlan}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">広さ</label>
                  <p className="font-medium mt-1">{clientPublicProfile.squareMeters}m²</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">公開メッセージ</label>
                  <p className="leading-relaxed mt-1">{clientPublicProfile.publicMessage}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">写真</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {clientPublicProfile.photos.map(photo => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="ご利用者さんの家"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 質問モーダル */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>ご利用者さんに質問する</h3>
              <button onClick={() => setShowChatModal(false)} className="p-2 hover:bg-accent rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p>まだメッセージはありません</p>
                  <p className="text-sm">気になることがあれば質問してみましょう</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      (userType === 'client' && message.sender === 'client') ||
                      (userType === 'supporter' && message.sender === 'supporter')
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        (userType === 'client' && message.sender === 'client') ||
                        (userType === 'supporter' && message.sender === 'supporter')
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendChat()}
                  placeholder="メッセージを入力..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-input-background"
                />
                <button
                  onClick={handleSendChat}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}