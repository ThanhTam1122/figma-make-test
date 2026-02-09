import React, { useState } from 'react';
import { Download, FileText, Check, Calendar } from 'lucide-react';

interface Payment {
  id: number;
  month: string;
  year: number;
  amount: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
  details: {
    clients: Array<{
      name: string;
      visits: number;
      perVisit: number;
      subtotal: number;
    }>;
    totalVisits: number;
    deductions: number;
  };
}

export function RewardPage() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // モックデータ
  const payments: Payment[] = [
    {
      id: 1,
      month: '2026年1月',
      year: 2026,
      amount: 120000,
      status: 'pending',
      details: {
        clients: [
          { name: '鈴木 太郎', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '田中 恵子', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '高橋 一郎', visits: 4, perVisit: 10000, subtotal: 40000 },
        ],
        totalVisits: 12,
        deductions: 0,
      },
    },
    {
      id: 2,
      month: '2025年12月',
      year: 2025,
      amount: 120000,
      status: 'paid',
      paymentDate: '2025-12-31',
      details: {
        clients: [
          { name: '鈴木 太郎', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '田中 恵子', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '高橋 一郎', visits: 4, perVisit: 10000, subtotal: 40000 },
        ],
        totalVisits: 12,
        deductions: 0,
      },
    },
    {
      id: 3,
      month: '2025年11月',
      year: 2025,
      amount: 150000,
      status: 'paid',
      paymentDate: '2025-11-30',
      details: {
        clients: [
          { name: '鈴木 太郎', visits: 5, perVisit: 10000, subtotal: 50000 },
          { name: '田中 恵子', visits: 5, perVisit: 10000, subtotal: 50000 },
          { name: '高橋 一郎', visits: 5, perVisit: 10000, subtotal: 50000 },
        ],
        totalVisits: 15,
        deductions: 0,
      },
    },
    {
      id: 4,
      month: '2025年10月',
      year: 2025,
      amount: 120000,
      status: 'paid',
      paymentDate: '2025-10-31',
      details: {
        clients: [
          { name: '鈴木 太郎', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '田中 恵子', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '高橋 一郎', visits: 4, perVisit: 10000, subtotal: 40000 },
        ],
        totalVisits: 12,
        deductions: 0,
      },
    },
    {
      id: 5,
      month: '2025年9月',
      year: 2025,
      amount: 120000,
      status: 'paid',
      paymentDate: '2025-09-30',
      details: {
        clients: [
          { name: '鈴木 太郎', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '田中 恵子', visits: 4, perVisit: 10000, subtotal: 40000 },
          { name: '高橋 一郎', visits: 4, perVisit: 10000, subtotal: 40000 },
        ],
        totalVisits: 12,
        deductions: 0,
      },
    },
  ];

  const filteredPayments = payments.filter(p => p.year === selectedYear);
  const availableYears = [...new Set(payments.map(p => p.year))].sort((a, b) => b - a);

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
            <Calendar size={12} />
            支払い予定
          </span>
        );
      default:
        return null;
    }
  };

  const toggleMonthSelection = (paymentId: number) => {
    setSelectedMonths((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
    );
  };

  const handleDownloadStatement = (payment: Payment) => {
    alert(`${payment.month}の支払明細をダウンロードしました`);
  };

  const handleDownloadMultiple = () => {
    const selected = payments.filter((p) => selectedMonths.includes(p.id));
    if (selected.length === 0) {
      alert('ダウンロードする月を選択してください');
      return;
    }
    alert(`${selected.map((p) => p.month).join('、')}の支払明細をダウンロードしました`);
    setSelectedMonths([]);
  };

  const handleDownloadAnnual = () => {
    const yearPayments = filteredPayments.filter((p) => p.status === 'paid');
    if (yearPayments.length === 0) {
      alert('該当する支払いデータがありません');
      return;
    }
    alert(`${selectedYear}年の年間支払明細をダウンロードしました`);
  };

  const yearlyTotal = filteredPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">報酬</h2>
        <p className="text-sm opacity-90">報酬の確認と支払明細のダウンロード</p>
      </div>

      <div className="p-4 space-y-6">
        {/* 報酬サマリー */}
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="mb-3">報酬サマリー</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700 mb-1">支払い予定</p>
              <p className="text-2xl font-bold text-amber-900">
                ¥
                {payments
                  .filter((p) => p.status === 'pending')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700 mb-1">{selectedYear}年支払済</p>
              <p className="text-2xl font-bold text-green-900">¥{yearlyTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 年度選択と一括ダウンロード */}
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3>年度選択</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-border rounded-lg bg-input-background"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}年
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownloadAnnual}
              className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              {selectedYear}年 年間支払明細をダウンロード
            </button>
            {selectedMonths.length > 0 && (
              <button
                onClick={handleDownloadMultiple}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                選択した{selectedMonths.length}ヶ月分をダウンロード
              </button>
            )}
          </div>
        </div>

        {/* 報酬一覧 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>報酬一覧</h3>
            {selectedMonths.length > 0 && (
              <button
                onClick={() => setSelectedMonths([])}
                className="text-sm text-muted-foreground hover:underline"
              >
                選択解除
              </button>
            )}
          </div>
          <div className="space-y-2">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className={`bg-white rounded-lg border p-4 transition-colors ${
                  selectedMonths.includes(payment.id) ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(payment.id)}
                      onChange={() => toggleMonthSelection(payment.id)}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold">{payment.month}</h4>
                      <p className="text-2xl font-bold text-primary mt-1">
                        ¥{payment.amount.toLocaleString()}
                      </p>
                      {payment.paymentDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          支払日：{payment.paymentDate}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                {/* 内訳サマリー */}
                <div className="mb-3 p-3 bg-accent rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">訪問回数</span>
                    <span>{payment.details.totalVisits}回</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">担当家庭数</span>
                    <span>{payment.details.clients.length}家庭</span>
                  </div>
                  {payment.details.deductions > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>控除額</span>
                      <span>-¥{payment.details.deductions.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* 詳細ボタン */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowStatementModal(true);
                    }}
                    className="flex-1 py-2 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText size={16} />
                    詳細を見る
                  </button>
                  <button
                    onClick={() => handleDownloadStatement(payment)}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    ダウンロード
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 支払明細モーダル */}
      {showStatementModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>支払明細</h3>
              <button
                onClick={() => setShowStatementModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 明細の内容 */}
              <div className="border border-border rounded-lg p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">支払明細書</h2>
                  <p className="text-sm text-muted-foreground">きらりライフサポート</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">対象月</span>
                    <span className="font-medium">{selectedPayment.month}</span>
                  </div>
                  {selectedPayment.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">支払日</span>
                      <span className="font-medium">{selectedPayment.paymentDate}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <h4 className="font-bold mb-3">家庭別詳細</h4>
                  <div className="space-y-3">
                    {selectedPayment.details.clients.map((client, index) => (
                      <div key={index} className="p-3 bg-accent rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{client.name}</span>
                          <span className="font-bold">¥{client.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>訪問回数</span>
                            <span>{client.visits}回</span>
                          </div>
                          <div className="flex justify-between">
                            <span>1回あたり</span>
                            <span>¥{client.perVisit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2">訪問回数合計</td>
                        <td className="text-right">{selectedPayment.details.totalVisits}回</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">報酬小計</td>
                        <td className="text-right">
                          ¥
                          {(selectedPayment.amount + selectedPayment.details.deductions).toLocaleString()}
                        </td>
                      </tr>
                      {selectedPayment.details.deductions > 0 && (
                        <tr className="border-b border-border text-red-600">
                          <td className="py-2">控除額</td>
                          <td className="text-right">
                            -¥{selectedPayment.details.deductions.toLocaleString()}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-3 font-bold">支払額</td>
                        <td className="text-right font-bold text-xl text-primary">
                          ¥{selectedPayment.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ダウンロードボタン */}
              <button
                onClick={() => handleDownloadStatement(selectedPayment)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                PDFでダウンロード
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
