import {Form, ActionFunction, useActionData, useTransition, Link} from 'remix';

import {TextField} from '../components/TextField';
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
    <>
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
        <button type="submit" disabled={Boolean(transition.submission)}>
          {transition.submission ? 'Logging in...' : 'Log in'}
        </button>
      </Form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up!</Link>
      </p>
    </>
  );
}
