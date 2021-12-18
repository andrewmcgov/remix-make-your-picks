import {Form, ActionFunction, useActionData, useTransition, Link} from 'remix';

import {TextField} from '~/components/TextField';
import {Layout} from '~/components/layout';
import {logIn} from '../utilities/user.server';

interface Errors {
  [key: string]: string;
}

interface ActionResponse {
  errors: Errors;
}

export const action: ActionFunction = async ({request}) => {
  return await logIn(request);
};

export default function LogIn() {
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const errors = actionData?.errors;

  return (
    <Layout>
      <div className="card account-form">
        <h1>Log in</h1>
        <Form method="post">
          <TextField
            type="email"
            name="email"
            label="Email"
            error={errors?.email}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            error={errors?.password}
          />
          <div className="button-group">
            <button type="submit" disabled={Boolean(transition.submission)}>
              {transition.submission ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </Form>
        <p className="signup-link text-center">
          Don't have an account? <Link to="/signup">Sign up!</Link>
        </p>
      </div>
    </Layout>
  );
}
