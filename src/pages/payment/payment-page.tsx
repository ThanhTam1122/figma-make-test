import React, { useState } from 'react';
import { Download, FileText, Receipt, Check, Clock, AlertCircle, CreditCard, Building2, Landmark } from 'lucide-react';

interface Invoice {
  id: number;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  details: {
    baseFee: number;
    visits: number;
    perVisit: number;
    tax: number;
  };
}

export function PaymentPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [receiptName, setReceiptName] = useState('株式会社サンプル');
  const [receiptNote, setReceiptNote] = useState('家事代行サービス利用料として');

  // モックデータ
  const invoices: Invoice[] = [
    {
      id: 1,
      month: '2026年1月',
      amount: 48000,
      status: 'overdue',
      dueDate: '2026-01-25',
      details: {
        baseFee: 40000,
        visits: 4,
        perVisit: 10000,
        tax: 4800,
      },
    },
    {
      id: 2,
      month: '2025年12月',
      amount: 48000,
      status: 'overdue',
      dueDate: '2025-12-31',
      details: {
        baseFee: 40000,
        visits: 4,
        perVisit: 10000,
        tax: 4800,
      },
    },
    {
      id: 3,
      month: '2025年11月',
      amount: 60000,
      status: 'paid',
      dueDate: '2025-11-30',
      paidDate: '2025-11-27',
      details: {
        baseFee: 50000,
        visits: 5,
        perVisit: 10000,
        tax: 6000,
      },
    },
    {
      id: 4,
      month: '2025年10月',
      amount: 48000,
      status: 'paid',
      dueDate: '2025-10-31',
      paidDate: '2025-10-29',
      details: {
        baseFee: 40000,
        visits: 4,
        perVisit: 10000,
        tax: 4800,
      },
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
            <Check size={12} />
            支払い済み
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs flex items-center gap-1">
            <Clock size={12} />
            未払い
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
            <AlertCircle size={12} />
            支払期限超過
          </span>
        );
      default:
        return null;
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    alert(`${invoice.month}の請求書をダウンロードしました`);
  };

  const handleDownloadReceipt = () => {
    if (!selectedInvoice) return;
    alert(
      `${selectedInvoice.month}の領収書をダウンロードしました\n宛名：${receiptName}\n但し書き：${receiptNote}`
    );
    setShowReceiptModal(false);
  };

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">お支払い</h2>
        <p className="text-sm opacity-90">ご請求とお支払い状況の確認</p>
      </div>

      <div className="p-4 space-y-6">
        {/* 期限超過のお支払い */}
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="mb-3">期限超過のお支払い</h3>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
            <p className="text-sm text-red-700 mb-2">未払い額の合計</p>
            <p className="text-3xl font-bold text-red-900">
              ¥{invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
            </p>
            {invoices.filter(i => i.status === 'overdue').length > 0 && (
              <p className="text-xs text-red-600 mt-2">
                {invoices.filter(i => i.status === 'overdue').length}件の支払期限超過があります
              </p>
            )}
          </div>
          {invoices.filter(i => i.status === 'overdue').length > 0 && (
            <button
              onClick={() => setShowPaymentMethodModal(true)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
            >
              支払い手続き
            </button>
          )}
        </div>

        {/* ご請求一覧 */}
        <div>
          <h3 className="mb-3">ご請求一覧</h3>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{invoice.month}</h4>
                    <p className="text-2xl font-bold text-primary mt-1">
                      ¥{invoice.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {invoice.status === 'paid' && invoice.paidDate
                        ? `支払日：${invoice.paidDate}`
                        : `お支払い期限：${invoice.dueDate}`}
                    </p>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>

                {/* 内訳 */}
                <div className="mb-3 p-3 bg-accent rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">基本料金</span>
                    <span>¥{invoice.details.baseFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">訪問回数</span>
                    <span>{invoice.details.visits}回</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1">
                    <span className="text-muted-foreground">消費税</span>
                    <span>¥{invoice.details.tax.toLocaleString()}</span>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowInvoiceModal(true);
                    }}
                    className="flex-1 py-2 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText size={16} />
                    請求書
                  </button>
                  {invoice.status === 'paid' && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowReceiptModal(true);
                      }}
                      className="flex-1 py-2 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2 text-sm"
                    >
                      <Receipt size={16} />
                      領収書
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 請求書モーダル */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>請求書</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 請求書の内容 */}
              <div className="border border-border rounded-lg p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">ご請求書</h2>
                  <p className="text-sm text-muted-foreground">きらりライフサポート</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">請求月</span>
                    <span className="font-medium">{selectedInvoice.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">お支払い期限</span>
                    <span className="font-medium">{selectedInvoice.dueDate}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2">項目</th>
                        <th className="text-right py-2">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2">基本料金</td>
                        <td className="text-right">¥{selectedInvoice.details.baseFee.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">訪問回数（{selectedInvoice.details.visits}回）</td>
                        <td className="text-right">-</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">小計</td>
                        <td className="text-right">¥{selectedInvoice.details.baseFee.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">消費税（10%）</td>
                        <td className="text-right">¥{selectedInvoice.details.tax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold">合計金額</td>
                        <td className="text-right font-bold text-xl text-primary">
                          ¥{selectedInvoice.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ダウンロードボタン */}
              <button
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                PDFでダウンロード
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 領収書モーダル */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>領収書</h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 宛名・但し書き編集 */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">宛名</label>
                  <input
                    type="text"
                    value={receiptName}
                    onChange={(e) => setReceiptName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    placeholder="宛名を入力してください"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">但し書き</label>
                  <input
                    type="text"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                    placeholder="但し書きを入力してください"
                  />
                </div>
              </div>

              {/* 領収書プレビュー */}
              <div className="border border-border rounded-lg p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">領収書</h2>
                  <p className="text-sm text-muted-foreground">きらりライフサポート</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">宛名</span>
                    <p className="text-lg font-medium">{receiptName} 様</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-3xl font-bold text-primary text-center">
                      ¥{selectedInvoice.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-center text-muted-foreground mt-1">（税込）</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">但し書き</span>
                    <p className="font-medium">{receiptNote}</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">発行日</span>
                      <span>{selectedInvoice.paidDate || new Date().toISOString().split('T')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ダウンロードボタン */}
              <button
                onClick={handleDownloadReceipt}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                PDFでダウンロード
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 支払い方法選択モーダル */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>支払い方法を選択</h3>
              <button
                onClick={() => setShowPaymentMethodModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-3">
              {/* お振込み */}
              <button
                onClick={() => {
                  setShowPaymentMethodModal(false);
                  alert('お振込み情報を表示します');
                }}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Landmark className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">お振込み</p>
                    <p className="text-sm text-muted-foreground">銀行振込でお支払い</p>
                  </div>
                </div>
              </button>

              {/* 口座振替を設定する */}
              <button
                onClick={() => {
                  setShowPaymentMethodModal(false);
                  alert('口座振替の設定画面に移動します');
                }}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">口座振替を設定する</p>
                    <p className="text-sm text-muted-foreground">自動引き落としを設定</p>
                  </div>
                </div>
              </button>

              {/* クレジットカード登録（未払いが2件以上の場合のみ表示） */}
              {invoices.filter(i => i.status === 'overdue').length >= 2 && (
                <button
                  onClick={() => {
                    setShowPaymentMethodModal(false);
                    alert('クレジットカード登録画面に移動します');
                  }}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">クレジットカード登録</p>
                      <p className="text-sm text-muted-foreground">カード払いで即時決済</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}