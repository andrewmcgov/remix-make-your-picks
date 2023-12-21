import {
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
} from '@remix-run/react';
import {
  LoaderFunction,
  redirect,
  MetaFunction,
  ActionFunction,
} from '@remix-run/node';
import {SafeUser} from '~/utilities/types';
import {currentUser, updateUser} from '~/utilities/user.server';
import {Layout} from '~/components/Layout';
import {TextField} from '~/components/TextField';
import {Errors} from '~/utilities/types';

interface LoaderResponse {
  user: SafeUser;
}

interface ActionResponse {
  errors: Errors;
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Account | Make your picks',
    },
    {name: 'description', content: 'NFL playoff picks'},
  ];
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user) {
    return redirect('/login');
  }

  return {user};
};

export const action: ActionFunction = async ({request}) => {
  return await updateUser(request);
};

export default function Account() {
  const {user} = useLoaderData<LoaderResponse>();
  const actionData = useActionData<ActionResponse>();
  const errors = actionData?.errors;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Layout user={user}>
      <div className="HeadingWithAction">
        <h1>Account</h1>
        <Form method="post" action="/logout">
          <button type="submit" disabled={isSubmitting}>
            {navigation.formAction === '/logout' ? 'Logging out' : 'Log out'}
          </button>
        </Form>
      </div>
      <div className="card">
        <h2>{user.username}</h2>
        <h3>Edit account details</h3>
        <Form method="post">
          <div className="form-groups">
            <div className="form-group">
              <TextField
                type="email"
                name="email"
                label="Email"
                defaultValue={user.email}
                error={errors?.email}
              />
              <TextField
                type="username"
                name="username"
                label="Username"
                defaultValue={user.username}
                error={errors?.username}
              />
            </div>
            <div className="button-group">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
