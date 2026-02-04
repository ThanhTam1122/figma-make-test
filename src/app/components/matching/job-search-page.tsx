import React, { useState } from 'react';
import { MapPin, Clock, Calendar, MessageCircle, Heart } from 'lucide-react';
import { SearchBar, StatusBadge, StatusVariant } from '../ui/common-index';

interface JobPosting {
  id: number;
  title: string;
  client: string;
  area: string;
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
  applicants: number;
  isFavorite?: boolean;
}

interface JobSearchPageProps {
  onApply: (jobId: number) => void;
  onViewDetail: (job: JobPosting) => void;
}

export function JobSearchPage({ onApply, onViewDetail }: JobSearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // モックデータ
  const jobPostings: JobPosting[] = [
    {
      id: 1,
      title: '週1回の定期清掃をお願いできる方を募集',
      client: '鈴木 太郎',
      area: '東京都千代田区',
      frequency: '週1回',
      preferredDays: ['tue', 'wed', 'thu'],
      preferredTimeStart: '10:00',
      preferredTimeEnd: '12:00',
      duration: '2',
      serviceType: ['掃除・整理整頓', '水回り清掃'],
      appealMessage: '明るく丁寧な方を希望しています。ペット（犬）がいますので、動物が苦手でない方だと助かります。',
      budget: '13000',
      postedDate: '2026-01-15',
      status: 'open',
      applicants: 0,
      isFavorite: false,
    },
    {
      id: 2,
      title: '料理・作り置きサポーター募集中',
      client: '田中 恵子',
      area: '東京都渋谷区',
      frequency: '週2回',
      preferredDays: ['mon', 'thu'],
      preferredTimeStart: '14:00',
      preferredTimeEnd: '17:00',
      duration: '3',
      serviceType: ['料理・作り置き', '買い物代行'],
      appealMessage: '健康的な和食中心の作り置きをお願いしたいです。料理が得意な方、お待ちしています！',
      budget: '19500',
      postedDate: '2026-01-14',
      status: 'open',
      applicants: 0,
      isFavorite: true,
    },
    {
      id: 3,
      title: '隔週で家全体の掃除をお願いします',
      client: '高橋 一郎',
      area: '東京都新宿区',
      frequency: '隔週',
      preferredDays: ['sat', 'sun'],
      preferredTimeStart: '09:00',
      preferredTimeEnd: '13:00',
      duration: '4',
      serviceType: ['掃除・整理整頓', '洗濯・アイロン', '水回り清掃'],
      appealMessage: '土日に来ていただける方を探しています。広めのマンションなので、体力に自信のある方歓迎です。',
      budget: '26000',
      postedDate: '2026-01-13',
      status: 'open',
      applicants: 0,
    },
    {
      id: 4,
      title: '平日午前中の定期清掃',
      client: '佐藤 美咲',
      area: '東京都港区',
      frequency: '週1回',
      preferredDays: ['mon', 'tue', 'wed'],
      preferredTimeStart: '09:00',
      preferredTimeEnd: '11:00',
      duration: '2',
      serviceType: ['掃除・整理整頓'],
      appealMessage: '在宅ワーク中ですが、静かに作業していただければ問題ありません。',
      budget: '13000',
      postedDate: '2026-01-12',
      status: 'reviewing',
      applicants: 1,
    },
  ];

  const getDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日',
    };
    return labels[day] || day;
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.includes(searchTerm) || job.area.includes(searchTerm);
    const matchesArea = filterArea === 'all' || job.area.includes(filterArea);
    const matchesFrequency = filterFrequency === 'all' || job.frequency === filterFrequency;
    const matchesFavorite = !showFavoritesOnly || job.isFavorite;
    return matchesSearch && matchesArea && matchesFrequency && matchesFavorite;
  });

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-4">お仕事をさがす</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="エリアやキーワードで検索"
          className="[&_input]:bg-white [&_input]:text-foreground"
        />
      </div>

      <div className="p-4 bg-white border-b border-border space-y-3">
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={filterArea}
            onChange={e => setFilterArea(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input-background text-sm"
          >
            <option value="all">すべてのエリア</option>
            <option value="千代田区">千代田区</option>
            <option value="渋谷区">渋谷区</option>
            <option value="新宿区">新宿区</option>
            <option value="港区">港区</option>
          </select>
          <select
            value={filterFrequency}
            onChange={e => setFilterFrequency(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input-background text-sm"
          >
            <option value="all">すべての頻度</option>
            <option value="週1回">週1回</option>
            <option value="週2回">週2回</option>
            <option value="隔週">隔週</option>
          </select>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-1 ${
              showFavoritesOnly
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-white'
            }`}
          >
            <Heart size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
            お気に入り
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            条件に一致する募集が見つかりませんでした
          </div>
        ) : (
          filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{job.title}</h3>
                  {job.status === 'reviewing' ? (
                    <StatusBadge variant="reviewing" label={`応募受付中（${job.applicants}名応募済み）`} />
                  ) : (
                    <StatusBadge variant="open" />
                  )}
                </div>
                <Heart
                  size={20}
                  className={`ml-2 cursor-pointer ${
                    job.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                  }`}
                />
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  {job.area}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  {job.frequency} / 希望曜日：{job.preferredDays.map(getDayLabel).join('・')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  {job.preferredTimeStart}〜{job.preferredTimeEnd}（{job.duration}時間）
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {job.serviceType.map(service => (
                  <span
                    key={service}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {job.appealMessage}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-lg font-bold text-primary">¥{Number(job.budget).toLocaleString()}/回</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetail(job)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm flex items-center gap-1"
                  >
                    <MessageCircle size={16} />
                    詳細/質問
                  </button>
                  <button
                    onClick={() => onApply(job.id)}
                    disabled={job.status === 'reviewing'}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      job.status === 'reviewing'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    {job.status === 'reviewing' ? '受付一時停止' : '応募する'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
