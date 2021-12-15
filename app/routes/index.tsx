import type {MetaFunction} from 'remix';
import {Link} from 'remix';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Make your picks',
    description: 'NFL playoff picks',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div className="remix__page">
      <Link to="/account">Account</Link>
    </div>
  );
}
