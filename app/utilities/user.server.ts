import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {redirect} from 'remix';
import {db} from '../utilities/db.server';
import {userCookie} from '../cookies';
import {SafeUser} from './types';

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

interface Errors {
  [key: string]: string;
}

export async function signUp(request: Request) {
  const formData = await request.formData();
  let email = formData.get('email') as string;
  let username = formData.get('username') as string;
  let password = formData.get('password') as string;
  let repeatpassword = formData.get('repeatpassword') as string;
  let key = formData.get('key') as string;

  let errors: Errors = {};
  if (!email) errors.email = 'Please provide an email';
  if (!password) errors.password = 'Please provide a password';
  if (!repeatpassword) errors.repeatpassword = 'Please repeat your password';
  if (!username) errors.username = 'Please provide your email';
  if (!key) errors.key = 'Please provide the signup key';

  if (Object.keys(errors).length) {
    return {errors};
  }

  if (key !== process.env.SIGNUP_KEY) {
    errors.key = 'Sign up key is incorrect';
    return {errors};
  }

  // Throw an error if the passwords do not match
  if (password !== repeatpassword) {
    errors.repeatpassword = 'Passwords do not match!';
    return {errors};
  }

  email = email.trim().toLowerCase();

  if (!validateEmail(email)) {
    errors.email = 'Please provide a valid email!';
    return {errors};
  } else if (await db.user.findUnique({where: {email}})) {
    errors.email = 'This user already exists!';
    return {errors};
  }

  if (await db.user.findUnique({where: {username}})) {
    errors.username = 'This username already exists!';
    return {errors};
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {email, password: hash, username},
  });

  if (!user) {
    errors.banner = 'Error creating user!';
    return null;
  }

  const token = jwt.sign({id: user.id}, process.env.APP_SECRET as string);
  const cookie = {id: token};

  return redirect('/', {
    headers: {
      'Set-Cookie': await userCookie.serialize(cookie),
    },
  });
}

export async function logIn(request: Request) {
  const formData = await request.formData();
  let email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let errors: Errors = {};
  if (!email) errors.email = 'Please provide an email address';
  if (!password) errors.password = 'Please provide a password';

  if (Object.keys(errors).length) {
    return errors;
  }

  email = email.trim();

  const user = await db.user.findUnique({where: {email}});

  if (!user) {
    errors.email = 'Could not find user with this email.';
    return {errors};
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    errors.password = 'Username or password were incorrect!';
    return {errors};
  }

  const token = jwt.sign({id: user.id}, process.env.APP_SECRET as string);
  const cookie = {id: token};

  return redirect('/', {
    headers: {
      'Set-Cookie': await userCookie.serialize(cookie),
    },
  });
}

export async function currentUser(request: Request): Promise<SafeUser | null> {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const token = cookie.id;

  if (token) {
    const id = (
      jwt.verify(token, process.env.APP_SECRET as string) as {id: string}
    )?.id;
    return await db.user.findUnique({
      where: {id: Number(id)},
      select: {username: true, email: true, id: true, isAdmin: true},
    });
  }

  return null;
}

export async function logOut(request: Request) {
  return redirect('/', {
    headers: {
      'Set-Cookie': await userCookie.serialize({}, {maxAge: Date.now()}),
    },
  });
}
