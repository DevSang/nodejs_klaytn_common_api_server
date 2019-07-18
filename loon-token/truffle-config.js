
const PrivateKeyConnector = require('connect-privkey-to-provider')

const NETWORK_ID = '1001'
const GASLIMIT = '30000000'
// const GASLIMIT = '100000000'
/**
 * We extracted `URL`, `PRIVATE_KEY` as const variable to set value easily.
 * Set your private key and klaytn node's URL in here.
 */
const URL = `https://api.baobab.klaytn.net:8651`
// const URL = 'http://localhost:8551';
const PRIVATE_KEY = '0xf66584dda7caabedc561f64196dd736c728e475a2bd1a5d99c334562899ba6c4'

module.exports = {
  networks: {
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
    baobab: {
      host: '127.0.0.1',
      port: 8551,
      from: '0xd378a66035ec7b43c3f8eebedf0446577ddb5c89', // enter your account address
      network_id: '1001', // Baobab network id
      gas: GASLIMIT, // transaction gas limit
      gasPrice: null, // gasPrice of Baobab is 25 Gpeb
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"    // Specify compiler's version to 0.4.24
    }
}
}