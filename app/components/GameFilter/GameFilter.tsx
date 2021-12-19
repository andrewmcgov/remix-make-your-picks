import React from 'react';
import {Form, useSearchParams, useTransition} from 'remix';

import {
  seasonOptions,
  weekOptions2020,
  weekOptions2021,
} from '~/utilities/static-data';
import {Select} from '~/components/Select';

export function GameFilter() {
  const transition = useTransition();
  const [filterOpen, setFilterOpen] = React.useState(false);
  let [searchParams] = useSearchParams();
  const initialSeason = searchParams.get('season') || '2020';
  const initialWeek = searchParams.get('week') || '16';
  const [currentSeason, setCurrentSeason] = React.useState(initialSeason);
  const weekOptions =
    currentSeason === '2020' ? weekOptions2020 : weekOptions2021;
  const submitting = Boolean(transition.submission);

  if (!filterOpen) {
    return (
      <div className="GameFilter--toggle">
        <div className="button-group">
          <button className="secondary" onClick={() => setFilterOpen(true)}>
            Filter games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <Form method="get" className="GameFilter">
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
            className="secondary space-right"
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            Update games
          </button>
        </div>
      </Form>
    </div>
  );
}
