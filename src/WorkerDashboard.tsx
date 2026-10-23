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

type Props = {
  user: User;
  onSignOut: () => void | Promise<void>;
};

type Page =
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
  status: string;
  is_demo: boolean;
  created_at: string;
};

type Submission = {
  id: string;
  task_id: string;
  worker_id: string;
  status: string;
  submitted_work: string | null;
  submitted_at: string | null;
  reviewer_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  task?: Task;
};

const navigation: { name: Page; icon: typeof House }[] = [
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

const cardStyle: React.CSSProperties = {
  padding: 17,
  border: '1px solid #e8edf4',
  borderRadius: 12,
  background: '#fff',
  marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 44,
  padding: '10px 12px',
  border: '1px solid #dce5f2',
  borderRadius: 9,
  background: '#fff',
  color: '#172033',
  font: 'inherit',
  boxSizing: 'border-box',
};

export default function WorkerDashboard({
  user,
  onSignOut,
}: Props) {
  const [activePage, setActivePage] = useState<Page>('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All categories');
  const [showPracticeTasks, setShowPracticeTasks] = useState(true);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState('');
  const [submissionRefresh, setSubmissionRefresh] = useState(0);

  const [acceptingTask, setAcceptingTask] = useState('');
  const [submittingId, setSubmittingId] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Worker';

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  function openPage(page: Page) {
    setActivePage(page);
    setSidebarOpen(false);
    setNotice('');
    setActionError('');
  }

  useEffect(() => {
    if (activePage !== 'Find Tasks') return;

    let cancelled = false;

    async function loadTasks() {
      if (!supabase) {
        setTasksError('Database connection is not configured.');
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
        console.error('Task loading failed:', error);
        setTasksError('Could not load tasks. Please try again.');
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

  useEffect(() => {
    if (activePage !== 'My Tasks') return;

    let cancelled = false;

    async function loadSubmissions() {
      if (!supabase) {
        setSubmissionsError('Database connection is not configured.');
        return;
      }

      setSubmissionsLoading(true);
      setSubmissionsError('');

      const { data, error } = await supabase
        .from('task_submissions')
        .select(
          'id, task_id, worker_id, status, submitted_work, submitted_at, reviewer_note, reviewed_at, created_at'
        )
        .eq('worker_id', user.id)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error('Submission loading failed:', error);
        setSubmissionsError(
          'Could not load your tasks. Check your database permissions and try again.'
        );
        setSubmissions([]);
        setSubmissionsLoading(false);
        return;
      }

      const rows = (data ?? []) as Submission[];
      const taskIds = [...new Set(rows.map((row) => row.task_id))];

      let taskMap: Record<string, Task> = {};

      if (taskIds.length > 0) {
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select(
            'id, title, description, category, reward_kobo, estimated_minutes, deadline, status, is_demo, created_at'
          )
          .in('id', taskIds);

        if (cancelled) return;

        if (taskError) {
          console.error('Task details loading failed:', taskError);
        } else {
          taskMap = Object.fromEntries(
            ((taskData ?? []) as Task[]).map((task) => [
              task.id,
              task,
            ])
          );
        }
      }

      if (cancelled) return;

      setSubmissions(
        rows.map((row) => ({
          ...row,
          task: taskMap[row.task_id],
        }))
      );
      setSubmissionsLoading(false);
    }

    void loadSubmissions();

    return () => {
      cancelled = true;
    };
  }, [activePage, submissionRefresh, user.id]);

  const categories = useMemo(
    () => [
      'All categories',
      ...Array.from(new Set(tasks.map((task) => task.category))).sort(),
    ],
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query) ||
        (task.category || '').toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All categories' ||
        task.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory &&
        (showPracticeTasks || !task.is_demo)
      );
    });
  }, [tasks, searchText, selectedCategory, showPracticeTasks]);

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

  async function acceptTask(task: Task) {
    if (!supabase || acceptingTask) return;

    if (task.is_demo) {
      setActionError(
        'Practice tasks cannot be accepted for cash rewards.'
      );
      return;
    }

    const alreadyAccepted = submissions.some(
      (item) =>
        item.task_id === task.id &&
        !['rejected', 'cancelled'].includes(item.status)
    );

    if (alreadyAccepted) {
      setActionError('You already have a submission for this task.');
      return;
    }

    const confirmed = window.confirm(
      `Accept "${task.title}"? Check the requirements before proceeding.`
    );

    if (!confirmed) return;

    setAcceptingTask(task.id);
    setActionError('');
    setNotice('');

    try {
      const { error } = await supabase
        .from('task_submissions')
        .insert({
          task_id: task.id,
          worker_id: user.id,
          status: 'accepted',
        });

      if (error) throw error;

      setNotice('Task accepted. You can now submit your completed work.');
      setSubmissionRefresh((value) => value + 1);
      openPage('My Tasks');
    } catch (error) {
      console.error('Accept task failed:', error);
      setActionError(
        'Could not accept this task. It may already be assigned, or database permissions may need checking.'
      );
    } finally {
      setAcceptingTask('');
    }
  }

  async function submitWork(item: Submission) {
    if (!supabase || submittingId) return;

    const work = (drafts[item.id] ?? '').trim();

    if (work.length < 10) {
      setActionError(
        'Please enter your completed work, with at least 10 characters.'
      );
      return;
    }

    if (item.status !== 'accepted') {
      setActionError('Only accepted tasks can receive a submission.');
      return;
    }

    setSubmittingId(item.id);
    setActionError('');
    setNotice('');

    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .update({
          submitted_work: work,
          submitted_at: new Date().toISOString(),
          status: 'submitted',
        })
        .eq('id', item.id)
        .eq('worker_id', user.id)
        .eq('status', 'accepted')
        .select('id');

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          'No submission was updated. Check the task status and database policy.'
        );
      }

      setDrafts((previous) => {
        const next = { ...previous };
        delete next[item.id];
        return next;
      });

      setNotice('Your work was submitted for review.');
      setSubmissionRefresh((value) => value + 1);
    } catch (error) {
      console.error('Submit work failed:', error);
      setActionError(
        'We could not submit your work. Please try again or check the database permissions.'
      );
    } finally {
      setSubmittingId('');
    }
  }

  function renderOverview() {
    const acceptedCount = submissions.filter(
      (item) => item.status === 'accepted'
    ).length;

    const submittedCount = submissions.filter(
      (item) => item.status === 'submitted'
    ).length;

    return (
      <>
        <section className="eb-welcome">
          <div className="eb-welcome-copy">
            <span className="eb-eyebrow">
              <Sparkles size={15} /> YOUR EARNING JOURNEY
            </span>
            <h2>Welcome, {fullName.split(' ')[0]}!</h2>
            <p>
              Explore opportunities, complete genuine work, and
              keep track of your progress.
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
            <h3>
              {submissions.filter((item) => item.status === 'approved').length}
            </h3>
            <span className="eb-stat-note">Approved submissions</span>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-purple">
              <Clock3 size={21} />
            </span>
            <p>Pending reviews</p>
            <h3>{submittedCount}</h3>
            <span className="eb-stat-note">Awaiting review</span>
          </article>

          <article className="eb-stat-card">
            <span className="eb-stat-icon eb-icon-orange">
              <BriefcaseBusiness size={21} />
            </span>
            <p>Tasks in progress</p>
            <h3>{acceptedCount}</h3>
            <span className="eb-stat-note">Accepted work</span>
          </article>
        </section>

        <section className="eb-content-card eb-opportunity-card">
          <div className="eb-section-heading">
            <div>
              <h3>Find your next opportunity</h3>
              <p>Browse available work and review each requirement.</p>
            </div>
            <span className="eb-heading-icon">
              <BriefcaseBusiness size={22} />
            </span>
          </div>

          <div className="eb-empty-state">
            <div className="eb-empty-icon">
              <Search size={28} />
            </div>
            <h4>Your next step starts here</h4>
            <p>
              Explore the marketplace, accept an eligible task,
              and submit your work for review. Listing a reward
              does not guarantee payment.
            </p>
            <button
              className="eb-secondary-button"
              onClick={() => openPage('Find Tasks')}
            >
              View available tasks <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="eb-notice">
          <ShieldCheck size={22} />
          <div>
            <strong>Your account, your work, your rewards.</strong>
            <p>
              Never pay a registration fee to unlock a supposed
              reward. Practice tasks do not earn cash, and only
              genuine reviewed work may qualify for payment.
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
            <p>Search and filter available marketplace tasks.</p>
          </div>
          <Search size={23} />
        </div>

        <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
          <label htmlFor="eb-search">Search tasks</label>
          <input
            id="eb-search"
            style={inputStyle}
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search writing, research, data entry..."
          />

          <label htmlFor="eb-category">Category</label>
          <select
            id="eb-category"
            style={inputStyle}
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={showPracticeTasks}
              onChange={(event) => setShowPracticeTasks(event.target.checked)}
            />
            Show practice tasks
          </label>
        </div>

        {tasksLoading && <p role="status">Loading available tasks...</p>}

        {tasksError && (
          <div className="eb-notice" role="alert">
            <CircleHelp size={22} />
            <div>{tasksError}</div>
          </div>
        )}

        {!tasksLoading && !tasksError && filteredTasks.length === 0 && (
          <div className="eb-empty-state">
            <div className="eb-empty-icon">
              <Search size={28} />
            </div>
            <h4>No matching tasks</h4>
            <p>Try a different search or check again later.</p>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 14,
          }}
        >
          {filteredTasks.map((task) => (
            <article key={task.id} style={cardStyle}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 9px',
                  borderRadius: 20,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {task.category}
              </span>

              {task.is_demo && (
                <p style={{ color: '#92400e', fontWeight: 800 }}>
                  PRACTICE TASK · NO CASH REWARD
                </p>
              )}

              <h4>{task.title}</h4>
              <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                {task.description}
              </p>

              <p style={{ color: '#748094', fontSize: 12 }}>
                <Clock3
                  size={13}
                  style={{ display: 'inline', marginRight: 5 }}
                />
                {task.estimated_minutes} minutes
              </p>

              <p>
                <strong>
                  {task.is_demo ? 'Example amount: ' : 'Listed reward: '}
                  {money(Number(task.reward_kobo || 0) / 100)}
                </strong>
              </p>

              <p style={{ color: '#748094', fontSize: 12 }}>
                {task.deadline
                  ? `Deadline: ${new Date(task.deadline).toLocaleDateString('en-NG')}`
                  : 'No deadline set'}
              </p>

              {!task.is_demo && (
                <button
                  className="eb-primary-button"
                  disabled={acceptingTask === task.id || Boolean(acceptingTask)}
                  onClick={() => void acceptTask(task)}
                >
                  {acceptingTask === task.id ? 'Accepting...' : 'Accept task'}
                  <ArrowRight size={16} />
                </button>
              )}
            </article>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            padding: 13,
            borderRadius: 9,
            background: '#fffbeb',
            color: '#92400e',
            fontSize: 12,
            lineHeight: 1.8,
          }}
        >
          <strong>Important:</strong> Displayed rewards are not proof
          of available funding. Practice tasks cannot earn cash.
          Confirm task terms before beginning work.
        </div>
      </section>
    );
  }
  
    function renderMyTasks() {
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>My Tasks</h3>
            <p>Track accepted work and submit completed tasks.</p>
          </div>
          <FileText size={23} />
        </div>

        {submissionsLoading && (
          <p role="status">Loading your tasks...</p>
        )}

        {submissionsError && (
          <div className="eb-empty-state" role="alert">
            <CircleHelp size={28} />
            <h4>Unable to load your tasks</h4>
            <p>{submissionsError}</p>
            <button
              className="eb-secondary-button"
              onClick={() => setSubmissionRefresh((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {!submissionsLoading &&
          !submissionsError &&
          submissions.length === 0 && (
            <div className="eb-empty-state">
              <div className="eb-empty-icon">
                <FileText size={28} />
              </div>
              <h4>You haven't accepted any tasks yet</h4>
              <p>
                Visit Find Tasks to explore available opportunities.
                When you accept a task, it will appear here.
              </p>
              <button
                className="eb-primary-button"
                onClick={() => openPage('Find Tasks')}
              >
                Find Tasks
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        {!submissionsLoading &&
          !submissionsError &&
          submissions.length > 0 && (
            <div
              style={{
                display: 'grid',
                gap: 15,
                marginTop: 18,
              }}
            >
              {submissions.map((submission) => (
                <article
                  key={submission.id}
                  style={{
                    padding: 16,
                    border: '1px solid #e8edf4',
                    borderRadius: 12,
                    display: 'grid',
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 15,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {submission.task?.title || 'Task'}
                    </h4>

                    <span
                      style={{
                        padding: '6px 10px',
                        borderRadius: 20,
                        background:
                          submission.status === 'approved'
                            ? '#dcfce7'
                            : submission.status === 'rejected'
                              ? '#fee2e2'
                              : submission.status === 'submitted'
                                ? '#dbeafe'
                                : '#fef3c7',
                        color:
                          submission.status === 'approved'
                            ? '#166534'
                            : submission.status === 'rejected'
                              ? '#991b1b'
                              : submission.status === 'submitted'
                                ? '#1d4ed8'
                                : '#92400e',
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {submission.status.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: '#748094',
                      fontSize: 12,
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {submission.task?.description ||
                      'Task details are unavailable.'}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 12,
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
                      {submission.task?.estimated_minutes ?? 0} minutes
                    </span>

                    <span>
                      Reward: {money(
                        Number(submission.task?.reward_kobo ?? 0) / 100
                      )}
                    </span>
                  </div>

                  {submission.reviewer_note && (
                    <div
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        background: '#f8fafc',
                        fontSize: 12,
                        lineHeight: 1.7,
                      }}
                    >
                      <strong>Review note:</strong>
                      <p style={{ margin: '5px 0 0' }}>
                        {submission.reviewer_note}
                      </p>
                    </div>
                  )}

                  {submission.status === 'accepted' && (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const form = event.currentTarget;
                        const field = form.elements.namedItem(
                          'submitted_work'
                        ) as HTMLTextAreaElement | null;

                        if (!field?.value.trim()) {
                          setNotice('Please describe your completed work.');
                          return;
                        }

                        void submitWork(submission.id, field.value.trim());
                        form.reset();
                      }}
                      style={{
                        display: 'grid',
                        gap: 10,
                      }}
                    >
                      <label
                        htmlFor={`submission-${submission.id}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Your completed work
                      </label>

                      <textarea
                        id={`submission-${submission.id}`}
                        name="submitted_work"
                        required
                        rows={4}
                        placeholder="Describe your completed work or provide the requested result..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: 12,
                          border: '1px solid #dce5f2',
                          borderRadius: 9,
                          font: 'inherit',
                          fontSize: 13,
                          resize: 'vertical',
                        }}
                      />

                      <button
                        type="submit"
                        className="eb-primary-button"
                      >
                        <CheckCircle2 size={16} />
                        Submit completed work
                      </button>
                    </form>
                  )}

                  {submission.status === 'submitted' && (
                    <p
                      style={{
                        margin: 0,
                        color: '#1d4ed8',
                        fontSize: 12,
                        lineHeight: 1.7,
                      }}
                    >
                      Your work has been submitted and is awaiting review.
                    </p>
                  )}

                  {submission.status === 'approved' && (
                    <p
                      style={{
                        margin: 0,
                        color: '#166534',
                        fontSize: 12,
                        lineHeight: 1.7,
                      }}
                    >
                      Your submission has been approved. This does not
                      mean a payout has been processed.
                    </p>
                  )}

                  {submission.status === 'rejected' && (
                    <p
                      style={{
                        margin: 0,
                        color: '#991b1b',
                        fontSize: 12,
                        lineHeight: 1.7,
                      }}
                    >
                      Your submission was not approved. Review the note
                      above and contact support if you need clarification.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

        {notice && (
          <p
            role="status"
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            {notice}
          </p>
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
          <strong>Important:</strong> Submitting work does not guarantee
          approval or payment. Rewards must be reviewed and properly
          funded before any payout can be promised.
        </div>
      </section>
    );
  }

  function renderEarnings() {
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
              <p>Review your rewards and payout information.</p>
            </div>
            <Coins size={23} />
          </div>

          <div className="eb-empty-state">
            <div className="eb-empty-icon">
              <Wallet size={28} />
            </div>
            <h4>Payouts are not active yet</h4>
            <p>
              Your balance remains at zero until a secure rewards
              and payout system is implemented. Demonstration task
              amounts are not real earnings.
            </p>
          </div>
        </section>
      </>
    );
  }

  function renderProfile() {
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
              {user.email_confirmed_at ? 'Verified' : 'Not confirmed'}
            </strong>
          </div>
        </div>

        <p className="eb-profile-note">
          Profile editing and payout details will be added when the
          secure profile system is ready.
        </p>
      </section>
    );
  }

  function renderHelp() {
    return (
      <section className="eb-content-card">
        <div className="eb-section-heading">
          <div>
            <h3>Help & Support</h3>
            <p>Important information about EarnBridge.</p>
          </div>
          <CircleHelp size={23} />
        </div>

        <div className="eb-help-list">
          <article className="eb-help-item">
            <ShieldCheck size={23} />
            <div>
              <h4>Is registration free?</h4>
              <p>
                Workers should not have to pay a fee to unlock tasks.
              </p>
            </div>
          </article>

          <article className="eb-help-item">
            <Coins size={23} />
            <div>
              <h4>When can I earn?</h4>
              <p>
                Real earnings depend on genuine tasks, completed
                requirements, review, and funding.
              </p>
            </div>
          </article>

          <article className="eb-help-item">
            <Wallet size={23} />
            <div>
              <h4>Can I withdraw money now?</h4>
              <p>
                The payout system is not active yet. Withdrawals
                should not be promised until it is implemented.
              </p>
            </div>
          </article>

          <article className="eb-help-item">
            <ShieldCheck size={23} />
            <div>
              <h4>How do I stay safe?</h4>
              <p>
                Never share your password or authentication codes.
                Be cautious of anyone demanding money to unlock a
                supposed reward.
              </p>
            </div>
          </article>
        </div>
      </section>
    );
  }

  function renderContent() {
    switch (activePage) {
      case 'Overview':
        return renderOverview();

      case 'Find Tasks':
        return renderFindTasks();

      case 'My Tasks':
        return renderMyTasks();

      case 'Earnings':
        return renderEarnings();

      case 'Profile':
        return renderProfile();

      case 'Help & Support':
        return renderHelp();

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

        <nav className="eb-navigation" aria-label="Main navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`eb-nav-item ${
                activePage === name ? 'eb-nav-active' : ''
              }`}
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

          {renderContent()}

          <footer className="eb-dashboard-footer">
            <span>
              EarnBridge · Start building your next opportunity.
            </span>
            <span>Created by Ayanfe Innovation Labs Limited</span>
          </footer>
        </div>
      </main>
    </div>
  );
                          }
