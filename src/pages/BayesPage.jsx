import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { scenarios } from '../data/scenarios';

const N = 1000;
const pct = (v) => `${(v * 100).toFixed(2)}%`;
const i = (n) => Math.round(n);

function compute(prevalence, sensitivity, specificity) {
  const pD = prevalence / 100;
  const pPosD = sensitivity / 100;
  const pNegNoD = specificity / 100;
  const pPosNoD = 1 - pNegNoD;
  const numerator = pPosD * pD;
  const denominator = numerator + pPosNoD * (1 - pD);
  const posterior = denominator === 0 ? 0 : numerator / denominator;

  const diseased = N * pD;
  const healthy = N - diseased;
  const tp = diseased * pPosD;
  const fn = diseased - tp;
  const fp = healthy * pPosNoD;
  const tn = healthy - fp;

  return { pD, pPosD, pNegNoD, pPosNoD, numerator, denominator, posterior, diseased, tp, fp, tn, fn };
}

function explainDelta(prev, cur) {
  if (!prev) return 'Move one slider at a time. Watch whether true positives rise faster than false positives.';
  const notes = [];
  if (cur.pD !== prev.pD) notes.push('You changed prevalence (base rate).');
  if (cur.pPosD !== prev.pPosD) notes.push('You changed sensitivity (catching real cases).');
  if (cur.pNegNoD !== prev.pNegNoD) notes.push('You changed specificity (avoiding false alarms).');
  const d = (cur.posterior - prev.posterior) * 100;
  const effect = d > 0 ? `Posterior increased by ${d.toFixed(2)} points.` : d < 0 ? `Posterior decreased by ${Math.abs(d).toFixed(2)} points.` : 'Posterior stayed nearly unchanged.';
  return `${notes.join(' ')} ${effect}`;
}

const quizItems = [
  {
    q: 'A test has high sensitivity. Does that alone guarantee a high P(Disease|Positive)?',
    a: 'No. You also need base rate and specificity. If the condition is rare and specificity is not strong, false positives can dominate.'
  },
  {
    q: 'Which is the Bayes question: P(+|Disease) or P(Disease|+)?',
    a: 'P(Disease|+). Bayes is about updating belief after seeing evidence.'
  },
  {
    q: 'When events are rare, which often matters more for trustworthy positives?',
    a: 'Specificity, because it controls false positives among the large healthy population.'
  }
];

