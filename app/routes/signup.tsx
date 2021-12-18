import {ActionFunction, useActionData, useTransition, Form, Link} from 'remix';
import {signUp} from '~/utilities/user.server';
import {TextField} from '~/components/TextField';
import {Layout} from '~/components/Layout';

interface Errors {
  [key: string]: string;
}

interface ActionResponse {
  errors: Errors;
}

export const action: ActionFunction = async ({request}) => {
  return await signUp(request);
};

export default function SignUp() {
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const errors = actionData?.errors;

  return (
    <Layout>
      <div className="card account-form">
        <h1>Sign up</h1>
        <Form method="post">
          <TextField
            type="text"
            name="username"
            label="Username"
            error={errors?.username}
          />
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
          <TextField
            type="password"
            name="repeatpassword"
            label="Password"
            error={errors?.repeatpassword}
          />
          <TextField
            type="text"
            name="key"
            label="Signup key"
            error={errors?.key}
          />
          <div className="button-group">
            <button type="submit" disabled={Boolean(transition.submission)}>
              {transition.submission ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </Form>
        <p className="login-link text-center">
          Already have an account? <Link to="/login">Log in!</Link>
        </p>
      </div>
    </Layout>
  );
}
