import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { 
  SearchBar, 
  StatusBadge, 
  PageHeader, 
  DataTable, 
  Modal,
  ContactInfo,
  ActionButtonGroup,
  InfoGrid,
  getStatusLabel
} from '../ui/common-index';

interface Client {
  id: number;
  name: string;
  nameKana: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  visitCount: number;
  nextVisit?: string;
}

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モックデータ
  const clients: Client[] = [
    {
      id: 1,
      name: '鈴木 太郎',
      nameKana: 'スズキ タロウ',
      phone: '090-1234-5678',
      email: 'suzuki@example.com',
      address: '東京都千代田区千代田1-1-1',
      joinDate: '2024-04-15',
      status: 'active',
      visitCount: 24,
      nextVisit: '2026-01-17',
    },
    {
      id: 2,
      name: '田中 恵子',
      nameKana: 'タナカ ケイコ',
      phone: '080-2345-6789',
      email: 'tanaka@example.com',
      address: '東京都渋谷区神宮前2-2-2',
      joinDate: '2024-06-20',
      status: 'active',
      visitCount: 18,
      nextVisit: '2026-01-16',
    },
    {
      id: 3,
      name: '高橋 一郎',
      nameKana: 'タカハシ イチロウ',
      phone: '090-3456-7890',
      email: 'takahashi@example.com',
      address: '東京都新宿区新宿3-3-3',
      joinDate: '2024-08-10',
      status: 'active',
      visitCount: 12,
      nextVisit: '2026-01-20',
    },
    {
      id: 4,
      name: '佐藤 美咲',
      nameKana: 'サトウ ミサキ',
      phone: '080-4567-8901',
      email: 'sato@example.com',
      address: '東京都港区赤坂4-4-4',
      joinDate: '2024-03-05',
      status: 'inactive',
      visitCount: 30,
    },
  ];

  const filteredClients = clients.filter(client =>
    client.name.includes(searchTerm) ||
    client.nameKana.includes(searchTerm) ||
    client.phone.includes(searchTerm) ||
    client.email.includes(searchTerm)
  );

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setShowDetailModal(true);
  };

  const columns = [
    {
      header: '氏名',
      accessor: (row: Client) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.nameKana}</div>
        </div>
      ),
    },
    {
      header: '連絡先',
      accessor: (row: Client) => <ContactInfo phone={row.phone} email={row.email} />,
    },
    {
      header: '住所',
      accessor: (row: Client) => <ContactInfo address={row.address} />,
    },
    {
      header: '訪問回数',
      accessor: (row: Client) => <span className="font-medium">{row.visitCount}回</span>,
    },
    {
      header: '次回訪問',
      accessor: (row: Client) => {
        if (!row.nextVisit) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        return (
          <div className="flex items-center gap-1 text-sm">
            <Calendar size={14} className="text-primary" />
            {row.nextVisit}
          </div>
        );
      },
    },
    {
      header: 'ステータス',
      accessor: (row: Client) => <StatusBadge variant={row.status} label={getStatusLabel(row.status)} />,
    },
    {
      header: '操作',
      accessor: (row: Client) => (
        <button
          onClick={() => handleViewDetail(row)}
          className="text-primary hover:underline text-sm"
        >
          詳細
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="ご利用者管理"
        description={`登録ご利用者：${clients.length}名 / アクティブ：${clients.filter(c => c.status === 'active').length}名`}
        action={
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2">
            <Plus size={20} />
            新規登録
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-border p-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="名前、電話番号、メールアドレスで検索..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        keyExtractor={(row) => row.id}
        emptyMessage="ご利用者が見つかりません"
      />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="ご利用者詳細"
      >
        {selectedClient && (
          <div className="space-y-6">
            <InfoGrid
              title="基本情報"
              items={[
                { label: '氏名', value: <><div>{selectedClient.name}</div><div className="text-sm text-muted-foreground">{selectedClient.nameKana}</div></> },
                { label: '登録日', value: selectedClient.joinDate },
                { label: '電話番号', value: selectedClient.phone },
                { label: 'メールアドレス', value: selectedClient.email },
                { label: '住所', value: selectedClient.address, fullWidth: true },
              ]}
            />

            <div>
              <h4 className="mb-3 pb-2 border-b border-border font-bold">利用状況</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">総訪問回数</p>
                  <p className="text-2xl font-bold text-primary">{selectedClient.visitCount}回</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">ステータス</p>
                  <p className="text-lg font-medium">
                    {selectedClient.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">次回訪問</p>
                  <p className="text-lg font-medium">
                    {selectedClient.nextVisit || '-'}
                  </p>
                </div>
              </div>
            </div>

            <ActionButtonGroup
              onEdit={() => console.log('Edit')}
              onDelete={() => console.log('Delete')}
              editLabel="編集"
              deleteLabel="削除"
              className="pt-4"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
