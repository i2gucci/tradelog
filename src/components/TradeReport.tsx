import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Trade, EMOTION_OPTIONS } from '../types';

interface TradeReportProps {
  trade: Trade;
  onBack: () => void;
  onUpdate: (trade: Trade) => void;
  onDelete: (tradeId: string) => void;
}

export const TradeReport: React.FC<TradeReportProps> = ({
  trade,
  onBack,
  onUpdate,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTrade, setEditedTrade] = useState(trade);
  const [newAction, setNewAction] = useState('');
  const [newReflection, setNewReflection] = useState('');
  const [newLesson, setNewLesson] = useState('');

  useEffect(() => {
    setEditedTrade(trade);
  }, [trade]);

  const handleSave = () => {
    onUpdate(editedTrade);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      onDelete(trade.id);
    }
  };

  const addAction = () => {
    if (newAction.trim()) {
      setEditedTrade({
        ...editedTrade,
        actions: [...editedTrade.actions, newAction],
      });
      setNewAction('');
    }
  };

  const removeAction = (index: number) => {
    setEditedTrade({
      ...editedTrade,
      actions: editedTrade.actions.filter((_, i) => i !== index),
    });
  };

  const addReflection = () => {
    if (newReflection.trim()) {
      setEditedTrade({
        ...editedTrade,
        feedbackAnalysis: [...editedTrade.feedbackAnalysis, newReflection],
      });
      setNewReflection('');
    }
  };

  const removeReflection = (index: number) => {
    setEditedTrade({
      ...editedTrade,
      feedbackAnalysis: editedTrade.feedbackAnalysis.filter((_, i) => i !== index),
    });
  };

  const addLesson = () => {
    if (newLesson.trim()) {
      setEditedTrade({
        ...editedTrade,
        lessonsLearned: [...editedTrade.lessonsLearned, newLesson],
      });
      setNewLesson('');
    }
  };

  const removeLesson = (index: number) => {
    setEditedTrade({
      ...editedTrade,
      lessonsLearned: editedTrade.lessonsLearned.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedTrade({
          ...editedTrade,
          chartUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTrade = editMode ? editedTrade : trade;

  return (
    <div className="trade-report">
      <div className="report-header">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Trades
        </button>
        <div className="report-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
          >
            {editMode ? 'Save Changes' : 'Edit Report'}
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={handleDelete}
            title="Delete trade"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="report-content dashboard-layout">
        {/* Top Row: Chart and Trade Info */}
        <div className="top-row">
          {/* Chart Section */}
          <div className="report-section chart-section-compact">
            {currentTrade.chartUrl ? (
              <>
                <div className="chart-image-container">
                  <img 
                    src={currentTrade.chartUrl} 
                    alt="Trade chart" 
                    className="chart-image"
                  />
                </div>
                {editMode && (
                  <div className="chart-actions">
                    <label className="btn-secondary chart-upload-btn">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditedTrade({ ...editedTrade, chartUrl: '' })}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="chart-placeholder-compact">
                <ImageIcon size={32} />
                <p>No chart</p>
                {editMode && (
                  <label className="btn-primary chart-upload-btn">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Trade Header Card */}
          <div className="report-section trade-header-card">
            <div className="trade-title-row">
              <div className="title-section">
                {editMode ? (
                  <input
                    type="text"
                    className="edit-ticker"
                    value={editedTrade.ticker}
                    onChange={(e) =>
                      setEditedTrade({ ...editedTrade, ticker: e.target.value })
                    }
                    placeholder="Ticker"
                  />
                ) : (
                  <h1>{currentTrade.ticker}</h1>
                )}
                {currentTrade.txn && <p className="txn-id">{currentTrade.txn}</p>}
                {!editMode && (
                  <div className="inline-metrics">
                    <span className={`metric-inline ${currentTrade.status === 'win' ? 'positive' : 'negative'}`}>
                      {currentTrade.percentageChange > 0 ? '+' : ''}
                      {currentTrade.percentageChange}%
                    </span>
                    <span className="metric-separator">·</span>
                    <span className={`metric-inline ${currentTrade.status === 'win' ? 'positive' : 'negative'}`}>
                      {currentTrade.dollarChange > 0 ? '+' : ''}
                      {currentTrade.dollarChange}
                    </span>
                  </div>
                )}
              </div>
              <div className="status-and-metrics">
                {editMode ? (
                  <>
                    <select
                      className="status-select"
                      value={editedTrade.status}
                      onChange={(e) =>
                        setEditedTrade({
                          ...editedTrade,
                          status: e.target.value as 'win' | 'loss',
                        })
                      }
                    >
                      <option value="win">Win ✓</option>
                      <option value="loss">Loss ✗</option>
                    </select>
                    <div className="edit-metrics-group">
                      <div className="edit-metric-wrapper">
                        <label className="metric-label-inline">% Change</label>
                        <input
                          type="number"
                          className="edit-metric-inline"
                          value={editedTrade.percentageChange}
                          onChange={(e) =>
                            setEditedTrade({
                              ...editedTrade,
                              percentageChange: parseFloat(e.target.value) || 0,
                            })
                          }
                          step="0.0001"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="edit-metric-wrapper">
                        <label className="metric-label-inline">SOL Change</label>
                        <input
                          type="number"
                          className="edit-metric-inline"
                          value={editedTrade.dollarChange}
                          onChange={(e) =>
                            setEditedTrade({
                              ...editedTrade,
                              dollarChange: parseFloat(e.target.value) || 0,
                            })
                          }
                          step="0.0001"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`status-badge-large ${currentTrade.status}`}>
                    {currentTrade.status === 'win' ? 'Win ✓' : 'Loss ✗'}
                  </div>
                )}
              </div>
            </div>
            <div className="description-box">
              <h4>Initial Description</h4>
              {editMode ? (
                <textarea
                  className="edit-description"
                  value={editedTrade.description}
                  onChange={(e) =>
                    setEditedTrade({ ...editedTrade, description: e.target.value })
                  }
                  placeholder="Enter initial description..."
                  rows={3}
                />
              ) : (
                <p>{currentTrade.description}</p>
              )}
            </div>
            <div className="emotion-display">
              <h4>Emotional State</h4>
              {editMode ? (
                <div className="emotion-selector">
                  {EMOTION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`emotion-btn ${editedTrade.emotionalState === option.value ? 'active' : ''}`}
                      onClick={() => setEditedTrade({ ...editedTrade, emotionalState: option.value })}
                      title={`Emotional State: ${option.tooltip}`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="emotion-badge">
                  {EMOTION_OPTIONS.find(opt => opt.value === currentTrade.emotionalState)?.emoji} {
                    currentTrade.emotionalState === 'rage' ? 'Rage' :
                    currentTrade.emotionalState === 'desperation' ? 'Desperation' :
                    currentTrade.emotionalState === 'neutral' ? 'Neutral' :
                    currentTrade.emotionalState === 'relaxed' ? 'Relaxed' :
                    currentTrade.emotionalState === 'calculated' ? 'Calculated' : ''
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Three columns */}
        <div className="bottom-row">
          {/* What I Did - Full height left column */}
          <div className="report-section full-height">
            <h3>What I Did</h3>
            {editMode ? (
              <div className="actions-edit">
                {currentTrade.actions.map((action, index) => (
                  <div key={index} className="action-item-edit">
                    <span>• {action}</span>
                    <button
                      type="button"
                      className="btn-icon-small"
                      onClick={() => removeAction(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="add-action">
                  <input
                    type="text"
                    placeholder="Add an action..."
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAction();
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="btn-icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      addAction();
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <ul className="actions-list">
                {currentTrade.actions.length === 0 ? (
                  <li className="empty">No actions documented yet</li>
                ) : (
                  currentTrade.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Right column with Expected and Actual stacked */}
          <div className="outcomes-column">
            {/* Expected Outcome */}
            <div className="report-section">
              <h3>Expected Outcome</h3>
              {editMode ? (
                <textarea
                  value={currentTrade.expectedOutcome}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
                      expectedOutcome: e.target.value,
                    })
                  }
                  placeholder="What did you expect to happen?"
                  rows={3}
                />
              ) : (
                <p className={!currentTrade.expectedOutcome ? 'empty' : ''}>
                  {currentTrade.expectedOutcome || 'Not documented yet'}
                </p>
              )}
            </div>

            {/* Actual Outcome */}
            <div className="report-section">
              <h3>Actual Outcome</h3>
              {editMode ? (
                <textarea
                  value={currentTrade.actualOutcome}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
                      actualOutcome: e.target.value,
                    })
                  }
                  placeholder="What actually happened?"
                  rows={3}
                />
              ) : (
                <p className={!currentTrade.actualOutcome ? 'empty' : ''}>
                  {currentTrade.actualOutcome || 'Not documented yet'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Row - Full width */}
        <div className="analysis-row">
          <div className="report-section">
            <h3>Reflection & Analysis</h3>
            
            <div className="reflection-grid">
              {/* Lessons Learned */}
              <div className="reflection-category">
                <h4>Reflection</h4>
                {editMode ? (
                  <div className="actions-edit">
                    {currentTrade.lessonsLearned.map((item, index) => (
                      <div key={index} className="action-item-edit">
                        <span>• {item}</span>
                        <button
                          type="button"
                          className="btn-icon-small"
                          onClick={() => removeLesson(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="add-action">
                      <input
                        type="text"
                        placeholder="Add lesson learned..."
                        value={newLesson}
                        onChange={(e) => setNewLesson(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addLesson();
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-icon" 
                        onClick={(e) => {
                          e.preventDefault();
                          addLesson();
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="actions-list">
                    {currentTrade.lessonsLearned.length === 0 ? (
                      <li className="empty">Not documented yet</li>
                    ) : (
                      currentTrade.lessonsLearned.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {/* General Reflection */}
              <div className="reflection-category">
                <h4>Behavioral Change</h4>
                {editMode ? (
                  <div className="actions-edit">
                    {currentTrade.feedbackAnalysis.map((reflection, index) => (
                      <div key={index} className="action-item-edit">
                        <span>• {reflection}</span>
                        <button
                          type="button"
                          className="btn-icon-small"
                          onClick={() => removeReflection(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="add-action">
                      <input
                        type="text"
                        placeholder="Add general reflection..."
                        value={newReflection}
                        onChange={(e) => setNewReflection(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addReflection();
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-icon" 
                        onClick={(e) => {
                          e.preventDefault();
                          addReflection();
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="actions-list">
                    {currentTrade.feedbackAnalysis.length === 0 ? (
                      <li className="empty">Not documented yet</li>
                    ) : (
                      currentTrade.feedbackAnalysis.map((reflection, index) => (
                        <li key={index}>{reflection}</li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
