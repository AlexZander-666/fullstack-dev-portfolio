"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2, Clock } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// 模拟数据
const mockMessages: Message[] = [
  {
    _id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    message: "您好，我对您的项目很感兴趣，想了解更多关于技术实现的细节。方便的话可以聊聊吗？",
    read: false,
    createdAt: "2024-12-05T10:30:00Z",
  },
  {
    _id: "2",
    name: "李四",
    email: "lisi@example.com",
    message: "看了您的博客文章，写得很好！期待更多内容。",
    read: false,
    createdAt: "2024-12-04T15:20:00Z",
  },
  {
    _id: "3",
    name: "王五",
    email: "wangwu@example.com",
    message: "请问您接受外包项目吗？我们有一个 Web 应用需要开发。",
    read: true,
    createdAt: "2024-12-01T09:00:00Z",
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
    );
    // TODO: 调用 API 更新
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条消息吗？")) {
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      // TODO: 调用 API 删除
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900 mb-2">消息管理</h1>
        <p className="text-stone-600">
          共 {messages.length} 条消息，{unreadCount} 条未读
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-stone-100">
            {messages.map((message) => (
              <div
                key={message._id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) handleMarkAsRead(message._id);
                }}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMessage?._id === message._id
                    ? "bg-[#f0eee6]"
                    : "hover:bg-stone-50"
                } ${!message.read ? "bg-blue-50/50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.read ? "bg-stone-100" : "bg-[#d97757]"
                    }`}
                  >
                    {message.read ? (
                      <MailOpen size={18} className="text-stone-500" />
                    ) : (
                      <Mail size={18} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium ${!message.read ? "text-stone-900" : "text-stone-700"}`}>
                        {message.name}
                      </p>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 truncate">{message.email}</p>
                    <p className="text-sm text-stone-600 mt-1 line-clamp-2">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-stone-500">暂无消息</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          {selectedMessage ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl text-stone-900 mb-1">
                    {selectedMessage.name}
                  </h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[#d97757] hover:underline text-sm"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="text-sm text-stone-500 mb-4 flex items-center gap-1">
                <Clock size={14} />
                {formatDate(selectedMessage.createdAt)}
              </div>

              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: 来自网站的消息`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl hover:bg-stone-800 transition-colors"
                >
                  <Mail size={18} />
                  回复邮件
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400">
              <p>选择一条消息查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
