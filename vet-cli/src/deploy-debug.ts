import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { UndeployedConfig, contractConfig } from './config.js';
import { Contract, Witnesses } from './managed/counter/contract/index.js';
import * as api from './api.js';
import { createLogger } from './logger.js';

// 1. DEFINE THE WITNESS (Private Data Provider)
// This must match the 'witness get_private_record' in your counter.compact file.
const privateRecordWitnesses: Witnesses<any> = {
  get_private_record: (pet_id: bigint) => {
    console.log(`[Witness] Providing private record for Pet ID: ${pet_id}`);
    // Returns a dummy 31-byte array for the pet's commitment.
    return new Uint8Array(31).fill(1); 
  },
};

const run = async () => {
  const logger = await createLogger('deploy-debug');
  api.setLogger(logger);
  
  try {
    console.log('\n--- STARTING DEBUG DEPLOYMENT ---');

    const config = new UndeployedConfig();
    console.log('1. Configuration loaded');

    const GENESIS_SEED = '0000000000000000000000000000000000000000000000000000000000000001';
    
    console.log('2. Building Wallet...');
    const wallet = await api.buildWalletAndWaitForFunds(config, GENESIS_SEED);
    console.log('   ✓ Wallet synced and funded!');

    console.log('3. Configuring Providers...');
    const providers = await api.configureProviders(wallet, config);

    console.log('4. Preparing ZK Assets...');
    // We manually compile the contract here to ensure it uses the new circuits 
    // and the witnesses we defined above.
    const vetVaultCompiledContract = CompiledContract.make('counter', Contract).pipe(
      CompiledContract.withWitnesses(privateRecordWitnesses),
      CompiledContract.withCompiledFileAssets(contractConfig.zkConfigPath),
    );

    console.log('5. Deploying Vet Vault Contract...');
    // We deploy with an empty initial private state since the vault 
    // uses Map-based ledger storage.
    const deployedContract = await deployContract(providers, {
      compiledContract: vetVaultCompiledContract,
      privateStateId: 'vetVaultPrivateState',
      initialPrivateState: {},
    });

    console.log('\nSUCCESS! Private Veterinary Record Vault Deployed.');
    console.log(`Contract Address: ${deployedContract.deployTxData.public.contractAddress}`);

  } catch (error) {
    console.error('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('CRITICAL FAILURE DETECTED');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
    console.dir(error, { depth: null, colors: true });
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();