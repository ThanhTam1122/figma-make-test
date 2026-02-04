import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
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

interface Supporter {
  id: number;
  name: string;
  nameKana: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  visitCount: number;
  rating: number;
  certifications: string[];
}

export function SupporterManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupporter, setSelectedSupporter] = useState<Supporter | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モックデータ
  const supporters: Supporter[] = [
    {
      id: 1,
      name: '山田 花子',
      nameKana: 'ヤマダ ハナコ',
      phone: '080-1111-2222',
      email: 'yamada@example.com',
      address: '東京都世田谷区世田谷1-1-1',
      joinDate: '2024-01-15',
      status: 'active',
      visitCount: 145,
      rating: 4.8,
      certifications: ['家事代行士2級', '整理収納アドバイザー1級'],
    },
    {
      id: 2,
      name: '佐藤 明美',
      nameKana: 'サトウ アケミ',
      phone: '090-2222-3333',
      email: 'sato@example.com',
      address: '東京都杉並区荻窪2-2-2',
      joinDate: '2024-02-20',
      status: 'active',
      visitCount: 128,
      rating: 4.9,
      certifications: ['家事代行士1級', '調理師免許'],
    },
    {
      id: 3,
      name: '田中 直美',
      nameKana: 'タナカ ナオミ',
      phone: '080-3333-4444',
      email: 'naomi@example.com',
      address: '東京都目黒区目黒3-3-3',
      joinDate: '2024-03-10',
      status: 'active',
      visitCount: 98,
      rating: 4.7,
      certifications: ['家事代行士2級'],
    },
    {
      id: 4,
      name: '鈴木 由美',
      nameKana: 'スズキ ユミ',
      phone: '090-4444-5555',
      email: 'yumi@example.com',
      address: '東京都品川区品川4-4-4',
      joinDate: '2023-12-05',
      status: 'inactive',
      visitCount: 210,
      rating: 4.6,
      certifications: ['家事代行士1級', '栄養士'],
    },
  ];

  const filteredSupporters = supporters.filter(supporter =>
    supporter.name.includes(searchTerm) ||
    supporter.nameKana.includes(searchTerm) ||
    supporter.phone.includes(searchTerm) ||
    supporter.email.includes(searchTerm)
  );

  const handleViewDetail = (supporter: Supporter) => {
    setSelectedSupporter(supporter);
    setShowDetailModal(true);
  };

  const columns = [
    {
      header: '氏名',
      accessor: (row: Supporter) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.nameKana}</div>
        </div>
      ),
    },
    {
      header: '連絡先',
      accessor: (row: Supporter) => <ContactInfo phone={row.phone} email={row.email} />,
    },
    {
      header: '住所',
      accessor: (row: Supporter) => <ContactInfo address={row.address} />,
    },
    {
      header: '訪問回数',
      accessor: (row: Supporter) => <span className="font-medium">{row.visitCount}回</span>,
    },
    {
      header: '評価',
      accessor: (row: Supporter) => (
        <div className="flex items-center gap-1">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          <span className="font-medium">{row.rating}</span>
        </div>
      ),
    },
    {
      header: 'ステータス',
      accessor: (row: Supporter) => (
        <StatusBadge variant={row.status} label={getStatusLabel(row.status)} />
      ),
    },
    {
      header: '操作',
      accessor: (row: Supporter) => (
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
        title="サポーター管理"
        description={`登録サポーター：${supporters.length}名 / アクティブ：${supporters.filter(s => s.status === 'active').length}名`}
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
        data={filteredSupporters}
        keyExtractor={(row) => row.id}
        emptyMessage="サポーターが見つかりません"
      />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="サポーター詳細"
      >
        {selectedSupporter && (
          <div className="space-y-6">
            <InfoGrid
              title="基本情報"
              items={[
                { label: '氏名', value: <><div>{selectedSupporter.name}</div><div className="text-sm text-muted-foreground">{selectedSupporter.nameKana}</div></> },
                { label: '登録日', value: selectedSupporter.joinDate },
                { label: '電話番号', value: selectedSupporter.phone },
                { label: 'メールアドレス', value: selectedSupporter.email },
                { label: '住所', value: selectedSupporter.address, fullWidth: true },
              ]}
            />

            <div>
              <h4 className="mb-3 pb-2 border-b border-border font-bold">活動状況</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">総訪問回数</p>
                  <p className="text-2xl font-bold text-primary">{selectedSupporter.visitCount}回</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">平均評価</p>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-amber-500 fill-amber-500" />
                    <p className="text-2xl font-bold">{selectedSupporter.rating}</p>
                  </div>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">ステータス</p>
                  <p className="text-lg font-medium">
                    {selectedSupporter.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 pb-2 border-b border-border font-bold">資格・スキル</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSupporter.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
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
