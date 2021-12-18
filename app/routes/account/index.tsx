import {
  LoaderFunction,
  useLoaderData,
  redirect,
  Form,
  useTransition,
} from 'remix';
import {SafeUser} from '~/utilities/types';
import {currentUser} from '../../utilities/user.server';

interface LoaderResponse {
  user: SafeUser;
}

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
    <>
      <h1>Account</h1>
      <h2>Hello, {user.username}</h2>
      <Form method="post" action="/logout">
        <button type="submit" disabled={Boolean(transition.submission)}>
          {transition.submission ? 'Logging out' : 'Log out'}
        </button>
      </Form>
    </>
  );
}
