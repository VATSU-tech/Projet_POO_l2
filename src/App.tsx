import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Comptes } from './pages/Comptes';

function Navigation() {
  const location = useLocation();

  return (
    <div className="navbar bg-base-100 border-b border-base-200 px-4 py-3 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-primary tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
          POO Bank
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link
              to="/"
              className={`font-semibold rounded-lg ${
                location.pathname === '/' ? 'bg-primary text-white' : 'hover:bg-base-200'
              }`}
            >
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link
              to="/comptes"
              className={`font-semibold rounded-lg ${
                location.pathname === '/comptes' ? 'bg-primary text-white' : 'hover:bg-base-200'
              }`}
            >
              Comptes & Opérations
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100 flex flex-col w-full">
        {/* Navigation Bar */}
        <Navigation />

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/comptes" element={<Comptes />} />
          </Routes>
        </main>

        {/* Academic Footer */}
        <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300">
          <div>
            <p className="font-semibold">TP Programmation Orientée Objet (POO)</p>
            <p className="text-xs text-base-content/60">
              Réalisé avec React, TypeScript, Tailwind CSS, daisyUI et json-server.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
