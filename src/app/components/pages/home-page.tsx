import { CheckSquare, ChevronRight } from 'lucide-react';

interface HomePageProps {
  userType: 'client' | 'supporter';
  onNavigate: (page: string) => void;
  onNavigateWithJobType?: (page: string, jobType: 'regular' | 'spot') => void;
  pendingReportsCount?: number;
}

interface TodoItem {
  id: string;
  label: string;
  completed: boolean;
  page: string;
  priority: 'high' | 'medium' | 'low';
}

export function HomePage({ userType, onNavigate, onNavigateWithJobType, pendingReportsCount = 0 }: HomePageProps) {
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
    { id: 'job-search', label: 'お仕事を探', completed: false, page: 'job-search', priority: 'high' },
    { id: 'apply', label: '案件に応募する', completed: false, page: 'job-search', priority: 'high' },
    { id: 'first-visit', label: '初回訪問を完了する', completed: false, page: 'schedule', priority: 'medium' },
  ];

  const todos = userType === 'client' ? clientTodos : supporterTodos;
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const nextTodo = incompleteTodos[0]; // 次にやるべきことのみ

  const handleTodoClick = (page: string) => {
    onNavigate(page);
  };

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* 名前表示 */}
      <div className="pt-2">
        <h2 className="text-xl font-bold">
          {userType === 'client' ? '鈴木幸子さん' : '佐藤 様'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          今日も一日頑張りましょう！
        </p>
      </div>

      {/* TODOリスト - 次にやるべきこと1つのみ */}
      {nextTodo && (
        <section>
          <h3 className="mb-3 flex items-center gap-2">
            <CheckSquare className="text-primary" size={20} />
            <span className="font-bold">次にやること</span>
          </h3>
          
          <button
            onClick={() => handleTodoClick(nextTodo.page)}
            className="w-full bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-primary rounded-xl p-5 text-left hover:brightness-95 active:brightness-90 transition-all shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">1</span>
                </div>
                <span className="text-xs font-bold text-primary">
                  優先度：{getPriorityLabel(nextTodo.priority)}
                </span>
              </div>
              <ChevronRight className="text-primary" size={20} />
            </div>
            <h4 className="font-bold text-base mb-1">{nextTodo.label}</h4>
            <p className="text-xs text-muted-foreground">
              タップして今すぐ始める
            </p>
          </button>
        </section>
      )}

      {/* 完了メッセージ */}
      {!nextTodo && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="font-bold text-lg mb-2">すべてのタスクが完了しました！</h3>
          <p className="text-sm text-muted-foreground">
            お疲れ様でした
          </p>
        </div>
      )}
    </div>
  );
}