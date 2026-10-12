import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const inputClass = 'bg-bgLight rounded-xl px-3 py-2.5 text-sm outline-none border border-transparent focus:border-secondary w-full';

  return (
    <div className="container-app py-10 sm:py-16">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-textDark mb-3">Contact Us</h1>
          <p className="text-sm text-textDark/60 mb-6">Have a question or feedback? We'd love to hear from you.</p>
          <div className="flex flex-col gap-4 text-sm text-textDark/70">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /> support@bookapp.com</div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /> +91 98765 43210</div>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /> Ludhiana, Punjab, India</div>
          </div>
        </div>

        <div className="bg-cardWhite rounded-2xl shadow-sm p-6">
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">
              Thanks for reaching out! We'll get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Your email" className={inputClass} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Your message" className={inputClass} />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button type="submit" className="bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
