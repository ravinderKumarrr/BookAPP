import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const Settings = () => {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
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
    if (formData.password) {
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase and a number';
      }
      if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!formData.password) {
      setError('Enter a new password to update it.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await userService.updateProfile({ password: formData.password });
      setMessage('Password updated successfully!');
      setFormData({ password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'bg-bgLight rounded-xl px-3 py-2.5 text-sm outline-none border border-transparent focus:border-secondary w-full';

  return (
    <DashboardLayout title="Settings">
      <div className="bg-cardWhite rounded-2xl shadow-sm p-5 sm:p-8 max-w-xl mb-6">
        <h3 className="font-semibold text-textDark mb-4">Change Password</h3>
        {message && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">New Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="At least 8 characters" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={loading} className="bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 mt-2 self-start px-6">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="bg-cardWhite rounded-2xl shadow-sm p-5 sm:p-8 max-w-xl">
        <h3 className="font-semibold text-textDark mb-3">Account</h3>
        <button onClick={logout} className="text-sm font-medium text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition">
          Logout of BookApp
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
