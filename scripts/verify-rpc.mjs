import { loadConfig, redact } from '../src/config.mjs';
import { clients, verifyNetwork } from '../src/chain/client.mjs';
try {
  const config = loadConfig();
  const { publicClient } = clients(undefined, config);
  console.log(JSON.stringify(await verifyNetwork(publicClient, config)));
} catch (error) {
  console.error(redact(error.message));
  process.exitCode = 1;
}
