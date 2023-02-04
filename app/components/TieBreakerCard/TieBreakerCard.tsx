import {Form, useTransition, useActionData} from '@remix-run/react';
import {TextField} from '../TextField';
import {Errors} from '~/utilities/types';

export interface TieBreakerCardProps {
  userTieBreaker?: number;
  superbowlStarted: boolean;
}

interface ActionResponse {
  errors: Errors;
}

export function TieBreakerCard({
  userTieBreaker,
  superbowlStarted,
}: TieBreakerCardProps) {
  const actionData = useActionData<ActionResponse>();
  const transition = useTransition();
  const errors = actionData?.errors;

  return (
    <div className="card TieBreakerCard">
      <div>
        <h3>Tiebreaker</h3>
        <p>Guess the total points scored in the Super Bowl</p>
      </div>
      {superbowlStarted && !userTieBreaker ? (
        <p>It's too late too add your tiebreaker pick!</p>
      ) : null}
      {userTieBreaker ? (
        <div className="TieBreakerCard--value">
          <p>
            Your guess: <strong>{userTieBreaker}</strong>
          </p>
        </div>
      ) : null}
      {!superbowlStarted ? (
        <Form method="post">
          <div className="TieBreakerCard--form">
            <TextField
              type="number"
              name="value"
              label="Total points"
              pattern="[0-9]*"
              min="0"
              error={errors?.value}
              defaultValue={userTieBreaker?.toString()}
            />
            <button type="submit" disabled={Boolean(transition.submission)}>
              {transition.submission ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          {errors?.message ? (
            <p className="TextField--error">{errors.message}</p>
          ) : null}
        </Form>
      ) : null}
    </div>
  );
}
