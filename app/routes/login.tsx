import { Form, useActionData, useNavigation, Link } from 'react-router';
import { ActionFunction, MetaFunction } from 'react-router';

import {TextField} from '~/components/TextField';
import {Layout} from '~/components/Layout';
import {logIn} from '../utilities/user.server';
import {Errors} from '~/utilities/types';

interface ActionResponse {
  errors: Errors;
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Log in | Make your picks',
    },
    {name: 'description', content: 'NFL playoff picks'},
  ];
};

export const action: ActionFunction = async ({request}) => {
  return await logIn(request);
};

export default function LogIn() {
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const errors = actionData?.errors;

  return (
    <Layout>
      <div className="card account-form">
        <h1>Log in</h1>
        <Form method="post">
          <div className="form-groups">
            <div className="form-group">
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
            </div>
            <div className="button-group">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </div>
        </Form>
        <p className="signup-link text-center">
          Don't have an account? <Link to="/signup">Sign up!</Link>
        </p>

        <p className="signup-link text-center">
          <Link to="/request-reset">Reset your password.</Link>
        </p>
      </div>
    </Layout>
  );
}
