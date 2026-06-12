import React, { useState, useEffect } from 'react';
import { Users, Code, BarChart3, ArrowRight, Mail, MapPin, DollarSign } from 'lucide-react';
import WidgetEmbedCode from './widget/WidgetEmbedCode';

const ProfessionalDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'widget'
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads();
    }
  }, [activeTab]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Professional Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your leads and marketing tools.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'leads' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users size={18} /> Leads
          </button>
          <button 
            onClick={() => setActiveTab('widget')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'widget' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code size={18} /> Widget
          </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Leads</p>
              <h3 className="text-3xl font-black text-slate-800">{leads.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last 7 Days</p>
              <h3 className="text-3xl font-black text-leaf-600">
                {leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-black text-brand-600">--%</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">County</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Income/Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matches</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Loading leads...</td></tr>
                  ) : leads.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No leads captured yet. Embed your widget to start collecting leads!</td></tr>
                  ) : leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold">
                            {lead.email[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-700">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 text-sm">
                          <MapPin size={14} className="text-slate-300" /> {lead.county}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="text-slate-700 font-medium">${lead.income?.toLocaleString()} inc.</span>
                          <span className="text-slate-400">${lead.purchase_price?.toLocaleString()} price</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                          {lead.matched_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                          <Mail size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <WidgetEmbedCode user={user} />
      )}
    </div>
  );
};

export default ProfessionalDashboard;
