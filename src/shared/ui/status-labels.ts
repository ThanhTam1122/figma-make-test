import { StatusVariant } from './status-badge';

// Japanese labels for status variants
// This file provides localized labels for the application
export const statusLabels: Record<StatusVariant, string> = {
  pending: '確認待ち',
  approved: '承認済み',
  rejected: '却下',
  active: 'アクティブ',
  inactive: '非アクティブ',
  open: '募集中',
  closed: '終了',
  reviewing: '応募受付中',
  completed: '完了',
  cancelled: 'キャンセル',
  pending_partner: 'パートナー承認待ち',
  pending_admin: '管理者承認待ち',
  draft: '下書き',
  sent: '配信済み',
  scheduled: 'スケジュール調整中',
  matched: 'マッチング成立',
  success: '成功',
  warning: '警告',
  error: 'エラー',
  info: '情報',
};

// Helper function to get localized status label
export function getStatusLabel(variant: StatusVariant): string {
  return statusLabels[variant];
}
