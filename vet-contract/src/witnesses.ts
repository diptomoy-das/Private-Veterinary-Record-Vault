import type { Witnesses, Ledger } from './managed/counter/contract/index.js';
import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

// Private state holding pet records (pet_id -> commitment)
export type CounterPrivateState = {
  records: Record<string, bigint>;
};

export const createPrivateState = (value: number): CounterPrivateState => {
  return {
    records: {},
  };
};

export const witnesses: Witnesses<CounterPrivateState> = {
  get_private_record(
    context: WitnessContext<Ledger, CounterPrivateState>,
    pet_id: bigint,
  ): [CounterPrivateState, bigint] {
    const record = context.privateState.records[pet_id.toString()] ?? 0n;
    return [context.privateState, record];
  },
};
