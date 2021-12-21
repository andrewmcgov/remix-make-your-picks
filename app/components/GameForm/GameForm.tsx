import {Form, useActionData, useTransition} from 'remix';
import {
  defaultSeason,
  seasonOptions,
  weekOptions2020,
  defaultWeek,
} from '~/utilities/static-data';
import {AdminGame, Option} from '~/utilities/types';
import {Select} from '../Select';
import {TextField} from '../TextField';

export interface GameFormProps {
  game?: AdminGame;
  teamOptions: Option[];
}

interface Errors {
  [key: string]: string;
}

interface ActionResponse {
  errors: Errors;
}

function getDateTimeValues(date: Date) {
  return {
    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    time: `${date.getHours()}:${date.getMinutes()}`,
  };
}

export function GameForm({game, teamOptions}: GameFormProps) {
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const dateTimeValues = game && getDateTimeValues(new Date(game.start));
  const saveButtonText = game ? 'Update game' : 'Create game';

  return (
    <div className="GameForm">
      <div className="card">
        <Form method="post">
          <div className="form-groups">
            <div className="form-group">
              <Select
                label="Select season"
                name="season"
                options={seasonOptions}
                initialValue={game?.season || defaultSeason}
              />
              <Select
                label="Select week"
                name="week"
                options={weekOptions2020}
                initialValue={game?.week || defaultWeek}
              />
            </div>
            <div className="form-group">
              <Select
                label="Away team"
                name="awayId"
                options={teamOptions}
                initialValue={String(game?.away.id) || teamOptions[0].value}
              />
              <Select
                label="Home team"
                name="homeId"
                options={teamOptions}
                initialValue={String(game?.home.id) || teamOptions[0].value}
              />
            </div>
            <div className="form-group">
              <TextField
                type="date"
                name="date"
                label="Date"
                defaultValue={dateTimeValues?.date}
              />
              <TextField
                type="time"
                name="time"
                label="Time"
                defaultValue={dateTimeValues?.time || '13:00'}
              />
            </div>
            <div className="button-group">
              <button type="submit" disabled={Boolean(transition.submission)}>
                {transition.submission ? 'Saving...' : saveButtonText}
              </button>
            </div>
            {actionData?.errors?.message && (
              <p className="TextField--error">{actionData.errors.message}</p>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
