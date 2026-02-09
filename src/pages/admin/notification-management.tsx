import React, { useState } from 'react';
import { Plus, Edit, Trash2, Send, X } from 'lucide-react';
import { 
  PageHeader, 
  FilterBar,
  FilterSelect,
  Modal,
  StatusBadge,
  StatusVariant
} from '@/shared/ui/common-index';

interface Notification {
  id: number;
  title: string;
  content: string;
  target: 'all' | 'clients' | 'supporters';
  status: 'draft' | 'sent';
  sentAt?: string;
  createdAt: string;
}

export function NotificationManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterTarget, setFilterTarget] = useState('any');
  const [filterStatus, setFilterStatus] = useState('all');

  // モックデータ
  const notifications: Notification[] = [
    {
      id: 1,
      title: '1月の営業カレンダー更新',
      content: '1月の営業日カレンダーを更新しました。年始は1/4から通常営業となります。',
      target: 'all',
      status: 'sent',
      sentAt: '2026-01-05 09:00',
      createdAt: '2026-01-05 08:30',
    },
    {
      id: 2,
      title: '年末年始の営業について',
      content: '年末年始は12/30〜1/3までお休みをいただきます。ご不便をおかけしますが、よろしくお願いいたします。',
      target: 'all',
      status: 'sent',
      sentAt: '2025-12-28 10:00',
      createdAt: '2025-12-27 15:00',
    },
    {
      id: 3,
      title: '新サービス開始のお知らせ',
      content: '2月より料理代行サービスを開始いたします。詳細は追ってご連絡いたします。',
      target: 'clients',
      status: 'draft',
      createdAt: '2026-01-14 11:00',
    },
    {
      id: 4,
      title: 'サポーター研修会のご案内',
      content: '1月25日にサポーター向け研修会を実施します。参加希望の方は事務局までご連絡ください。',
      target: 'supporters',
      status: 'draft',
      createdAt: '2026-01-13 14:30',
    },
  ];

  const filteredNotifications = notifications.filter(notif => {
    const matchesTarget = filterTarget === 'any' || notif.target === filterTarget;
    const matchesStatus = filterStatus === 'all' || notif.status === filterStatus;
    return matchesTarget && matchesStatus;
  });

  const getTargetLabel = (target: string) => {
    switch (target) {
      case 'all':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">全員</span>;
      case 'clients':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">ご利用者のみ</span>;
      case 'supporters':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">サポーターのみ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="お知らせ管理"
        description={`全お知らせ：${notifications.length}件 / 下書き：${notifications.filter(n => n.status === 'draft').length}件`}
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <Plus size={20} />
            新規作成
          </button>
        }
      />

      <FilterBar>
        <FilterSelect
          value={filterTarget}
          onChange={setFilterTarget}
          options={[
            { value: 'any', label: 'すべての対象' },
            { value: 'all', label: '全員' },
            { value: 'clients', label: 'ご利用者のみ' },
            { value: 'supporters', label: 'サポーターのみ' },
          ]}
        />
        <FilterSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'すべて' },
            { value: 'draft', label: '下書き' },
            { value: 'sent', label: '配信済み' },
          ]}
        />
      </FilterBar>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-8 text-center text-muted-foreground">
            お知らせがありません
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div key={notif.id} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{notif.title}</h3>
                    {getTargetLabel(notif.target)}
                    <StatusBadge variant={notif.status as StatusVariant} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notif.content}</p>
                  <div className="text-xs text-muted-foreground">
                    作成日：{notif.createdAt}
                    {notif.sentAt && <span className="ml-3">配信日：{notif.sentAt}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                {notif.status === 'draft' && (
                  <>
                    <button className="px-3 py-2 border border-border rounded-lg hover:bg-accent flex items-center gap-2 text-sm">
                      <Edit size={16} />
                      編集
                    </button>
                    <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2 text-sm">
                      <Send size={16} />
                      配信
                    </button>
                    <button className="px-3 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 flex items-center gap-2 text-sm">
                      <Trash2 size={16} />
                      削除
                    </button>
                  </>
                )}
                {notif.status === 'sent' && (
                  <button className="px-3 py-2 border border-border rounded-lg hover:bg-accent flex items-center gap-2 text-sm">
                    <Edit size={16} />
                    詳細
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="新規お知らせ作成"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">タイトル</label>
            <input
              type="text"
              placeholder="お知らせのタイトルを入力"
              className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">配信対象</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg bg-input-background">
              <option value="all">全員</option>
              <option value="clients">ご利用者のみ</option>
              <option value="supporters">サポーターのみ</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">内容</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
              rows={6}
              placeholder="お知らせの内容を入力してください"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                setShowCreateModal(false);
              }}
              className="flex-1 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10"
            >
              下書き保存
            </button>
            <button
              onClick={() => {
                setShowCreateModal(false);
              }}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              配信
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
