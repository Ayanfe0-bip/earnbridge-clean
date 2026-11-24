import type { CSSProperties, ReactNode } from 'react';
import {
ArrowLeft,
HandCoins,
ShieldCheck,
FileText,
} from 'lucide-react';

const updated = '25 November 2026';

const pageStyle: CSSProperties = {
minHeight: '100vh',
background: '#f7f9fe',
color: '#24364f',
fontFamily: 'inherit',
};

const shellStyle: CSSProperties = {
width: 'min(900px, calc(100% - 32px))',
margin: '0 auto',
padding: '28px 0 60px',
};

const cardStyle: CSSProperties = {
background: '#fff',
border: '1px solid #e5ebf5',
borderRadius: 18,
padding: 'clamp(20px, 5vw, 42px)',
boxShadow: '0 12px 35px rgba(28, 55, 100, .05)',
};

const headingStyle: CSSProperties = {
color: '#193252',
fontWeight: 800,
letterSpacing: '-.03em',
};

function LegalHeader() {
return (
<header style={{
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
gap: 16,
marginBottom: 24,
}}>
<a href="/" style={{
display: 'flex',
alignItems: 'center',
gap: 9,
color: '#2858d6',
fontWeight: 800,
textDecoration: 'none',
}}>
<span style={{
display: 'grid',
placeItems: 'center',
width: 40,
height: 40,
borderRadius: 12,
color: '#fff',
background: '#2858d6',
}}>
<HandCoins size={22} />
</span>
<span style={{ color: '#193252' }}>
Earn<span style={{ color: '#2858d6' }}>Bridge</span>
</span>
</a>

  <a href="/" style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    color: '#52647d',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
  }}>
    <ArrowLeft size={16} /> Back to home
  </a>
</header>

);
}

function LegalFooter() {
return (
<footer style={{
marginTop: 22,
padding: '18px 4px',
color: '#7b8799',
fontSize: 12,
lineHeight: 1.8,
}}>
<div style={{
display: 'flex',
flexWrap: 'wrap',
gap: 16,
marginBottom: 8,
}}>
<a href="/privacy-policy" style={{ color: '#2858d6' }}>
Privacy Policy
</a>
<a href="/terms" style={{ color: '#2858d6' }}>
Terms & Conditions
</a>
<a href="/" style={{ color: '#2858d6' }}>
EarnBridge Home
</a>
</div>
EarnBridge is a product of Ayanfe Innovation Labs Limited.
</footer>
);
}

function Section({
title,
children,
}: {
title: string;
children: ReactNode;
}) {
return (
<section style={{ marginTop: 25 }}>
<h2 style={{
...headingStyle,
fontSize: 19,
margin: '0 0 9px',
}}>
{title}
</h2>

  <div style={{
    color: '#5e6d82',
    fontSize: 14,
    lineHeight: 1.85,
  }}>
    {children}
  </div>
</section>

);
}

