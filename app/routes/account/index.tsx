import {LoaderFunction, useLoaderData, redirect} from 'remix';

import {db} from '../../utilities/db.server';

export let loader: LoaderFunction = async () => {
  // const user = await db.user.findFirst();

  if (true) {
    return redirect('/login');
  }
};

export default function Account() {
  return <h2>Account page</h2>;
}
