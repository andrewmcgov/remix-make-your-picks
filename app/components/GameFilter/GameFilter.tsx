import React from 'react';
import {
  Form,
  useSearchParams,
  useSubmit,
  useTransition,
} from '@remix-run/react';

import {
  defaultSeason,
  defaultWeek,
  seasonOptions,
  weekOptions2020,
  weekOptions2021,
  weekOptions2022,
  weekOptions2023,
} from '~/utilities/static-data';
import {Select} from '~/components/Select';

function getWeekOptions(season: string) {
  switch (season) {
    case '2020':
      return weekOptions2020;
    case '2021':
      return weekOptions2021;
    case '2022':
      return weekOptions2022;
    default:
      return weekOptions2023;
  }
}

export function GameFilter() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const initialSeason = searchParams.get('season') || defaultSeason;
  const initialWeek = searchParams.get('week') || defaultWeek;
  const [currentSeason, setCurrentSeason] = React.useState(initialSeason);
  const weekOptions = getWeekOptions(currentSeason);

  function handleFormChange(event: React.ChangeEvent<HTMLFormElement>) {
    submit(event.currentTarget, {replace: true});
  }

  return (
    <Form method="get" className="GameFilter" onChange={handleFormChange}>
      <Select
        label="Select week"
        labelHidden
        name="week"
        options={weekOptions}
        initialValue={initialWeek}
      />
      <Select
        label="Select season"
        labelHidden
        name="season"
        options={seasonOptions}
        initialValue={initialSeason}
        onChange={setCurrentSeason}
      />
    </Form>
  );
}