function PrivacyContent() {
return (
<>
<p>
This Privacy Policy explains how EarnBridge, a product of
Ayanfe Innovation Labs Limited ("EarnBridge", "we", "us"
or "our"), handles information when you visit or use our
website and platform.
</p>

  <Section title="1. Information We Collect">
    <p>Depending on how you use EarnBridge, we may process:</p>
    <ul>
      <li>
        <strong>Account information:</strong> Your name,
        email address, account identifier and authentication
        information.
      </li>
      <li>
        <strong>Platform activity:</strong> Task selections,
        submissions and related review information.
      </li>
      <li>
        <strong>Rewards records:</strong> Points balances,
        transaction references and reward history.
      </li>
      <li>
        <strong>Technical information:</strong> Browser,
        device, security and access information generated
        when you use the website.
      </li>
      <li>
        <strong>Survey information:</strong> Information
        you submit directly to CPX Research or another
        survey provider when participating in surveys.
      </li>
    </ul>
  </Section>

  <Section title="2. How We Use Your Information">
    <p>
      We use information to create and manage accounts,
      provide platform services, display tasks, record
      eligible rewards, prevent fraudulent activity,
      respond to support requests, improve our services
      and comply with applicable legal obligations.
    </p>
  </Section>

  <Section title="3. Third-Party Services">
    <p>
      EarnBridge may provide access to third-party services,
      including CPX Research surveys.
    </p>
    <p>
      When you participate in a third-party survey, that
      provider may collect and process your information
      according to its own privacy policy and terms.
    </p>
    <p>
      Information such as account identifiers, completion
      signals and transaction references may be exchanged
      where necessary to verify eligible survey activity
      and maintain reward records.
    </p>
    <p>
      We also use service providers such as Supabase for
      backend infrastructure and Vercel for website hosting.
      These providers process information to deliver their
      respective services.
    </p>
  </Section>

  <Section title="4. Data Storage and Security">
    <p>
      We use our configured backend services to store
      account and platform records.
    </p>
    <p>
      We apply reasonable technical and organisational
      measures intended to protect information against
      unauthorised access, misuse or disclosure.
      However, no internet transmission or storage system
      can be guaranteed completely secure.
    </p>
  </Section>

  <Section title="5. Data Retention">
    <p>
      We retain information for as long as reasonably
      necessary to operate EarnBridge, maintain transaction
      records, resolve disputes, prevent fraud and meet
      applicable legal requirements.
    </p>
  </Section>

  <Section title="6. Your Privacy Rights">
    <p>
      You may contact us to request access to, correction
      of or deletion of personal information associated
      with your account.
    </p>
    <p>
      We may need to verify your identity before processing
      a request. Some records may need to be retained for
      legal, security or accounting purposes.
    </p>
  </Section>

  <Section title="7. Children's Privacy">
    <p>
      EarnBridge is not intended to knowingly collect
      information from children who are not legally
      permitted to use the relevant services.
      Third-party survey providers may have additional
      age and eligibility requirements.
    </p>
  </Section>

  <Section title="8. Changes to This Policy">
    <p>
      We may update this Privacy Policy as EarnBridge
      develops. Any revised version will be published
      on this page with an updated date.
    </p>
  </Section>

  <Section title="9. Contact Us">
    <p>
      For privacy questions or requests, contact
      Ayanfe Innovation Labs Limited through the
      official contact channel published on the
      EarnBridge website.
    </p>
    <p>
      Never send your password or authentication
      codes through support messages.
    </p>
  </Section>
</>

);
}

