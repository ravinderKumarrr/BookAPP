import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Phone, Lock, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and a number';
    }
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    'flex items-center gap-2 bg-bgLight rounded-xl px-3 py-2.5 border border-transparent focus-within:border-secondary';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-cardWhite rounded-2xl shadow-md p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-textDark">Create Your Account</h1>
          <p className="text-sm text-textDark/60 mt-1">Join BookApp and start trading books</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Full Name</label>
            <div className={fieldClass}>
              <User className="w-4 h-4 text-textDark/40 shrink-0" />
              <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="bg-transparent outline-none text-sm w-full" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Phone Number</label>
            <div className={fieldClass}>
              <Phone className="w-4 h-4 text-textDark/40 shrink-0" />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="bg-transparent outline-none text-sm w-full" />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Email</label>
            <div className={fieldClass}>
              <Mail className="w-4 h-4 text-textDark/40 shrink-0" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="bg-transparent outline-none text-sm w-full" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textDark mb-1">City</label>
            <div className={fieldClass}>
              <MapPin className="w-4 h-4 text-textDark/40 shrink-0" />
              <input name="city" value={formData.city} onChange={handleChange} placeholder="Ludhiana" className="bg-transparent outline-none text-sm w-full" />
            </div>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Password</label>
            <div className={fieldClass}>
              <Lock className="w-4 h-4 text-textDark/40 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="bg-transparent outline-none text-sm w-full"
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="shrink-0">
                {showPassword ? <EyeOff className="w-4 h-4 text-textDark/40" /> : <Eye className="w-4 h-4 text-textDark/40" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Confirm Password</label>
            <div className={fieldClass}>
              <Lock className="w-4 h-4 text-textDark/40 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center text-textDark/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
