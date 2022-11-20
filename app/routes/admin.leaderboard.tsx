import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import {ActionFunction, LoaderFunction, redirect} from '@remix-run/node';
import {Layout} from '~/components/Layout';
import {updateLeaderboard} from '~/utilities/leaderboard.server';
import {Errors, SafeUser} from '~/utilities/types';
import {isAdmin} from '~/utilities/user';
import {currentUser} from '~/utilities/user.server';

interface ActionResponse {
  success?: boolean;
  errors?: Errors;
}

export const action: ActionFunction = async ({request}) => {
  const errors: Errors = {};
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    errors.message =
      'You must be logged in as an Admin to update the leaderboard';
    return {errors};
  }

  const result = await updateLeaderboard(user);

  if (result.success) {
    return redirect('/leaderboard');
  }

  return result;
};

interface LoaderResponse {
  user: SafeUser;
}

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  return {user};
};

export default function Account() {
  const {user} = useLoaderData<LoaderResponse>();
  const transition = useTransition();
  const actionData = useActionData<ActionResponse>();

  return (
    <Layout user={user}>
      <h1>Update leaderboard</h1>
      <Form method="post">
        <button type="submit" disabled={Boolean(transition.submission)}>
          {transition.submission
            ? 'Updating leaderboard...'
            : 'Update leaderboard'}
        </button>
        {actionData?.errors?.message && <p>{actionData.errors.message}</p>}
      </Form>
    </Layout>
  );
}
