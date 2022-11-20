import {useState} from 'react';
import {Link} from '@remix-run/react';
import {FiMenu, FiX} from 'react-icons/fi';
import {SafeUser} from '~/utilities/types';
import {isAdmin} from '~/utilities/user';

export interface LayoutProps {
  children: React.ReactNode;
  user?: SafeUser | null;
}

export function Layout({children, user}: LayoutProps) {
  const accountUrl = user ? '/account' : '/login';
  const accountText = user ? 'Account' : 'Log in';
  const admin = user && isAdmin(user);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="Layout">
      <div>
        <header>
          <Link to="/" className="logo">
            MAKE YOUR PICKS
          </Link>
          <button
            className="mobile-nav-toggle closed"
            onClick={() => setMobileNavOpen(true)}
          >
            <FiMenu />
          </button>
          <nav className={mobileNavOpen ? 'mobile-nav--open' : ''}>
            <Link to="/">Home</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to={accountUrl}>{accountText}</Link>
            {admin && <Link to="/admin">Admin</Link>}
            <button
              className="mobile-nav-toggle open"
              onClick={() => setMobileNavOpen(false)}
            >
              <FiX />
            </button>
          </nav>
        </header>
        <main>{children}</main>
      </div>
      <footer className="Footer">🧀🧀🧀</footer>
    </div>
  );
}
