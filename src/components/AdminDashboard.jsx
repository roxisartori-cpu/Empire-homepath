import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, CheckCircle, XCircle, Clock, Search, Shield, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import EligibilityForm from './EligibilityForm';
import ResultsList from './ResultsList';
import programsData from '../data/programs.json';
import { matchPrograms } from '../matching';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Super Search State
  const [adminFormData, setAdminFormData] = useState({
    county: '',
    city: '',
    income: '',
    householdSize: 2,
    purchasePrice: '',
    propertyType: 'Single Family',
    isFirstTimeBuyer: true,
    isVeteran: false,
    isInterestedInRenovation: false,
    isInterestedInEnergy: false,
    isInterestedInAccessibility: false
  });
  const [showAdminResults, setShowAdminResults] = useState(false);

  const fetchUsers = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId, updates) => {
    setUpdating(userId);
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/update-user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.plan && u.plan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingApprovals = users.filter(u => u.subscription_status === 'trialing' || !u.subscription_status);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-900 flex items-center gap-3">
            <Shield className="text-red-500" /> Admin Console
          </h2>
          <p className="text-warm-600 mt-2">Manage users, subscriptions, and platform access.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-warm-100">
            <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-1">Total Pros</p>
            <p className="text-2xl font-black text-brand-800">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-warm-100">
            <p className="text-xs font-bold text-warm-400 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-2xl font-black text-amber-500">{pendingApprovals.length}</p>
          </div>
        </div>
      </div>

      {/* Trial Controls Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-warm-200 pb-2">
          <Clock className="text-amber-500" />
          <h3 className="text-xl font-bold text-warm-800">Trial Controls</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingApprovals.length > 0 ? (
            pendingApprovals.slice(0, 3).map(user => (
              <div key={user.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase">Pending Review</span>
                    <span className="text-xs text-warm-400">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="font-bold text-warm-900 truncate">{user.email}</p>
                  <p className="text-sm text-warm-500 mt-1">Tier: {user.plan || 'standard'}</p>
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => handleUpdateUser(user.id, { subscription_status: 'active' })}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-all"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() + 7);
                      handleUpdateUser(user.id, { trial_end: date.toISOString(), subscription_status: 'trialing' });
                    }}
                    className="flex-1 bg-white border border-amber-200 text-amber-700 font-bold py-2 rounded-xl text-sm hover:bg-amber-100 transition-all"
                  >
                    +7d Trial
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 bg-warm-50 rounded-2xl border border-dashed border-warm-200 text-center text-warm-400">
              No pending approvals at this time.
            </div>
          )}
        </div>
      </section>

      {/* User Management Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 border-b border-warm-200 pb-2 flex-1">
            <Users className="text-brand-600" />
            <h3 className="text-xl font-bold text-warm-800">User Management</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white rounded-xl border border-warm-200 text-sm focus:ring-2 focus:ring-brand-400 outline-none w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-warm-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-warm-50 text-warm-600 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-black">Professional</th>
                <th className="px-6 py-4 font-black">Plan Tier</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Trial End</th>
                <th className="px-6 py-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-warm-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-warm-900">{user.email}</div>
                    <div className="text-[10px] text-warm-400 uppercase tracking-widest">Joined {new Date(user.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={user.plan || 'standard'} 
                      onChange={(e) => handleUpdateUser(user.id, { plan: e.target.value })}
                      disabled={updating === user.id}
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-brand-700 cursor-pointer"
                    >
                      <option value="standard">Standard</option>
                      <option value="white-label">White Label</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      {user.subscription_status === 'active' ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                          <CheckCircle size={10} /> Active
                        </span>
                      ) : user.subscription_status === 'trialing' ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                          <Clock size={10} /> Trial
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-warm-400 bg-warm-100 px-2.5 py-1 rounded-full">
                          <XCircle size={10} /> Inactive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-600 font-medium">
                    {user.trial_end ? new Date(user.trial_end).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateUser(user.id, { subscription_status: 'active' })}
                        title="Quick Approve"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      >
                        <UserCheck size={18} />
                      </button>
                      <button 
                        onClick={() => handleUpdateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                        title={user.role === 'admin' ? "Demote from Admin" : "Promote to Admin"}
                        className={`p-2 rounded-lg transition-all ${user.role === 'admin' ? 'text-red-500 hover:bg-red-50' : 'text-warm-400 hover:bg-warm-100'}`}
                      >
                        <Shield size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admin Super Search Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-warm-200 pb-2">
          <Search className="text-brand-500" />
          <h3 className="text-xl font-bold text-warm-800">Admin Super Search</h3>
          <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
            <Shield size={10} /> Unrestricted
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-warm-100 overflow-hidden">
          <div className="p-8 bg-warm-50/50 border-b border-warm-100">
            <EligibilityForm 
              formData={adminFormData}
              handleInputChange={(e) => {
                const { name, value, type, checked } = e.target;
                setAdminFormData(prev => ({
                  ...prev,
                  [name]: type === 'checkbox' ? checked : (name === 'income' || name === 'purchasePrice' || name === 'householdSize' ? (value === '' ? '' : Number(value)) : value)
                }));
              }}
              handleSubmit={(e) => {
                e.preventDefault();
                setShowAdminResults(true);
              }}
              isSearching={false}
            />
          </div>

          {showAdminResults && (
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm italic">
                <AlertTriangle size={18} />
                Admin View: Displaying all matching programs without subscription gating.
              </div>
              <ResultsList 
                programs={matchPrograms(programsData, adminFormData)}
                onSaveClick={() => alert('Save disabled in admin view')}
                verificationStates={{}}
                onVerifyLive={() => {}}
                onLenderClick={() => {}}
                isAdminView={true}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
