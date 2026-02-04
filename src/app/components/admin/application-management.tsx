import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { 
  SearchBar, 
  StatusBadge,
  StatusVariant,
  PageHeader, 
  DataTable, 
  Modal,
  FilterBar,
  FilterSelect,
  InfoGrid,
  ActionButtonGroup
} from '../ui/common-index';

interface Application {
  id: number;
  type: string;
  applicant: string;
  applicantType: 'client' | 'supporter';
  submittedAt: string;
  status: 'pending_partner' | 'pending_admin' | 'approved' | 'rejected';
  flow: 'partner_admin' | 'admin_only' | 'partner_only' | 'instant';
  approvedBy?: string[];
  details: Record<string, any>;
}

export function ApplicationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モックデータ
  const applications: Application[] = [
    {
      id: 1,
      type: 'コース／頻度変更',
      applicant: '鈴木 太郎',
      applicantType: 'client',
      submittedAt: '2026-01-15 10:30',
      status: 'pending_partner',
      flow: 'partner_admin',
      details: {
        currentFrequency: '週1回',
        newFrequency: '週2回',
        currentDuration: '2時間',
        newDuration: '3時間',
        reason: '家事の量が増えたため',
        desiredDate: '2026-02-01',
      },
    },
    {
      id: 2,
      type: '補償希望申請',
      applicant: '山田 花子',
      applicantType: 'supporter',
      submittedAt: '2026-01-14 15:20',
      status: 'pending_partner',
      flow: 'partner_admin',
      details: {
        incidentDate: '2026-01-14',
        incidentType: '物損',
        location: 'リビング',
        description: '掃除中に花瓶を誤って落としてしまいました',
        damageAmount: '5,000円',
      },
    },
    {
      id: 3,
      type: '定期訪問解約申請',
      applicant: '高橋 一郎',
      applicantType: 'client',
      submittedAt: '2026-01-13 09:45',
      status: 'pending_admin',
      flow: 'admin_only',
      details: {
        terminationDate: '2026-02-28',
        reason: '引っ越し',
        feedback: '大変お世話になりました。サービスには満足しています。',
      },
    },
    {
      id: 4,
      type: '氏名変更',
      applicant: '佐藤 美咲',
      applicantType: 'client',
      submittedAt: '2026-01-12 14:00',
      status: 'pending_admin',
      flow: 'admin_only',
      details: {
        currentName: '佐藤 美咲',
        newName: '田中 美咲',
        newNameKana: 'タナカ ミサキ',
        reason: '結婚',
      },
    },
    {
      id: 5,
      type: '訪問曜日／時間変更',
      applicant: '田中 恵子',
      applicantType: 'client',
      submittedAt: '2026-01-11 11:20',
      status: 'approved',
      flow: 'partner_only',
      approvedBy: ['佐藤 明美'],
      details: {
        currentDay: '火曜日',
        newDay: '水曜日',
        currentTime: '10:00-12:00',
        newTimeStart: '14:00',
        newTimeEnd: '16:00',
        reason: '仕事の都合',
      },
    },
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant.includes(searchTerm) || app.type.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesType =
      filterType === 'all' ||
      (filterType === 'key' && app.type === '鍵預かり申請') ||
      (filterType === 'visit' && app.type === '訪問リクエスト') ||
      (filterType === 'contract' && app.type === '定期契約終了申請');
    return matchesSearch && matchesStatus && matchesType;
  });

  const getFlowBadge = (flow: string) => {
    switch (flow) {
      case 'partner_admin':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">パートナーと管理者</span>;
      case 'admin_only':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">管理者のみ</span>;
      case 'partner_only':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">パートナーのみ</span>;
      case 'instant':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">即時</span>;
      default:
        return null;
    }
  };

  const handleViewDetail = (app: Application) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const handleApprove = (appId: number) => {
    console.log('Approve application:', appId);
    setShowDetailModal(false);
  };

  const handleReject = (appId: number) => {
    console.log('Reject application:', appId);
    setShowDetailModal(false);
  };

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      currentFrequency: '現在の頻度',
      newFrequency: '新しい頻度',
      currentDuration: '現在の時間',
      newDuration: '新しい時間',
      desiredDate: '希望開始日',
      incidentDate: '発生日',
      incidentType: '発生種類',
      location: '発生場所',
      description: '詳細',
      damageAmount: '損失額',
      terminationDate: '終了日',
      reason: '理由',
      feedback: 'フィードバック',
      currentName: '現在の名前',
      newName: '新しい名前',
      newNameKana: '新しい名前（カナ）',
      currentDay: '現在の曜日',
      newDay: '新しい曜日',
      currentTime: '現在の時間',
      newTimeStart: '新しい開始時間',
      newTimeEnd: '新しい終了時間',
    };
    return labels[key] || key;
  };

  const columns = [
    {
      header: '申請種類',
      accessor: (row: Application) => <span className="font-medium">{row.type}</span>,
    },
    {
      header: '申請者',
      accessor: (row: Application) => <span className="font-medium">{row.applicant}</span>,
    },
    {
      header: '申請者タイプ',
      accessor: (row: Application) => (
        <span className="text-sm">
          {row.applicantType === 'client' ? 'ご利用者' : 'サポーター'}
        </span>
      ),
    },
    {
      header: '申請日時',
      accessor: (row: Application) => <span className="text-sm text-muted-foreground">{row.submittedAt}</span>,
    },
    {
      header: '承認フロー',
      accessor: (row: Application) => getFlowBadge(row.flow),
    },
    {
      header: 'ステータス',
      accessor: (row: Application) => <StatusBadge variant={row.status as StatusVariant} />,
    },
    {
      header: '操作',
      accessor: (row: Application) => (
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
        title="申請管理"
        description={`全申請：${applications.length}件 / 運営承認待ち：${applications.filter(a => a.status === 'pending_admin').length}件`}
      />

      <FilterBar>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ご利用者、申請種類で検索..."
          className="flex-1"
        />
        <FilterSelect
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: 'all', label: 'すべての種類' },
            { value: 'visit', label: '訪問リクエスト' },
            { value: 'key', label: '鍵預かり申請' },
            { value: 'contract', label: '契約終了申請' },
          ]}
        />
        <FilterSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'すべて' },
            { value: 'pending_partner', label: 'パートナー承認待ち' },
            { value: 'pending_admin', label: '管理者承認待ち' },
            { value: 'approved', label: '承認済み' },
            { value: 'rejected', label: '却下' },
          ]}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filteredApplications}
        keyExtractor={(row) => row.id}
        emptyMessage="申請が見つかりません"
      />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="申請詳細"
      >
        {selectedApplication && (
          <div className="space-y-6">
            <InfoGrid
              title="基本情報"
              items={[
                { label: '申請種類', value: selectedApplication.type },
                { label: '申請日時', value: selectedApplication.submittedAt },
                { label: '申請者', value: selectedApplication.applicant },
                { label: '申請者タイプ', value: selectedApplication.applicantType === 'client' ? 'ご利用者' : 'サポーター' },
                { label: '承認フロー', value: getFlowBadge(selectedApplication.flow) },
                { label: 'ステータス', value: <StatusBadge variant={selectedApplication.status as StatusVariant} /> },
                ...(selectedApplication.approvedBy ? [{ label: '承認者', value: selectedApplication.approvedBy.join(', '), fullWidth: true }] : []),
              ]}
            />

            <div>
              <h4 className="mb-3 pb-2 border-b border-border font-bold">申請内容</h4>
              <div className="space-y-3">
                {Object.entries(selectedApplication.details).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm text-muted-foreground block mb-1">
                      {getFieldLabel(key)}
                    </label>
                    <p className="font-medium">{value || '-'}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedApplication.status === 'pending_admin' && (
              <ActionButtonGroup
                onReject={() => handleReject(selectedApplication.id)}
                onApprove={() => handleApprove(selectedApplication.id)}
                rejectLabel="却下"
                approveLabel="承認"
                className="pt-4"
              />
            )}
            {selectedApplication.status === 'pending_partner' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                現在、相手方の承認待ちです。相手が承認した後、運営での承認作業が必要です。
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
