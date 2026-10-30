import { redact } from '../src/config.mjs';
import { generateWallet } from '../src/chain/wallet.mjs';
try {
  const { address, keyPath } = await generateWallet();
  console.log(JSON.stringify({ address, keyPath }));
} catch (error) {
  console.error(redact(error.message));
  process.exitCode = 1;
}
