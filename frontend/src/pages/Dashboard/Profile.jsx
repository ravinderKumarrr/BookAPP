import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    profileImage: user?.profileImage || '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setMessage('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!validate()) return;

    setLoading(true);
    try {
      const updated = await userService.updateProfile(formData);
      updateUserInContext(updated);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'bg-bgLight rounded-xl px-3 py-2.5 text-sm outline-none border border-transparent focus:border-secondary w-full';

  return (
    <DashboardLayout title="My Profile">
      <div className="bg-cardWhite rounded-2xl shadow-sm p-5 sm:p-8 max-w-xl">
        {message && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

        <div className="mb-5 p-3 bg-bgLight rounded-xl text-sm text-textDark/70">
          <p><span className="font-medium text-textDark">Email:</span> {user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className={inputClass} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">City</label>
            <input name="city" value={formData.city} onChange={handleChange} className={inputClass} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Profile Image URL (optional)</label>
            <input name="profileImage" value={formData.profileImage} onChange={handleChange} className={inputClass} placeholder="https://..." />
          </div>
          <button type="submit" disabled={loading} className="bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 mt-2 self-start px-6">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
