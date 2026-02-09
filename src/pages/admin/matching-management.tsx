import React, { useState } from 'react';
import { Eye, Users } from 'lucide-react';
import { 
  SearchBar, 
  StatusBadge,
  StatusVariant,
  PageHeader, 
  DataTable, 
  Modal,
  FilterBar,
  FilterSelect,
  StatsCard,
  InfoGrid
} from '@/shared/ui/common-index';

interface Matching {
  id: number;
  jobTitle: string;
  client: string;
  supporter?: string;
  status: 'open' | 'reviewing' | 'matched' | 'scheduling' | 'completed' | 'cancelled';
  applicants: number;
  postedDate: string;
  matchedDate?: string;
  firstVisitDate?: string;
}

export function MatchingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMatching, setSelectedMatching] = useState<Matching | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モックデータ
  const matchings: Matching[] = [
    {
      id: 1,
      jobTitle: '週1回の定期清掃をお願いできる方を募集',
      client: '鈴木 太郎',
      supporter: '山田 花子',
      status: 'scheduling',
      applicants: 1,
      postedDate: '2026-01-15',
      matchedDate: '2026-01-16',
    },
    {
      id: 2,
      jobTitle: '料理・作り置きサポーター募集中',
      client: '田中 恵子',
      status: 'reviewing',
      applicants: 2,
      postedDate: '2026-01-14',
    },
    {
      id: 3,
      jobTitle: '隔週で家全体の掃除をお願いします',
      client: '高橋 一郎',
      status: 'open',
      applicants: 0,
      postedDate: '2026-01-13',
    },
    {
      id: 4,
      jobTitle: '平日午前中の定期清掃',
      client: '佐藤 美咲',
      supporter: '佐藤 明美',
      status: 'matched',
      applicants: 1,
      postedDate: '2026-01-12',
      matchedDate: '2026-01-14',
      firstVisitDate: '2026-01-20',
    },
    {
      id: 5,
      jobTitle: '週2回の料理代行',
      client: '山本 健一',
      supporter: '田中 直美',
      status: 'completed',
      applicants: 3,
      postedDate: '2026-01-10',
      matchedDate: '2026-01-11',
      firstVisitDate: '2026-01-15',
    },
  ];

  const filteredMatchings = matchings.filter(matching => {
    const matchesSearch =
      matching.jobTitle.includes(searchTerm) ||
      matching.client.includes(searchTerm) ||
      (matching.supporter && matching.supporter.includes(searchTerm));
    const matchesStatus = filterStatus === 'all' || matching.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string): StatusVariant => {
    const statusMap: Record<string, StatusVariant> = {
      'open': 'open',
      'reviewing': 'reviewing',
      'matched': 'matched',
      'scheduling': 'scheduled',
      'completed': 'completed',
      'cancelled': 'cancelled',
    };
    return statusMap[status] || 'pending';
  };

  const handleViewDetail = (matching: Matching) => {
    setSelectedMatching(matching);
    setShowDetailModal(true);
  };

  const columns = [
    {
      header: '募集タイトル',
      accessor: (row: Matching) => <span className="font-medium">{row.jobTitle}</span>,
    },
    {
      header: 'ご利用者',
      accessor: (row: Matching) => <span className="font-medium">{row.client}</span>,
    },
    {
      header: 'サポーター',
      accessor: (row: Matching) => <span className="font-medium">{row.supporter || '-'}</span>,
    },
    {
      header: '応募者数',
      accessor: (row: Matching) => (
        <div className="flex items-center gap-1">
          <Users size={16} className="text-muted-foreground" />
          <span>{row.applicants}名</span>
        </div>
      ),
    },
    {
      header: '掲載日',
      accessor: (row: Matching) => <span className="text-sm">{row.postedDate}</span>,
    },
    {
      header: 'ステータス',
      accessor: (row: Matching) => <StatusBadge variant={getStatusVariant(row.status)} />,
    },
    {
      header: '操作',
      accessor: (row: Matching) => (
        <button
          onClick={() => handleViewDetail(row)}
          className="text-primary hover:underline text-sm flex items-center gap-1"
        >
          <Eye size={16} />
          詳細
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="マッチング管理"
        description={`全募集：${matchings.length}件 / 募集中：${matchings.filter(m => m.status === 'open').length}件 / 応募受付中：${matchings.filter(m => m.status === 'reviewing').length}件`}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          label="募集中"
          value={`${matchings.filter(m => m.status === 'open').length}件`}
          valueClassName="text-green-600"
        />
        <StatsCard
          label="応募受付中"
          value={`${matchings.filter(m => m.status === 'reviewing').length}件`}
          valueClassName="text-amber-600"
        />
        <StatsCard
          label="マッチング成立"
          value={`${matchings.filter(m => m.status === 'matched' || m.status === 'scheduling').length}件`}
          valueClassName="text-blue-600"
        />
        <StatsCard
          label="完了"
          value={`${matchings.filter(m => m.status === 'completed').length}件`}
          valueClassName="text-gray-600"
        />
      </div>

      <FilterBar>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="募集タイトル、ご利用者、サポーターで検索..."
          className="flex-1"
        />
        <FilterSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'すべて' },
            { value: 'open', label: '募集中' },
            { value: 'reviewing', label: '応募受付中' },
            { value: 'matched', label: 'マッチング成立' },
            { value: 'scheduling', label: 'スケジュール調整中' },
          ]}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filteredMatchings}
        keyExtractor={(row) => row.id}
        emptyMessage="マッチングが見つかりません"
      />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="マッチング詳細"
      >
        {selectedMatching && (
          <div className="space-y-6">
            <InfoGrid
              title="基本情報"
              items={[
                { label: '募集タイトル', value: selectedMatching.jobTitle },
                { label: 'ステータス', value: <StatusBadge variant={getStatusVariant(selectedMatching.status)} /> },
                { label: 'ご利用者', value: selectedMatching.client },
                { label: 'サポーター', value: selectedMatching.supporter || '未定' },
                { label: '掲載日', value: selectedMatching.postedDate },
                { label: '応募者数', value: `${selectedMatching.applicants}名` },
                ...(selectedMatching.matchedDate ? [{ label: 'マッチング成立日', value: selectedMatching.matchedDate }] : []),
                ...(selectedMatching.firstVisitDate ? [{ label: '初回訪問日', value: selectedMatching.firstVisitDate }] : []),
              ]}
            />

            <div className="flex gap-2 pt-4">
              <button className="flex-1 py-3 border border-border rounded-lg hover:bg-accent">
                チャット履歴を見る
              </button>
              <button className="flex-1 py-3 border border-border rounded-lg hover:bg-accent">
                スケジュールを見る
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
