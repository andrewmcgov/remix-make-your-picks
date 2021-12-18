import type {MetaFunction, LoaderFunction} from 'remix';
import {Link} from 'remix';
import {currentUser} from '~/utilities/user.server';
import {Layout} from '~/components/layout';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  return {user};
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <Layout>
      <Link to="/account">Account</Link>
    </Layout>
  );
}