function TermsContent() {
return (
<>
<p>
These Terms & Conditions govern your access to
and use of EarnBridge, a product of Ayanfe Innovation
Labs Limited. By accessing or using the platform,
you agree to these terms.
</p>

  <Section title="1. About EarnBridge">
    <p>
      EarnBridge is a platform being developed to help
      users discover tasks, surveys and other available
      opportunities.
    </p>
    <p>
      Features and opportunities may change as the
      platform develops. The appearance of an opportunity
      does not guarantee availability or eligibility.
    </p>
  </Section>

  <Section title="2. User Accounts">
    <p>
      Users are responsible for providing accurate
      registration information and keeping their
      login credentials confidential.
    </p>
    <p>
      You must not impersonate another person, create
      accounts for deceptive purposes or share your
      account credentials.
    </p>
  </Section>

  <Section title="3. Acceptable Use">
    <p>You agree not to:</p>
    <ul>
      <li>Submit false or misleading information.</li>
      <li>Manipulate surveys or reward systems.</li>
      <li>Use bots or automated scripts to generate activity.</li>
      <li>Exploit technical errors or security weaknesses.</li>
      <li>Attempt unauthorised access to the platform.</li>
      <li>Engage in fraudulent activities.</li>
    </ul>
  </Section>

  <Section title="4. Surveys and Third-Party Providers">
    <p>
      Surveys may have individual eligibility rules,
      availability limits and completion requirements.
    </p>
    <p>
      Third-party providers, including CPX Research,
      operate independently and have their own terms
      and privacy policies.
    </p>
    <p>
      Users must follow the applicable rules of each
      survey provider. EarnBridge does not control
      survey qualification decisions or availability.
    </p>
  </Section>

  <Section title="5. Points and Rewards">
    <p>
      Points or rewards are recorded only after the
      relevant activity has been validated and the
      required reward information has been received
      or confirmed.
    </p>
    <p>
      Attempting a survey, clicking a task or partially
      completing an activity does not automatically
      qualify as an approved reward.
    </p>
    <p>
      CPX Research points are tracked separately from
      the EarnBridge naira wallet.
    </p>
    <p>
      The current CPX Points dashboard displays recorded
      points and transaction history. It does not
      currently provide cash conversion or withdrawal.
    </p>
    <p>
      EarnBridge payout functionality is not currently
      active. No earnings or payouts are guaranteed.
    </p>
    <p>
      Where reward and payout features become available,
      applicable eligibility requirements and processing
      conditions will be communicated.
    </p>
  </Section>

  <Section title="6. Fraud Prevention and Account Reviews">
    <p>
      We may investigate suspicious activity, withhold
      pending rewards, correct inaccurate records or
      reverse rewards where a provider reports invalid
      completions, duplicate activity or suspected fraud.
    </p>
    <p>
      Accounts may be restricted or suspended where
      reasonably necessary to protect users, partners
      and the platform.
    </p>
  </Section>

  <Section title="7. Third-Party Links">
    <p>
      EarnBridge may link to or integrate external
      services. These services are independently
      operated and are subject to their own policies.
    </p>
    <p>
      We are not responsible for the independent
      operation or policies of third-party services.
    </p>
  </Section>

  <Section title="8. Platform Availability">
    <p>
      We aim to maintain reliable access to EarnBridge
      but cannot guarantee uninterrupted service.
    </p>
    <p>
      We may modify, suspend or discontinue features
      for maintenance, security, legal or operational
      reasons.
    </p>
  </Section>

  <Section title="9. Disclaimer">
    <p>
      EarnBridge does not guarantee a particular number
      of surveys, tasks, opportunities or earnings.
    </p>
    <p>
      Access to opportunities depends on availability,
      eligibility and applicable provider requirements.
    </p>
    <p>
      Nothing in these terms excludes rights or
      liabilities that cannot lawfully be excluded.
    </p>
  </Section>

  <Section title="10. Account Suspension">
    <p>
      Users may stop using EarnBridge at any time.
      We may restrict or terminate accounts where
      reasonably necessary due to violations of
      these terms, fraudulent activity or security
      concerns.
    </p>
  </Section>

  <Section title="11. Changes to These Terms">
    <p>
      We may revise these Terms &amp; Conditions as
      EarnBridge develops. Updated versions will
      be published on this page with a revised date.
    </p>
    <p>
      Continued use of the platform after changes
      take effect constitutes acceptance of the
      revised terms, to the extent permitted by law.
    </p>
  </Section>

  <Section title="12. Applicable Law and Contact">
    <p>
      EarnBridge is operated by Ayanfe Innovation
      Labs Limited.
    </p>
    <p>
      These terms are subject to applicable laws,
      including the laws of the Federal Republic
      of Nigeria where applicable.
    </p>
    <p>
      For questions, contact us through the official
      contact channel published on the EarnBridge
      website.
    </p>
  </Section>
</>

);
}

export default function LegalPages() {
const path = window.location.pathname.replace(/\/$/, '') || '/';

const isPrivacy = path === '/privacy-policy';
const isTerms = path === '/terms';

if (!isPrivacy && !isTerms) return null;

return (
<div style={pageStyle}>
<div style={shellStyle}>
<LegalHeader />

    <main style={cardStyle}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: '#2858d6',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '.12em',
        marginBottom: 14,
      }}>
        {isPrivacy
          ? <ShieldCheck size={18} />
          : <FileText size={18} />
        }
        EARNBRIDGE · {isPrivacy
          ? 'YOUR PRIVACY MATTERS'
          : 'PLATFORM GUIDELINES'
        }
      </div>

      <h1 style={{
        ...headingStyle,
        fontSize: 'clamp(30px, 6vw, 42px)',
        margin: '0 0 10px',
      }}>
        {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
      </h1>

      <p style={{
        color: '#7b8799',
        fontSize: 13,
        margin: '0 0 28px',
      }}>
        Last updated: {updated}
      </p>

      {isPrivacy ? <PrivacyContent /> : <TermsContent />}
    </main>

    <LegalFooter />
  </div>
</div>

);
}
