import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
Activity,
ArrowDownToLine,
ArrowRight,
BadgeCheck,
BriefcaseBusiness,
CheckCircle2,
CircleHelp,
Clock3,
Coins,
FileText,
House,
LogOut,
Menu,
Search,
ShieldCheck,
Sparkles,
UserRound,
Wallet,
X,
} from 'lucide-react';
import './WorkerDashboard.css';

type DashboardProps = {
user: User;
onSignOut: () => void | Promise<void>;
};

type PageName =
| 'Overview'
| 'Find Tasks'
| 'My Tasks'
| 'Earnings'
| 'Profile'
| 'Help & Support';

const navigation: {
name: PageName;
icon: typeof House;
}[] = [
{ name: 'Overview', icon: House },
{ name: 'Find Tasks', icon: Search },
{ name: 'My Tasks', icon: BriefcaseBusiness },
{ name: 'Earnings', icon: Wallet },
{ name: 'Profile', icon: UserRound },
{ name: 'Help & Support', icon: CircleHelp },
];

const money = (amount: number) =>
new Intl.NumberFormat('en-NG', {
style: 'currency',
currency: 'NGN',
maximumFractionDigits: 2,
}).format(amount);

export default function WorkerDashboard({
user,
onSignOut,
}: DashboardProps) {
const [activePage, setActivePage] = useState<PageName>('Overview');
const [sidebarOpen, setSidebarOpen] = useState(false);
const [signingOut, setSigningOut] = useState(false);

const fullName =
user.user_metadata?.full_name ||
user.user_metadata?.name ||
user.email?.split('@')[0] ||
'Worker';

const initials = fullName
.split(/\s+/)
.filter(Boolean)
.slice(0, 2)
.map((part: string) => part[0])
.join('')
.toUpperCase();

async function handleSignOut() {
if (signingOut) return;

setSigningOut(true);

try {
  await onSignOut();
} finally {
  setSigningOut(false);
}

}

function openPage(page: PageName) {
setActivePage(page);
setSidebarOpen(false);
}

function renderOverview() {
return (
<>
<section className="eb-welcome">
<div className="eb-welcome-copy">
<span className="eb-eyebrow">
<Sparkles size={15} /> YOUR EARNING JOURNEY
</span>

        <h2>Welcome, {fullName.split(' ')[0]}!</h2>

        <p>
          Your next opportunity starts here. Explore useful tasks,
          build your skills, and grow at your own pace.
        </p>

        <button
          className="eb-primary-button"
          onClick={() => openPage('Find Tasks')}
        >
          Explore opportunities <ArrowRight size={17} />
        </button>
      </div>

      <div className="eb-welcome-art" aria-hidden="true">
        <div className="eb-art-circle">
          <Wallet size={53} strokeWidth={1.5} />
        </div>
        <Sparkles className="eb-art-sparkle" size={23} />
        <Coins className="eb-art-coins" size={30} />
      </div>
    </section>

    <section className="eb-stats-grid">
      <article className="eb-stat-card">
        <span className="eb-stat-icon eb-icon-blue">
          <Wallet size={21} />
        </span>
        <p>Available balance</p>
        <h3>{money(0)}</h3>
        <span className="eb-stat-note">Approved rewards only</span>
      </article>

      <article className="eb-stat-card">
        <span className="eb-stat-icon eb-icon-green">
          <CheckCircle2 size={21} />
        </span>
        <p>Completed tasks</p>
        <h3>0</h3>
        <span className="eb-stat-note">Your completed work</span>
      </article>

      <article className="eb-stat-card">
        <span className="eb-stat-icon eb-icon-purple">
          <Clock3 size={21} />
        </span>
        <p>Pending reviews</p>
        <h3>0</h3>
        <span className="eb-stat-note">Awaiting approval</span>
      </article>

      <article className="eb-stat-card">
        <span className="eb-stat-icon eb-icon-orange">
          <ArrowDownToLine size={21} />
        </span>
        <p>Total withdrawn</p>
        <h3>{money(0)}</h3>
        <span className="eb-stat-note">Confirmed payouts only</span>
      </article>
    </section>

    <section className="eb-content-card eb-opportunity-card">
      <div className="eb-section-heading">
        <div>
          <h3>Find your next opportunity</h3>
          <p>Discover work you can do with your skills.</p>
        </div>
        <span className="eb-heading-icon">
          <BriefcaseBusiness size={22} />
        </span>
      </div>

      <div className="eb-empty-state">
        <div className="eb-empty-icon">
          <Search size={28} />
        </div>
        <h4>The task marketplace is being prepared</h4>
        <p>
          We're working on a marketplace for legitimate tasks
          funded by real clients and task providers. Available
          tasks and rewards will appear here when they're ready.
        </p>
        <button
          className="eb-secondary-button"
          onClick={() => openPage('Find Tasks')}
        >
          View task marketplace <ArrowRight size={16} />
        </button>
      </div>
    </section>

    <section className="eb-notice">
      <ShieldCheck size={22} />
      <div>
        <strong>Your account, your work, your rewards.</strong>
        <p>
          EarnBridge will not ask you to pay a registration fee
          to unlock tasks. Rewards should only be recorded when
          genuine work is reviewed and approved.
        </p>
      </div>
    </section>
  </>
);

}

function renderPageContent() {
switch (activePage) {
case 'Overview':
return renderOverview();

  case 'Find Tasks':
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>Find Tasks</h3>
            <p>Explore opportunities that match your skills.</p>
          </div>
          <Search size={23} />
        </div>

        <div className="eb-empty-state">
          <div className="eb-empty-icon">
            <BriefcaseBusiness size={28} />
          </div>
          <h4>We're preparing the task marketplace</h4>
          <p>
            Future opportunities may include writing, research,
            data entry, graphic design, website testing, and
            helping local businesses organise their products.
          </p>
          <p>
            No tasks are currently available through this
            dashboard. Please check back when the marketplace
            launches.
          </p>
        </div>
      </section>
    );

  case 'My Tasks':
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>My Tasks</h3>
            <p>Track work you've accepted and submitted.</p>
          </div>
          <FileText size={23} />
        </div>

        <div className="eb-empty-state">
          <div className="eb-empty-icon">
            <FileText size={28} />
          </div>
          <h4>No task submissions yet</h4>
          <p>
            When the task system is available, you'll be able
            to track accepted tasks, submit your work, and see
            review decisions here.
          </p>
        </div>
      </section>
    );

  case 'Earnings':
    return (
      <>
        <section className="eb-stats-grid eb-earnings-grid">
          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-blue">
              <Wallet size={21} />
            </span>
            <p>Available balance</p>
            <h3>{money(0)}</h3>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-orange">
              <Clock3 size={21} />
            </span>
            <p>Pending rewards</p>
            <h3>{money(0)}</h3>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-green">
              <ArrowDownToLine size={21} />
            </span>
            <p>Total withdrawn</p>
            <h3>{money(0)}</h3>
          </article>
        </section>

        <section className="eb-content-card">
          <div className="eb-section-heading">
            <div>
              <h3>Earnings & withdrawals</h3>
              <p>Review your rewards and payout history.</p>
            </div>
            <Coins size={23} />
          </div>

          <div className="eb-empty-state">
            <div className="eb-empty-icon">
              <Wallet size={28} />
            </div>
            <h4>Your earnings record starts here</h4>
            <p>
              No rewards or withdrawals have been recorded.
              Real balances and withdrawals will require a
              connected, properly secured payment system and
              funded, approved tasks.
            </p>
          </div>
        </section>
      </>
    );

  case 'Profile':
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>Your Profile</h3>
            <p>View your current account information.</p>
          </div>
          <UserRound size={23} />
        </div>

        <div className="eb-profile-header">
          <div className="eb-avatar eb-profile-avatar">
            {initials || 'W'}
          </div>
          <div>
            <h4>{fullName}</h4>
            <p>EarnBridge worker account</p>
            <span className="eb-account-badge">
              <BadgeCheck size={14} /> Registered account
            </span>
          </div>
        </div>

        <div className="eb-profile-details">
          <div className="eb-profile-field">
            <span>Full name</span>
            <strong>{fullName}</strong>
          </div>
          <div className="eb-profile-field">
            <span>Email address</span>
            <strong>{user.email || 'Not available'}</strong>
          </div>
          <div className="eb-profile-field">
            <span>Account ID</span>
            <strong className="eb-account-id">{user.id}</strong>
          </div>
          <div className="eb-profile-field">
            <span>Email verification</span>
            <strong>
              {user.email_confirmed_at ? 'Verified' : 'Not confirmed'}
            </strong>
          </div>
        </div>

        <p className="eb-profile-note">
          Profile editing, phone number, and payout details
          will be added after the secure profile system is built.
        </p>
      </section>
    );

  case 'Help & Support':
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>Help & Support</h3>
            <p>Important information about using EarnBridge.</p>
          </div>
          <CircleHelp size={23} />
        </div>

        <div className="eb-help-list">
          <article className="eb-help-item">
            <ShieldCheck size={23} />
            <div>
              <h4>Is registration free?</h4>
              <p>
                EarnBridge is designed to let workers register
                without paying a fee to unlock earning tasks.
              </p>
            </div>
          </article>

          <article className="eb-help-item">
            <Coins size={23} />
            <div>
              <h4>When can I earn?</h4>
              <p>
                Earnings depend on real tasks becoming available,
                completing the requirements, and getting your
                submitted work approved.
              </p>
            </div>
          </article>

          <article className="eb-help-item">
            <Wallet size={23} />
            <div>
              <h4>Can I withdraw money now?</h4>
              <p>
                The payout system is not active yet. No payout
                should be promised until funding and payment
                processing have been implemented and tested.
              </p>
            </div>
          </article>

          <article className="eb-help-item">
            <ShieldCheck size={23} />
            <div>
              <h4>How do I stay safe?</h4>
              <p>
                Never share your password or authentication
                codes. Be cautious of anyone asking you to pay
                money to unlock a supposed reward.
              </p>
            </div>
          </article>
        </div>
      </section>
    );
}

}

