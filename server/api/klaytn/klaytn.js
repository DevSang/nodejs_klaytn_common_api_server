const myCav = require('../../utils/caver');

const { cav, cavConfig, contract } = myCav;

exports.createAccount = async () => {
  // create kalytn account
  const account = cav.klay.accounts.create();
  console.log(JSON.stringify(account));
};

exports.getBalance = async (address) => {
  const balance = await contract.methods.balanceOf(address).call();
  return cav.utils.fromPeb(balance, 'KLAY');
}

exports.requestToken = async (address, value) => {
  const senderAddress = cavConfig.address;
  cav.klay.accounts.wallet.add(cavConfig.pKey, senderAddress);

  const params = {
    from: senderAddress,
    gas: '3000000',
  };
  return contract.methods
    .transfer(address, cav.utils.toPeb(value, 'KLAY'))
    .send(params)
    .on('error', console.error);
};

exports.sendToken = async (fPkey, fAddress, tAddress, token) => {
  try {
    const feePayer = cav.klay.accounts.wallet.add(cavConfig.pKey); // 대납 feePayer wallet
    const toAddress = tAddress || cavConfig.loonAddress;
    let fromPkey = fPkey || cavConfig.pKey;
    let fromAddress = fAddress || cavConfig.fromAddress;
    if (fAddress === 'loon') {
      fromPkey = cavConfig.loonPkey;
      fromAddress = cavConfig.loonAddress;
    }

    const sender = cav.klay.accounts.wallet.add(fromPkey);
    const balance = await contract.methods.balanceOf(fromAddress).call();
    console.log(`contract addess: ${contract.options.address}`)
    console.log(`sender address ${sender.address}`)
    console.log(`sender balande ${balance}`)
    console.log(`recipient address ${toAddress}`)

    const pebToken = cav.utils.toPeb(token, 'KLAY');

    if (parseFloat(balance) < parseFloat(pebToken)) {
      throw new Error('balance is not enough')
    }
    const data = await contract.methods.transfer(toAddress, pebToken).encodeABI();
    const ops = {
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: sender.address,
      to: contract.options.address,
      data,
      gas: '300000',
      value: 0,
    };
    const { rawTransaction: senderRawTransaction } = await cav.klay.accounts.signTransaction(ops, sender.privateKey);
    const result = await cav.klay.sendTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      senderRawTransaction,
      feePayer: feePayer.address,
    });
    if (!result.status) {
      throw new Error('Transaction Error');
    }
    return { status: true, msg: result.transactionHash };
  } catch (err) {
    console.log(err);
    return { status: false, msg: err };
  }
};
