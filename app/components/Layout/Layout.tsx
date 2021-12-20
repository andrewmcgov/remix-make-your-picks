import {Link} from 'remix';
import {SafeUser} from '~/utilities/types';

export interface LayoutProps {
  children: React.ReactNode;
  user?: SafeUser | null;
}

export function Layout({children, user}: LayoutProps) {
  const accountUrl = user ? '/account' : '/login';
  const accountText = user ? 'Account' : 'Log in';
  return (
    <div className="Layout">
      <div>
        <header>
          <Link to="/" className="h1 logo">
            MAKE YOUR PICKS
          </Link>
          <nav>
            <Link to="/">Home</Link>
            <Link to={accountUrl}>{accountText}</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>
        <main>{children}</main>
      </div>
      <footer className="Footer">Made by Andrew McGoveran</footer>
    </div>
  );
}
