import { useState } from 'react';
import { TrendingDown, TrendingUp, FileText, Edit2, Trash2, X, Check } from 'lucide-react';
import { Trade, EMOTION_OPTIONS } from '../types';

interface TradeListProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onUpdateTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

export const TradeList: React.FC<TradeListProps> = ({ 
  trades, 
  onSelectTrade,
  onUpdateTrade,
  onDeleteTrade
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    txn?: string;
    ticker?: string;
    status?: 'win' | 'loss';
    percentageChange?: string | number;
    dollarChange?: string | number;
    description?: string;
  }>({});

  const startEdit = (trade: Trade, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(trade.id);
    setEditData({
      txn: trade.txn,
      ticker: trade.ticker,
      status: trade.status,
      percentageChange: trade.percentageChange,
      dollarChange: trade.dollarChange,
      description: trade.description,
    });
  };

  const saveEdit = (trade: Trade, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTrade({
      ...trade,
      txn: editData.txn || trade.txn,
      ticker: editData.ticker || trade.ticker,
      status: editData.status || trade.status,
      percentageChange: typeof editData.percentageChange === 'string' 
        ? parseFloat(editData.percentageChange) || 0 
        : editData.percentageChange ?? trade.percentageChange,
      dollarChange: typeof editData.dollarChange === 'string'
        ? parseFloat(editData.dollarChange) || 0
        : editData.dollarChange ?? trade.dollarChange,
      description: editData.description || trade.description,
    });
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trade?')) {
      onDeleteTrade(tradeId);
    }
  };
  if (trades.length === 0) {
    return (
      <div className="empty-state-large">
        <FileText size={48} />
        <h3>No trades yet</h3>
        <p>Add your first trade to start tracking</p>
      </div>
    );
  }

  const sortedTrades = [...trades].sort((a, b) => b.timestamp - a.timestamp);
  const isEditing = (tradeId: string) => editingId === tradeId;

  return (
    <div className="trade-list">
      {sortedTrades.map((trade) => (
        <div
          key={trade.id}
          className={`trade-card ${trade.status} ${isEditing(trade.id) ? 'editing' : ''}`}
          onClick={() => !isEditing(trade.id) && onSelectTrade(trade)}
        >
          {isEditing(trade.id) ? (
            <div className="trade-edit-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="TXN"
                  value={editData.txn || ''}
                  onChange={(e) => setEditData({ ...editData, txn: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
                <input
                  type="text"
                  placeholder="Ticker"
                  value={editData.ticker || ''}
                  onChange={(e) => setEditData({ ...editData, ticker: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="form-row">
                <select
                  value={editData.status || trade.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as 'win' | 'loss' })}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="loss">Loss</option>
                  <option value="win">Win</option>
                </select>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="% Change"
                  value={editData.percentageChange ?? ''}
                  onChange={(e) => setEditData({ ...editData, percentageChange: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="SOL Change"
                  value={editData.dollarChange ?? ''}
                  onChange={(e) => setEditData({ ...editData, dollarChange: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <textarea
                placeholder="Description"
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                rows={3}
              />
              <div className="edit-actions">
                <button 
                  type="button"
                  className="btn-icon save-btn" 
                  onClick={(e) => saveEdit(trade, e)}
                  title="Save"
                >
                  <Check size={18} />
                </button>
                <button 
                  type="button"
                  className="btn-icon cancel-btn" 
                  onClick={cancelEdit}
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="trade-card-header">
                <div className="trade-ticker">
                  <h3>{trade.ticker}</h3>
                  {trade.txn && <span className="trade-txn">{trade.txn}</span>}
                  {trade.emotionalState && (() => {
                    const emotion = EMOTION_OPTIONS.find(opt => opt.value === trade.emotionalState);
                    return emotion ? (
                      <span className="emotion-icon" data-tooltip={`Emotional State: ${emotion.tooltip}`}>
                        {emotion.emoji}
                      </span>
                    ) : null;
                  })()}
                </div>
                <div className="trade-actions">
                  <button 
                    type="button"
                    className="btn-icon-small edit-btn" 
                    onClick={(e) => startEdit(trade, e)}
                    title="Edit trade"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    type="button"
                    className="btn-icon-small delete-btn" 
                    onClick={(e) => handleDelete(trade.id, e)}
                    title="Delete trade"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className={`trade-status ${trade.status}`}>
                    {trade.status === 'win' ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                    <span>{trade.status === 'win' ? 'Win' : 'Loss'}</span>
                  </div>
                </div>
              </div>

              <div className="trade-metrics">
                <div className="metric">
                  <span className="metric-label">Change</span>
                  <span className={`metric-value ${trade.percentageChange >= 0 ? 'positive' : 'negative'}`}>
                    {trade.percentageChange > 0 ? '+' : ''}
                    {trade.percentageChange}%
                  </span>
                </div>
                {trade.dollarChange !== 0 && (
                  <div className="metric">
                    <span className="metric-label">P/L</span>
                    <span className={`metric-value ${trade.dollarChange >= 0 ? 'positive' : 'negative'}`}>
                      {trade.dollarChange > 0 ? '+' : ''}{trade.dollarChange}
                    </span>
                  </div>
                )}
              </div>

              <div className="trade-description">
                <p>{trade.description}</p>
              </div>

              <div className="trade-footer">
                <span className="trade-time">
                  {new Date(trade.timestamp).toLocaleString()}
                </span>
                <span className="view-report">View Report →</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
