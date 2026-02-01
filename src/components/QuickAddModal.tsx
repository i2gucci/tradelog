import { useState, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Plus, X, ExternalLink } from 'lucide-react';
import { Trade, EMOTION_OPTIONS } from '../types';
import { createTrade } from '../storage';

interface QuickAddModalProps {
  onAddTrade: (trade: Trade) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ 
  onAddTrade, 
  isOpen, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    txn: '',
    ticker: '',
    status: 'loss' as 'win' | 'loss',
    percentageChange: '' as string | number,
    dollarChange: '' as string | number,
    description: '',
    emotionalState: 'neutral' as string,
  });
  const [keepPipOpen, setKeepPipOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tradeCount, setTradeCount] = useState(0);
  const pipWindowRef = useRef<Window | null>(null);
  const pipRootRef = useRef<Root | null>(null);

  // Cleanup PiP window when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (pipRootRef.current) {
        pipRootRef.current.unmount();
        pipRootRef.current = null;
      }
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
        pipWindowRef.current = null;
      }
    };
  }, []);

  // Update PiP form when formData changes
  useEffect(() => {
    if (pipRootRef.current && pipWindowRef.current && !pipWindowRef.current.closed) {
      renderPiPForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
      
      // Show success feedback
      setShowSuccess(true);
      setTradeCount(prev => prev + 1);
      setTimeout(() => setShowSuccess(false), 2000);
      
      resetForm();
      
      // Focus back on ticker input for quick next entry
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        const input = pipWindowRef.current.document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      }
      
      // Only close if not in PiP or if keepPipOpen is false
      if (!pipWindowRef.current || pipWindowRef.current.closed) {
        onClose();
      } else if (!keepPipOpen) {
        pipWindowRef.current.close();
        pipWindowRef.current = null;
        pipRootRef.current = null;
        onClose();
      }
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
  };

  const renderPiPForm = () => {
    if (!pipWindowRef.current || pipWindowRef.current.closed) return;

    const container = pipWindowRef.current.document.getElementById('pip-root');
    if (!container) return;

    if (!pipRootRef.current) {
      pipRootRef.current = createRoot(container);
    }

    pipRootRef.current.render(
      <div className="pip-container" onKeyDown={(e) => {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
        // Ctrl/Cmd + K to toggle keep open
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          setKeepPipOpen(prev => !prev);
        }
      }}>
        <div className="pip-content">
          <div className="pip-header">
            <div>
              <h2>Quick Add Trade</h2>
              <p className="pip-subtitle">
                {tradeCount > 0 ? `${tradeCount} trade${tradeCount > 1 ? 's' : ''} added · ` : ''}PiP Mode · ⌘↵ to submit
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="pip-success-banner">
              ✓ Trade added successfully!
            </div>
          )}

          <div className="pip-body">
            <div className="form-grid compact">
              <div className="form-group">
                <label>Ticker Symbol</label>
                <input
                  type="text"
                  placeholder="SOL, BTC, ETH..."
                  value={formData.ticker}
                  onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const nextInput = e.currentTarget.parentElement?.nextElementSibling?.querySelector('select, input');
                      if (nextInput) (nextInput as HTMLElement).focus();
                    }
                  }}
                />
              </div>

              <div className="form-group status-group">
                <label>Result</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'win' | 'loss' })}
                >
                  <option value="loss">Loss</option>
                  <option value="win">Win</option>
                </select>
              </div>

              <div className="form-group">
                <label>% Change</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="0.00"
                  value={formData.percentageChange}
                  onChange={(e) => setFormData({ ...formData, percentageChange: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>SOL Change</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="0.00"
                  value={formData.dollarChange}
                  onChange={(e) => setFormData({ ...formData, dollarChange: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Transaction ID</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={formData.txn}
                  onChange={(e) => setFormData({ ...formData, txn: e.target.value })}
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
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData({ ...formData, emotionalState: option.value });
                      }}
                      title={`Emotional State: ${option.tooltip}`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Trade Description</label>
                <textarea
                  placeholder="Describe what happened in this trade..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="pip-footer">
            <div className="pip-footer-controls">
              <label className="pip-toggle">
                <input
                  type="checkbox"
                  checked={keepPipOpen}
                  onChange={(e) => setKeepPipOpen(e.target.checked)}
                />
                <span>Keep open after adding</span>
              </label>
            </div>
            <button 
              className="btn-primary pip-submit-btn" 
              onClick={handleSubmit}
              disabled={!formData.ticker || !formData.description}
            >
              <Plus size={18} />
              Add Trade
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenPiP = async () => {
    try {
      // Check if Document Picture-in-Picture API is available
      if (!('documentPictureInPicture' in window)) {
        alert('Picture-in-Picture is not supported in this browser. Please use Chrome 116+ or Edge 116+.');
        return;
      }

      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 540,
        height: 720,
      });

      pipWindowRef.current = pipWindow;

        // Copy styles to PiP window
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules]
              .map((rule) => rule.cssText)
              .join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
          } catch (e) {
            // Handle CORS issues with external stylesheets
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = (styleSheet as any).href;
            pipWindow.document.head.appendChild(link);
          }
        });

        // Setup the container for React
        const container = document.createElement('div');
        container.id = 'pip-root';
        pipWindow.document.body.appendChild(container);

        // Set body background
        pipWindow.document.body.style.margin = '0';
        pipWindow.document.body.style.padding = '0';
        pipWindow.document.body.style.background = 'var(--bg-primary)';
        pipWindow.document.body.style.overflow = 'hidden';

        // Render the form
        renderPiPForm();

        // Close modal when PiP window opens
        onClose();

        // Clean up when PiP window closes
        pipWindow.addEventListener('pagehide', () => {
          if (pipRootRef.current) {
            pipRootRef.current.unmount();
            pipRootRef.current = null;
          }
          pipWindowRef.current = null;
        });
    } catch (error) {
      console.error('Failed to open Picture-in-Picture:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to open Picture-in-Picture mode: ${errorMessage}\n\nMake sure you're using Chrome 116+ or Edge 116+.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quick-add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Quick Add Trade</h2>
            <p className="modal-subtitle">Quickly document your trade from anywhere</p>
          </div>
          <div className="modal-header-actions">
            <button 
              type="button"
              className="btn-icon" 
              onClick={handleOpenPiP}
              title="Open in Picture-in-Picture"
            >
              <ExternalLink size={18} />
            </button>
            <button type="button" className="btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="form-grid compact">
            <div className="form-group">
              <label>Ticker Symbol</label>
              <input
                type="text"
                placeholder="SOL, BTC, ETH..."
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              />
            </div>

            <div className="form-group status-group">
              <label>Result</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'win' | 'loss' })}
              >
                <option value="loss">Loss</option>
                <option value="win">Win</option>
              </select>
            </div>

            <div className="form-group">
              <label>% Change</label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.00"
                value={formData.percentageChange}
                onChange={(e) => setFormData({ ...formData, percentageChange: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>SOL Change</label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.00"
                value={formData.dollarChange}
                onChange={(e) => setFormData({ ...formData, dollarChange: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Transaction ID</label>
              <input
                type="text"
                placeholder="Optional"
                value={formData.txn}
                onChange={(e) => setFormData({ ...formData, txn: e.target.value })}
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
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({ ...formData, emotionalState: option.value });
                    }}
                    title={`Emotional State: ${option.tooltip}`}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Trade Description</label>
              <textarea
                placeholder="Describe what happened in this trade..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button"
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={!formData.ticker || !formData.description}
          >
            <Plus size={18} />
            Add Trade
          </button>
        </div>
      </div>
    </div>
  );
};
