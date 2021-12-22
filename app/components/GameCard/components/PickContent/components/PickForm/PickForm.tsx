import {Form, useTransition} from 'remix';
import {IndexGame} from '~/utilities/types';

export interface PickFormProps {
  game: IndexGame;
}

export function PickForm({game}: PickFormProps) {
  const transition = useTransition();
  return (
    <div className="PickForm">
      <Form method="post" action={`/pick?game=${game.id}&team=${game.away.id}`}>
        <button
          type="submit"
          className="secondary"
          disabled={Boolean(transition.submission)}
        >
          {game.away.nickName}
        </button>
      </Form>
      <Form method="post" action={`/pick?game=${game.id}&team=${game.home.id}`}>
        <button
          type="submit"
          className="secondary"
          disabled={Boolean(transition.submission)}
        >
          {game.home.nickName}
        </button>
      </Form>
    </div>
  );
}
