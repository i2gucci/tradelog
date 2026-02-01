import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Trade, EMOTION_OPTIONS } from '../types';
import { createTrade } from '../storage';

interface TradeFormProps {
  onAddTrade: (trade: Trade) => void;
}

export const TradeForm: React.FC<TradeFormProps> = ({ onAddTrade }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    txn: '',
    ticker: '',
    status: 'loss' as 'win' | 'loss',
    percentageChange: '' as string | number,
    dollarChange: '' as string | number,
    description: '',
    emotionalState: 'neutral' as string,
  });

  const handleSubmit = () => {
    if (formData.ticker && formData.description) {
      const trade = createTrade({
        ...formData,
        percentageChange: typeof formData.percentageChange === 'string' 
          ? parseFloat(formData.percentageChange) || 0 
          : formData.percentageChange,
        dollarChange: typeof formData.dollarChange === 'string'
          ? parseFloat(formData.dollarChange) || 0
          : formData.dollarChange,
        actions: [],
        expectedOutcome: '',
        actualOutcome: '',
        feedbackAnalysis: [],
        lessonsLearned: [],
      });
      onAddTrade(trade);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      txn: '',
      ticker: '',
      status: 'loss',
      percentageChange: '',
      dollarChange: '',
      description: '',
      emotionalState: 'neutral',
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        type="button"
        className="btn-add-trade"
        onClick={() => setShowForm(true)}
      >
        <Plus size={20} />
        Quick Add Trade
      </button>
    );
  }

  return (
    <div className="trade-form-card">
      <div className="form-header">
        <h3>Quick Add Trade</h3>
        <button type="button" className="btn-icon" onClick={resetForm}>
          <X size={20} />
        </button>
      </div>

      <div className="form-grid compact">
        <div className="form-group">
          <label>Ticker</label>
          <input
            type="text"
            placeholder="Ticker *"
            value={formData.ticker}
            onChange={(e) =>
              setFormData({ ...formData, ticker: e.target.value })
            }
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>TXN</label>
          <input
            type="text"
            placeholder="TXN (optional)"
            value={formData.txn}
            onChange={(e) => setFormData({ ...formData, txn: e.target.value })}
          />
        </div>

        <div className="form-group status-group">
          <label>Status</label>
          <div className="status-toggle">
            <button
              type="button"
              className={`status-btn ${
                formData.status === 'loss' ? 'active loss' : ''
              }`}
              onClick={() => setFormData({ ...formData, status: 'loss' })}
            >
              Loss
            </button>
            <button
              type="button"
              className={`status-btn ${
                formData.status === 'win' ? 'active win' : ''
              }`}
              onClick={() => setFormData({ ...formData, status: 'win' })}
            >
              Win
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>% Change</label>
          <input
            type="number"
            step="0.0001"
            placeholder="% Change"
            value={formData.percentageChange}
            onChange={(e) =>
              setFormData({
                ...formData,
                percentageChange: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>SOL Change</label>
          <input
            type="number"
            step="0.0001"
            placeholder="$ Change"
            value={formData.dollarChange}
            onChange={(e) =>
              setFormData({
                ...formData,
                dollarChange: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group full-width">
          <label>Emotional State</label>
          <div className="emotion-selector">
            {EMOTION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`emotion-btn ${formData.emotionalState === option.value ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, emotionalState: option.value })}
                title={`Emotional State: ${option.tooltip}`}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            placeholder="Quick notes about this trade *"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          Add Trade
        </button>
        <button type="button" className="btn-secondary" onClick={resetForm}>
          Cancel
        </button>
      </div>
    </div>
  );
};
