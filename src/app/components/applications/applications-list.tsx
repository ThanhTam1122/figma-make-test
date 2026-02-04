import React, { useState } from 'react';
import { Plus, Clock, Check, X as XIcon, AlertCircle } from 'lucide-react';
import { StatusBadge, StatusVariant } from '../ui/common-index';

interface Application {
  id: number;
  type: string;
  status: 'pending_partner' | 'pending_admin' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string[];
  rejectedBy?: string;
}

interface ApplicationMenuItem {
  id: string;
  label: string;
  description: string;
  flow: 'partner_admin' | 'admin_only' | 'partner_only' | 'instant';
  availableFor: 'client' | 'supporter' | 'both';
}

interface ApplicationsListProps {
  userType: 'client' | 'supporter';
  onCreateApplication: (typeId: string) => void;
}

export function ApplicationsList({ userType, onCreateApplication }: ApplicationsListProps) {
  // 申請メニュー
  const applicationMenus: ApplicationMenuItem[] = [
    // 両者承認+運営承認
    { id: 'course-change', label: 'コース／頻度変更', description: '訪問ボリュームの変更', flow: 'partner_admin', availableFor: 'both' },
    { id: 'compensation', label: '補償希望申請', description: '物損・事故の申請', flow: 'partner_admin', availableFor: 'both' },
    // 運営承認のみ
    { id: 're-matching', label: '再マッチング申請', description: 'サポーターの変更を希望', flow: 'admin_only', availableFor: 'both' },
    { id: 'contract-termination', label: '定期訪問解約申請', description: '定期契約の解約', flow: 'admin_only', availableFor: 'client' },
    { id: 'withdrawal', label: '退会申請', description: 'サービスからの退会', flow: 'admin_only', availableFor: 'client' },
    { id: 'supporter-resignation', label: 'サポーター登録終了申請', description: 'サポーター登録の終了', flow: 'admin_only', availableFor: 'supporter' },
    { id: 'client-relocation', label: 'ご利用者引っ越し申請', description: '引っ越しに伴う住所変更', flow: 'partner_admin', availableFor: 'client' },
    { id: 'supporter-relocation', label: 'サポーター引っ越し申請', description: '引っ越しに伴う担当変更', flow: 'admin_only', availableFor: 'supporter' },
    { id: 'client-name-change', label: '氏名変更', description: 'ご利用者の氏名変更', flow: 'admin_only', availableFor: 'client' },
    { id: 'supporter-name-change', label: '氏名変更', description: 'サポーターの氏名変更', flow: 'admin_only', availableFor: 'supporter' },
    { id: 'contract-name-change', label: '契約名義／住所変更', description: '契約者情報の変更', flow: 'admin_only', availableFor: 'client' },
    { id: 'payment-method-change', label: '支払い方法変更', description: 'お支払い方法の変更', flow: 'admin_only', availableFor: 'client' },
    { id: 'bank-account-change', label: '引落口座変更', description: '引き落とし口座の変更', flow: 'admin_only', availableFor: 'client' },
    { id: 'transfer-account-change', label: '報酬振込口座変更', description: '報酬振込先の変更', flow: 'admin_only', availableFor: 'supporter' },
    // 相手承認のみ
    { id: 'schedule-change', label: '訪問曜日／時間変更', description: '定期訪問の日時変更', flow: 'partner_only', availableFor: 'both' },
    { id: 'key-deposit', label: '鍵預かり申請', description: '鍵の預かり・返却', flow: 'partner_only', availableFor: 'both' },
    // 即時反映
    { id: 'contract-email-change', label: '契約名義人メールアドレス変更', description: '即時システム反映', flow: 'instant', availableFor: 'client' },
    { id: 'billing-info-change', label: '請求名義／送付先アドレス変更', description: '即時システム反映', flow: 'instant', availableFor: 'client' },
  ];

  // モック申請履歴
  const [applications] = useState<Application[]>([
    {
      id: 1,
      type: '鍵預かり申請',
      status: 'approved',
      submittedAt: '2026-01-10',
      approvedBy: ['山田 花子'],
    },
    {
      id: 2,
      type: '訪問曜日／時間変更',
      status: 'pending_partner',
      submittedAt: '2026-01-14',
    },
  ]);

  const filteredMenus = applicationMenus.filter(
    menu => menu.availableFor === 'both' || menu.availableFor === userType
  );

  const getFlowLabel = (flow: string) => {
    switch (flow) {
      case 'partner_admin': return '相手承認→運営承認';
      case 'admin_only': return '運営承認';
      case 'partner_only': return '相手承認';
      case 'instant': return '即時反映';
      default: return '';
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">申請</h2>
        <p className="text-sm opacity-90">各種変更・申請の手続き</p>
      </div>

      <div className="p-4 space-y-6">
        {/* 申請履歴 */}
        <div>
          <h3 className="mb-3 font-bold">申請履歴</h3>
          <div className="space-y-2">
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg border border-border p-6 text-center text-muted-foreground">
                申請履歴はありません
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} className="bg-white rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold">{app.type}</h4>
                      <p className="text-sm text-muted-foreground">申請日：{app.submittedAt}</p>
                      {app.approvedBy && (
                        <p className="text-sm text-muted-foreground">
                          承認者：{app.approvedBy.join(', ')}
                        </p>
                      )}
                    </div>
                    <StatusBadge variant={app.status as StatusVariant} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 新規申請メニュー */}
        <div>
          <h3 className="mb-3 font-bold">新規申請</h3>
          <div className="space-y-2">
            {filteredMenus.map(menu => (
              <button
                key={menu.id}
                onClick={() => onCreateApplication(menu.id)}
                className="w-full bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{menu.label}</h4>
                      {menu.flow === 'instant' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          即時反映
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{menu.description}</p>
                    <p className="text-xs text-muted-foreground">承認フロー：{getFlowLabel(menu.flow)}</p>
                  </div>
                  <Plus size={20} className="text-primary flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-2">
            <AlertCircle size={20} className="text-blue-700 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">申請に関する注意事項</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>相手承認が必要な申請は、相手が承認するまで反映されません</li>
                <li>運営承認が必要な申請は、通常3営業日以内に対応いたします</li>
                <li>即時反映の申請は、送信後すぐにシステムに反映されます</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
