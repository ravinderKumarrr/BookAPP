import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, CheckCircle, Heart, ShoppingBag } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import orderService from '../../services/orderService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, orders] = await Promise.all([userService.getDashboardStats(), orderService.getOrders()]);
      setStats(statsData);
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = stats
    ? [
        { label: 'Books Listed', value: stats.booksListed, icon: BookMarked },
        { label: 'Books Sold', value: stats.booksSold, icon: CheckCircle },
        { label: 'Wishlist Items', value: stats.wishlistCount, icon: Heart },
        { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingBag },
      ]
    : [];

  return (
    <DashboardLayout title="Dashboard">
      <div className="bg-primary rounded-2xl p-5 sm:p-6 text-white mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-sm text-white/80 mt-1">Here's what's happening with your BookApp account.</p>
      </div>

      {loading && <LoadingSpinner label="Loading dashboard..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchData} />}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className="bg-cardWhite rounded-2xl shadow-sm p-4 flex flex-col gap-2 border border-black/5">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-textDark">{s.value ?? 0}</span>
                <span className="text-xs text-textDark/60">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-cardWhite rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-textDark">Recent Activity</h3>
              <Link to="/dashboard/orders" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {recentOrders.length === 0 && <p className="text-sm text-textDark/60 py-6 text-center">No recent activity yet.</p>}
            <div className="flex flex-col divide-y divide-black/5">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-textDark">{order.book?.title || 'Book'}</p>
                    <p className="text-xs text-textDark/50">₹{order.price} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-primary capitalize">{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
