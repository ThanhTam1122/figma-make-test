import { X, Bell, Calendar, MessageCircle, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'schedule' | 'message' | 'application' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  // モックデータ
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'schedule',
      title: 'スケジュール確定',
      message: '1月25日（土）10:00-12:00のスケジュールが確定しました',
      time: '2時間前',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: '新しいメッセージ',
      message: '山田 花子さんからメッセージが届きました',
      time: '5時間前',
      read: false,
    },
    {
      id: '3',
      type: 'application',
      title: '申請が承認されました',
      message: 'キャンセル申請が承認されました',
      time: '1日前',
      read: false,
    },
    {
      id: '4',
      type: 'system',
      title: 'お支払い完了',
      message: '1月分のお支払いが完了しました',
      time: '2日前',
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return Calendar;
      case 'message':
        return MessageCircle;
      case 'application':
        return FileText;
      case 'system':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'schedule':
        return 'text-blue-600';
      case 'message':
        return 'text-green-600';
      case 'application':
        return 'text-orange-600';
      case 'system':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={24} />
                <h2 className="text-lg font-bold">お知らせ</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">お知らせはありません</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    const iconColor = getIconColor(notification.type);

                    return (
                      <button
                        key={notification.id}
                        className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-bold text-sm">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors">
                すべて既読にする
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
