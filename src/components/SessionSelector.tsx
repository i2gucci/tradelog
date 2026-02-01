import { useState } from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { Session } from '../types';
import { createSession } from '../storage';

interface SessionSelectorProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}) => {
  const [showNewSession, setShowNewSession] = useState(false);

  const getESTDateString = () => {
    const now = new Date();
    const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const month = String(estDate.getMonth() + 1).padStart(2, '0');
    const day = String(estDate.getDate()).padStart(2, '0');
    const year = estDate.getFullYear();
    return `${month}.${day}.${year}`;
  };

  const handleCreateSession = () => {
    const dateString = getESTDateString();
    const session = createSession(dateString, dateString);
    onCreateSession(session);
    setShowNewSession(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this session? All trades will be lost.')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="session-selector">
      <div className="session-header">
        <h2>Trading Sessions</h2>
        <button
          type="button"
          className="btn-icon"
          onClick={() => setShowNewSession(!showNewSession)}
          title="New Session"
        >
          <Plus size={20} />
        </button>
      </div>

      {showNewSession && (
        <div className="new-session-form">
          <p className="confirm-text">Create a new trading session for today?</p>
          <p className="session-date-preview">{getESTDateString()}</p>
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={handleCreateSession}>
              Create Session
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowNewSession(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="session-list">
        {sessions.length === 0 ? (
          <p className="empty-state">No sessions yet. Create one to start!</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${
                session.id === activeSessionId ? 'active' : ''
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="session-info">
                <h3>{session.name}</h3>
                <div className="session-meta">
                  <Calendar size={14} />
                  <span>{session.date}</span>
                  <span className="trade-count">
                    {session.trades.length} trades
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon-danger"
                onClick={(e) => handleDeleteSession(e, session.id)}
                title="Delete Session"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
