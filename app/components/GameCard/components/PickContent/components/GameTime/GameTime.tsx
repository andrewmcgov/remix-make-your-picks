import formatRelative from 'date-fns/formatRelative';

export interface GameTimeProps {
  start: string;
}

export function GameTime({start}: GameTimeProps) {
  return <p>{formatRelative(new Date(start), new Date())}</p>;
}
