import {Form, ActionFunction, Link, redirect} from 'remix';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {db} from '../utilities/db.server';
import {userCookie} from '../cookies';

interface Errors {
  [key: string]: boolean;
}

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  let email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let errors: Errors = {};
  if (!email) errors.email = true;
  if (!password) errors.password = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  email = email.trim();

  const user = await db.user.findUnique({where: {email}});

  if (!user) {
    errors.email = true;
    return errors;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    errors.password = true;
    return errors;
  }

  const token = jwt.sign({id: user.id}, process.env.APP_SECRET as string);
  const cookie = {id: token};

  return redirect('/', {
    headers: {
      'Set-Cookie': await userCookie.serialize(cookie),
    },
  });
};

export default function LogIn() {
  return (
    <>
      <h1>Log in</h1>
      <Form method="post">
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit">Log in</button>
      </Form>
      <p>
        Don't have an account? <Link to="/signup">Sign up!</Link>
      </p>
    </>
  );
}
