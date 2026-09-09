import React, { useState } from 'react';
import { UserAccount, ViewMode } from '../types';
import { SYSTEM_USERS } from '../data/initialData';

interface AuthScreenProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount, targetView?: ViewMode) => void;
  onSignOut: () => void;
  onNavigate: (view: ViewMode) => void;
}

type AuthMode = 'login' | 'register';
type UserCategory = 'patient' | 'pharmacist' | 'admin';

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLoginSuccess,
  onSignOut,
  onNavigate,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [category, setCategory] = useState<UserCategory>('patient');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('aarav.sharma@gmail.com');
  const [loginPassword, setLoginPassword] = useState('GenericMed@2026');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPincode, setRegPincode] = useState('400028');
  const [regCity, setRegCity] = useState('Mumbai, Maharashtra');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Diabetes', 'Hypertension']);

  // Pharmacist specific registration fields
  const [regPharmacyName, setRegPharmacyName] = useState('');
  const [regDrugLicenseNo, setRegDrugLicenseNo] = useState('');
  const [regCouncilRegNo, setRegCouncilRegNo] = useState('');
  const [regGstin, setRegGstin] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Handle Quick Demo Login
  const handleQuickLogin = (user: UserAccount) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      let targetView: ViewMode = 'customer';
      if (user.role === 'Pharmacist-in-Charge') targetView = 'dispensary';
      else if (user.role === 'Admin / Ops Lead' || user.role === 'Support & Compliance') targetView = 'ops';
      else if (user.role === 'Super Admin') targetView = 'superadmin';
      onLoginSuccess(user, targetView);
    }, 450);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your email or registered 10-digit mobile number.');
      return;
    }

    if (loginMethod === 'otp' && !otpSent) {
      setOtpSent(true);
      setSuccessMessage('OTP sent! Simulated 4-digit code is: 4821');
      return;
    }

    if (loginMethod === 'otp' && otpSent && otpCode.trim() !== '4821') {
      setErrorMessage('Invalid OTP code. Please enter 4821 to continue.');
      return;
    }

    if (loginMethod === 'password' && !loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Try to find matching user in system
      const found = SYSTEM_USERS.find(
        (u) =>
          u.email.toLowerCase() === loginIdentifier.toLowerCase().trim() ||
          u.phone === loginIdentifier.trim()
      );

      if (found) {
        let targetView: ViewMode = 'customer';
        if (found.role === 'Pharmacist-in-Charge') targetView = 'dispensary';
        else if (found.role === 'Admin / Ops Lead') targetView = 'ops';
        else if (found.role === 'Super Admin') targetView = 'superadmin';

        onLoginSuccess(found, targetView);
      } else {
        // Create an ad-hoc session user based on entered info
        const adHocUser: UserAccount = {
          id: `usr-${Date.now()}`,
          name: loginIdentifier.split('@')[0] || 'GenericMed User',
          email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@genericmed.in`,
          phone: loginIdentifier.includes('@') ? '+91 98200 12345' : loginIdentifier,
          role: category === 'pharmacist' ? 'Pharmacist-in-Charge' : 'Customer / Patient',
          tenantBound: category === 'pharmacist' ? 'ten_044_prod (Metro Generic Chemist)' : 'CUSTOMER_PUBLIC_POOL',
          status: 'Active',
          mfaEnabled: false,
          lastLogin: 'Just now',
          permissions: category === 'pharmacist' 
            ? ['dispense:accept', 'inventory:sync', 'batch:validate']
            : ['order:create', 'cart:write', 'prescription:upload'],
        };
        onLoginSuccess(adHocUser, category === 'pharmacist' ? 'dispensary' : 'customer');
      }
    }, 600);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (category === 'pharmacist') {
      if (!regPharmacyName.trim()) {
        setErrorMessage('Please enter your pharmacy trade name.');
        return;
      }
      if (!regDrugLicenseNo.trim()) {
        setErrorMessage('Drug License Form 20B/21B number is required under Drug Rules 1945.');
        return;
      }
      if (!regCouncilRegNo.trim()) {
        setErrorMessage('State Pharmacy Council Pharmacist registration number is required.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: category === 'pharmacist' ? 'Pharmacist-in-Charge' : 'Customer / Patient',
        tenantBound: category === 'pharmacist' ? `ten_partner_${Date.now().toString().slice(-4)}` : 'CUSTOMER_PUBLIC_POOL',
        status: category === 'pharmacist' ? 'Pending Verification' : 'Active',
        mfaEnabled: false,
        lastLogin: 'Active Now',
        permissions: category === 'pharmacist'
          ? ['dispense:accept', 'inventory:sync', 'batch:validate']
          : ['order:create', 'cart:write', 'prescription:upload'],
        pharmacyDetails: category === 'pharmacist' ? {
          storeName: regPharmacyName,
          drugLicenseNo: regDrugLicenseNo,
          pharmacistCouncilReg: regCouncilRegNo,
          pincode: regPincode,
          city: regCity,
        } : undefined,
        patientDetails: category === 'patient' ? {
          pincode: regPincode,
          city: regCity,
          chronicConditions: selectedConditions,
        } : undefined,
      };

      onLoginSuccess(newUser, category === 'pharmacist' ? 'dispensary' : 'customer');
    }, 800);
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Current User Logged In State Banner */}
      {currentUser && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg border-2 border-emerald-300">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-slate-900 text-base sm:text-lg">
                  Currently Signed In as {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.email} • Tenant: <span className="font-mono">{currentUser.tenantBound}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(currentUser.role === 'Pharmacist-in-Charge' ? 'dispensary' : 'customer')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <span>Go to {currentUser.role === 'Pharmacist-in-Charge' ? 'Dispensary Portal' : 'Medicine Store'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button
              onClick={onSignOut}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-red-500">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Auth Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context, Trust, & Demo Persona Quick Switcher */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand Card */}
          <div className="bg-gradient-to-br from-[#002441] to-[#00172e] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-900/60 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-lg text-white shadow-md">
                  gm
                </div>
                <div>
                  <h1 className="font-headline font-bold text-xl tracking-tight text-white">genericmed</h1>
                  <p className="text-[11px] text-blue-300">Direct-from-Chemist Generic Marketplace</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Save up to 70%–85% on prescription medicines by purchasing genuine, 100% bio-equivalent generic chemical salts from verified local neighborhood chemists.
              </p>

              {/* Regulatory Assurance Badges */}
              <div className="space-y-2 pt-2 border-t border-blue-900/60 text-[11px]">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                  <span>CDSCO Form 20B/21B Licensed Retail Chemists only</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">inventory_2</span>
                  <span>Batch-verified barcoded drugs with cold-chain tracking</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">lock</span>
                  <span>Row-Level Security (RLS) encrypted patient data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo One-Click Role Switcher */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600 text-base">bolt</span>
                <h3 className="font-headline font-bold text-slate-900 text-xs">
                  Instant Demo Sign In (1-Click Test)
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono">
                Development Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Select any role below to test the full end-to-end interface immediately:
            </p>

            <div className="space-y-2">
              {/* Persona: Patient */}
              <button
                type="button"
                onClick={() => handleQuickLogin(SYSTEM_USERS[4])}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">Aarav Sharma</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                        Patient / Buyer
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      aarav.sharma@gmail.com • Dadar, Mumbai
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-base transition">
                  login
                </span>
              </button>

              {/* Persona: Pharmacist */}
              <button
                type="button"
                onClick={() => handleQuickLogin(SYSTEM_USERS[1])}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    VJ
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">Vikram Joshi (R.Ph)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-100 text-blue-800 font-mono">
                        TN-044 Chemist
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      vikram.j@metrochemist.in • Metro Generic Chemist
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 text-base transition">
                  login
                </span>
              </button>

              {/* Persona: Ops Lead */}
              <button
                type="button"
                onClick={() => handleQuickLogin(SYSTEM_USERS[2])}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    MT
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">Maya Thorne</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-100 text-amber-800">
                        Admin / Ops Lead
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      m.thorne@genericmed.internal • Global Master
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-600 text-base transition">
                  login
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login & Register Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Top Switcher: Sign In vs Create Account */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  authMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              {authMode === 'login' ? 'Welcome back to genericmed' : 'Join India\'s low-cost pharmacy network'}
            </span>
          </div>

          {/* Role / Persona Segmented Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              I am signing in / registering as:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('patient');
                  setLoginIdentifier('aarav.sharma@gmail.com');
                }}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  category === 'patient'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-base text-blue-600">person</span>
                  {category === 'patient' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <span className="font-bold text-xs leading-none">Patient / Buyer</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">Buy generic meds</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('pharmacist');
                  setLoginIdentifier('vikram.j@metrochemist.in');
                }}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  category === 'pharmacist'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-base text-emerald-600">local_pharmacy</span>
                  {category === 'pharmacist' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <span className="font-bold text-xs leading-none">Retail Chemist</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">Dispensary TN-044</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('admin');
                  setLoginIdentifier('m.thorne@genericmed.internal');
                }}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  category === 'admin'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-base text-indigo-600">admin_panel_settings</span>
                  {category === 'admin' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <span className="font-bold text-xs leading-none">Ops / Staff</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">Enterprise SSO</span>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* ---------------- LOGIN FORM ---------------- */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Login Method Toggle */}
              {category !== 'admin' && (
                <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-600 text-[11px] font-medium pl-1.5">Sign in with:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('password');
                        setOtpSent(false);
                      }}
                      className={`px-3 py-1 rounded-lg font-medium text-[11px] transition ${
                        loginMethod === 'password'
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className={`px-3 py-1 rounded-lg font-medium text-[11px] transition ${
                        loginMethod === 'otp'
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Instant OTP (SMS)
                    </button>
                  </div>
                </div>
              )}

              {/* Identifier Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {loginMethod === 'otp' ? 'Mobile Number (+91)' : 'Email or Registered Mobile'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 text-base absolute left-3.5 top-1/2 -translate-y-1/2">
                    {loginMethod === 'otp' ? 'call' : 'mail'}
                  </span>
                  <input
                    type={loginMethod === 'otp' ? 'tel' : 'text'}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={loginMethod === 'otp' ? '98200 12345' : 'aarav.sharma@gmail.com'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              {/* Password or OTP Input */}
              {loginMethod === 'password' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined text-slate-400 text-base absolute left-3.5 top-1/2 -translate-y-1/2">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-base">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">One-Time Password (OTP)</label>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCode('4821');
                          setSuccessMessage('Auto-filled test OTP: 4821');
                        }}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        Auto-fill OTP (4821)
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined text-slate-400 text-base absolute left-3.5 top-1/2 -translate-y-1/2">
                      sms
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder={otpSent ? 'Enter 4-digit code (4821)' : 'Click "Send OTP" below'}
                      disabled={!otpSent}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition disabled:bg-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Trust this device for 30 days</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">TLS 1.3 256-bit AES</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>
                      {loginMethod === 'otp' && !otpSent
                        ? 'Request One-Time Password (OTP)'
                        : `Sign In as ${category === 'patient' ? 'Patient' : category === 'pharmacist' ? 'Dispensary' : 'Staff'}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ---------------- REGISTRATION FORM ---------------- */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Legal Name</label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Priya Kulkarni"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Phone (+91)</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="priya.kulkarni@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  required
                />
              </div>

              {/* Pharmacist specific fields */}
              {category === 'pharmacist' && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-base">verified_user</span>
                    <span className="text-xs font-bold text-emerald-900">
                      CDSCO Form 20B / 21B Statutory Chemist Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Pharmacy Trade Name</label>
                      <input
                        type="text"
                        value={regPharmacyName}
                        onChange={(e) => setRegPharmacyName(e.target.value)}
                        placeholder="e.g. Apex Health Chemist"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Drug License No. (Form 20B/21B)</label>
                      <input
                        type="text"
                        value={regDrugLicenseNo}
                        onChange={(e) => setRegDrugLicenseNo(e.target.value)}
                        placeholder="MH-MZ4-20B-184920"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Pharmacist Council Reg No. (R.Ph)</label>
                      <input
                        type="text"
                        value={regCouncilRegNo}
                        onChange={(e) => setRegCouncilRegNo(e.target.value)}
                        placeholder="MSPC-74921"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">GSTIN (Optional)</label>
                      <input
                        type="text"
                        value={regGstin}
                        onChange={(e) => setRegGstin(e.target.value)}
                        placeholder="27ABCDE1234F1Z5"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location Pincode & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Delivery / Store PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={regPincode}
                    onChange={(e) => setRegPincode(e.target.value)}
                    placeholder="400028"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City / District</label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Dadar, Mumbai"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Patient Chronic Care Care Selection (Optional for Patient) */}
              {category === 'patient' && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Chronic Medication Reminders (Optional):</span>
                    <span className="text-[10px] text-slate-400 font-normal">Auto generic savings alert</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Diabetes', 'Hypertension', 'Thyroid', 'Cardiac', 'Asthma', 'GERD / Acidity'].map((cond) => {
                      const isSel = selectedConditions.includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                            isSel
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}
                          {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Set Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Statutory Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600 text-[11px] leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 mt-0.5 shrink-0"
                  />
                  <span>
                    I confirm that I am 18+ years of age and agree to GenericMed&apos;s Terms of Use, Privacy Policy, and CDSCO Drug Rules 1945 regulations.
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    <span>Creating Verified Profile...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">how_to_reg</span>
                    <span>Complete Registration & Launch Store</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Forgot Password Modal */}
          {forgotPasswordOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-lg">lock_reset</span>
                    <h3 className="font-headline font-bold text-slate-900 text-sm">Reset Your Password</h3>
                  </div>
                  <button
                    onClick={() => setForgotPasswordOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Enter your registered email address. We will simulate sending a secure reset link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setForgotPasswordOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      setSuccessMessage(`Password reset link sent to ${forgotEmail || 'your email'}!`);
                      setTimeout(() => setSuccessMessage(null), 4000);
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
