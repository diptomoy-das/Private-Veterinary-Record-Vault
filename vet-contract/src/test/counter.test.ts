import { CounterSimulator, logger } from "./simulators/simulator.js";
import { describe, it, expect } from "vitest";
import * as utils from "./utils/utils.js";
import { CoinPublicKey } from "@midnight-ntwrk/compact-runtime";

// Callers
export const player1 = utils.toHexPadded("player1");
export const player2 = utils.toHexPadded("player2");

function createSimulator() {
  const simulator = CounterSimulator.deployContract(0);
  simulator.createPrivateState("p2", 1);
  return simulator;
}

// Test data
const PET_ID = 42n;
const COMMITMENT = 123456789n; // Simulated hash of a private health record

describe("Private Veterinary Record Vault", () => {
  it("displays initial (empty) state", () => {
    const simulator = createSimulator();
    const initialLedger = simulator.as("p1").getLedger();
    const initialPrivateState = simulator.as("p1").getPrivateState();
    const circuitContext = simulator.as("p1").getCircuitContext();

    // Both maps should start empty
    expect(initialLedger.record_commitments.isEmpty()).toBe(true);
    expect(initialLedger.is_vaccinated.isEmpty()).toBe(true);

    logger.info({
      section: "Initial State",
      recordCommitmentsEmpty: initialLedger.record_commitments.isEmpty(),
      isVaccinatedEmpty: initialLedger.is_vaccinated.isEmpty(),
      privateState: initialPrivateState,
    });
    logger.info({
      section: "Context",
      costModel: circuitContext.costModel,
      gasLimit: circuitContext.gasLimit,
    });
  });

  it("registers a pet with a commitment", () => {
    const simulator = createSimulator();
    const ledgerAfterRegister = simulator.as("p1").registerPet(PET_ID, COMMITMENT);

    // The commitment should now be stored on-chain
    expect(ledgerAfterRegister.record_commitments.member(PET_ID)).toBe(true);
    expect(ledgerAfterRegister.record_commitments.lookup(PET_ID)).toEqual(COMMITMENT);

    // Vaccination status should not be set yet
    expect(ledgerAfterRegister.is_vaccinated.member(PET_ID)).toBe(false);

    logger.info({
      section: "After register_pet",
      hasPet: ledgerAfterRegister.record_commitments.member(PET_ID),
      commitment: ledgerAfterRegister.record_commitments.lookup(PET_ID),
    });
  });

  it("verifies vaccination with matching private record", () => {
    const simulator = createSimulator();

    // First, store the commitment as a private record so the witness can return it
    simulator.as("p1").getPrivateState().records[PET_ID.toString()] = COMMITMENT;

    // Register the pet
    simulator.as("p1").registerPet(PET_ID, COMMITMENT);

    // Verify vaccination — the witness will return the private record
    // which should match the on-chain commitment
    const ledgerAfterVerify = simulator.as("p1").verifyVaccination(PET_ID);

    // The pet should now be marked as vaccinated
    expect(ledgerAfterVerify.is_vaccinated.member(PET_ID)).toBe(true);
    expect(ledgerAfterVerify.is_vaccinated.lookup(PET_ID)).toBe(true);

    logger.info({
      section: "After verify_vaccination",
      isVaccinated: ledgerAfterVerify.is_vaccinated.lookup(PET_ID),
    });
  });

  it("revokes vaccination status", () => {
    const simulator = createSimulator();

    // Store private record and register + verify
    simulator.as("p1").getPrivateState().records[PET_ID.toString()] = COMMITMENT;
    simulator.as("p1").registerPet(PET_ID, COMMITMENT);
    simulator.as("p1").verifyVaccination(PET_ID);

    // Now revoke
    const ledgerAfterRevoke = simulator.as("p1").revokeVerification(PET_ID);

    // Vaccination status should be revoked (set to false)
    expect(ledgerAfterRevoke.is_vaccinated.member(PET_ID)).toBe(true);
    expect(ledgerAfterRevoke.is_vaccinated.lookup(PET_ID)).toBe(false);

    logger.info({
      section: "After revoke_verification",
      isVaccinated: ledgerAfterRevoke.is_vaccinated.lookup(PET_ID),
    });
  });
});
