import React, { useEffect, useState } from 'react';
import { Bell, ShoppingBag, MessageCircle, Heart } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import notificationService from '../../services/notificationService';

const iconMap = { order: ShoppingBag, message: MessageCircle, wishlist: Heart, system: Bell };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout title="Notifications">
      {loading && <LoadingSpinner label="Loading notifications..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchNotifications} />}
      {!loading && !error && notifications.length === 0 && (
        <p className="text-center text-textDark/60 py-16">No notifications yet.</p>
      )}
      {!loading && !error && notifications.length > 0 && (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <button
                key={n._id}
                onClick={() => handleMarkRead(n._id)}
                className={`flex items-start gap-3 p-4 rounded-2xl text-left transition ${
                  n.read ? 'bg-cardWhite' : 'bg-secondary/10'
                } shadow-sm border border-black/5`}
              >
                <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-textDark">{n.message}</p>
                  <p className="text-xs text-textDark/40 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-accent ml-auto mt-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
