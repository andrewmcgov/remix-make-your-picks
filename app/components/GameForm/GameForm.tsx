import React, {useRef, useState} from 'react';
import {Form, useActionData, useTransition} from 'remix';
import {
  defaultSeason,
  seasonOptions,
  defaultWeek,
  weekOptions2021,
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
    date: `${asTwoDigitValue(date.getFullYear())}-${asTwoDigitValue(
      date.getMonth() + 1
    )}-${asTwoDigitValue(date.getDate())}`,
    time: `${date.getHours()}:${asTwoDigitValue(date.getMinutes())}`,
  };
}

function asTwoDigitValue(value: number) {
  return value < 10 ? `0${value}` : value;
}

export function GameForm({game, teamOptions}: GameFormProps) {
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const dateTimeValues = getDateTimeValues(
    game ? new Date(game.start) : new Date()
  );
  const saveButtonText = game ? 'Update game' : 'Create game';
  const [start, setStart] = useState(
    (game ? new Date(game.start) : new Date()).toISOString()
  );
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLFormElement>) {
    const name = event.target.name;

    if (formRef.current && (name === 'date' || name === 'time')) {
      const formData = new FormData(formRef.current);
      const date = formData.get('date') as string;
      const time = formData.get('time') as string;
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');

      const newStart = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes)
      );

      if (!isNaN(newStart.getHours())) {
        setStart(newStart.toISOString());
      }
    }
  }

  return (
    <div className="GameForm">
      <div className="card">
        <Form method="post" onChange={handleChange} ref={formRef}>
          <input type="text" value={start} name="start" readOnly hidden />
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
                options={weekOptions2021}
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
                defaultValue={dateTimeValues.date}
              />
              <TextField
                type="time"
                name="time"
                label="Time"
                defaultValue={game ? dateTimeValues?.time : '13:00'}
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
