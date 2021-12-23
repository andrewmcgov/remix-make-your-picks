import {
  LoaderFunction,
  useLoaderData,
  redirect,
  MetaFunction,
  ActionFunction,
  Link,
  Form,
} from 'remix';
import {SafeUser, AdminGame, Option} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';
import {GameForm} from '~/components/GameForm';
import {getTeamOptions} from '~/utilities/teams.server';
import {isAdmin} from '~/utilities/user';
import {getGameData} from '~/utilities/games.server';
import {TextField} from '~/components/TextField';

interface LoaderResponse {
  user: SafeUser;
  game: AdminGame;
  teamOptions: Option[];
}
interface Errors {
  [key: string]: string;
}

export const meta: MetaFunction = () => {
  return {
    title: 'Close game | Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request, params}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  const game = await db.game.findUnique({
    where: {
      id: Number(params.gameId),
    },
    include: {
      home: true,
      away: true,
      picks: {select: {id: true}},
    },
  });

  if (!game) {
    throw new Response('Not Found', {status: 404});
  }

  return {game, user};
};

export const action: ActionFunction = async ({request, params}) => {
  let errors: Errors = {};
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    errors.message = 'Only admins can close games.';
    return {errors};
  }

  const formData = await request.formData();
  const homeScore = formData.get('homeScore');
  const awayScore = formData.get('awayScore');

  if (homeScore === null || awayScore === null) {
    errors.message = 'Home and away scores are required.';
    return {errors};
  }

  // Get the game from the database, and include all picks for that game
  const game = await db.game.findUnique({
    where: {id: Number(params.gameId)},
    include: {picks: true},
  });

  if (!game) {
    errors.message = 'Could not find matching game.';
    return {errors};
  }

  // Ensure scores are numbers
  if (isNaN(Number(homeScore)) || isNaN(Number(awayScore))) {
    errors.message = 'Scores must be numbers.';
    return {errors};
  }

  // Find calculate the winner of the game
  const winnerId =
    Number(homeScore) > Number(awayScore) ? game.homeId : game.awayId;

  // Save the winnerId of the winning team on the game
  await db.game.update({
    where: {id: game.id},
    data: {
      winnerId: Number(winnerId),
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
    },
  });

  // For all picks of that game, set the correct and closed values based on the winner of the pick

  await Promise.all(
    game.picks.map(async (pick) => {
      const updatedPick = await db.pick.update({
        where: {id: pick.id},
        data: {closed: true, correct: Number(winnerId) === pick.teamId},
      });

      if (!updatedPick.closed) {
        errors.message = 'Error updating picks for this game.';
      }
    })
  );

  if (errors.message) {
    return {errors};
  }

  return redirect('/admin');
};

export default function AdminGame() {
  const {game, user} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <h1>
        Close {game.away.nickName} @ {game.home.nickName}
      </h1>
      <div className="card">
        <Form method="post">
          <div className="form-groups">
            <div className="form-group">
              <TextField
                type="number"
                name="awayScore"
                label={`${game.away.nickName} score`}
              />
              <TextField
                type="number"
                name="homeScore"
                label={`${game.home.nickName} score`}
              />
            </div>
            <div className="button-group">
              <button type="submit">Close game</button>
            </div>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
