import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-200 text-gray-600',
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout title="My Orders">
      {loading && <LoadingSpinner label="Loading orders..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchOrders} />}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-textDark/60 py-16">No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const isSeller = order.seller?._id === user?._id;
            return (
              <div key={order._id} className="bg-cardWhite rounded-2xl shadow-sm p-4 border border-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-textDark">{order.book?.title || 'Book'}</p>
                    <p className="text-xs text-textDark/50 mt-1">
                      ₹{order.price} · {isSeller ? `Buyer: ${order.buyer?.name}` : `Seller: ${order.seller?.name}`}
                    </p>
                    <p className="text-xs text-textDark/40 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize shrink-0 ${statusColors[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>

                {isSeller && order.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleStatusChange(order._id, 'accepted')}
                      disabled={updatingId === order._id}
                      className="text-xs font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-60"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(order._id, 'rejected')}
                      disabled={updatingId === order._id}
                      className="text-xs font-medium border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {isSeller && order.status === 'accepted' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleStatusChange(order._id, 'completed')}
                      disabled={updatingId === order._id}
                      className="text-xs font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-60"
                    >
                      Mark Completed
                    </button>
                  </div>
                )}
                {!isSeller && order.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleStatusChange(order._id, 'cancelled')}
                      disabled={updatingId === order._id}
                      className="text-xs font-medium border border-black/10 text-textDark px-3 py-1.5 rounded-lg hover:bg-bgLight disabled:opacity-60"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyOrders;
