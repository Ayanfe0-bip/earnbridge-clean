import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CheckCircle2,
  Compass,
  HandCoins,
  HeartHandshake,
  BadgeCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
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

const benefits = [
  'Clear opportunity information',
  'A safety-first approach',
  'Built around progress and growth',
];

function App() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container navbar">
          <a className="brand" href="#home" aria-label="EarnBridge home">
            <span className="brand-mark">
              <HandCoins size={23} />
            </span>
            <span className="brand-name">
              Earn<span>Bridge</span>
            </span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#home" className="nav-active">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-right">
            <span className="header-badge">
              <span className="status-dot" />
              Foundation Preview
            </span>
            <a className="header-cta" href="#features">
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
                <span className="eyebrow-line" />
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
                <a className="button button-primary" href="#features">
                  <Sparkles size={17} />
                  Explore Opportunities
                  <ArrowRight size={17} />
                </a>
                <a className="button button-secondary" href="#how-it-works">
                  <span className="play-icon">▶</span>
                  How It Works
                </a>
              </div>

              <div className="trust-note">
                <span className="trust-icon">
                  <ShieldCheck size={24} />
                </span>
                <span>
                  <strong>Built with purpose</strong>
                  <small>Clarity, opportunity, and growth.</small>
                </span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="photo-backdrop" />
              <div className="photo-frame">
                <img
                  className="hero-person"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85"
                  alt="Smiling young man representing the EarnBridge community"
                />
                <div className="photo-caption">
                  <span className="caption-check">
                    <CheckCircle2 size={17} />
                  </span>
                  <span>
                    <strong>Your journey matters</strong>
                    <small>Learn. Explore. Grow.</small>
                  </span>
                </div>
              </div>

              <div className="floating-card notification-one">
                <span className="notification-icon icon-gold">
                  <Sparkles size={19} />
                </span>
                <span className="notification-copy">
                  <strong>Reward example</strong>
                  <small>Imagine completing your first task.</small>
                </span>
                <span className="notification-time">Now</span>
              </div>

              <div className="floating-card notification-two">
                <span className="notification-icon icon-blue">
                  <Bell size={19} />
                </span>
                <span className="notification-copy">
                  <strong>New opportunity</strong>
                  <small>Explore something that suits you.</small>
                </span>
                <span className="notification-time">New</span>
              </div>

              <div className="hero-note">
                <span>Real opportunities.</span>
                <strong>Real growth.</strong>
                <span className="hero-note-line" />
              </div>

              <div className="visual-sparkle sparkle-one">✦</div>
              <div className="visual-sparkle sparkle-two">✧</div>
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

        <section className="features-section" id="features">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-line" />
                  THE EARNBRIDGE APPROACH
                </div>
                <h2>
                  A smarter way to
                  <br />
                  explore what's possible.
                </h2>
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
                        <Icon size={25} strokeWidth={1.9} />
                      </span>
                      <span className="feature-number">{feature.number}</span>
                    </div>

                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>

                    <div className="feature-card-footer">
                      <span>Explore the vision</span>
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
                  STAGE 01 · FOUNDATION
                </span>

                <h2>
                  Built one step
                  <br />
                  at a time.
                </h2>

                <p>
                  We're laying the groundwork for a platform that helps people
                  discover opportunities and make more informed decisions.
                </p>

                <a className="button button-primary journey-button" href="#about">
                  Learn More <ArrowRight size={17} />
                </a>
              </div>

              <div className="journey-checklist">
                {benefits.map((benefit) => (
                  <div className="checklist-item" key={benefit}>
                    <CheckCircle2 size={19} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="journey-visual">
                <div className="journey-orbit orbit-one" />
                <div className="journey-orbit orbit-two" />

                <div className="journey-phone">
                  <div className="phone-speaker" />
                 <div className="phone-brand">
                    <Wallet size={17} />
                    EarnBridge
                     </div> 
                  <div className="phone-message">
                    <span className="phone-message-icon">
                      <Sparkles size={20} />
                    </span>
                    <span>
                      <small>YOUR NEXT STEP</small>
                      <strong>Opportunity awaits</strong>
                    </span>
                  </div>
                  <div className="phone-balance">
                    <small>Your progress</small>
                    <strong>One step at a time</strong>
                    <div className="phone-progress">
                      <span />
                    </div>
                  </div>
                  <div className="phone-bottom-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="coin-decoration">₦</div>
                <span className="journey-star star-one">✦</span>
                <span className="journey-star star-two">✧</span>
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section" id="about">
          <div className="container closing-card">
            <div className="closing-emblem">
              <HeartHandshake size={35} />
            </div>

            <div className="closing-copy">
              <span>THE FUTURE WE'RE BUILDING</span>
              <h2>
                Make your next step count.
              </h2>
              <p>
                EarnBridge is being developed with a simple idea: opportunity
                should be easier to explore and understand.
              </p>
            </div>

            <div className="closing-benefits">
              <div>
                <span className="closing-benefit-icon">
                  <Users size={20} />
                </span>
                <span>
                  <strong>Build valuable skills</strong>
                  <small>Learn and grow</small>
                </span>
              </div>
              <div>
                <span className="closing-benefit-icon">
                  <Target size={20} />
                </span>
                <span>
                  <strong>Explore opportunities</strong>
                  <small>Find what fits you</small>
                </span>
              </div>
              <div>
                <span className="closing-benefit-icon">
                  <TrendingUp size={20} />
                </span>
                <span>
                  <strong>Create a better future</strong>
                  <small>Step by step</small>
                </span>
              </div>
            </div>
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

          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div className="footer-company">
            <span className="footer-company-label">
              <ShieldCheck size={18} /> A PRODUCT BY
            </span>
            <strong>Ayanfe Innovation Labs Limited</strong>
            <span className="footer-copyright">
              © 2026 EarnBridge. Built with purpose.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