export default function BayesPage() {
  const [values, setValues] = useState(scenarios[0]);
  const [showPredictAnswer, setShowPredictAnswer] = useState(false);
  const [openQuiz, setOpenQuiz] = useState([false, false, false]);

  const result = useMemo(() => compute(values.prevalence, values.sensitivity, values.specificity), [values]);
  const prevRef = useRef(null);
  const deltaText = explainDelta(prevRef.current, result);
  prevRef.current = result;

  const setField = (k, v) => setValues((s) => ({ ...s, [k]: Number(v) }));

  return (
    <div className="page">
      <div className="topnav"><Link to="/statistics">← Back to Statistics</Link></div>

      <header className="hero glass">
        <p className="kicker">Module</p>
        <h1>Bayes’ Theorem</h1>
        <p className="subtitle">Start with meaning, then intuition, then math, then simulation.</p>
      </header>

      <main className="container bayes-layout">
        <section className="card glass section-block">
          <h2>1) What Bayes means (in plain English)</h2>
          <p>
            Bayes is a rule for updating belief. You begin with a starting belief, see new evidence,
            and then revise your belief.
          </p>
          <div className="formula">P(H|E) = [P(E|H) × P(H)] / P(E)</div>

          <div className="count-grid">
            <div><strong>H = Hypothesis</strong><span>The thing you want to know. Example: “Person has disease.”</span></div>
            <div><strong>E = Evidence</strong><span>The signal you observed. Example: “Test is positive.”</span></div>
            <div><strong>P(H) = Prior</strong><span>Belief before seeing evidence.</span></div>
            <div><strong>P(H|E) = Posterior</strong><span>Belief after seeing evidence (final answer).</span></div>
          </div>

          <p className="keyline">
            <strong>One-sentence definition:</strong> Bayes tells you how to convert a test result into a real belief.
          </p>
        </section>

        <section className="card glass section-block">
          <h2>2) Intuitive real-world example</h2>
          <p>
            Suppose a disease is rare. A person tests positive. Is the person almost certainly sick?
            Not always. If false positives are common, many positive results will be wrong.
          </p>
          <p className="keyline">
            <strong>Memory anchor:</strong> Among all positive tests, how many are truly positive?
          </p>
        </section>

        <section className="card glass section-block">
          <h2>3) Worked Example (manual numbers)</h2>
          <p>Assume 1,000 people, prevalence 1%, sensitivity 95%, specificity 95%.</p>
          <ul>
            <li>1% of 1,000 → <strong>10</strong> truly have disease.</li>
            <li>95% sensitivity → about <strong>10 true positives</strong> (9.5 rounded).</li>
            <li>990 healthy people, 5% false positive rate → about <strong>50 false positives</strong>.</li>
            <li>Total positives = 10 + 50 = <strong>60</strong> (approx).</li>
            <li>So posterior ≈ 10 / 60 = <strong>16.7%</strong>.</li>
          </ul>
          <p className="keyline"><strong>Takeaway:</strong> a positive test is not enough by itself — base rate and false positives matter.</p>
        </section>

        <section className="card glass section-block">
          <h2>4) Deep dive: common traps</h2>
          <ul>
            <li><strong>Trap 1:</strong> Confusing <strong>P(+|Disease)</strong> with <strong>P(Disease|+)</strong>.</li>
            <li><strong>Trap 2:</strong> Ignoring base rate (how common the condition is).</li>
            <li><strong>Trap 3:</strong> Over-focusing on sensitivity and underestimating specificity.</li>
          </ul>
        </section>

        <section className="card glass section-block">
          <h2>5) Pause & Predict</h2>
          <p className="muted">If prevalence is tiny and specificity drops a little, what happens to posterior?</p>
          <button className="btn" onClick={() => setShowPredictAnswer((s) => !s)}>
            {showPredictAnswer ? 'Hide Explanation' : 'Reveal Explanation'}
          </button>
          {showPredictAnswer && (
            <motion.div className="delta-box" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              Posterior usually drops, because false positives increase and can outnumber true positives.
            </motion.div>
          )}
        </section>

        <section className="card glass section-block">
          <h2>6) Interactive Lab</h2>
          <div className="flow-strip"><span>Prior</span><span>→</span><span>Evidence Quality</span><span>→</span><span>Posterior</span></div>

          <div className="chips">
            {scenarios.map((s) => (
              <button key={s.name} className={`chip ${values.name === s.name ? 'active' : ''}`} onClick={() => setValues(s)}>{s.name}</button>
            ))}
          </div>
          <p className="muted">{values.insight}</p>

          <label>Prevalence P(D): {values.prevalence}%<input type="range" min="0" max="100" value={values.prevalence} onChange={(e) => setField('prevalence', e.target.value)} /></label>
          <label>Sensitivity P(+|D): {values.sensitivity}%<input type="range" min="0" max="100" value={values.sensitivity} onChange={(e) => setField('sensitivity', e.target.value)} /></label>
          <label>Specificity P(-|No D): {values.specificity}%<input type="range" min="0" max="100" value={values.specificity} onChange={(e) => setField('specificity', e.target.value)} /></label>

          <motion.div className="answer" key={result.posterior} initial={{ opacity: 0.5, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Posterior (final answer)</h3>
            <p className="mega">{pct(result.posterior)}</p>
            <p>Given a positive result, this is the chance the condition is truly present.</p>
          </motion.div>

          <div className="delta-box">{deltaText}</div>

          <h3>Natural frequencies (out of 1,000)</h3>
          <p className="muted">{i(result.diseased)} have the condition. {i(result.tp)} are true positives. {i(result.fp)} are false positives.</p>
          <div className="count-grid">
            <div><strong>{i(result.tp)}</strong><span>True Positive</span></div>
            <div><strong>{i(result.fp)}</strong><span>False Positive</span></div>
            <div><strong>{i(result.tn)}</strong><span>True Negative</span></div>
            <div><strong>{i(result.fn)}</strong><span>False Negative</span></div>
          </div>
        </section>

        <section className="card glass section-block">
          <h2>7) Quick Mastery Check</h2>
          {quizItems.map((item, idx) => (
            <div key={item.q} className="quiz-item">
              <p><strong>Q{idx + 1}.</strong> {item.q}</p>
              <button
                className="btn"
                onClick={() => setOpenQuiz((prev) => prev.map((v, i2) => (i2 === idx ? !v : v)))}
              >
                {openQuiz[idx] ? 'Hide Answer' : 'Show Answer'}
              </button>
              {openQuiz[idx] && <p className="keyline">{item.a}</p>}
            </div>
          ))}
          <p className="keyline"><strong>Final recall:</strong> Bayes = among all positive signals, what fraction are truly positive?</p>
        </section>
      </main>
    </div>
  );
}
