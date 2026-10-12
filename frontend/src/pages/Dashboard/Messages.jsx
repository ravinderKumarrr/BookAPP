import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import messageService from '../../services/messageService';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [thread, setThread] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await messageService.getConversations();
      setConversations(data || []);
      if (data && data.length > 0 && !selectedUser) {
        setSelectedUser(data[0].user);
      }
    } catch (err) {
      setError(err.message || 'Unable to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const loadThread = async () => {
      setThreadLoading(true);
      try {
        const data = await messageService.getMessagesWithUser(selectedUser._id);
        setThread(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setThreadLoading(false);
      }
    };
    loadThread();
  }, [selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    try {
      const sent = await messageService.sendMessage({ receiverId: selectedUser._id, message: newMessage });
      setThread((prev) => [...prev, sent]);
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout title="Messages">
      {loading && <LoadingSpinner label="Loading messages..." />}
      {!loading && error && conversations.length === 0 && <ErrorMessage message={error} onRetry={fetchConversations} />}
      {!loading && conversations.length === 0 && !error && (
        <p className="text-center text-textDark/60 py-16">No messages found.</p>
      )}

      {!loading && conversations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[500px]">
          <div className="bg-cardWhite rounded-2xl shadow-sm overflow-y-auto sm:col-span-1">
            {conversations.map((conv) => (
              <button
                key={conv.user._id}
                onClick={() => setSelectedUser(conv.user)}
                className={`w-full flex items-center gap-3 p-3 text-left hover:bg-bgLight transition border-b border-black/5 ${
                  selectedUser?._id === conv.user._id ? 'bg-bgLight' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {conv.user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-textDark truncate">{conv.user.name}</p>
                  <p className="text-xs text-textDark/50 truncate">{conv.lastMessage?.message}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-cardWhite rounded-2xl shadow-sm sm:col-span-2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {threadLoading && <LoadingSpinner label="Loading conversation..." />}
              {!threadLoading &&
                thread.map((msg) => {
                  const isMine = msg.sender._id === user?._id;
                  return (
                    <div key={msg._id} className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${isMine ? 'bg-primary text-white self-end' : 'bg-bgLight text-textDark self-start'}`}>
                      {msg.message}
                    </div>
                  );
                })}
              {!threadLoading && thread.length === 0 && (
                <p className="text-center text-textDark/50 text-sm py-10">No messages yet. Say hello!</p>
              )}
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-black/5">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-bgLight rounded-xl px-3 py-2 text-sm outline-none"
              />
              <button type="submit" disabled={sending} className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-60">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Messages;
