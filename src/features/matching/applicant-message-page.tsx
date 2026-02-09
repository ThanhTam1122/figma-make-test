import { ArrowLeft, Send, User } from 'lucide-react';
import React, { useState } from 'react';

interface ApplicantMessagePageProps {
  applicantId: string;
  jobId: string;
  onBack: () => void;
  onViewProfile: (supporterId: string) => void;
}

export function ApplicantMessagePage({ applicantId, jobId, onBack, onViewProfile }: ApplicantMessagePageProps) {
  const [messageText, setMessageText] = useState('');

  // モック：応募者情報
  const applicant = {
    id: applicantId,
    name: '山田 花子',
    age: 35,
    gender: '女性',
  };

  // モック：メッセージ履歴
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderId: applicantId,
      senderName: '山田 花子',
      text: 'はじめまして！この度応募させていただきました。料理が得意で、お子様向けのお料理も対応可能です。ぜひよろしくお願いいたします。',
      timestamp: '2月1日 14:30',
      isFromApplicant: true,
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'あなた',
      text: 'ご応募ありがとうございます！プロフィールを拝見しました。いくつか質問させてください。',
      timestamp: '2月1日 15:15',
      isFromApplicant: false,
    },
    {
      id: '3',
      senderId: applicantId,
      senderName: '山田 花子',
      text: 'もちろんです！何でもお聞きください。',
      timestamp: '2月1日 15:20',
      isFromApplicant: true,
    },
    {
      id: '4',
      senderId: 'user',
      senderName: 'あなた',
      text: '子どものアレルギー対応の経験はありますか？',
      timestamp: '2月1日 15:25',
      isFromApplicant: false,
    },
    {
      id: '5',
      senderId: applicantId,
      senderName: '山田 花子',
      text: 'はい、卵アレルギーと乳製品アレルギーのお子様の対応経験があります。代替食材を使った料理も得意です。',
      timestamp: '2月1日 15:30',
      isFromApplicant: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: String(messages.length + 1),
      senderId: 'user',
      senderName: 'あなた',
      text: messageText,
      timestamp: new Date().toLocaleString('ja-JP', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isFromApplicant: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{applicant.name}さん</h1>
            <p className="text-sm opacity-90">{applicant.age}歳・{applicant.gender}</p>
          </div>
          <button
            onClick={() => onViewProfile(applicantId)}
            className="px-3 py-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <User size={14} />
            プロフィール
          </button>
        </div>
      </div>

      {/* 応募メッセージの区切り */}
      <div className="bg-orange-50 border-b border-orange-200 px-4 py-2">
        <p className="text-xs text-orange-700 font-medium">応募に関するメッセージ</p>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isFromApplicant ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] ${
                message.isFromApplicant
                  ? 'bg-card border border-border'
                  : 'bg-primary text-primary-foreground'
              } rounded-2xl px-4 py-3`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-2 ${
                  message.isFromApplicant ? 'text-muted-foreground' : 'opacity-80'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* メッセージ入力エリア */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-3 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 px-2">
          ※ マッチング成立前のやり取りです。個人情報の交換はお控えください。
        </p>
      </div>
    </div>
  );
}
