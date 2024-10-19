const ServiceTwo = require('./ServiceTwo');

const args = process.argv;
const vaultMsUrl = args.includes('--vault_ms_url')
  ? args[args.indexOf('--vault_ms_url') + 1]
  : null;
const serviceTwo = new ServiceTwo();
serviceTwo.vaultMsUrl = vaultMsUrl;
serviceTwo.run();
