import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

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

  if (loading) return <div className="p-8 text-center">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-brand-900 flex items-center gap-3">
          <Users className="text-brand-600" /> Admin Management
        </h2>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-warm-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
              {users.length}
            </div>
            <div>
              <p className="text-xs font-bold text-warm-500 uppercase tracking-widest">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-warm-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-warm-50 text-warm-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Plan</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Trial Ends</th>
              <th className="px-6 py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-warm-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-warm-900">{user.email}</div>
                  <div className="text-xs text-warm-500">Joined {new Date(user.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.plan || 'free'} 
                    onChange={(e) => handleUpdateUser(user.id, { plan: e.target.value })}
                    disabled={updating === user.id}
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold text-brand-700 cursor-pointer"
                  >
                    <option value="free">Free</option>
                    <option value="standard">Standard</option>
                    <option value="white-label">White Label</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.subscription_status === 'active' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : user.subscription_status === 'trialing' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <Clock size={14} /> Trialing
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-warm-400 bg-warm-100 px-2 py-1 rounded-full">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-warm-600">
                  {user.trial_end ? new Date(user.trial_end).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateUser(user.id, { subscription_status: 'active' })}
                      className="text-xs font-bold bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 7);
                        handleUpdateUser(user.id, { trial_end: date.toISOString(), subscription_status: 'trialing' });
                      }}
                      className="text-xs font-bold bg-warm-100 text-warm-700 px-3 py-1.5 rounded-lg hover:bg-warm-200"
                    >
                      +7d Trial
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
