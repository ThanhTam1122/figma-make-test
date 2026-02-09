import { Calendar, CalendarCheck, Check } from 'lucide-react';

interface JobTypeSelectionProps {
  onComplete: (jobType: 'regular' | 'spot') => void;
}

export function JobTypeSelection({ onComplete }: JobTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold mb-1">ご利用タイプを選択</h1>
          <p className="text-xs opacity-90">
            定期的なサポートまたはスポットのサポートをお選びください
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-3">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* 定期サポート */}
          <button
            onClick={() => onComplete('regular')}
            className="w-full bg-white rounded-xl border-2 border-border p-4 hover:border-primary hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarCheck size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">定期サポート</h3>
              </div>
            </div>

            {/* 特徴 */}
            <div className="mb-3">
              <h4 className="text-xs font-bold text-muted-foreground mb-1.5">特徴</h4>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>曜日時間固定で、都度調整の手間なし</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>専任制で、毎回の説明が不要</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>料理、掃除、育児と幅広く依頼できる</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>リーズナブルな価格設定（1時間2,400円〜）</span>
                </li>
              </ul>
            </div>

            {/* こんな方におすすめ */}
            <div>
              <h4 className="text-xs font-bold text-muted-foreground mb-1.5">こんな方におすすめ</h4>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>料理も掃除も幅広くお願いしたい</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>育児サポートをお願いしたい</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>定期的にサポートしてほしい</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>長期的に関係性を築きたい</span>
                </li>
              </ul>
            </div>
          </button>

          {/* スポットサポート */}
          <button
            onClick={() => onComplete('spot')}
            className="w-full bg-white rounded-xl border-2 border-border p-4 hover:border-primary hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={24} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">スポットサポート</h3>
              </div>
            </div>

            {/* 特徴 */}
            <div className="mb-3">
              <h4 className="text-xs font-bold text-muted-foreground mb-1.5">特徴</h4>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>料理または掃除のどちらかのみ<br />※（育児サポートは定期限定）</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>必要な時だけ単発で利用可能</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>毎回違うきらりさんとマッチング</span>
                </li>
              </ul>
            </div>

            {/* こんな方におすすめ */}
            <div>
              <h4 className="text-xs font-bold text-muted-foreground mb-1.5">こんな方におすすめ</h4>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>まずは気軽に試してみたい</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>相性の良いきらりさんを探したい</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>料理または掃除をピンポイントでお願いしたい</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>必要な時だけ来てもらいたい</span>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}