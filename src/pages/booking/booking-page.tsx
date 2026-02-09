import { Calendar, CalendarCheck, Plus, ChevronRight, Clock, User, Search } from 'lucide-react';

interface BookingPageProps {
  onNavigate: (page: string, jobType?: 'regular' | 'spot', jobId?: string) => void;
  userType?: 'client' | 'supporter';
}

interface Visit {
  id: string;
  date: string;
  time: string;
  partner: string;
  type: 'regular' | 'spot';
  status: 'confirmed' | 'pending';
}

interface MatchingJob {
  id: string;
  jobNumber: string;
  jobType: 'regular' | 'spot';
  status: 'draft' | 'open' | 'paused';
  createdDate: string;
  services: string[];
  applicantsCount: number;
  // スポット用
  spotDate?: string;
  spotTime?: string;
  // 定期用
  regularCourse?: string;
}

export function BookingPage({ onNavigate, userType = 'client' }: BookingPageProps) {
  // モック：直近の訪問予定1件のみ
  const nextVisit: Visit = {
    id: '1',
    date: '2月5日（水）',
    time: '10:00 - 12:00',
    partner: userType === 'client' ? '山田 花子' : '田中 太郎',
    type: 'regular',
    status: 'confirmed',
  };

  // モック：マッチング中の依頼
  const matchingJobs: MatchingJob[] = [
    {
      id: '1',
      jobNumber: 'JOB123456',
      jobType: 'spot',
      status: 'open',
      createdDate: '2月1日',
      services: ['料理'],
      applicantsCount: 3,
      spotDate: '2月10日（木）',
      spotTime: '14:00 - 16:00',
    },
    {
      id: '2',
      jobNumber: 'JOB123457',
      jobType: 'regular',
      status: 'open',
      createdDate: '1月28日',
      services: ['掃除', '洗濯'],
      applicantsCount: 1,
      regularCourse: '週2回',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold">予約</h1>
        <p className="text-sm mt-1 opacity-90">
          新しい依頼とスケジュール管理
        </p>
      </div>

      {/* 新しい依頼セクション */}
      {userType === 'client' && (
        <div className="p-4">
          <h2 className="text-sm font-bold text-muted-foreground mb-3">新しい依頼</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('job-posting', 'spot')}
              className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-lg p-4 flex flex-col items-center gap-2 hover:from-orange-600 hover:to-pink-600 transition-all shadow-md"
            >
              <div className="p-2 rounded-full bg-white/20">
                <Calendar size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-sm">スポット</h3>
                <p className="text-xs mt-0.5 opacity-90">
                  1回だけの依頼
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('job-posting', 'regular')}
              className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg p-4 flex flex-col items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
            >
              <div className="p-2 rounded-full bg-white/20">
                <CalendarCheck size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-sm">定期</h3>
                <p className="text-xs mt-0.5 opacity-90">
                  継続的なサポート
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 直近の訪問予定 */}
      <div className="p-4">
        <h2 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
          <Calendar size={18} />
          直近の訪問予定
        </h2>
        <div
          className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <div>
                <div className="font-bold text-base">{nextVisit.date}</div>
                <div className="text-sm text-muted-foreground">{nextVisit.time}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                nextVisit.type === 'regular' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {nextVisit.type === 'regular' ? '定期' : 'スポット'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                nextVisit.status === 'confirmed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {nextVisit.status === 'confirmed' ? '確定' : '調整中'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <User size={14} />
              {userType === 'client' ? '担当きらりさん' : 'ご利用者様'}
            </span>
            <span className="font-medium">{nextVisit.partner}</span>
          </div>
        </div>
        
        {/* すべての予定を見る */}
        <button
          onClick={() => onNavigate('schedule')}
          className="w-full mt-3 py-3 text-primary font-medium hover:bg-accent rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <span>すべての予定を見る</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* マッチング中の依頼セクション */}
      {userType === 'client' && matchingJobs.length > 0 && (
        <div className="p-4">
          <h2 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <Search size={18} />
            マッチング中の依頼
          </h2>
          <div className="space-y-3">
            {matchingJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        job.jobType === 'regular' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {job.jobType === 'regular' ? '定期' : 'スポット'}
                      </span>
                    </div>
                    {job.jobType === 'spot' && job.spotDate && (
                      <div className="text-sm font-medium mb-1">
                        {job.spotDate} {job.spotTime}
                      </div>
                    )}
                    {job.jobType === 'regular' && job.regularCourse && (
                      <div className="text-sm font-medium mb-1">
                        {job.regularCourse}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {job.createdDate}に募集開始
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'paused'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {job.status === 'open' ? '募集中' : job.status === 'paused' ? '一時停止' : '下書き'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">サービス:</span>
                  <div className="flex gap-1">
                    {job.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-accent rounded text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-primary font-bold">{job.applicantsCount}</span>
                    <span className="text-muted-foreground ml-1">件の応募</span>
                  </div>
                  <button
                    onClick={() => onNavigate('matching-detail', job.jobType, job.id)}
                    className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    詳細を見る
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}