import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  get_private_record(context: __compactRuntime.WitnessContext<Ledger, PS>,
                     pet_id_0: bigint): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  register_pet(context: __compactRuntime.CircuitContext<PS>,
               pet_id_0: bigint,
               commitment_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verify_vaccination(context: __compactRuntime.CircuitContext<PS>,
                     pet_id_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  revoke_verification(context: __compactRuntime.CircuitContext<PS>,
                      pet_id_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  register_pet(context: __compactRuntime.CircuitContext<PS>,
               pet_id_0: bigint,
               commitment_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verify_vaccination(context: __compactRuntime.CircuitContext<PS>,
                     pet_id_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  revoke_verification(context: __compactRuntime.CircuitContext<PS>,
                      pet_id_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  record_commitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  is_vaccinated: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
