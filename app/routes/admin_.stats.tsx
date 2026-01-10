import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router';
import {ActionFunction, LoaderFunction, redirect} from 'react-router';
import {Layout} from '~/components/Layout';
import {recalculateAllStats} from '~/utilities/stats.server';
import {Errors, SafeUser} from '~/utilities/types';
import {isAdmin} from '~/utilities/user';
import {currentUser} from '~/utilities/user.server';

interface ActionResponse {
  success?: boolean;
  errors?: Errors;
  results?: {
    total: number;
    successful: number;
    failed: number;
    errors: {userId: number; username: string; error: string}[];
  };
}

export const action: ActionFunction = async ({request}) => {
  const errors: Errors = {};
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    errors.message =
      'You must be logged in as an Admin to recalculate user stats';
    return {errors};
  }

  try {
    const results = await recalculateAllStats();

    if (results.failed > 0) {
      errors.message = `Successfully updated ${results.successful} users, but ${results.failed} failed. Check console for details.`;
    }

    return {success: true, results};
  } catch (error) {
    console.error('Error recalculating stats:', error);
    errors.message = 'An error occurred while recalculating stats';
    return {errors};
  }
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

export default function AdminStats() {
  const {user} = useLoaderData<LoaderResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const actionData = useActionData<ActionResponse>();

  return (
    <Layout user={user}>
      <div className="AdminHeading">
        <h1>Recalculate stats</h1>
        <Link to="/stats" className="button">
          View stats
        </Link>
      </div>
      <div className="card">
        <p>
          This will recalculate statistics for all users based on their playoff
          picks and leaderboard positions in finished seasons.
        </p>
        <p>
          <strong>Note:</strong> This operation queries all users, picks, and
          leaderboards. It may take a moment to complete.
        </p>
      </div>
      <div className="card">
        <Form method="post">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recalculating stats...' : 'Recalculate all stats'}
          </button>
        </Form>
      </div>
      {actionData?.success && actionData.results && (
        <div className="card">
          <h3>✓ Stats Updated Successfully</h3>
          <p>Total users: {actionData.results.total}</p>
          <p>Successfully updated: {actionData.results.successful}</p>
          {actionData.results.failed > 0 && (
            <>
              <p>Failed: {actionData.results.failed}</p>
              <details>
                <summary>View errors</summary>
                <ul>
                  {actionData.results.errors.map((error) => (
                    <li key={error.userId}>
                      {error.username} (ID: {error.userId}): {error.error}
                    </li>
                  ))}
                </ul>
              </details>
            </>
          )}
        </div>
      )}
      {actionData?.errors?.message && (
        <div className="card">
          <p style={{color: 'red'}}>{actionData.errors.message}</p>
        </div>
      )}
    </Layout>
  );
}
