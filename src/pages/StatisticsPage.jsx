import { Link } from 'react-router-dom';

export default function StatisticsPage() {
  return (
    <div className="page">
      <div className="topnav"><Link to="/">← Back to Academy</Link></div>
      <header className="hero glass">
        <p className="kicker">Track</p>
        <h1>Statistics</h1>
        <p className="subtitle">Build rigorous intuition through interactive modules.</p>
      </header>

      <main className="container grid3">
        <article className="card glass">
          <h2>Bayes’ Theorem</h2>
          <p>Definition-first explanation, natural frequencies, and interactive evidence updates.</p>
          <Link className="btn" to="/statistics/bayes-theorem">Open Module</Link>
        </article>
        {['Probability Foundations', 'Distributions', 'Hypothesis Testing', 'Confidence Intervals', 'Regression Essentials'].map((t) => (
          <article className="card glass disabled" key={t}><h2>{t}</h2><p>Planned module.</p></article>
        ))}
      </main>
    </div>
  );
}
