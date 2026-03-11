import { query } from './query';

export function strictQuery<TIn, TOut = TIn>(
  ...steps: any[]
): (data: TIn[]) => TOut[] {
  return query<TIn, TOut>(...steps);
}