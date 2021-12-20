import {
  LoaderFunction,
  useLoaderData,
  redirect,
  Form,
  useTransition,
  MetaFunction,
} from 'remix';
import {SafeUser} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {Layout} from '~/components/layout';

interface LoaderResponse {
  user: SafeUser;
}

export const meta: MetaFunction = () => {
  return {
    title: 'Account | Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user) {
    return redirect('/login');
  }

  return {user};
};

export default function Account() {
  const {user} = useLoaderData<LoaderResponse>();
  const transition = useTransition();

  return (
    <Layout user={user}>
      <h1>Account</h1>
      <h2>Hello, {user.username}</h2>
      <Form method="post" action="/logout">
        <button type="submit" disabled={Boolean(transition.submission)}>
          {transition.submission ? 'Logging out' : 'Log out'}
        </button>
      </Form>
    </Layout>
  );
}
