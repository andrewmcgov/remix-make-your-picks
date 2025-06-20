import { Form, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ActionFunction, LoaderFunction, redirect } from 'react-router';
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

export const loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  return {user};
};

export default function Account() {
  const {user} = useLoaderData<LoaderResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const actionData = useActionData<ActionResponse>();

  return (
    <Layout user={user}>
      <h1>Update leaderboard</h1>
      <Form method="post">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating leaderboard...' : 'Update leaderboard'}
        </button>
        {actionData?.errors?.message && <p>{actionData.errors.message}</p>}
      </Form>
    </Layout>
  );
}
