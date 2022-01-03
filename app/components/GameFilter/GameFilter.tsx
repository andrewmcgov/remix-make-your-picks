import React from 'react';
import {Form, useSearchParams, useSubmit, useTransition} from 'remix';

import {
  defaultSeason,
  defaultWeek,
  seasonOptions,
  weekOptions2020,
  weekOptions2021,
} from '~/utilities/static-data';
import {Select} from '~/components/Select';

export function GameFilter() {
  const transition = useTransition();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const [filterOpen, setFilterOpen] = React.useState(false);
  const initialSeason = searchParams.get('season') || defaultSeason;
  const initialWeek = searchParams.get('week') || defaultWeek;
  const [currentSeason, setCurrentSeason] = React.useState(initialSeason);
  const weekOptions =
    currentSeason === '2020' ? weekOptions2020 : weekOptions2021;
  const submitting = Boolean(transition.submission);

  if (!filterOpen) {
    return (
      <div className="GameFilter--toggle">
        <button className="secondary" onClick={() => setFilterOpen(true)}>
          Filter games
        </button>
      </div>
    );
  }

  function handleFormChange(event: React.ChangeEvent<HTMLFormElement>) {
    submit(event.currentTarget, {replace: true});
  }

  return (
    <div className="card">
      <Form method="get" className="GameFilter" onChange={handleFormChange}>
        <div className="GameFilter--Filters">
          <Select
            label="Select season"
            name="season"
            options={seasonOptions}
            initialValue={initialSeason}
            onChange={setCurrentSeason}
          />
          <Select
            label="Select week"
            name="week"
            options={weekOptions}
            initialValue={initialWeek}
          />
        </div>
        <div className="GameFilter--buttons">
          <button
            onClick={() => setFilterOpen(false)}
            className="secondary"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
