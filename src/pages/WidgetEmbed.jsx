import React, { useEffect, useState } from 'react';
import LeadGenWidget from '../components/widget/LeadGenWidget';

const WidgetEmbed = () => {
  const [params, setParams] = useState({ pro_id: '', primary: '#3b82f6', company: '' });
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setParams({
      pro_id: query.get('pro_id') || '',
      primary: query.get('primary') || '#3b82f6',
      company: query.get('company') || 'Empire HomePath'
    });
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-2">
      <LeadGenWidget 
        proId={params.pro_id} 
        branding={{ 
          primaryColor: params.primary, 
          companyName: params.company 
        }}
        apiUrl={API_BASE_URL}
      />
    </div>
  );
};

export default WidgetEmbed;
