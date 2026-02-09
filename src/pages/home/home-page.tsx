import React from 'react';
import { Calendar, Clock, MessageCircle, ChevronRight, CheckSquare, Plus, Search, Star, ShieldCheck, Heart, ArrowRight, BarChart3, PieChart as PieChartIcon, CalendarCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface HomePageProps {
  userType: 'client' | 'supporter';
  onNavigate: (page: string) => void;
  onNavigateWithJobType?: (page: string, jobType: 'regular' | 'spot') => void;
  pendingReportsCount?: number;
}

export function HomePage({ userType, onNavigate, onNavigateWithJobType, pendingReportsCount = 0 }: HomePageProps) {
  // モックデータ: チャート用
  const activityData = [
    { name: '9月', value: 4 },
    { name: '10月', value: 6 },
    { name: '11月', value: 8 },
    { name: '12月', value: 5 },
    { name: '1月', value: 7 },
    { name: '2月', value: 3 },
  ];

  const categoryData = userType === 'client' ? [
    { name: '掃除', value: 60, color: '#ff8800' },
    { name: '料理', value: 30, color: '#ffb347' },
    { name: 'その他', value: 10, color: '#ffd1b3' },
  ] : [
    { name: '定期', value: 70, color: '#ff8800' },
    { name: 'スポット', value: 30, color: '#ffb347' },
  ];

  // モックデータ: プロフィール等
  const userData = {
    name: userType === 'client' ? '鈴木 幸子' : '佐藤 健太',
    avatar: userType === 'client' 
      ? 'https://images.unsplash.com/photo-1678105627784-2e14bb9fa143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHdvbWFuJTIwcHJvZmlsZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDI3MDY0MHww&ixlib=rb-4.1.0&q=80&w=1080'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9maWxlfGVufDB8fHx8MTcwOTM1OTM1MHww&ixlib=rb-4.1.0&q=80&w=400',
    status: userType === 'client' ? 'マッチング待ち' : '活動中',
  };

  const upcomingVisit = {
    date: '2月12日（木）',
    time: '10:00 - 12:00',
    partner: userType === 'client' ? '田中 きらりさん' : '山田 幸子 様',
    status: '確定済み',
    category: '掃除・料理'
  };

  const stats = userType === 'client' ? [
    { label: '利用回数', value: '12', unit: '回' },
    { label: 'お気に入り', value: '3', unit: '名' },
    { label: '評価', value: '4.9', unit: '★' },
  ] : [
    { label: '完了件数', value: '28', unit: '件' },
    { label: 'お気に入り登録', value: '15', unit: '人' },
    { label: '評価', value: '5.0', unit: '★' },
  ];

  return (
    <div className="min-h-full bg-slate-50/50 pb-32">
      {/* ヒーローセクション: ユーザープロフィール */}
      <section className="bg-white px-6 pt-8 pb-10 rounded-b-[40px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-orange-200/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted-foreground text-sm font-medium mb-1"
            >
              こんにちは！
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-foreground"
            >
              {userData.name} <span className="text-sm font-normal text-muted-foreground">{userType === 'client' ? '様' : 'きらりさん'}</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5">
              <ImageWithFallback 
                src={userData.avatar} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" />
          </motion.div>
        </div>

        {/* 簡易ステータスカード */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100"
            >
              <p className="text-[10px] text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="px-5 -mt-6 relative z-20 space-y-6">
        {/* メインアクション */}
        <section className="grid grid-cols-2 gap-4">
          {userType === 'client' ? (
            <>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateWithJobType?.('job-posting', 'spot')}
                className="bg-primary text-white p-5 rounded-3xl shadow-lg shadow-primary/20 text-left flex flex-col justify-between h-36"
              >
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">ス��ット依頼</h3>
                  <p className="text-[10px] opacity-80 mt-1">1回のみのサポート</p>
                </div>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateWithJobType?.('job-posting', 'regular')}
                className="bg-white border border-primary/20 p-5 rounded-3xl shadow-sm text-left flex flex-col justify-between h-36"
              >
                <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight text-foreground">定期コース</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">週1回からの継続サポート</p>
                </div>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('job-search')}
                className="bg-primary text-white p-5 rounded-3xl shadow-lg shadow-primary/20 text-left flex flex-col justify-between h-36"
              >
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">お仕事を探す</h3>
                  <p className="text-[10px] opacity-80 mt-1">最新の募集をチェック</p>
                </div>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('schedule')}
                className="bg-white border border-primary/20 p-5 rounded-3xl shadow-sm text-left flex flex-col justify-between h-36"
              >
                <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight text-foreground">予定の確認</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">スケジュール管理</p>
                </div>
              </motion.button>
            </>
          )}
        </section>

        {/* チャートセクション: アクティビティ履歴 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              {userType === 'client' ? 'ご利用履歴' : '稼働実績'}
            </h3>
          </div>
          
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">過去6ヶ月の合計</p>
                <p className="text-xl font-bold text-foreground">
                  {userType === 'client' ? '33' : '156,000'}
                  <span className="text-xs font-normal ml-1">{userType === 'client' ? '回' : '円'}</span>
                </p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <BarChart3 size={18} className="text-primary" />
              </div>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#ff8800' : '#ffc078'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* チャートセクション: 内訳 */}
        <section>
           <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 flex items-center gap-6">
             <div className="w-24 h-24">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryData}
                     cx="50%"
                     cy="50%"
                     innerRadius={25}
                     outerRadius={40}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="flex-1 space-y-3">
               <div className="flex items-center justify-between">
                 <h4 className="text-xs font-bold text-foreground">{userType === 'client' ? 'サポート内容内訳' : '契約形態内訳'}</h4>
                 <PieChartIcon size={14} className="text-muted-foreground" />
               </div>
               <div className="space-y-2">
                 {categoryData.map((item) => (
                   <div key={item.name} className="flex items-center justify-between text-[10px]">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-muted-foreground">{item.name}</span>
                     </div>
                     <span className="font-bold text-foreground">{item.value}%</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </section>

        {/* 進行中のステータス / 次回の予定 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              次回の訪問予定
            </h3>
            <button 
              onClick={() => onNavigate('schedule')}
              className="text-primary text-xs font-medium flex items-center gap-0.5"
            >
              一覧を見る <ChevronRight size={14} />
            </button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-primary border border-orange-100">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{upcomingVisit.date}</p>
                  <p className="text-lg font-bold text-foreground tracking-tight">{upcomingVisit.time}</p>
                </div>
              </div>
              <div className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full border border-primary/20">
                {upcomingVisit.status}
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full mb-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                   <div className="text-lg">👤</div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">{userType === 'client' ? '担当きらりさん' : 'ご利用者様'}</p>
                  <p className="text-sm font-bold text-foreground">{upcomingVisit.partner}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shadow-sm active:bg-slate-100">
                <MessageCircle size={18} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* トピックス / ニュース */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              きらりライフマガジン
            </h3>
          </div>
          
          <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-100">
            <div className="relative h-32 overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758273238564-806f750a2cce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGNsZWFuaW5nJTIwaW50ZXJpb3IlMjBicmlnaHR8ZW58MXx8fHwxNzcwMjcwNjQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Topics"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold bg-primary px-2 py-0.5 rounded">NEW</span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm mb-1 line-clamp-1">春の換気扇掃除！きらりさん直伝の裏技テクニック</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2">これからの季節にぴったりな、プロが教える効率的な掃除方法を詳しくご紹介します。</p>
            </div>
          </div>
        </section>

        {/* お役立ち情報 */}
        <section className="pb-8">
           <div className="grid grid-cols-2 gap-3">
             <div className="bg-orange-50 border border-orange-100 p-4 rounded-3xl flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                   <ShieldCheck className="text-primary" size={16} />
                </div>
                <p className="text-xs font-bold text-foreground">あんしん保証</p>
                <p className="text-[10px] text-muted-foreground">万が一の事故にも対応</p>
             </div>
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                   <Heart className="text-blue-500" size={16} />
                </div>
                <p className="text-xs font-bold text-foreground">よくある質問</p>
                <p className="text-[10px] text-muted-foreground">困ったときはコチラ</p>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}
