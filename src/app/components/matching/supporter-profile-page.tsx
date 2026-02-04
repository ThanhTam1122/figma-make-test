import { ArrowLeft, MapPin, Star, Calendar, Award, Heart, MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface SupporterProfilePageProps {
  supporterId: string;
  onBack: () => void;
  onSendMessage: () => void;
}

export function SupporterProfilePage({ supporterId, onBack, onSendMessage }: SupporterProfilePageProps) {
  // モック：きらりさんのプロフィール情報
  const supporter = {
    id: supporterId,
    name: '山田 花子',
    age: 35,
    gender: '女性',
    rating: 4.8,
    reviewCount: 127,
    experience: '3年',
    distance: '2.5km',
    nearestStation: '渋谷駅',
    completedJobs: 154,
    responseRate: 98,
    introduction: 'こんにちは！家事代行サポーターとして3年間活動しています。料理が特に得意で、和食から洋食まで幅広く対応できます。お子様がいらっしゃるご家庭での経験も豊富で、アレルギー対応も可能です。丁寧で心のこもったサポートを心がけています。',
    skills: [
      { category: '料理', items: ['和食', '洋食', '中華', '作り置き', 'お弁当', 'アレルギー対応'] },
      { category: '掃除・片付け', items: ['水回り掃除', '整理整頓', '収納アドバイス'] },
      { category: '洗濯', items: ['アイロンがけ', '衣類の仕分け'] },
    ],
    availability: ['平日午後', '土日'],
    preferredAreas: ['渋谷区', '目黒区', '世田谷区'],
    certifications: ['食品衛生責任者', '整理収納アドバイザー2級'],
    languages: ['日本語'],
    reviews: [
      {
        id: '1',
        userName: 'A.M様',
        rating: 5,
        date: '1月28日',
        comment: '料理がとても美味しく、家族全員が大満足でした。子どもたちも喜んで食べていました。また次回もお願いしたいです。',
      },
      {
        id: '2',
        userName: 'K.T様',
        rating: 5,
        date: '1月20日',
        comment: '時間通りに来ていただき、テキパキと作業してくださいました。作り置きもたくさん作っていただき、とても助かりました。',
      },
      {
        id: '3',
        userName: 'M.S様',
        rating: 4,
        date: '1月15日',
        comment: '丁寧に対応していただきました。コミュニケーションも取りやすく、安心してお任せできました。',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">きらりさんのプロフィール</h1>
        </div>
      </div>

      {/* プロフィールヘッダー */}
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
            {supporter.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{supporter.name}さん</h2>
            <p className="text-sm text-muted-foreground mb-2">
              {supporter.age}歳・{supporter.gender}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{supporter.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({supporter.reviewCount}件のレビュー)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{supporter.nearestStation}から{supporter.distance}</span>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-accent rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar size={16} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">経験年数</p>
            <p className="font-bold">{supporter.experience}</p>
          </div>
          <div className="bg-accent rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle size={16} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">完了件数</p>
            <p className="font-bold">{supporter.completedJobs}件</p>
          </div>
          <div className="bg-accent rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock size={16} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">返信率</p>
            <p className="font-bold">{supporter.responseRate}%</p>
          </div>
        </div>

        {/* メッセージボタン */}
        <button
          onClick={onSendMessage}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          メッセージを送る
        </button>
      </div>

      {/* 自己紹介 */}
      <div className="p-4 border-b border-border">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Heart size={18} className="text-primary" />
          自己紹介
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {supporter.introduction}
        </p>
      </div>

      {/* できること */}
      <div className="p-4 border-b border-border">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Award size={18} className="text-primary" />
          できること
        </h3>
        <div className="space-y-4">
          {supporter.skills.map((skill, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium mb-2">{skill.category}</p>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 対応可能エリア */}
      <div className="p-4 border-b border-border">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          対応可能エリア
        </h3>
        <div className="flex flex-wrap gap-2">
          {supporter.preferredAreas.map((area, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-accent rounded-full text-sm"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* 対応可能時間 */}
      <div className="p-4 border-b border-border">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          対応可能時間
        </h3>
        <div className="flex flex-wrap gap-2">
          {supporter.availability.map((time, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-accent rounded-full text-sm"
            >
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* 資格・認定 */}
      {supporter.certifications.length > 0 && (
        <div className="p-4 border-b border-border">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Award size={18} className="text-primary" />
            資格・認定
          </h3>
          <div className="space-y-2">
            {supporter.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* レビュー */}
      <div className="p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Star size={18} className="text-primary" />
          レビュー ({supporter.reviewCount}件)
        </h3>
        <div className="space-y-3">
          {supporter.reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.userName}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
