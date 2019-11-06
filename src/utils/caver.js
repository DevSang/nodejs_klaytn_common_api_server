const Caver = require('caver-js');
const { prisma } = require('../generated/prisma-client')


const config = {
  rpcURL: process.env.KLAYTN_RPCURL,
};
const cav = new Caver(config.rpcURL);
const myERC20 = require('../../loon-token/build/contracts/LoonGEM.json');

// module.exports = async (req, res, next) => {

//   const contractAddress = process.env.SMART_CONTRACT_ADDRESS;
//   // const contractAddress = '0x5B5a7E08F9ff6E4dD1f71086eff77DD404b5Eb9a';
//   const contract = new cav.klay.Contract(myERC20.abi, contractAddress);
  
//   const ownerWallet = await prisma.userWallets({where: {address: process.env.SMART_CONTRACT_OWNER_ADDRESS}});
//   const contractOwner = {
//     address: process.env.SMART_CONTRACT_OWNER_ADDRESS,
//     pKey: process.env.SMART_CONTRACT_OWNER_KEY,
//     walletId: ownerWallet[0].id,
//     userRowId: ownerWallet[0].userRowId,
//   }

//   const loonWallet = await prisma.userWallets({where: {address: process.env.LOON_ADDRESS}});
//   const loon = {
//     address: process.env.LOON_ADDRESS,
//     pKey: process.env.LOON_KEY,
//     walletId: loonWallet[0].id,
//     userRowId: loonWallet[0].userRowId,
//   }

//   res.locals.contract = contract;
//   res.locals.cav = cav;
//   res.locals.cavConfig = {contractOwner, loon};
//   next();
// }

// const ownerWallet = await prisma.userWallets({address: process.env.SMART_CONTRACT_OWNER_ADDRESS});
// const contractOwner = {
//   address: process.env.SMART_CONTRACT_OWNER_ADDRESS,
//   pKey: process.env.SMART_CONTRACT_OWNER_KEY,
//   walletId: ownerWallet[0].id,
//   userRowId: ownerWallet[0].userRowId,
// }

// const loonWallet = await prisma.userWallets({address: process.env.LOON_ADDRESS});
// const loon = {
//   address: process.env.LOON_ADDRESS,
//   pKey: process.env.LOON_KEY,
//   walletId: loonWallet[0].id,
//   userRowId: loonWallet[0].userRowId,
// }

const fromAddress = process.env.SMART_CONTRACT_OWNER_ADDRESS; // contract owner address
const pKey = process.env.SMART_CONTRACT_OWNER_KEY; // contract owner pKey
const loonAddress = process.env.LOON_ADDRESS; // loon address
const loonPkey = process.env.LOON_KEY;
// const cavConfig = {
//   fromAddress, pKey, loonAddress, loonPkey, loonUserRowId, 
// };

const contractAddress = process.env.SMART_CONTRACT_ADDRESS;
// // const contractAddress = '0x5B5a7E08F9ff6E4dD1f71086eff77DD404b5Eb9a';
const contract = new cav.klay.Contract(myERC20.abi, contractAddress);

exports.cav = cav;
exports.cavInfo = {
  contractOwner : {
    address: process.env.SMART_CONTRACT_OWNER_ADDRESS,
    pKey: process.env.SMART_CONTRACT_OWNER_KEY,
  },
  loon: {
    address: process.env.LOON_ADDRESS,
    pKey: process.env.LOON_KEY,
  }
}
exports.getDbCavInfo = async () => {
  const ownerWallet = await prisma.userWallets({where: {address: process.env.SMART_CONTRACT_OWNER_ADDRESS}});
  const contractOwner = {
    address: process.env.SMART_CONTRACT_OWNER_ADDRESS,
    pKey: process.env.SMART_CONTRACT_OWNER_KEY,
    walletId: ownerWallet[0].id,
    userRowId: ownerWallet[0].userRowId,
  }

  const loonWallet = await prisma.userWallets({where: {address: process.env.LOON_ADDRESS}});
  const loon = {
    address: process.env.LOON_ADDRESS,
    pKey: process.env.LOON_KEY,
    walletId: loonWallet[0].id,
    userRowId: loonWallet[0].userRowId,
  }
  return {contractOwner, loon}
};
exports.contract = contract;
