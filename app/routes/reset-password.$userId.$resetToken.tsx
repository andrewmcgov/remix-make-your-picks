import {
  Form,
  useActionData,
  useTransition,
  Link,
  useLoaderData,
} from '@remix-run/react';
import {
  ActionFunction,
  V2_MetaFunction as MetaFunction,
  LoaderFunction,
} from '@remix-run/node';

import {TextField} from '~/components/TextField';
import {Layout} from '~/components/Layout';
import {resetPassword} from '~/utilities/user.server';
import {db} from '~/utilities/db.server';
import {Errors} from '~/utilities/types';

interface ActionResponse {
  errors?: Errors;
  success: boolean;
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Reset password | Make your picks',
    },
    {name: 'description', content: 'NFL playoff picks'},
  ];
};

export const loader: LoaderFunction = async ({params}) => {
  const user = await db.user.findFirst({
    where: {id: Number(params.userId), resetToken: params.resetToken},
  });

  if (!user || !user.resetExpiry) {
    return {valid: false};
  }

  const tokenExpired = Date.now() > Number(user.resetExpiry);

  if (tokenExpired) {
    return {valid: false};
  }

  return {valid: true};
};

export const action: ActionFunction = async ({request, params}) => {
  return await resetPassword(request, params.userId, params.resetToken);
};

export default function RequestReset() {
  const loaderData = useLoaderData<{valid: boolean}>();
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const errors = actionData?.errors;

  if (!loaderData.valid) {
    return (
      <Layout>
        <div className="card account-form">
          <h1>Invalid reset token</h1>
          <p>
            The password reset token provided is invalid or expired. Please{' '}
            <Link to="/request-reset">request another password reset.</Link>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card account-form">
        <h1>Reset password</h1>
        {errors?.message && (
          <p className="TextField--error">{errors.message}</p>
        )}
        <p className="TextField--error"></p>
        <Form method="post">
          <div className="form-groups">
            <div className="form-group">
              <TextField
                type="password"
                name="password"
                label="New password"
                error={errors?.email}
              />
              <TextField
                type="password"
                name="repeatpassword"
                label="Repeat new password"
                error={errors?.email}
              />
            </div>
            <div className="button-group">
              <button type="submit" disabled={Boolean(transition.submission)}>
                {transition.submission
                  ? 'Resetting password...'
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
