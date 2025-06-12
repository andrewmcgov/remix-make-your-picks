import {MetaFunction, LoaderFunction} from '@remix-run/node';
import {useLoaderData, useSubmit, Form} from '@remix-run/react';
import {Layout} from '~/components/Layout';
import {Select} from '~/components/Select';
import {LeaderboardTable} from '~/components/LeaderboardTable';
import {getLeaderboard} from '~/utilities/leaderboard.server';
import {LeaderboardEntryWithUserAndTotal, SafeUser} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {defaultSeason, seasonOptions} from '~/utilities/static-data';
import {gameFilters} from '~/utilities/games.server';
import {db} from '~/utilities/db.server';

interface LoaderResponse {
  user: SafeUser | null;
  leaderboard: LeaderboardEntryWithUserAndTotal[];
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Leaderboard | Make your picks',
    },
  ];
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);
  const {season} = gameFilters(request);
  const leaderboard = await getLeaderboard(season);

  return {user, leaderboard};
};

export default function Leaderboard() {
  const submit = useSubmit();
  const {user, leaderboard} = useLoaderData<LoaderResponse>();

  function handleFormChange(event: React.ChangeEvent<HTMLFormElement>) {
    submit(event.currentTarget, {replace: true});
  }

  return (
    <Layout user={user}>
      <div className="AdminHeading">
        <h1>Leaderboard</h1>
        <Form method="get" onChange={handleFormChange}>
          <Select
            label="Select season"
            labelHidden
            name="season"
            options={seasonOptions}
            initialValue={defaultSeason}
          />
        </Form>
      </div>
      <div className="card">
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </Layout>
  );
}
