import {
ArrowRight,
CheckCircle2,
HandCoins,
ShieldCheck,
Sparkles,
Users,
} from 'lucide-react';

const features = [
{
icon: HandCoins,
title: 'Discover opportunities',
description:
'Explore microtasks, affiliate offers, and other earning opportunities in one place.',
},
{
icon: ShieldCheck,
title: 'Make informed choices',
description:
'Review opportunity details and requirements before deciding whether to participate.',
},
{
icon: Users,
title: 'Grow together',
description:
'Build useful skills, share knowledge, and make progress at your own pace.',
},
];

function App() {
return (
<main className="page-shell">
<header className="topbar">
<a className="brand" href="/" aria-label="EarnBridge home">
<span className="brand-mark">
<HandCoins size={23} strokeWidth={2.4} />
</span>
<span>
Earn<span className="brand-accent">Bridge</span>
</span>
</a>

    <span className="status-pill">
      <span className="status-dot" />
      Foundation preview
    </span>
  </header>

  <section className="hero">
    <div className="hero-copy">
      <div className="eyebrow">
        <Sparkles size={15} />
        YOUR NEXT OPPORTUNITY STARTS HERE
      </div>

      <h1>
        Earn small.
        <br />
        <span>Grow together.</span>
      </h1>

      <p className="hero-description">
        A simpler way to discover microtasks, affiliate opportunities,
        and practical ways to keep moving forward.
      </p>

      <a className="primary-button" href="#how-it-works">
        Explore the vision <ArrowRight size={18} />
      </a>

      <div className="trust-note">
        <CheckCircle2 size={16} />
        Built for a clear, mobile-friendly experience
      </div>
    </div>

    <div className="hero-art" aria-label="EarnBridge opportunity overview">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />

      <div className="floating-card card-top">
        <span className="mini-icon">
          <Sparkles size={17} />
        </span>
        <span>
          <strong>New possibilities</strong>
          <small>One step at a time</small>
        </span>
      </div>

      <div className="main-illustration">
        <div className="illustration-circle">
          <HandCoins size={72} strokeWidth={1.45} />
        </div>
        <div className="illustration-line line-one" />
        <div className="illustration-line line-two" />
        <div className="illustration-line line-three" />
      </div>

      <div className="floating-card card-bottom">
        <span className="mini-icon mini-icon-gold">
          <ShieldCheck size={18} />
        </span>
        <span>
          <strong>Choose wisely</strong>
          <small>Check every opportunity</small>
        </span>
      </div>

      <div className="decor decor-one">+</div>
      <div className="decor decor-two">✳</div>
    </div>
  </section>

  <section className="features-section" id="how-it-works">
    <div className="section-heading">
      <span className="section-kicker">THE EARNBRIDGE APPROACH</span>
      <h2>A solid start for your next step.</h2>
      <p>
        We're laying the foundation before adding accounts, dashboards,
        and live opportunities.
      </p>
    </div>

    <div className="feature-grid">
      {features.map(({ icon: Icon, title, description }, index) => (
        <article className="feature-card" key={title}>
          <div className={index === 1 ? 'feature-icon gold' : 'feature-icon'}>
            <Icon size={23} />
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  </section>

  <section className="next-step">
    <div>
      <span className="section-kicker">BUILT ONE STEP AT A TIME</span>
      <h2>Start with a stable foundation.</h2>
      <p>
        Account access and the user dashboard will be added after the
        base app is verified.
      </p>
    </div>

    <div className="next-step-badge">
      <CheckCircle2 size={20} />
      <span>
        <strong>Stage 1</strong>
        <small>Foundation UI</small>
      </span>
    </div>
  </section>

  <footer className="footer">
    <a className="brand footer-brand" href="/">
      <span className="brand-mark">
        <HandCoins size={19} />
      </span>
      <span>
        Earn<span className="brand-accent">Bridge</span>
      </span>
    </a>

    <p>Created by Ayanfe Innovation Labs Limited</p>
    <span>Earn Small. Grow Together.</span>
  </footer>
</main>

);
}

export default App;