return (
<div className="eb-dashboard">
{sidebarOpen && (
<button
className="eb-mobile-overlay"
aria-label="Close navigation"
onClick={() => setSidebarOpen(false)}
/>
)}

  <aside className={`eb-sidebar ${sidebarOpen ? 'eb-sidebar-open' : ''}`}>
    <div className="eb-brand">
      <div className="eb-brand-mark">
        <Activity size={23} />
      </div>
      <div>
        <strong>EarnBridge</strong>
        <span>Opportunities for everyone</span>
      </div>
      <button
        className="eb-close-sidebar"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={21} />
      </button>
    </div>

    <div className="eb-nav-label">WORKSPACE</div>

    <nav className="eb-navigation" aria-label="Main navigation">
      {navigation.map(({ name, icon: Icon }) => (
        <button
          key={name}
          className={`eb-nav-item ${activePage === name ? 'eb-nav-active' : ''}`}
          onClick={() => openPage(name)}
          aria-current={activePage === name ? 'page' : undefined}
        >
          <Icon size={19} />
          <span>{name}</span>
          {activePage === name && (
            <span className="eb-nav-indicator" />
          )}
        </button>
      ))}
    </nav>

    <div className="eb-sidebar-bottom">
      <div className="eb-sidebar-tip">
        <Sparkles size={20} />
        <strong>Build your future</strong>
        <p>Keep learning and look for opportunities to grow.</p>
      </div>

      <button
        className="eb-signout-button"
        onClick={handleSignOut}
        disabled={signingOut}
      >
        <LogOut size={19} />
        {signingOut ? 'Signing out...' : 'Sign out'}
      </button>

      <p className="eb-sidebar-footer">
        © {new Date().getFullYear()} EarnBridge
      </p>
    </div>
  </aside>

  <main className="eb-main">
    <header className="eb-topbar">
      <button
        className="eb-menu-button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={23} />
      </button>

      <div className="eb-breadcrumb">
        <span>Workspace</span>
        <span className="eb-breadcrumb-divider">/</span>
        <strong>{activePage}</strong>
      </div>

      <div className="eb-topbar-actions">
        <span className="eb-topbar-status">
          <span className="eb-status-dot" />
          Account active
        </span>
        <div className="eb-avatar">{initials || 'W'}</div>
      </div>
    </header>

    <div className="eb-page-content">
      <div className="eb-page-title">
        <div>
          <h1>{activePage}</h1>
          <p>
            {activePage === 'Overview'
              ? 'Your personal workspace for tasks and opportunities.'
              : `Manage your ${activePage.toLowerCase()} information.`}
          </p>
        </div>
        <span className="eb-page-date">
          <Clock3 size={15} />
          Worker workspace
        </span>
      </div>

      {renderPageContent()}

      <footer className="eb-dashboard-footer">
        <span>EarnBridge · Start building your next opportunity.</span>
        <span>Created by Ayanfe Innovation Labs Limited</span>
      </footer>
    </div>
  </main>
</div>

);
  }
