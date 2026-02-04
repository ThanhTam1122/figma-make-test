import { X, CheckSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TodoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userType?: 'client' | 'supporter';
  onNavigate?: (page: string) => void;
}

interface TodoItem {
  id: string;
  label: string;
  completed: boolean;
  page: string;
  priority: 'high' | 'medium' | 'low';
}

export function TodoDrawer({ isOpen, onClose, userType = 'client', onNavigate }: TodoDrawerProps) {
  // ユーザー向けやることリスト
  const clientTodos: TodoItem[] = [
    { id: 'payment', label: 'お支払い方法を登録する', completed: false, page: 'payment', priority: 'high' },
    { id: 'job-posting', label: '募集内容を作成する', completed: false, page: 'requests', priority: 'high' },
    { id: 'match', label: 'サポーターとマッチングする', completed: false, page: 'requests', priority: 'medium' },
    { id: 'schedule', label: '初回スケジュールを調整する', completed: false, page: 'schedule', priority: 'medium' },
    { id: 'first-visit', label: '初回訪問を完了する', completed: false, page: 'schedule', priority: 'low' },
  ];

  // サポーター向けやることリスト
  const supporterTodos: TodoItem[] = [
    { id: 'job-search', label: 'お仕事を探す', completed: false, page: 'job-search', priority: 'high' },
    { id: 'apply', label: '案件に応募する', completed: false, page: 'job-search', priority: 'high' },
    { id: 'first-visit', label: '初回訪問を完了する', completed: false, page: 'schedule', priority: 'medium' },
  ];

  const todos = userType === 'client' ? clientTodos : supporterTodos;
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const nextTodo = incompleteTodos[0]; // 次にやるべきことのみ

  const handleTodoClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    onClose();
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
                <CheckSquare size={24} />
                <h2 className="text-lg font-bold">やることリスト</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {incompleteTodos.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">すべて完了しました！</h3>
                  <p className="text-muted-foreground">
                    🎉 やることリストはすべて完了しています
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 次にやるべきこと */}
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">次はこれをやろう</h3>
                    {nextTodo && (
                      <button
                        onClick={() => handleTodoClick(nextTodo.page)}
                        className="w-full bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-primary rounded-xl p-5 text-left hover:brightness-95 active:brightness-90 transition-all shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary-foreground font-bold">1</span>
                            </div>
                            <span className="text-xs font-bold text-primary">優先度：高</span>
                          </div>
                          <ChevronRight className="text-primary" size={20} />
                        </div>
                        <h4 className="font-bold text-base mb-1">{nextTodo.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          タップして今すぐ始める
                        </p>
                      </button>
                    )}
                  </div>

                  {/* その他のやること（折りたたみ可能） */}
                  {incompleteTodos.length > 1 && (
                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground mb-2">
                        その他のやること ({incompleteTodos.length - 1}件)
                      </h3>
                      <div className="space-y-2">
                        {incompleteTodos.slice(1).map((todo, index) => (
                          <button
                            key={todo.id}
                            onClick={() => handleTodoClick(todo.page)}
                            className="w-full bg-card border border-border rounded-lg p-4 text-left hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-muted-foreground">
                                    {index + 2}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">{todo.label}</span>
                              </div>
                              <ChevronRight className="text-muted-foreground" size={18} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 進捗表示 */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">進捗状況</span>
                      <span className="font-bold">
                        {todos.length - incompleteTodos.length} / {todos.length} 完了
                      </span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${((todos.length - incompleteTodos.length) / todos.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
