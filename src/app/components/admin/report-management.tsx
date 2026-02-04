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

interface Report {
  id: number;
  date: string;
  time: string;
  client: string;
  supporter: string;
  service: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function ReportManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モックデータ
  const reports: Report[] = [
    {
      id: 1,
      date: '2026-01-16',
      time: '10:00-12:00',
      client: '鈴木 太郎',
      supporter: '山田 花子',
      service: '定期清掃',
      content: 'リビング、キッチン、浴室の清掃を行いました。特にキッチンの油汚れがひどかったため、念入りに清掃しました。窓拭きも実施し、全体的にきれいになりました。',
      status: 'approved',
      submittedAt: '2026-01-16 12:30',
    },
    {
      id: 2,
      date: '2026-01-16',
      time: '14:00-16:00',
      client: '田中 恵子',
      supporter: '佐藤 明美',
      service: '定期清掃',
      content: 'リビングと寝室の清掃を実施しました。掃除機がけ、床の拭き掃除、トイレ清掃を行いました。',
      status: 'pending',
      submittedAt: '2026-01-16 16:15',
    },
    {
      id: 3,
      date: '2026-01-15',
      time: '10:00-12:00',
      client: '高橋 一郎',
      supporter: '田中 直美',
      service: 'スポット清掃',
      content: 'エアコンの清掃を中心に実施しました。フィルター掃除と内部クリーニングを行い、快適に使えるようになりました。',
      status: 'pending',
      submittedAt: '2026-01-15 12:45',
    },
    {
      id: 4,
      date: '2026-01-15',
      time: '13:00-15:00',
      client: '佐藤 美咲',
      supporter: '山田 花子',
      service: '定期清掃',
      content: 'キッチン、浴室、トイレの水回り清掃を重点的に行いました。カビ取りも実施しました。',
      status: 'approved',
      submittedAt: '2026-01-15 15:20',
    },
    {
      id: 5,
      date: '2026-01-14',
      time: '10:00-12:00',
      client: '山本 健一',
      supporter: '佐藤 明美',
      service: '定期清掃',
      content: '全体的な清掃を行いました。',
      status: 'rejected',
      submittedAt: '2026-01-14 12:10',
    },
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.client.includes(searchTerm) ||
      report.supporter.includes(searchTerm) ||
      report.service.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleApprove = (reportId: number) => {
    console.log('Approve report:', reportId);
    setShowDetailModal(false);
  };

  const handleReject = (reportId: number) => {
    console.log('Reject report:', reportId);
    setShowDetailModal(false);
  };

  const columns = [
    {
      header: '訪問日時',
      accessor: (row: Report) => (
        <div>
          <div className="font-medium">{row.date}</div>
          <div className="text-xs text-muted-foreground">{row.time}</div>
        </div>
      ),
    },
    {
      header: 'ご利用者',
      accessor: (row: Report) => <span className="font-medium">{row.client}</span>,
    },
    {
      header: 'サポーター',
      accessor: (row: Report) => <span className="font-medium">{row.supporter}</span>,
    },
    {
      header: 'サービス内容',
      accessor: (row: Report) => <span className="text-sm">{row.service}</span>,
    },
    {
      header: '提出日時',
      accessor: (row: Report) => <span className="text-sm text-muted-foreground">{row.submittedAt}</span>,
    },
    {
      header: 'ステータス',
      accessor: (row: Report) => <StatusBadge variant={row.status as StatusVariant} />,
    },
    {
      header: '操作',
      accessor: (row: Report) => (
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
        title="レポート管理"
        description={`全レポート：${reports.length}件 / 確認待ち：${reports.filter(r => r.status === 'pending').length}件`}
      />

      <FilterBar>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ご利用者、サポーター、サービスで検索..."
          className="flex-1"
        />
        <FilterSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'すべて' },
            { value: 'pending', label: '確認待ち' },
            { value: 'approved', label: '承認済み' },
            { value: 'rejected', label: '却下' },
          ]}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filteredReports}
        keyExtractor={(row) => row.id}
        emptyMessage="レポートが見つかりません"
      />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="レポート詳細"
      >
        {selectedReport && (
          <div className="space-y-6">
            <InfoGrid
              title="訪問情報"
              items={[
                { label: '訪問日時', value: `${selectedReport.date} ${selectedReport.time}` },
                { label: '提出日時', value: selectedReport.submittedAt },
                { label: 'ご利用者', value: selectedReport.client },
                { label: 'サポーター', value: selectedReport.supporter },
                { label: 'サービス内容', value: selectedReport.service, fullWidth: true },
              ]}
            />

            <div>
              <h4 className="mb-3 pb-2 border-b border-border font-bold">作業内容</h4>
              <p className="leading-relaxed">{selectedReport.content}</p>
            </div>

            <div>
              <h4 className="mb-3 pb-2 border-b border-border font-bold">ステータス</h4>
              <StatusBadge variant={selectedReport.status as StatusVariant} />
            </div>

            {selectedReport.status === 'pending' && (
              <ActionButtonGroup
                onReject={() => handleReject(selectedReport.id)}
                onApprove={() => handleApprove(selectedReport.id)}
                rejectLabel="却下"
                approveLabel="承認"
                className="pt-4"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
