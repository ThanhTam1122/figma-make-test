import React, { useState } from 'react';
import { Send, Phone, User, ChevronLeft } from 'lucide-react';

interface ChatPageProps {
  userType: 'client' | 'supporter';
}

interface ChatRoom {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export function ChatPage({ userType }: ChatPageProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // モックデータ：チャットルーム一覧
  const chatRooms: ChatRoom[] = [
    {
      id: 1,
      name: userType === 'client' ? '山田 花子（サポーター）' : '田中 太郎（ご利用者）',
      avatar: '👩',
      lastMessage: 'よろしくお願いいたします。',
      lastMessageTime: '10:30',
      unreadCount: 2,
    },
    {
      id: 2,
      name: userType === 'client' ? '佐藤 明美（サポーター）' : '鈴木 恵子（ご利用者）',
      avatar: '👨',
      lastMessage: '了解しました。',
      lastMessageTime: '昨日',
      unreadCount: 0,
    },
  ];

  // モックデータ：メッセージ履歴
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 'other',
      text: 'こんにちは！次回の訪問について確認させてください。',
      timestamp: '10:25',
      isMine: false,
    },
    {
      id: 2,
      senderId: 'me',
      text: 'はい、お願いします。',
      timestamp: '10:26',
      isMine: true,
    },
    {
      id: 3,
      senderId: 'other',
      text: '1月17日の10時からで変更ありませんか？',
      timestamp: '10:28',
      isMine: false,
    },
    {
      id: 4,
      senderId: 'me',
      text: '大丈夫です。よろしくお願いいたします。',
      timestamp: '10:30',
      isMine: true,
    },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: 'me',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  if (selectedRoom) {
    // チャット画面
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* チャットヘッダー */}
        <div className="bg-white border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedRoom(null)}
              className="p-2 hover:bg-accent rounded-lg -ml-2"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
              {selectedRoom.avatar}
            </div>
            <div>
              <div className="font-medium">{selectedRoom.name}</div>
              <div className="text-xs text-muted-foreground">オンライン</div>
            </div>
          </div>
          <button className="p-2 hover:bg-accent rounded-lg">
            <Phone size={20} className="text-primary" />
          </button>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 日付区切り */}
          <div className="flex items-center justify-center">
            <div className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
              2026年1月14日
            </div>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.isMine
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-foreground'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 入力エリア */}
        <div className="bg-white border-t border-border p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 border border-border rounded-full bg-input-background resize-none max-h-24"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // チャットルーム一覧
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <h2 className="mb-4">チャット</h2>
        <div className="space-y-2">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-start gap-3 hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                {room.avatar}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="truncate">{room.name}</h4>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {room.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {room.lastMessage}
                  </p>
                  {room.unreadCount > 0 && (
                    <span className="ml-2 flex-shrink-0 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
