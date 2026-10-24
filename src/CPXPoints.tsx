import { useCallback, useEffect, useState } from 'react';
import {
Activity,
AlertCircle,
ArrowDownLeft,
ArrowUpRight,
Coins,
RefreshCw,
ShieldCheck,
Wallet,
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

type PointsAccount = {
user_id: string;
balance_points: number | string;
updated_at?: string;
};

type PointsTransaction = {
id: string;
user_id: string;
points: number | string;
transaction_type: 'reward' | 'reversal' | 'adjustment';
provider: string;
provider_reference: string | null;
description: string | null;
created_at: string;
};

function formatPoints(value: number | string | null | undefined) {
const numberValue = Number(value ?? 0);

return new Intl.NumberFormat('en-NG', {
maximumFractionDigits: 0,
}).format(Number.isFinite(numberValue) ? numberValue : 0);
}

function formatDate(value: string) {
const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return 'Date unavailable';
}

return date.toLocaleString('en-NG', {
day: 'numeric',
month: 'short',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
});
}

function transactionLabel(transaction: PointsTransaction) {
if (transaction.transaction_type === 'reversal') {
return 'Reward reversal';
}

if (transaction.transaction_type === 'adjustment') {
return 'Balance adjustment';
}

return 'CPX Research reward';
}

