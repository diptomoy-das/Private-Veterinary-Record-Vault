import { createLogger } from './logger.js';
import { UndeployedConfig } from './config.js';
import * as api from './api.js';

const run = async () => {
  const config = new UndeployedConfig();
  const logger = await createLogger(config.logDir);
  api.setLogger(logger);

  try {
    logger.info('Initializing deployment...');

    // 1. WALLET SETUP
    // Use the Genesis Mint seed which comes pre-funded in the local Docker env
    const GENESIS_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

    logger.info('Building wallet and waiting for funds...');
    const walletContext = await api.buildWalletAndWaitForFunds(config, GENESIS_SEED);

    // 2. PROVIDER SETUP
    logger.info('Configuring providers...');
    const providers = await api.configureProviders(walletContext, config);

    // 3. DEPLOYMENT
    logger.info('Deploying Private Veterinary Record Vault...');
    const deployedContract = await api.deploy(providers);

    logger.info('--------------------------------------------------');
    logger.info('SUCCESS! Contract Deployed.');
    logger.info(`Contract Address: ${deployedContract.deployTxData.public.contractAddress}`);
    logger.info('--------------------------------------------------');

    // Clean up
    await api.closeWallet(walletContext);
  } catch (error) {
    logger.error('Deployment failed:');
    logger.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();