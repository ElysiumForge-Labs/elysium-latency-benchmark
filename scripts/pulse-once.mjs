import { assertLive, loadConfig, redact } from '../src/config.mjs';
import { loadWallet } from '../src/chain/wallet.mjs';
import { pulseOnce } from '../src/benchmark/serial.mjs';
try {
  const config = loadConfig();
  assertLive(config);
  const result = await pulseOnce(await loadWallet(config.keyPath), config);
  console.log(JSON.stringify({ status: result.status, hash: result.hash, slot: result.slot }));
} catch (error) {
  console.error(redact(error.message));
  process.exitCode = 1;
}