export default function CPXPoints() {
const [balance, setBalance] = useState(0);
const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState('');
const [notice, setNotice] = useState('');

const loadPoints = useCallback(async (isRefresh = false) => {
if (isRefresh) {
setRefreshing(true);
} else {
setLoading(true);
}

setError('');
setNotice('');

if (!supabaseConfigured || !supabase) {
  setBalance(0);
  setTransactions([]);
  setError(
    'Supabase is not configured. Please check your Vercel environment variables.'
  );
  setLoading(false);
  setRefreshing(false);
  return;
}

try {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    setBalance(0);
    setTransactions([]);
    setError('Please sign in to view your points.');
    return;
  }

  const [accountResult, transactionResult] = await Promise.all([
    supabase
      .from('earnbridge_points')
      .select('user_id, balance_points, updated_at')
      .eq('user_id', user.id)
      .maybeSingle(),

    supabase
      .from('earnbridge_points_transactions')
      .select(
        'id, user_id, points, transaction_type, provider, provider_reference, description, created_at',
      )
      .eq('user_id', user.id)
      .in('provider', ['cpx_research', 'cpx_reversal'])
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  if (accountResult.error) {
    throw accountResult.error;
  }

  if (transactionResult.error) {
    throw transactionResult.error;
  }

  const account = accountResult.data as PointsAccount | null;
  const history = (transactionResult.data ?? []) as PointsTransaction[];

  setBalance(Number(account?.balance_points ?? 0));
  setTransactions(history);

  if (!account && history.length === 0) {
    setNotice(
      'Your points account will appear when your first eligible reward is recorded.',
    );
  }
} catch (err) {
  console.error('Failed to load CPX points:', err);
  setError(
    err instanceof Error
      ? err.message
      : 'Unable to load your points. Please try again.',
  );
} finally {
  setLoading(false);
  setRefreshing(false);
}

}, []);

useEffect(() => {
void loadPoints();
}, [loadPoints]);

const totalEarned = transactions.reduce((total, transaction) => {
const points = Number(transaction.points);

return points > 0 ? total + points : total;

}, 0);

const totalReversed = transactions.reduce((total, transaction) => {
const points = Number(transaction.points);

return points < 0 ? total + Math.abs(points) : total;

}, 0);

const cardStyle = {
background: '#ffffff',
border: '1px solid #e5e7eb',
borderRadius: '16px',
padding: '20px',
minWidth: 0,
} as const;

const mutedText = {
color: '#64748b',
fontSize: '13px',
} as const;

return (
<section
aria-label="CPX points dashboard"
style={{
width: '100%',
color: '#0f172a',
fontFamily: 'inherit',
}}
>
<div
style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
gap: '16px',
flexWrap: 'wrap',
marginBottom: '24px',
}}
>
<div>
<h2
style={{
fontSize: 'clamp(22px, 4vw, 30px)',
fontWeight: 800,
margin: '0 0 8px',
}}
>
CPX Points
</h2>

      <p style={{ ...mutedText, margin: 0, lineHeight: 1.6 }}>
        Track your research rewards and points transactions.
      </p>
    </div>

    <button
      type="button"
      onClick={() => void loadPoints(true)}
      disabled={loading || refreshing}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '11px 15px',
        borderRadius: '10px',
        border: '1px solid #dbe3ef',
        background: '#ffffff',
        color: '#1e293b',
        fontWeight: 700,
        cursor: loading || refreshing ? 'wait' : 'pointer',
        opacity: loading || refreshing ? 0.65 : 1,
      }}
    >
      <RefreshCw
        size={16}
        className={refreshing ? 'animate-spin' : undefined}
      />
      Refresh
    </button>
  </div>

  {error && (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '14px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        color: '#9f1239',
        lineHeight: 1.6,
        overflowWrap: 'anywhere',
      }}
    >
      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{error}</span>
    </div>
  )}

  {notice && !error && (
    <div
      role="status"
      style={{
        padding: '14px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1d4ed8',
        lineHeight: 1.6,
      }}
    >
      {notice}
    </div>
  )}

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}
  >
    <div
      style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #eff6ff, #eef2ff)',
        borderColor: '#c7d2fe',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ ...mutedText, fontWeight: 700 }}>
          Available points
        </span>

        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#dbeafe',
            color: '#1d4ed8',
          }}
        >
          <Coins size={21} />
        </span>
      </div>

      <div
        style={{
          fontSize: 'clamp(30px, 5vw, 38px)',
          fontWeight: 800,
          marginTop: '18px',
          overflowWrap: 'anywhere',
        }}
      >
        {loading ? '...' : formatPoints(balance)}
      </div>

      <p style={{ ...mutedText, margin: '8px 0 0' }}>
        CPX reward points
      </p>
    </div>

    <div style={cardStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ ...mutedText, fontWeight: 700 }}>
          Rewards recorded
        </span>

        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#dcfce7',
            color: '#15803d',
          }}
        >
          <ArrowDownLeft size={21} />
        </span>
      </div>

      <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '18px' }}>
        {loading ? '...' : formatPoints(totalEarned)}
      </div>

      <p style={{ ...mutedText, margin: '8px 0 0' }}>
        Positive entries in the latest 50 transactions
      </p>
    </div>

    <div style={cardStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ ...mutedText, fontWeight: 700 }}>
          Reversed points
        </span>

        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#ffedd5',
            color: '#c2410c',
          }}
        >
          <ArrowUpRight size={21} />
        </span>
      </div>

      <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '18px' }}>
        {loading ? '...' : formatPoints(totalReversed)}
      </div>

      <p style={{ ...mutedText, margin: '8px 0 0' }}>
        Reversals in the latest 50 transactions
      </p>
    </div>
  </div>

  <div style={{ ...cardStyle, marginBottom: '20px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
      }}
    >
      <ShieldCheck size={21} color="#2563eb" />
      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>
        Your points are separate
      </h3>
    </div>

    <p style={{ ...mutedText, lineHeight: 1.8, margin: 0 }}>
      CPX points are separate from your EarnBridge naira wallet. This
      dashboard displays recorded points and transaction history only.
      Points withdrawals or conversion to cash are not available here.
    </p>
  </div>

  <div style={cardStyle}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
      }}
    >
      <Activity size={21} color="#2563eb" />
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
        Transaction history
      </h3>
    </div>

    {loading ? (
      <div style={{ padding: '28px 8px', textAlign: 'center' }}>
        Loading your points history...
      </div>
    ) : transactions.length === 0 ? (
      <div
        style={{
          textAlign: 'center',
          padding: '35px 12px',
          background: '#f8fafc',
          borderRadius: '12px',
        }}
      >
        <Wallet
          size={34}
          color="#94a3b8"
          style={{ margin: '0 auto 12px' }}
        />

        <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>
          No points transactions yet
        </h4>

        <p
          style={{
            ...mutedText,
            maxWidth: '380px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Your recorded CPX rewards and reversals will appear here when
          they are processed by the EarnBridge backend.
        </p>
      </div>
    ) : (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            minWidth: '470px',
          }}
        >
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={tableHeaderStyle}>Transaction</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>
                Points
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => {
              const points = Number(transaction.points);
              const positive = points > 0;

              return (
                <tr key={transaction.id}>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: 700 }}>
                      {transactionLabel(transaction)}
                    </div>

                    <div
                      style={{
                        ...mutedText,
                        marginTop: '5px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {transaction.description ||
                        transaction.provider_reference ||
                        'Points transaction'}
                    </div>
                  </td>

                  <td style={{ ...tableCellStyle, ...mutedText }}>
                    {formatDate(transaction.created_at)}
                  </td>

                  <td
                    style={{
                      ...tableCellStyle,
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      fontWeight: 800,
                      color: positive ? '#15803d' : '#b91c1c',
                    }}
                  >
                    {positive ? '+' : ''}
                    {formatPoints(points)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p
          style={{
            ...mutedText,
            lineHeight: 1.6,
            margin: '16px 0 0',
          }}
        >
          Showing up to 50 recent CPX-related transactions.
        </p>
      </div>
    )}
  </div>
</section>

);
}

const tableHeaderStyle = {
padding: '13px 12px',
borderBottom: '1px solid #e2e8f0',
color: '#64748b',
fontSize: '12px',
fontWeight: 800,
textTransform: 'uppercase' as const,
letterSpacing: '0.04em',
};

const tableCellStyle = {
padding: '15px 12px',
borderBottom: '1px solid #e2e8f0',
verticalAlign: 'top' as const,
};
