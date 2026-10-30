import { assertBenchmarkLive, assertLive, loadBenchmarkConfig, loadConfig, redact } from '../src/config.mjs';
import { loadWallet } from '../src/chain/wallet.mjs';
import { runBenchmarkLoop, runLoop } from '../src/benchmark/loop.mjs';
import { openBenchmarkOwner, systemClock } from '../src/benchmark/engine.mjs';
import { clockOffsetTracker } from '../src/benchmark/clock.mjs';
import { compileMinutePulse } from '../src/chain/contract.mjs';
import { clients, verifyNetwork } from '../src/chain/client.mjs';

try {
  const config = loadConfig();
  const benchmark = loadBenchmarkConfig();
  const account = await loadWallet(config.keyPath);
  if (benchmark.profile === 'serial-1') {
    assertLive(config);
    await runLoop({ account, config });
  } else {
    assertBenchmarkLive(config, benchmark);
    const { publicClient } = clients(account, config);
    await verifyNetwork(publicClient, config);
    const owner = await openBenchmarkOwner({
      config,
      benchmark,
      account,
      artifact: compileMinutePulse(),
      chain: publicClient,
      clock: systemClock(),
      clockOffset: clockOffsetTracker(),
    });
    try {
      await runBenchmarkLoop({ owner, config, benchmark });
    } finally {
      await owner.close();
    }
  }
} catch (error) {
  console.error(redact(error.message));
  process.exitCode = 1;
}
