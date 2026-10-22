import { useEffect, useMemo, useState } from 'react';
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
import { supabase } from './lib/supabase';
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

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  reward_kobo: number;
  estimated_minutes: number;
  deadline: string | null;
  status: 'draft' | 'open' | 'closed';
  is_demo: boolean;
  created_at: string;
};

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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All categories');
  const [showPracticeTasks, setShowPracticeTasks] = useState(true);

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

  useEffect(() => {
    if (activePage !== 'Find Tasks') return;

    let cancelled = false;

    async function loadTasks() {
      if (!supabase) {
        setTasksError(
          'The database connection is not configured. Please contact support.'
        );
        setTasks([]);
        return;
      }

      setTasksLoading(true);
      setTasksError('');

      const { data, error } = await supabase
        .from('tasks')
        .select(
          'id, title, description, category, reward_kobo, estimated_minutes, deadline, status, is_demo, created_at'
        )
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error('EarnBridge task loading failed:', error);
        setTasksError(
          'We could not load tasks. Please try again.'
        );
        setTasks([]);
      } else {
        setTasks((data ?? []) as Task[]);
      }

      setTasksLoading(false);
    }

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, [activePage]);

  const categories = useMemo(
    () => [
      'All categories',
      ...Array.from(
        new Set(tasks.map((task) => task.category))
      ).sort(),
    ],
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All categories' ||
        task.category === selectedCategory;

      const matchesDemo =
        showPracticeTasks || !task.is_demo;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDemo
      );
    });
  }, [
    tasks,
    searchText,
    selectedCategory,
    showPracticeTasks,
  ]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await onSignOut();
    } catch (error) {
      console.error('Sign out failed:', error);
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
              <Sparkles size={15} />
              YOUR EARNING JOURNEY
            </span>

            <h2>
              Welcome, {fullName.split(' ')[0]}!
            </h2>

            <p>
              Your next opportunity starts here. Explore useful
              tasks, build your skills, and grow at your own pace.
            </p>

            <button
              className="eb-primary-button"
              onClick={() => openPage('Find Tasks')}
            >
              Explore opportunities
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="eb-welcome-art" aria-hidden="true">
            <div className="eb-art-circle">
              <Wallet size={53} strokeWidth={1.5} />
            </div>
            <Sparkles
              className="eb-art-sparkle"
              size={23}
            />
            <Coins
              className="eb-art-coins"
              size={30}
            />
          </div>
        </section>

        <section className="eb-stats-grid">
          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-blue">
              <Wallet size={21} />
            </span>
            <p>Available balance</p>
            <h3>{money(0)}</h3>
            <span className="eb-stat-note">
              Approved rewards only
            </span>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-green">
              <CheckCircle2 size={21} />
            </span>
            <p>Completed tasks</p>
            <h3>0</h3>
            <span className="eb-stat-note">
              Your completed work
            </span>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-purple">
              <Clock3 size={21} />
            </span>
            <p>Pending reviews</p>
            <h3>0</h3>
            <span className="eb-stat-note">
              Awaiting approval
            </span>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-orange">
              <ArrowDownToLine size={21} />
            </span>
            <p>Total withdrawn</p>
            <h3>{money(0)}</h3>
            <span className="eb-stat-note">
              Confirmed payouts only
            </span>
          </article>
        </section>

        <section className="eb-content-card eb-opportunity-card">
          <div className="eb-section-heading">
            <div>
              <h3>Find your next opportunity</h3>
              <p>
                Discover work you can do with your skills.
              </p>
            </div>
            <span className="eb-heading-icon">
              <BriefcaseBusiness size={22} />
            </span>
          </div>

          <div className="eb-empty-state">
            <div className="eb-empty-icon">
              <Search size={28} />
            </div>
            <h4>Explore the task marketplace</h4>
            <p>
              Browse tasks, read their requirements, and
              develop useful skills. Demonstration tasks are
              for practice and do not generate withdrawable
              rewards.
            </p>
            <button
              className="eb-secondary-button"
              onClick={() => openPage('Find Tasks')}
            >
              View task marketplace
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="eb-notice">
          <ShieldCheck size={22} />
          <div>
            <strong>
              Your account, your work, your rewards.
            </strong>
            <p>
              EarnBridge does not require a registration fee
              to unlock tasks. Rewards should only be recorded
              after genuine work is reviewed and approved.
            </p>
          </div>
        </section>
      </>
    );
  }

  function renderFindTasks() {
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>Find Tasks</h3>
            <p>
              Browse available tasks from the marketplace.
            </p>
          </div>
          <Search size={23} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <label
            htmlFor="eb-task-search"
            style={{ fontWeight: 700, fontSize: 12 }}
          >
            Search tasks
          </label>

          <input
            id="eb-task-search"
            type="search"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search writing, research, data entry..."
            style={{
              width: '100%',
              minHeight: 44,
              padding: '10px 13px',
              border: '1px solid #dce5f2',
              borderRadius: 9,
              font: 'inherit',
              background: '#fff',
              color: '#172033',
              boxSizing: 'border-box',
            }}
          />

          <label
            htmlFor="eb-task-category"
            style={{ fontWeight: 700, fontSize: 12 }}
          >
            Filter by category
          </label>

          <select
            id="eb-task-category"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            style={{
              width: '100%',
              minHeight: 44,
              padding: '10px 13px',
              border: '1px solid #dce5f2',
              borderRadius: 9,
              font: 'inherit',
              background: '#fff',
              color: '#172033',
              boxSizing: 'border-box',
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 12,
            }}
          >
            <input
              type="checkbox"
              checked={showPracticeTasks}
              onChange={(event) =>
                setShowPracticeTasks(event.target.checked)
              }
            />
            Show demonstration practice tasks
          </label>
        </div>

        {tasksLoading && (
          <div className="eb-empty-state" role="status">
            <div className="eb-empty-icon">
              <Clock3 size={28} />
            </div>
            <h4>Loading tasks...</h4>
            <p>
              Connecting to the EarnBridge marketplace.
            </p>
          </div>
        )}

        {!tasksLoading && tasksError && (
          <div className="eb-empty-state" role="alert">
            <div className="eb-empty-icon">
              <CircleHelp size={28} />
            </div>
            <h4>We couldn't load the tasks</h4>
            <p>{tasksError}</p>
            <button
              className="eb-secondary-button"
              onClick={() => {
                setActivePage('Overview');
                window.setTimeout(
                  () => setActivePage('Find Tasks'),
                  0
                );
              }}
            >
              Try again <ArrowRight size={16} />
            </button>
          </div>
        )}

        {!tasksLoading &&
          !tasksError &&
          filteredTasks.length === 0 && (
            <div className="eb-empty-state">
              <div className="eb-empty-icon">
                <Search size={28} />
              </div>
              <h4>
                {tasks.length === 0
                  ? 'No open tasks found'
                  : 'No tasks match your search'}
              </h4>
              <p>
                {tasks.length === 0
                  ? 'There are no open tasks to display right now.'
                  : 'Try a different search term or category.'}
              </p>
            </div>
          )}

        {!tasksLoading &&
          !tasksError &&
          filteredTasks.length > 0 && (
            <>
              <p
                style={{
                  color: '#748094',
                  fontSize: 11,
                  margin: '0 0 14px',
                }}
              >
                {filteredTasks.length} task
                {filteredTasks.length === 1 ? '' : 's'} found
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                  gap: 14,
                }}
              >
                {filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    style={{
                      minWidth: 0,
                      padding: 17,
                      border: '1px solid #e8edf4',
                      borderRadius: 12,
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '5px 9px',
                        color: '#1d4ed8',
                        background: '#eff6ff',
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {task.category}
                    </span>

                    {task.is_demo && (
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '5px 9px',
                          color: '#92400e',
                          background: '#fef3c7',
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        PRACTICE TASK · NO CASH REWARD
                      </span>
                    )}

                    <h4
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: 1.5,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {task.title}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        color: '#748094',
                        fontSize: 12,
                        lineHeight: 1.8,
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {task.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        marginTop: 'auto',
                        paddingTop: 8,
                        color: '#526176',
                        fontSize: 11,
                      }}
                    >
                      <span>
                        <Clock3
                          size={13}
                          style={{
                            display: 'inline',
                            verticalAlign: 'middle',
                            marginRight: 4,
                          }}
                        />
                        {task.estimated_minutes} minutes
                      </span>

                      <span>
                        {task.deadline
                          ? `Deadline: ${new Date(
                              task.deadline
                            ).toLocaleDateString('en-NG')}`
                          : 'No deadline set'}
                      </span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        paddingTop: 12,
                        borderTop: '1px solid #e8edf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: 'block',
                            color: '#748094',
                            fontSize: 10,
                          }}
                        >
                          {task.is_demo
                            ? 'Example amount'
                            : 'Listed reward'}
                        </span>
                        <strong
                          style={{
                            color: '#172033',
                            fontSize: 18,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {money(
                            Number(task.reward_kobo) / 100
                          )}
                        </strong>
                      </div>

                      <span
                        style={{
                          padding: '7px 10px',
                          color: '#526176',
                          background: '#f1f5f9',
                          borderRadius: 8,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {task.is_demo
                          ? 'For practice'
                          : 'Details coming soon'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

        <div
          style={{
            marginTop: 20,
            padding: 13,
            borderRadius: 9,
            background: '#fffbeb',
            color: '#92400e',
            fontSize: 11,
            lineHeight: 1.8,
          }}
        >
          <strong>Important:</strong> Demonstration tasks are
          examples for testing the marketplace. Their displayed
          amounts are not funded rewards and cannot be withdrawn.
          A task appearing in the database does not by itself
          guarantee payment.
        </div>
      </section>
    );
  }

    function renderPageContent() {
    switch (activePage) {
      case 'Overview':
        return renderOverview();

      case 'Find Tasks':
        return renderFindTasks();

      case 'My Tasks':
        return (
          <section className="eb-content-card">
            <div className="eb-section-heading">
              <div>
                <h3>My Tasks</h3>
                <p>
                  Track your accepted and submitted work.
                </p>
              </div>
              <FileText size={23} />
            </div>

            <div className="eb-empty-state">
              <div className="eb-empty-icon">
                <FileText size={28} />
              </div>
              <h4>Task submissions are coming next</h4>
              <p>
                The marketplace currently displays available
                tasks. Accepting tasks and submitting work will
                be added after the submission workflow is built.
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
                  <p>
                    Review your rewards and payout history.
                  </p>
                </div>
                <Coins size={23} />
              </div>

              <div className="eb-empty-state">
                <div className="eb-empty-icon">
                  <Wallet size={28} />
                </div>
                <h4>No rewards have been recorded</h4>
                <p>
                  The wallet and payout systems are not active
                  yet. Demonstration task amounts are not real
                  earnings.
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
                <p>Your current account information.</p>
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
                  <BadgeCheck size={14} />
                  Registered account
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
                <span>Email verification</span>
                <strong>
                  {user.email_confirmed_at
                    ? 'Verified'
                    : 'Not confirmed'}
                </strong>
              </div>
            </div>

            <p className="eb-profile-note">
              Profile editing, phone number, and payout details
              will be added after the secure profile system is
              built.
            </p>
          </section>
        );

      case 'Help & Support':
        return (
          <section className="eb-content-card">
            <div className="eb-section-heading">
              <div>
                <h3>Help & Support</h3>
                <p>
                  Important information about EarnBridge.
                </p>
              </div>
              <CircleHelp size={23} />
            </div>

            <div className="eb-help-list">
              <article className="eb-help-item">
                <ShieldCheck size={23} />
                <div>
                  <h4>Is registration free?</h4>
                  <p>
                    Workers should not have to pay a fee to
                    unlock tasks.
                  </p>
                </div>
              </article>

              <article className="eb-help-item">
                <Coins size={23} />
                <div>
                  <h4>When can I earn?</h4>
                  <p>
                    Real earnings depend on genuine tasks,
                    completed requirements, review, and funding.
                  </p>
                </div>
              </article>

              <article className="eb-help-item">
                <Wallet size={23} />
                <div>
                  <h4>Can I withdraw money now?</h4>
                  <p>
                    The payout system is not active. No
                    withdrawals should be promised before it
                    is implemented.
                  </p>
                </div>
              </article>

              <article className="eb-help-item">
                <ShieldCheck size={23} />
                <div>
                  <h4>How do I stay safe?</h4>
                  <p>
                    Never share your password or authentication
                    codes. Be cautious of anyone demanding
                    payment to unlock a supposed reward.
                  </p>
                </div>
              </article>
            </div>
          </section>
        );

      default:
        return null;
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

      <aside
        className={`eb-sidebar ${
          sidebarOpen ? 'eb-sidebar-open' : ''
        }`}
      >
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

        <nav
          className="eb-navigation"
          aria-label="Main navigation"
        >
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`eb-nav-item ${
                activePage === name ? 'eb-nav-active' : ''
              }`}
              onClick={() => openPage(name)}
              aria-current={
                activePage === name ? 'page' : undefined
              }
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
            <p>
              Keep learning and look for opportunities to grow.
            </p>
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

            <div className="eb-avatar">
              {initials || 'W'}
            </div>
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
            <span>
              EarnBridge · Start building your next opportunity.
            </span>
            <span>
              Created by Ayanfe Innovation Labs Limited
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
