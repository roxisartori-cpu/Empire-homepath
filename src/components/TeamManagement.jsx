import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X, CheckCircle, Clock } from 'lucide-react';

const TeamManagement = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [seatLimit, setSeatLimit] = useState(null);
  const [seatsUsed, setSeatsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  const token = localStorage.getItem('token');

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/team/members`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        setSeatLimit(data.seatLimit);
        setSeatsUsed(data.seatsUsed || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/team/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invite');

      if (data.emailSent) {
        setMessage({ type: 'success', text: `Invite sent to ${inviteEmail}.` });
      } else {
        setMessage({ type: 'warning', text: `Account created, but the invite email failed to send. Share this link directly: ${data.inviteLink}` });
      }
      setInviteEmail('');
      loadMembers();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId, email) => {
    if (!window.confirm(`Remove ${email} from your team? They will immediately lose access.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/team/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove member');
      loadMembers();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const atLimit = seatLimit !== null && seatLimit !== undefined && seatsUsed >= seatLimit;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="auth-eyebrow" style={{ justifyContent: 'center' }}>Team Management</div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Users style={{ color: 'var(--gold)' }} size={24} /> Your Team
        </h2>
        <p style={{ color: 'var(--body-c)', marginTop: '8px', fontSize: '13px' }}>
          {seatLimit === null || seatLimit === undefined
            ? `${seatsUsed} seat${seatsUsed === 1 ? '' : 's'} used \u00b7 unlimited seats`
            : `${seatsUsed} of ${seatLimit} seats used`}
        </p>
      </div>

      <div className="card-dark card-dark-pad" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)', marginBottom: '16px' }}>Invite a Teammate</h3>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="teammate@example.com"
            className="field-input"
            style={{ flex: '1 1 240px' }}
            disabled={atLimit}
          />
          <button type="submit" className="btn-gold" disabled={inviting || atLimit} style={{ whiteSpace: 'nowrap' }}>
            <UserPlus size={16} /> {inviting ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        {atLimit && (
          <p style={{ color: 'var(--warning)', fontSize: '12px', marginTop: '10px' }}>
            You've reached your seat limit. Remove a teammate first, or contact us to add more seats.
          </p>
        )}
        {message && (
          <div className={message.type === 'error' ? 'auth-error' : ''} style={{
            marginTop: '14px', fontSize: '13px', padding: '10px 14px', borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(74,222,128,0.1)' : message.type === 'warning' ? 'rgba(251,185,36,0.1)' : undefined,
            color: message.type === 'success' ? 'var(--success)' : message.type === 'warning' ? 'var(--warning)' : undefined,
            border: message.type === 'success' ? '1px solid rgba(74,222,128,0.3)' : message.type === 'warning' ? '1px solid rgba(251,185,36,0.3)' : undefined,
            wordBreak: 'break-all',
          }}>
            {message.text}
          </div>
        )}
      </div>

      <div className="card-dark card-dark-pad">
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)', marginBottom: '16px' }}>Current Members</h3>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Loading...</p>
        ) : members.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No teammates yet \u2014 invite your first one above.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {members.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--ink-lift)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div>
                  <p style={{ color: 'var(--white)', fontWeight: 600, fontSize: '13px' }}>{m.email}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {m.status === 'pending' ? <><Clock size={11} /> Invite pending</> : <><CheckCircle size={11} color="var(--success)" /> Active</>}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(m.id, m.email)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '6px' }}
                  title="Remove from team"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
