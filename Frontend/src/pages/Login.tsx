import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const initialRole = (location.state as any)?.role || 'patient';
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles: { value: UserRole; label: string; demo: string }[] = [
    { value: 'patient', label: 'Patient', demo: 'patient@demo.com' },
    { value: 'doctor', label: 'Doctor', demo: 'doctor@demo.com' },
    { value: 'admin', label: 'Admin', demo: 'admin@demo.com' },
    { value: 'pharmacist', label: 'Pharmacist', demo: 'pharmacist@demo.com' },
    { value: 'lab_tech', label: 'Lab Tech', demo: 'lab@demo.com' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, 'demo123', selectedRole);
      
      // Navigate based on role
      const roleRoutes: Record<UserRole, string> = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        admin: '/admin/dashboard',
        pharmacist: '/pharmacy/dashboard',
        lab_tech: '/lab/dashboard',
        receptionist: '/reception/dashboard',
        nurse: '/nurse/dashboard',
        supplier: '/supplier/dashboard'
      };
      
      navigate(roleRoutes[selectedRole] || '/');
    } catch (err) {
      setError('Invalid credentials. Please use demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your portal</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.value);
                    setEmail('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedRole === role.value
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{role.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => fillDemoCredentials(role.demo)}
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {role.label}: {role.demo}
                </button>
              ))}
            </div>
            <p className="text-sm text-blue-600 mt-2">Password: demo123 (any)</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  defaultValue="demo123"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo system - Use any demo email above</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
