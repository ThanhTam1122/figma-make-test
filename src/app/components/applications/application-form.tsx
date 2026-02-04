import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ApplicationFormProps {
  applicationTypeId: string;
  userType: 'client' | 'supporter';
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ApplicationForm({ applicationTypeId, userType, onClose, onSubmit }: ApplicationFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const getApplicationInfo = () => {
    const infos: Record<string, any> = {
      'course-change': {
        title: 'コース／頻度変更',
        description: '訪問ボリュームを変更します',
        flow: '相手の承認→運営の承認',
        fields: [
          { name: 'current_frequency', label: '現在の頻度', type: 'text', disabled: true, defaultValue: '週1回' },
          { name: 'new_frequency', label: '変更後の頻度', type: 'select', options: ['週1回', '週2回', '週3回', '隔週', '月1回'], required: true },
          { name: 'current_duration', label: '現在の作業時間', type: 'text', disabled: true, defaultValue: '2時間' },
          { name: 'new_duration', label: '変更後の作業時間', type: 'select', options: ['1時間', '1.5時間', '2時間', '2.5時間', '3時間', '4時間'], required: true },
          { name: 'reason', label: '変更理由', type: 'textarea', required: true },
          { name: 'desired_date', label: '変更希望日', type: 'date', required: true },
        ],
      },
      'compensation': {
        title: '補償希望申請（物損・事故申請）',
        description: '物損や事故に関する補償を申請します',
        flow: userType === 'supporter' ? '相手の承認→運営の承認' : '運営の承認',
        fields: [
          { name: 'incident_date', label: '発生日', type: 'date', required: true },
          { name: 'incident_type', label: '種類', type: 'select', options: ['物損', '事故', 'その他'], required: true },
          { name: 'location', label: '発生場所', type: 'text', required: true },
          { name: 'description', label: '詳細説明', type: 'textarea', required: true, placeholder: '状況を詳しくご説明ください' },
          { name: 'damage_amount', label: '損害額（概算）', type: 'text', placeholder: '例：10,000円' },
          { name: 'has_photo', label: '写真の有無', type: 'select', options: ['あり（後日提出）', 'なし'] },
        ],
      },
      're-matching': {
        title: '再マッチング申請',
        description: 'サポーターの変更を希望します',
        flow: '運営の承認',
        fields: [
          { name: 'reason', label: '変更希望理由', type: 'select', options: ['スケジュールが合わない', '相性の問題', 'その他'], required: true },
          { name: 'detailed_reason', label: '詳細', type: 'textarea', required: true },
          { name: 'preferred_conditions', label: '次回の希望条件', type: 'textarea', placeholder: '例：土日に来ていただける方を希望' },
        ],
      },
      'contract-termination': {
        title: '定期訪問解約申請',
        description: '定期契約を解約します',
        flow: '運営の承認',
        warning: '解約後、再度ご利用される際は新規登録が必要になります',
        fields: [
          { name: 'termination_date', label: '解約希望日', type: 'date', required: true },
          { name: 'reason', label: '解約理由', type: 'select', options: ['引っ越し', '経済的理由', 'サービスに不満', 'その他'], required: true },
          { name: 'feedback', label: 'ご意見・ご要望', type: 'textarea', placeholder: 'サービス改善のため、ご意見をお聞かせください' },
        ],
      },
      'withdrawal': {
        title: '退会申請',
        description: 'サービスから退会します',
        flow: '運営の承認',
        warning: '退会されると、アカウント情報が削除され元に戻せません',
        fields: [
          { name: 'reason', label: '退会理由', type: 'select', options: ['引っ越し', '経済的理由', 'サービスに不満', 'その他'], required: true },
          { name: 'feedback', label: 'ご意見・ご要望', type: 'textarea', placeholder: 'サービス改善のため、ご意見をお聞かせください' },
        ],
      },
      'supporter-resignation': {
        title: 'サポーター登録終了申請',
        description: 'サポーター登録を終了します',
        flow: '運営の承認',
        warning: '登録終了後、再度活動される際は新規登録が必要になります',
        fields: [
          { name: 'resignation_date', label: '終了希望日', type: 'date', required: true },
          { name: 'reason', label: '終了理由', type: 'select', options: ['多忙', '引っ越し', 'その他の仕事', 'その他'], required: true },
          { name: 'feedback', label: 'ご意見・ご要望', type: 'textarea', placeholder: 'サービス改善のため、ご意見をお聞かせください' },
        ],
      },
      'client-relocation': {
        title: 'ご利用者引っ越し申請',
        description: '引っ越しに伴う住所変更を申請します',
        flow: 'サポーターの確認→運営の承認',
        fields: [
          { name: 'moving_date', label: '引っ越し日', type: 'date', required: true },
          { name: 'new_address', label: '新住所', type: 'text', required: true, placeholder: '都道府県から入力してください' },
          { name: 'continue_service', label: 'サービス継続', type: 'select', options: ['継続希望', '終了'], required: true },
          { name: 'note', label: '備考', type: 'textarea', placeholder: '駐車場の有無、エレベーターの有無など' },
        ],
      },
      'supporter-relocation': {
        title: 'サポーター引っ越し申請',
        description: '引っ越しに伴う担当変更を申請します',
        flow: '運営の承認',
        fields: [
          { name: 'moving_date', label: '引っ越し日', type: 'date', required: true },
          { name: 'new_address', label: '新住所', type: 'text', required: true, placeholder: '都道府県から入力してください' },
          { name: 'discontinue_clients', label: '継続できないご利用者', type: 'multi-select', options: ['鈴木 太郎', '田中 恵子', '高橋 一郎'], required: true },
          { name: 'note', label: '備考', type: 'textarea' },
        ],
      },
      'client-name-change': {
        title: 'ご利用者氏名変更',
        description: '氏名を変更します',
        flow: '運営の承認',
        fields: [
          { name: 'current_name', label: '現在の氏名', type: 'text', disabled: true, defaultValue: '鈴木 太郎' },
          { name: 'new_name', label: '新しい氏名', type: 'text', required: true },
          { name: 'new_name_kana', label: '新しい氏名（カナ）', type: 'text', required: true, placeholder: 'スズキ タロウ' },
          { name: 'reason', label: '変更理由', type: 'select', options: ['結婚', '離婚', 'その他'], required: true },
        ],
      },
      'supporter-name-change': {
        title: 'サポーター氏名変更',
        description: '氏名を変更します',
        flow: '運営の承認',
        fields: [
          { name: 'current_name', label: '現在の氏名', type: 'text', disabled: true, defaultValue: '山田 花子' },
          { name: 'new_name', label: '新しい氏名', type: 'text', required: true },
          { name: 'new_name_kana', label: '新しい氏名（カナ）', type: 'text', required: true, placeholder: 'ヤマダ ハナコ' },
          { name: 'reason', label: '変更理由', type: 'select', options: ['結婚', '離婚', 'その他'], required: true },
        ],
      },
      'contract-name-change': {
        title: '契約名義／住所変更',
        description: '契約者情報を変更します',
        flow: '運営の承認',
        fields: [
          { name: 'new_contract_name', label: '新契約者名', type: 'text', required: true },
          { name: 'new_address', label: '新住所', type: 'text', required: true },
          { name: 'reason', label: '変更理由', type: 'textarea', required: true },
        ],
      },
      'payment-method-change': {
        title: '支払い方法変更',
        description: 'お支払い方法を変更します',
        flow: '運営の承認',
        fields: [
          { name: 'current_method', label: '現在の方法', type: 'text', disabled: true, defaultValue: '口座振替' },
          { name: 'new_method', label: '新しい方法', type: 'select', options: ['口座振替', 'クレジットカード', '銀行振込'], required: true },
          { name: 'effective_date', label: '変更希望日', type: 'date', required: true },
        ],
      },
      'bank-account-change': {
        title: '引落口座変更',
        description: '引き落とし口座を変更します',
        flow: '運営の承認',
        fields: [
          { name: 'bank_name', label: '金融機関名', type: 'text', required: true },
          { name: 'branch_name', label: '支店名', type: 'text', required: true },
          { name: 'account_type', label: '口座種別', type: 'select', options: ['普通', '当座'], required: true },
          { name: 'account_number', label: '口座番号', type: 'text', required: true },
          { name: 'account_holder', label: '口座名義', type: 'text', required: true },
        ],
      },
      'transfer-account-change': {
        title: '報酬振込口座変更',
        description: '報酬振込先を変更します',
        flow: '運営の承認',
        fields: [
          { name: 'bank_name', label: '金融機関名', type: 'text', required: true },
          { name: 'branch_name', label: '支店名', type: 'text', required: true },
          { name: 'account_type', label: '口座種別', type: 'select', options: ['普通', '当座'], required: true },
          { name: 'account_number', label: '口座番号', type: 'text', required: true },
          { name: 'account_holder', label: '口座名義', type: 'text', required: true },
        ],
      },
      'schedule-change': {
        title: '訪問曜日／時間変更',
        description: '定期訪問の日時を変更します',
        flow: '相手の承認',
        fields: [
          { name: 'current_day', label: '現在の曜日', type: 'text', disabled: true, defaultValue: '火曜日' },
          { name: 'new_day', label: '新しい曜日', type: 'select', options: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'], required: true },
          { name: 'current_time', label: '現在の時間', type: 'text', disabled: true, defaultValue: '10:00-12:00' },
          { name: 'new_time_start', label: '新しい開始時間', type: 'time', required: true },
          { name: 'new_time_end', label: '新しい終了時間', type: 'time', required: true },
          { name: 'reason', label: '変更理由', type: 'textarea', required: true },
          { name: 'effective_date', label: '変更希望日', type: 'date', required: true },
        ],
      },
      'key-deposit': {
        title: '鍵預かり申請',
        description: '鍵の預かり・返却を申請します',
        flow: '相手の承認',
        fields: [
          { name: 'action_type', label: '申請内容', type: 'select', options: ['預ける', '返却'], required: true },
          { name: 'key_type', label: '鍵の種類', type: 'text', required: true, placeholder: '例：玄関の鍵' },
          { name: 'key_count', label: '本数', type: 'number', required: true },
          { name: 'delivery_method', label: '受け渡し方法', type: 'select', options: ['訪問時に手渡し', '郵送', 'その他'], required: true },
          { name: 'note', label: '備考', type: 'textarea', placeholder: '注意事項など' },
        ],
      },
      'contract-email-change': {
        title: '契約名義人メールアドレス変更',
        description: '即時システムに反映されます',
        flow: '即時反映',
        fields: [
          { name: 'current_email', label: '現在のメールアドレス', type: 'email', disabled: true, defaultValue: 'suzuki@example.com' },
          { name: 'new_email', label: '新しいメールアドレス', type: 'email', required: true },
          { name: 'confirm_email', label: '新しいメールアドレス（確認）', type: 'email', required: true },
        ],
      },
      'billing-info-change': {
        title: '請求名義／送付先アドレス変更',
        description: '即時システムに反映されます',
        flow: '即時反映',
        fields: [
          { name: 'billing_name', label: '請求名義', type: 'text', required: true },
          { name: 'billing_email', label: '請求書送付先メールアドレス', type: 'email', required: true },
        ],
      },
    };

    return infos[applicationTypeId] || null;
  };

  const info = getApplicationInfo();
  if (!info) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 即時反映の場合は確認なしで実行
    if (info.flow === '即時反映') {
      onSubmit(formData);
      return;
    }

    // その他は確認が必要
    if (!agreedToTerms) {
      alert('注意事項に同意してください');
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: any) => {
    const value = formData[field.name] || field.defaultValue || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
            disabled={field.disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
          >
            <option value="">選択してください</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'multi-select':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(formData[field.name] || []).includes(option)}
                  onChange={e => {
                    const current = formData[field.name] || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((v: string) => v !== option);
                    setFormData({ ...formData, [field.name]: updated });
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <h3>{info.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 承認フロー表示 */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="text-blue-800">
              <strong>承認フロー：</strong>{info.flow}
            </p>
          </div>

          {/* 警告表示 */}
          {info.warning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle size={20} className="text-amber-700 flex-shrink-0" />
                <p className="text-sm text-amber-800">{info.warning}</p>
              </div>
            </div>
          )}

          {/* フォームフィールド */}
          {info.fields.map((field: any) => (
            <div key={field.name}>
              <label className="block mb-2 font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          {/* 即時反映以外は同意チェック */}
          {info.flow !== '即時反映' && (
            <div className="pt-4 border-t border-border">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  申請内容に誤りがないことを確認しました。承認フローに従って処理されることに同意します。
                </span>
              </label>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={info.flow !== '即時反映' && !agreedToTerms}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {info.flow === '即時反映' ? '変更する' : '申請する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
