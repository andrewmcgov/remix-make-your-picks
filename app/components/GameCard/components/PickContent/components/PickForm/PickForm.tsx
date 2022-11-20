import {Form, useTransition} from '@remix-run/react';
import {IndexGame} from '~/utilities/types';

export interface PickFormProps {
  game: IndexGame;
  onSubmit?: () => void;
}

export function PickForm({game, onSubmit}: PickFormProps) {
  const transition = useTransition();
  return (
    <div className="PickForm">
      <Form
        method="post"
        action={`/resources/pick?game=${game.id}&team=${game.away.id}`}
        onSubmit={onSubmit}
      >
        <button
          type="submit"
          className="secondary"
          disabled={Boolean(transition.submission)}
        >
          {game.away.nickName}
        </button>
      </Form>
      <Form
        method="post"
        action={`/resources/pick?game=${game.id}&team=${game.home.id}`}
        onSubmit={onSubmit}
      >
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
