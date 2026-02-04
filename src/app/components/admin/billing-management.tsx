import React, { useState } from 'react';
import { Search, Download, Eye, X } from 'lucide-react';

interface Invoice {
  id: number;
  invoiceNumber: string;
  client: string;
  month: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  visits: number;
}

export function BillingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [filterMonth, setFilterMonth] = useState('2026-01');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モックデータ
  const invoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: 'INV-2026-01-001',
      client: '鈴木 太郎',
      month: '2026年1月',
      amount: 52000,
      status: 'paid',
      issueDate: '2026-01-05',
      dueDate: '2026-01-31',
      paidDate: '2026-01-10',
      visits: 4,
    },
    {
      id: 2,
      invoiceNumber: 'INV-2026-01-002',
      client: '田中 恵子',
      month: '2026年1月',
      amount: 39000,
      status: 'pending',
      issueDate: '2026-01-05',
      dueDate: '2026-01-31',
      visits: 3,
    },
    {
      id: 3,
      invoiceNumber: 'INV-2026-01-003',
      client: '高橋 一郎',
      month: '2026年1月',
      amount: 26000,
      status: 'pending',
      issueDate: '2026-01-05',
      dueDate: '2026-01-31',
      visits: 2,
    },
    {
      id: 4,
      invoiceNumber: 'INV-2025-12-015',
      client: '佐藤 美咲',
      month: '2025年12月',
      amount: 65000,
      status: 'overdue',
      issueDate: '2025-12-05',
      dueDate: '2025-12-31',
      visits: 5,
    },
    {
      id: 5,
      invoiceNumber: 'INV-2025-12-014',
      client: '山本 健一',
      month: '2025年12月',
      amount: 39000,
      status: 'paid',
      issueDate: '2025-12-05',
      dueDate: '2025-12-31',
      paidDate: '2025-12-28',
      visits: 3,
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.includes(searchTerm) || invoice.invoiceNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueRevenue = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">未入金</span>;
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">入金済み</span>;
      case 'overdue':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">期限超過</span>;
      default:
        return null;
    }
  };

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">売上/請求管理</h2>
          <p className="text-sm text-muted-foreground">
            請求書：{invoices.length}件 / 未入金：{invoices.filter(i => i.status === 'pending').length}件
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2">
          <Download size={20} />
          CSV出力
        </button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">入金済み売上</p>
          <p className="text-2xl font-bold text-green-600">¥{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">未入金額</p>
          <p className="text-2xl font-bold text-amber-600">¥{pendingRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">期限超過額</p>
          <p className="text-2xl font-bold text-red-600">¥{overdueRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* フィルター・検索バー */}
      <div className="bg-white rounded-lg border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="ご利用者、請求書番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-input-background"
          >
            <option value="all">すべて</option>
            <option value="pending">未入金</option>
            <option value="paid">入金済み</option>
            <option value="overdue">期限超過</option>
          </select>
        </div>
      </div>

      {/* 請求書一覧 */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium">請求書番号</th>
                <th className="text-left p-4 text-sm font-medium">ご利用者</th>
                <th className="text-left p-4 text-sm font-medium">対象月</th>
                <th className="text-left p-4 text-sm font-medium">訪問回数</th>
                <th className="text-left p-4 text-sm font-medium">金額</th>
                <th className="text-left p-4 text-sm font-medium">支払期限</th>
                <th className="text-left p-4 text-sm font-medium">ステータス</th>
                <th className="text-left p-4 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    請求書が見つかりません
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="p-4">
                      <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{invoice.client}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{invoice.month}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{invoice.visits}回</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">¥{invoice.amount.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{invoice.dueDate}</span>
                    </td>
                    <td className="p-4">{getStatusBadge(invoice.status)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetail(invoice)}
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        <Eye size={16} />
                        詳細
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 請求書詳細モーダル */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>請求書詳細</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* 請求書情報 */}
              <div>
                <h4 className="mb-3 pb-2 border-b border-border">請求書情報</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">請求書番号</label>
                    <p className="font-mono font-medium">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">対象月</label>
                    <p className="font-medium">{selectedInvoice.month}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">ご利用者</label>
                    <p className="font-medium">{selectedInvoice.client}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">訪問回数</label>
                    <p className="font-medium">{selectedInvoice.visits}回</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">発行日</label>
                    <p className="font-medium">{selectedInvoice.issueDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">支払期限</label>
                    <p className="font-medium">{selectedInvoice.dueDate}</p>
                  </div>
                  {selectedInvoice.paidDate && (
                    <div>
                      <label className="text-sm text-muted-foreground">入金日</label>
                      <p className="font-medium">{selectedInvoice.paidDate}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-muted-foreground">ステータス</label>
                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                  </div>
                </div>
              </div>

              {/* 金額明細 */}
              <div>
                <h4 className="mb-3 pb-2 border-b border-border">金額明細</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-accent rounded-lg">
                    <span>訪問サービス料金（{selectedInvoice.visits}回 × ¥13,000）</span>
                    <span className="font-medium">¥{(selectedInvoice.visits * 13000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">合計金額</span>
                    <span className="text-xl font-bold text-primary">¥{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2 pt-4">
                <button className="flex-1 py-3 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                  <Download size={18} />
                  PDF出力
                </button>
                {selectedInvoice.status !== 'paid' && (
                  <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                    入金済みにする
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
