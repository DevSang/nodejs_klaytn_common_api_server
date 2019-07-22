const Caver = require('caver-js');

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651',
};
const cav = new Caver(config.rpcURL);

exports.createAccount = async () => {
  // create kalytn account
  const account = cav.klay.accounts.create();
  console.log(JSON.stringify(account));
};

exports.requestToken = async (address, value) => {
  const senderAddress = '0xd378a66035ec7b43c3f8eebedf0446577ddb5c89';
  cav.klay.accounts.wallet.add(
    '0xf66584dda7caabedc561f64196dd736c728e475a2bd1a5d99c334562899ba6c4',
    senderAddress
  );

  const myERC20 = require('../../../loon-token/build/contracts/MyERC20.json');
  const params = {
    from: senderAddress,
    gas: '3000000',
  };
  const contractAddress = '0x96b16d0C8dA2E05A464c58F51Bb118f9bF3F1D51';
  const contract = new cav.klay.Contract(myERC20.abi, contractAddress, params);

  const events = await contract.events.allEvents();
  console.log(JSON.stringify(events));

  return (
    contract.methods
      .transfer(address, cav.utils.toPeb(value, 'KLAY'))
      .send({ ...params })
      // .on('transactionHash', (hash) => {
      //   // console.log(hash);
      //   // console.log('-' * 50);
      // })
      // // .on('receipt', (receipt) => {
      // //   // console.log(receipt);
      // // })
      .on('error', console.error)
  );

  // const result = await contract.methods
  //   .transfer(address, cav.utils.toPeb(value, 'KLAY'))
  //   .send({ ...params });
  // return result.transactionHash;
};
