import {Form, useNavigation} from '@remix-run/react';
import {IndexGame} from '~/utilities/types';

export interface PickFormProps {
  game: IndexGame;
  onSubmit?: () => void;
}

export function PickForm({game, onSubmit}: PickFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="PickForm">
      <Form
        method="post"
        action={`/pick?game=${game.id}&team=${game.away.id}`}
        onSubmit={onSubmit}
      >
        <button type="submit" className="secondary" disabled={isSubmitting}>
          {game.away.nickName}
        </button>
      </Form>
      <Form
        method="post"
        action={`/pick?game=${game.id}&team=${game.home.id}`}
        onSubmit={onSubmit}
      >
        <button type="submit" className="secondary" disabled={isSubmitting}>
          {game.home.nickName}
        </button>
      </Form>
    </div>
  );
}
