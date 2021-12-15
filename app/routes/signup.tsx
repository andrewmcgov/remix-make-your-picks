import {ActionFunction, Form, Link, redirect} from 'remix';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {db} from '../utilities/db.server';
import {userCookie} from '../cookies';

interface Errors {
  [key: string]: boolean;
}

export const action: ActionFunction = async ({request}) => {
  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  const formData = await request.formData();
  let email = formData.get('email') as string;
  let username = formData.get('username') as string;
  let password = formData.get('password') as string;
  let repeatpassword = formData.get('repeatpassword') as string;
  let key = formData.get('key') as string;

  let errors: Errors = {};
  if (!email) errors.email = true;
  if (!password) errors.password = true;
  if (!repeatpassword) errors.repeatpassword = true;
  if (!username) errors.username = true;
  if (!key) errors.key = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  if (key !== process.env.SIGNUP_KEY) {
    errors.key = true;
    return errors;
  }

  // Throw an error if the passwords do not match
  if (password !== repeatpassword) {
    errors.repeatpassword = true;
    return errors;
  }

  email = email.trim().toLowerCase();

  if (!validateEmail(email)) {
    errors.email = true;
    return errors;
  } else if (await db.user.findUnique({where: {email}})) {
    errors.email = true;
    return errors;
  }

  if (await db.user.findUnique({where: {username}})) {
    errors.ursername = true;
    return errors;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {email, password: hash, username},
  });

  if (!user) {
    // TODO: return a real error here?
    return null;
  }

  const token = jwt.sign({id: user.id}, process.env.APP_SECRET as string);
  const cookie = {id: token};

  return redirect('/', {
    headers: {
      'Set-Cookie': await userCookie.serialize(cookie),
    },
  });
};

export default function SignUp() {
  return (
    <>
      <h1>Sign up</h1>
      <Form method="post">
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <label>
          Repeat password
          <input type="password" name="repeatpassword" />
        </label>
        <label>
          Secret key 🤫
          <input type="text" name="key" />
        </label>
        <button type="submit">Log in</button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Log in!</Link>
      </p>
    </>
  );
}
