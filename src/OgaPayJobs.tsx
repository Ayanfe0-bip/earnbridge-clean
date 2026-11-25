import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  ExternalLink,
  BriefcaseBusiness,
  ShieldCheck,
  AlertCircle,
  Clock3,
} from 'lucide-react';

type OgaPayJob = {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  category: string;
  status: string;
  reward: number;
  currency: string;
  maxWorkers: number;
  currentWorkers: number;
  deadline: string | null;
  targetUrl?: string;
  proofRequired?: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: OgaPayJob[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const blockedTerms = [
  'gambling',
  'bet9ja',
  'betting',
  'casino',
  'aviator',
  'sportsbook',
  'wager',
  'stake.com',
  'gmail',
  'email account',
  'create email',
  'create account',
  'account creation',
  'sell account',
  'sell gmail',
  'account farming',
  'fake account',
  'verification code',
  'otp',
  'pay registration fee',
  'registration fee',
  'deposit to unlock',
  'investment deposit',
  'send money',
  'bank details',
  'credit card details',
  'password',
];

function isSafeJob(job: OgaPayJob) {
  const text = [
    job.title,
    job.description,
    job.instructions || '',
    job.proofRequired || '',
  ]
    .join(' ')
    .toLowerCase();

  return !blockedTerms.some((term) => text.includes(term));
}

function formatMoney(amount: number, currency: string) {
  if (currency === 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return `${currency} ${amount}`;
}

export default function OgaPayJobs() {
  const [jobs, setJobs] = useState<OgaPayJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');

  async function loadJobs() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ogapay/jobs?limit=50', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error('Could not load OgaPay opportunities.');
      }

      setJobs(result.data || []);
    } catch (err) {
      console.error('OgaPay jobs error:', err);
      setError(
        'We could not load OgaPay opportunities. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  const safeJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.status === 'OPEN' &&
          isSafeJob(job)
      ),
    [jobs]
  );

  const categories = useMemo(
    () => [
      'All categories',
      ...Array.from(
        new Set(safeJobs.map((job) => job.category))
      ).sort(),
    ],
    [safeJobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return safeJobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All categories' ||
        job.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [safeJobs, search, category]);

  return (
    <section className="eb-content-card">
      <div className="eb-section-heading">
        <div>
          <h3>OgaPay Opportunities</h3>
          <p>
            Explore external work opportunities from OgaPay.
          </p>
        </div>

        <BriefcaseBusiness size={24} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 18,
        }}
      >
        <span
          style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '7px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ● OgaPay connected
        </span>

        <button
          className="eb-secondary-button"
          onClick={() => void loadJobs()}
          disabled={loading}
        >
          <RefreshCw size={15} />
          {loading ? 'Refreshing...' : 'Refresh jobs'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
        <label htmlFor="ogapay-search">Search opportunities</label>

        <input
          id="ogapay-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search available jobs..."
          style={{
            width: '100%',
            minHeight: 44,
            padding: 12,
            border: '1px solid #dce5f2',
            borderRadius: 9,
            boxSizing: 'border-box',
            font: 'inherit',
          }}
        />

        <label htmlFor="ogapay-category">Category</label>

        <select
          id="ogapay-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{
            width: '100%',
            minHeight: 44,
            padding: 12,
            border: '1px solid #dce5f2',
            borderRadius: 9,
            background: '#fff',
            font: 'inherit',
          }}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p role="status">Loading OgaPay opportunities...</p>
      )}

      {error && (
        <div className="eb-notice" role="alert">
          <AlertCircle size={22} />
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="eb-empty-state">
          <Search size={28} />
          <h4>No matching opportunities</h4>
          <p>Try another search or check again later.</p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: 14,
        }}
      >
        {filteredJobs.map((job) => (
          <article
            key={job.id}
            style={{
              border: '1px solid #e8edf4',
              borderRadius: 13,
              padding: 16,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 11,
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: 'fit-content',
                padding: '5px 9px',
                background: '#eff6ff',
                color: '#1d4ed8',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              {job.category}
            </span>

            <h4 style={{ margin: 0, overflowWrap: 'anywhere' }}>
              {job.title}
            </h4>

            <p
              style={{
                fontSize: 12,
                color: '#64748b',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
              }}
            >
              {job.description}
            </p>

            <strong style={{ color: '#15803d', fontSize: 17 }}>
              {formatMoney(job.reward, job.currency)}
            </strong>

            <div
              style={{
                fontSize: 11,
                color: '#64748b',
                display: 'grid',
                gap: 7,
              }}
            >
              <span>
                <BriefcaseBusiness
                  size={13}
                  style={{ display: 'inline', marginRight: 5 }}
                />
                {job.currentWorkers}/{job.maxWorkers} workers
              </span>

              {job.deadline && (
                <span>
                  <Clock3
                    size={13}
                    style={{ display: 'inline', marginRight: 5 }}
                  />
                  Deadline:{' '}
                  {new Date(job.deadline).toLocaleDateString('en-NG')}
                </span>
              )}
            </div>

            {job.proofRequired && (
              <div
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: '#f8fafc',
                  fontSize: 11,
                  lineHeight: 1.7,
                }}
              >
                <strong>Proof required:</strong>
                <p style={{ margin: '4px 0 0' }}>
                  {job.proofRequired}
                </p>
              </div>
            )}

            <a
              href={job.targetUrl || 'https://ogapay.app'}
              target="_blank"
              rel="noopener noreferrer"
              className="eb-primary-button"
              style={{
                textDecoration: 'none',
                justifyContent: 'center',
                marginTop: 'auto',
              }}
            >
              Open on OgaPay
              <ExternalLink size={16} />
            </a>
          </article>
        ))}
      </div>

      <div
        className="eb-notice"
        style={{ marginTop: 20 }}
      >
        <ShieldCheck size={22} />
        <div>
          <strong>External opportunities</strong>
          <p>
            These jobs are managed by OgaPay. Apply, complete
            work, submit proof and receive payment through
            OgaPay. They do not add money to your EarnBridge
            wallet or CPX Points.
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: 11,
          color: '#64748b',
          marginTop: 12,
        }}
      >
        Some listings are automatically hidden by our basic
        safety filter. Always review the full requirements
        before accepting external work.
      </p>
    </section>
  );
}
