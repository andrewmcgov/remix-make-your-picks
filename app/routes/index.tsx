import {MetaFunction, LoaderFunction, useLoaderData} from 'remix';
import {currentUser} from '~/utilities/user.server';
import {Layout} from '~/components/layout';
import {SafeUser} from '~/utilities/types';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Make your picks',
    description: 'NFL playoff picks',
  };
};

interface IndexLoaderResponse {
  user: SafeUser | null;
}

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  return {user};
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const {user} = useLoaderData();
  return <Layout user={user}>{null}</Layout>;
}
