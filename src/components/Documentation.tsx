import { useState } from 'react';
import { ArrowLeft, Book, FileText, HelpCircle, Zap } from 'lucide-react';

interface DocsProps {
  onBack: () => void;
}

interface DocSection {
  id: string;
  title: string;
  icon: any;
  content: string;
}

export const Documentation: React.FC<DocsProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: `
# Getting Started with TradeLog

Welcome to TradeLog - your personal trading journal designed for reflection and growth.

## Quick Start

1. **Create a Session**: Click the "New Session" button to start documenting your trading day
2. **Add Trades**: Use the "Quick Add Trade" button or the floating action button to log trades
3. **Document Details**: Fill in ticker, status (win/loss), percentage change, and emotional state
4. **Reflect**: Open any trade to add detailed analysis, actions, and lessons learned

## Key Features

- **Session-based Organization**: Group trades by trading day
- **Emotional State Tracking**: Monitor your trading psychology
- **Quick Trade Entry**: Fast trade logging with Picture-in-Picture mode
- **Import/Export**: Backup and restore your data as JSON
- **Detailed Reflection**: Comprehensive trade reports with charts and analysis
      `.trim(),
    },
    {
      id: 'sessions',
      title: 'Managing Sessions',
      icon: FileText,
      content: `
# Managing Trading Sessions

Sessions help you organize trades by trading day and review your performance over time.

## Creating Sessions

- Click the "+" button in the sidebar under "Trading Sessions"
- Sessions are automatically named with the current date in EST timezone
- Format: MM.DD.YYYY

## Selecting Sessions

- Click any session in the sidebar to view its trades
- The active session is highlighted in blue
- Only one session can be active at a time

## Deleting Sessions

- Click the trash icon next to any session
- Confirm the deletion (this will delete all trades in that session)
- **Warning**: This action cannot be undone

## Session Tips

- Create a new session each trading day
- Use export to backup sessions before deletion
- Sessions show trade count for quick reference
      `.trim(),
    },
    {
      id: 'trades',
      title: 'Adding & Editing Trades',
      icon: Book,
      content: `
# Adding & Editing Trades

Document your trades quickly and comprehensively.

## Quick Add Trade

Use the "Quick Add Trade" form for fast trade entry:

1. **Ticker**: Asset symbol (required)
2. **Transaction ID**: Optional blockchain transaction reference
3. **Status**: Win or Loss
4. **% Change**: Percentage gain or loss
5. **SOL Change**: Dollar/SOL amount gained or lost
6. **Emotional State**: Select from 5 states:
   - 😡 Rage: Emotional, impulsive trade
   - 😰 Desperation: FOMO or panic-driven
   - 😐 Neutral: Standard trade
   - 😌 Relaxed: Calm, no pressure
   - 🎯 Calculated: Well-planned, strategic
7. **Description**: Quick notes about the trade (required)

## Picture-in-Picture Mode

- Click the pop-out icon in the modal to open PiP mode
- Keep the form floating while you browse other apps
- Toggle "Keep open after adding" to log multiple trades quickly
- Use keyboard shortcuts:
  - **Ctrl/Cmd + Enter**: Submit trade
  - **Ctrl/Cmd + K**: Close PiP window

## Editing Trades

### Quick Edit (Trade List)
- Click the edit icon on any trade card
- Modify basic fields inline
- Click checkmark to save or X to cancel

### Full Edit (Trade Report)
- Click any trade to open the detailed report
- Click "Edit Report" button
- Modify all fields including analysis and reflections
- Click "Save Changes" when done

## Deleting Trades

- Click the trash icon on any trade card
- Confirm deletion
- **Warning**: This cannot be undone
      `.trim(),
    },
    {
      id: 'reflection',
      title: 'Trade Reflection & Analysis',
      icon: HelpCircle,
      content: `
# Trade Reflection & Analysis

The detailed trade report helps you analyze and learn from every trade.

## Report Sections

### Trade Header
- View ticker, transaction ID, and basic metrics
- See emotional state at time of trade
- Upload chart image for visual reference

### What I Did (Actions)
Document specific actions taken:
- Entry and exit points
- Position sizing decisions
- Stop loss placement
- Timing decisions

### Expected vs Actual Outcome
- **Expected**: What you thought would happen
- **Actual**: What actually happened
- Helps identify prediction accuracy

### Reflection & Analysis

**Reflection**
- Key insights from the trade
- What worked or didn't work
- Pattern recognition

**Behavioral Change**
- Specific actions to take differently next time
- Habits to form or break
- Process improvements

## Tips for Effective Reflection

1. **Be Honest**: Document emotions and mistakes
2. **Be Specific**: Avoid vague statements
3. **Focus on Process**: Not just outcomes
4. **Review Regularly**: Look for patterns across trades
5. **Track Progress**: See how your trading evolves

## Using Chart Images

- Upload screenshots of your trade setups
- Reference technical analysis visually
- Compare expected vs actual price action
- Supported formats: JPG, PNG, GIF
      `.trim(),
    },
  ];

  const activeDoc = docSections.find(section => section.id === activeSection);

  return (
    <div className="documentation">
      <div className="docs-header">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Trading
        </button>
        <h1>Documentation</h1>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <h3>Contents</h3>
          <nav className="docs-nav">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`docs-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={18} />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="docs-content">
          {activeDoc && (
            <div className="docs-article">
              <div className="docs-article-content">
                {activeDoc.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index}>{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={index}>{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={index}>{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={index}>{line.replace('- ', '')}</li>;
                  }
                  if (line.match(/^\d+\. /)) {
                    return <li key={index}>{line.replace(/^\d+\. /, '')}</li>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={index}>{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.trim() === '') {
                    return <br key={index} />;
                  }
                  return <p key={index}>{line}</p>;
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
