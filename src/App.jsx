import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatisticsPage from './pages/StatisticsPage';
import BayesPage from './pages/BayesPage';

function Landing() {
  return (
    <div className="page">
      <header className="hero glass">
        <p className="kicker">Learning Platform</p>
        <h1>Data Science Academy</h1>
        <p className="subtitle">Interactive lessons for Statistics, Machine Learning, and Data Science.</p>
      </header>

      <main className="container grid3">
        <motion.article className="card glass" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2>Statistics</h2>
          <p>Visual and intuitive modules from fundamentals to advanced reasoning.</p>
          <Link className="btn" to="/statistics">Open Track</Link>
        </motion.article>

        <article className="card glass disabled">
          <h2>Machine Learning</h2>
          <p>Coming soon: model intuition, training, evaluation, and deployment pathways.</p>
        </article>

        <article className="card glass disabled">
          <h2>Data Science</h2>
          <p>Coming soon: experimentation, storytelling, product analytics, and decision systems.</p>
        </article>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/statistics/bayes-theorem" element={<BayesPage />} />
    </Routes>
  );
}
