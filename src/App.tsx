import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Coins,
  Compass,
  HandCoins,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Compass,
    number: '01',
    title: 'Discover opportunities',
    description:
      'Explore earning ideas, useful tasks, and opportunities that match your interests and goals.',
    tone: 'blue',
  },
  {
    icon: ShieldCheck,
    number: '02',
    title: 'Make informed choices',
    description:
      'Understand opportunity details and requirements before deciding what is right for you.',
    tone: 'gold',
  },
  {
    icon: Users,
    number: '03',
    title: 'Grow together',
    description:
      'Build useful skills, learn from others, and take your next step with confidence.',
    tone: 'purple',
  },
];

const highlights = [
  { icon: CheckCircle2, text: 'Clear opportunity information' },
  { icon: ShieldCheck, text: 'A thoughtful, safety-first approach' },
  { icon: TrendingUp, text: 'Built around progress and growth' },
];

function App() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container navbar">
          <a className="brand" href="#home" aria-label="EarnBridge home">
            <span className="brand-mark">
              <HandCoins size={23} strokeWidth={2.2} />
            </span>
            <span className="brand-name">
              Earn<span>Bridge</span>
            </span>
          </a>

          <div className="header-right">
            <span className="header-badge">
              <span className="status-dot" />
              Foundation preview
            </span>
            <a className="header-link" href="#how-it-works">
              Explore <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={15} />
                YOUR NEXT OPPORTUNITY STARTS HERE
              </div>

              <h1>
                Small steps.
                <br />
                Bigger <span>possibilities.</span>
              </h1>

              <p className="hero-description">
                Discover opportunities, explore new possibilities, and build
                your path towards a more rewarding future with EarnBridge.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#opportunities">
                  Explore the vision <ArrowRight size={18} />
                </a>
                <a className="button button-secondary" href="#how-it-works">
                  How it works
                </a>
              </div>

              <div className="trust-note">
                <span className="trust-icon">
                  <ShieldCheck size={17} />
                </span>
                <span>
                  <strong>Built with purpose</strong>
                  <small>Clarity, opportunity, and growth.</small>
                </span>
              </div>
            </div>

            <div className="hero-visual" aria-label="EarnBridge opportunity illustration">
              <div className="visual-halo" />
              <div className="visual-ring visual-ring-one" />
              <div className="visual-ring visual-ring-two" />

              <div className="main-illustration">
                <div className="illustration-top">
                  <span className="mini-brand">
                    <HandCoins size={19} />
                  </span>
                  <span className="illustration-label">YOUR JOURNEY</span>
                  <Sparkles size={18} className="gold-sparkle" />
                </div>

                <div className="illustration-title">
                  <small>Every step counts</small>
                  <h2>Make progress<br />your own way.</h2>
                </div>

                <div className="progress-track">
                  <span />
                </div>

                <div className="illustration-bottom">
                  <span>Opportunity explorer</span>
                  <span className="round-arrow">
                    <ArrowDownRight size={18} />
                  </span>
                </div>

                <div className="illustration-decoration decoration-one">
                  <Coins size={25} />
                </div>
                <div className="illustration-decoration decoration-two">
                  <Target size={24} />
                </div>
              </div>

              <div className="floating-card floating-card-top">
                <span className="float-icon float-icon-gold">
                  <Zap size={19} />
                </span>
                <span>
                  <strong>New possibilities</strong>
                  <small>Your next step begins here</small>
                </span>
              </div>

              <div className="floating-card floating-card-bottom">
                <span className="float-icon float-icon-blue">
                  <TrendingUp size={20} />
                </span>
                <span>
                  <strong>Progress that matters</strong>
                  <small>Learn. Explore. Grow.</small>
                </span>
                <BadgeCheck className="verified-icon" size={19} />
              </div>
            </div>
          </div>

          <div className="container hero-bottom">
            <span>OPPORTUNITY</span>
            <span className="hero-bottom-line" />
            <span>KNOWLEDGE</span>
            <span className="hero-bottom-line" />
            <span>PROGRESS</span>
          </div>
        </section>

        <section className="features-section" id="opportunities">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <Sparkles size={14} /> THE EARNBRIDGE APPROACH
                </div>
                <h2>A smarter way to<br />explore what's possible.</h2>
              </div>
              <p>
                Your journey should begin with clarity. We're building a
                foundation that puts informed decisions and meaningful
                progress first.
              </p>
            </div>

            <div className="feature-grid">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article className="feature-card" key={feature.number}>
                    <div className="feature-card-top">
                      <span className={`feature-icon ${feature.tone}`}>
                        <Icon size={24} strokeWidth={1.9} />
                      </span>
                      <span className="feature-number">{feature.number}</span>
                    </div>

                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>

                    <div className="feature-card-footer">
                      <span>Discover more</span>
                      <span className="feature-arrow">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="journey-section" id="how-it-works">
          <div className="container">
            <div className="journey-card">
              <div className="journey-content">
                <span className="stage-label">
                  <span className="stage-dot" />
                  STAGE 01 · THE FOUNDATION
                </span>

                <h2>Built one step<br />at a time.</h2>

                <p>
                  We're laying the groundwork for a platform that helps people
                  discover opportunities and make more informed decisions.
                </p>

                <div className="journey-checklist">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="checklist-item" key={item.text}>
                        <Icon size={18} />
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="journey-visual">
                <div className="journey-orbit orbit-one" />
                <div className="journey-orbit orbit-two" />

                <div className="journey-emblem">
                  <HeartHandshake size={43} strokeWidth={1.6} />
                </div>

                <div className="journey-mini-card">
                  <span className="journey-mini-icon">
                    <CheckCircle2 size={20} />
                  </span>
                  <span>
                    <strong>Foundation UI</strong>
                    <small>Stage 1 · In progress</small>
                  </span>
                </div>

                <div className="journey-caption">
                  <span className="caption-line" />
                  <span>THE JOURNEY STARTS HERE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="container closing-card">
            <div className="closing-icon">
              <Wallet size={26} />
            </div>
            <div className="closing-copy">
              <span>THE FUTURE WE'RE BUILDING</span>
              <h2>Make your next step count.</h2>
              <p>
                EarnBridge is being developed with a simple idea: opportunity
                should be easier to explore and understand.
              </p>
            </div>
            <a className="closing-link" href="#home" aria-label="Back to top">
              <ChevronRight size={22} />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand-block">
            <a className="brand footer-brand" href="#home">
              <span className="brand-mark footer-mark">
                <HandCoins size={20} />
              </span>
              <span className="brand-name">
                Earn<span>Bridge</span>
              </span>
            </a>
            <p>Earn Small. Grow Together.</p>
          </div>

          <div className="footer-divider" />

          <div className="footer-company">
            <span className="footer-company-label">A PRODUCT BY</span>
            <strong>Ayanfe Innovation Labs Limited</strong>
            <span className="footer-copyright">
              Designed for progress. Built with purpose.
            </span>
          </div>

          <a className="back-to-top" href="#home">
            Back to top <ArrowRight size={15} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
