import {
  Form,
  ActionFunction,
  useActionData,
  useTransition,
  Link,
  MetaFunction,
} from 'remix';

import {TextField} from '~/components/TextField';
import {Layout} from '~/components/Layout';
import {requestReset} from '../utilities/user.server';
import {Errors} from '~/utilities/types';

interface ActionResponse {
  errors?: Errors;
  success: boolean;
}

export const meta: MetaFunction = () => {
  return {
    title: 'Request password reset | Make your picks',
    description: 'NFL playoff picks',
  };
};

export const action: ActionFunction = async ({request}) => {
  return await requestReset(request);
};

export default function RequestReset() {
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const errors = actionData?.errors;
  const success = actionData?.success;

  if (success) {
    return (
      <Layout>
        <div className="card account-form">
          <h1>Request reset</h1>
          <p>You will be emailed a link to reset your password 👍</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card account-form">
        <h1>Request reset</h1>
        <Form method="post">
          <div className="form-groups">
            <div className="form-group">
              <TextField
                type="email"
                name="email"
                label="Email"
                error={errors?.email}
              />
            </div>
            <div className="button-group">
              <button type="submit" disabled={Boolean(transition.submission)}>
                {transition.submission
                  ? 'Requesting reset...'
                  : 'Reset password'}
              </button>
            </div>
          </div>
        </Form>
        <p className="signup-link text-center">
          Don't need to reset? <Link to="/login">Log in!</Link>
        </p>
      </div>
    </Layout>
  );
}
