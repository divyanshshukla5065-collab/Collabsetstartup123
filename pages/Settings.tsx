
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Bell, Moon, Sun, Shield, 
  Trash2, LogOut, ChevronRight, Mail, 
  CreditCard, Smartphone, Key, AlertTriangle, CheckCircle, Pencil,
  Repeat, ArrowRight, ShieldAlert, Zap, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const SettingItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick?: () => void;
  action?: React.ReactNode;
  variant?: 'default' | 'danger' | 'premium';
}> = ({ icon, title, description, onClick, action, variant = 'default' }) => {
  const bgStyles = {
    default: 'bg-slate-50 dark:bg-slate-800',
    danger: 'bg-red-50 dark:bg-red-950/20',
    premium: 'bg-purple-50 dark:bg-purple-900/20'
  };
  
  const iconColors = {
    default: 'text-slate-600 dark:text-slate-400',
    danger: 'text-red-500',
    premium: 'text-purple-600'
  };

  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={`w-full p-6 md:p-8 flex items-center justify-between transition-all text-left ${onClick ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30' : 'cursor-default'}`}
    >
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${bgStyles[variant]} flex items-center justify-center ${iconColors[variant]} flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white uppercase tracking-widest leading-none mb-1.5">{title}</h3>
          <p className="text-xs md:text-sm text-slate-500 font-bold">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {action ? action : onClick && <ChevronRight className="text-slate-300" />}
      </div>
    </button>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
    <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{title}</h2>
  </div>
);

export const Settings: React.FC = () => {
  const { user, logout, sendPasswordReset, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loadingReset, setLoadingReset] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoadingReset(true);
    try {
      await sendPasswordReset(user.email);
      setSuccessMsg('Reset link sent to your inbox!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReset(false);
    }
  };

  const handleSwitchRole = async () => {
    setIsSwitching(true);
    try {
      const newRole = user?.role === 'Influencer' ? 'Brand' : 'Influencer';
      await switchRole(newRole);
      // AuthContext update will trigger App.tsx routing to /complete-profile
      navigate('/complete-profile');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwitching(false);
      setShowSwitchConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <header className="mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tighter uppercase mb-2">
            Settings <span className="text-gradient-premium">.</span>
          </h1>
          <p className="text-slate-500 font-bold">Manage your account preferences and security.</p>
        </motion.div>
      </header>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-800 rounded-3xl flex items-center gap-4 text-green-600 dark:text-green-400 font-black shadow-lg"
        >
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
        <SectionHeader title="Account Identity" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={<User size={24} />}
            title="Public Profile"
            description="Edit your marketplace details, niche, and rates."
            onClick={() => navigate('/profile')}
            action={
              <Link to="/profile" className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                Edit
              </Link>
            }
          />
          
          <SettingItem 
            icon={<Repeat size={24} />}
            title="Switch Identity"
            description={`Convert your account to a ${user?.role === 'Influencer' ? 'Brand' : 'Influencer'}.`}
            variant="premium"
            onClick={() => setShowSwitchConfirm(true)}
            action={
               <div className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/20">
                Switch
              </div>
            }
          />

          <SettingItem 
            icon={<Mail size={24} />}
            title="Email Address"
            description={user?.email || 'No email set'}
          />
        </div>

        <SectionHeader title="Preferences" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            title="Appearance"
            description={`Currently set to ${theme} mode.`}
            onClick={toggleTheme}
            action={
              <div className="w-14 h-8 bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center transition-all cursor-pointer" onClick={toggleTheme}>
                 <motion.div 
                  animate={{ x: theme === 'dark' ? 24 : 0 }}
                  className="w-6 h-6 bg-white dark:bg-purple-600 rounded-full shadow-sm" 
                />
              </div>
            }
          />
          <SettingItem 
            icon={<Bell size={24} />}
            title="Notifications"
            description="Manage how you receive alerts and campaign news."
            onClick={() => navigate('/notifications')}
          />
        </div>

        <SectionHeader title="Security & Finance" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={<Key size={24} />}
            title="Security Key"
            description="Request a secure password reset link."
            onClick={handlePasswordReset}
            action={
              <button 
                onClick={handlePasswordReset}
                disabled={loadingReset}
                className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline"
              >
                {loadingReset ? 'Sending...' : 'Reset Password'}
              </button>
            }
          />
          <SettingItem 
            icon={<CreditCard size={24} />}
            title="Payments"
            description="Review your payouts and collaboration history."
            onClick={() => {}}
          />
        </div>

        <SectionHeader title="Danger Zone" />
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          <SettingItem 
            icon={<LogOut className="text-slate-400" size={24} />}
            title="Log Out"
            description="Securely sign out of your active session."
            onClick={logout}
          />
          <SettingItem 
            icon={<Trash2 className="text-red-500" size={24} />}
            title="Delete Account"
            description="Permanently remove your profile from the network."
            variant="danger"
            onClick={() => {}}
            action={
              <button className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-100 transition-all active:scale-95">
                <Trash2 size={18} />
              </button>
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] opacity-50">
        <Shield size={14} />
        <span>Secured by Collabset Infrastructure</span>
      </div>

      {/* Role Switch Confirmation Modal */}
      <AnimatePresence>
        {showSwitchConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[48px] p-10 text-center border border-white/10 shadow-3xl overflow-hidden relative"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              
              <div className="w-20 h-20 bg-purple-600 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-500/20">
                <Repeat className="text-white w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-4">Confirm Transition</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 text-base leading-relaxed">
                You are about to switch from <span className="text-purple-600">Influencer</span> to <span className="text-slate-950 dark:text-white">Brand</span> profile. 
                You will need to re-complete your profile information for the new role.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={handleSwitchRole}
                  disabled={isSwitching}
                  className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl active-scale uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-3"
                >
                  {/* Fixed missing RefreshCw icon name by adding it to the lucide-react import list */}
                  {isSwitching ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} className="text-amber-500 fill-amber-500" />}
                  {isSwitching ? 'Transitioning...' : 'Yes, Convert Account'}
                </button>
                <button 
                  onClick={() => setShowSwitchConfirm(false)}
                  disabled={isSwitching}
                  className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
