const Caver = require('caver-js');

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651',
};

const cav = new Caver(config.rpcURL);
const fromAddress = '0xd378a66035ec7b43c3f8eebedf0446577ddb5c89'; // contract owner address
const pKey = '0xf66584dda7caabedc561f64196dd736c728e475a2bd1a5d99c334562899ba6c4'; // contract owner pKey
const loonAddress = '0xea7fc20ea55c16ea631e880a9e936a30146a8d3b'; // loon address
const loonPkey = '0x1bd8062596dffd3e9b400c86e8811f4aac70b6ecb05d6975331cbbff7ec44a93';
const cavConfig = {
  fromAddress, pKey, loonAddress, loonPkey,
};
const myERC20 = require('../../loon-token/build/contracts/MyERC20.json');

const contractAddress = '0x96b16d0C8dA2E05A464c58F51Bb118f9bF3F1D51';
const contract = new cav.klay.Contract(myERC20.abi, contractAddress);

exports.cav = cav;
exports.cavConfig = cavConfig;
exports.contract = contract;
