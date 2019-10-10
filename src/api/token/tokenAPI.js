const myCav = require('../../utils/caver');
const { prisma } = require('../../generated/prisma-client')

let { cav, contract, cavInfo, getDbCavInfo } = myCav;


// loon ai db에 user 생성
exports.createAccount = async (req, res, next) => {
  try {
    // create HEMO database
    const createTime = new Date();
    if(res.locals.user) {
      const rr = await prisma.updateManyUserWallets({data: {status: false, updateTime: new Date()}, where: {userRowId: res.locals.user.id}})
      let wallet = await prisma.createUserWallet({address: req.body.wallet_address, createTime, userRowId: res.locals.user.id});
      res.status(201).json({wallet, user: res.locals.user, isExist: true});
    } else {
      let wallet = await prisma.createUserWallet({address: req.body.wallet_address, createTime});
      const user = await prisma.createUser({userId: req.body.user_id, email: req.body.email, walletId: {connect: {id: wallet.id}}, createTime});
      wallet = await prisma.updateUserWallet({data: {userRowId: user.id}, where: {id: wallet.id}});
      res.status(201).json({wallet, user, isExist: false});
    }
    next();
  } catch(err) {
    console.log(`[ERROR] ${err}`)
    res.status(400);
    next();
  }
};

// wallet address 수정
exports.updateWallet = async (req, res, next) => {
  try {
    // create HEMO database
    // const data  = req.body;
    const r = await prisma.updateManyUserWallets({data: {status: false, updateTime: new Date()}, where: {userRowId: res.locals.user.id}})
    let wallet = await prisma.userWallets({where: {address: req.body.address}});
    if(wallet.length > 0) {
      wallet = await prisma.updateUserWallet({data: {updateTime: new Date(), status: true}, where: {id: wallet[0].id}});  
    } else {
      wallet = await prisma.createUserWallet({userRowId: res.locals.user.id, 
                                                  address: req.body.wallet_address,
                                                  createTime: new Date(), 
                                                  status: true}
                                                  );  
    }
    res.status(201).json({wallet});
    next();
  } catch(err) {
    console.log(`[ERROR] ${err}`)
    res.status(400);
    next();
  }
};

exports.getBalance = async (req, res, next) => {
  const balance = await contract.methods.balanceOf(req.params.address).call();
  res.json({ balance: Number(cav.utils.fromPeb(balance, 'KLAY')) });
  next()
}

exports.test = async (req, res, next) => {
  const result = await contract.methods.symbol().call();
  const result2 = await contract.methods.name().call();
  const result3 = await contract.methods.decimals().call();
  // const balance = await contract.methods.balanceOf(req.params.address).call();
  res.json({ result, result2, result3 });
  next()
}

exports.sendToken = async (req, res, next) => {
  try {
    let {
      fromPkey, fromAddress, toAddress, token, contents, category
    } = req.body;
    const recordedDayCount = req.body.recordedDayCount || 0;
    const isImageColorCount = req.body.isImageColorCount || 0;
    const cavConfig = await getDbCavInfo();

    cav.klay.accounts.wallet.clear();
    const feePayer = cav.klay.accounts.wallet.add(process.env.FEE_PAYER_KEY, process.env.FEE_PAYER_ADDRESS); // 대납 feePayer wallet
    toAddress = toAddress || cavConfig.loon.address; // gem token 받는 address(없으면 loonlab address)
    fromPkey = fromPkey || cavConfig.contractOwner.pKey; // gen token 보내는 private key(없으면 loon ai pk)
    fromAddress = fromAddress || cavConfig.contractOwner.address; // gen token 보내는 address(없으면 loon ai address)
    if (fromAddress === 'loon') { //loonlab이 보내는 경우
      fromPkey = cavConfig.loon.pKey;
      fromAddress = cavConfig.loon.address;
    }

    // reward token 값 확인
    let dbToken;
    let rewards = null;
    if(category === 'REWARDS') {
      // history 확인
      const gemHistory = await prisma.gemTransactions({where: {rewardType: contents, receiverUserRowId: res.locals.user.id, status: true}, orderBy: 'createTime_DESC'});
      if(contents == 'WELCOME' || contents == 'PHR') {
        if(gemHistory.length > 0) {
          console.log('[ERROR]: ALREADY PAID')
          return res.status(401).json({message: 'ALREADY PAID'});
        }
      } else {
        if(gemHistory.length > 0) {
          const today = new Date();
          const paidDate = new Date(gemHistory[0].createTime);
          if(today.getFullYear() == paidDate.getFullYear() && today.getMonth() == paidDate.getMonth()) {
            console.log('[ERROR]: ALREADY PAID')
            return res.status(401).json({message: 'ALREADY PAID'});
          }
        }
      }

      let feeQuery = contents.includes('RECORD') ? {contents_in: ['RECORD', 'CAMERA RECORD']} : {contents};
      rewards = await prisma.gemRewardTypes({where: feeQuery, orderBy: 'contents_DESC'});
      if(contents.includes('RECORD')) {
        if(rewards[0].contents == 'RECORD') {
            dbToken = rewards[0].amount * recordedDayCount + rewards[1].amount * isImageColorCount;
        } else {
            dbToken = rewards[1].amount * recordedDayCount + rewards[0].amount * isImageColorCount;
        }
      } else {
          dbToken = rewards[0].amount;
      }
      console.log(`LOON AI TOKEN ${dbToken}`)
      if(dbToken !== token) {
        res.status(400).send('The requested value does not match the actual value');
        next();
        return;
      }
    }

    const sender = fromPkey == cavConfig.contractOwner.pKey? feePayer : cav.klay.accounts.wallet.add(fromPkey);
    const balance = await contract.methods.balanceOf(fromAddress).call();
    console.log(`fromPkey ${fromPkey}`)
    console.log(`fromAddress ${fromAddress}`)
    console.log(`toAddress ${toAddress}`)
    console.log(`token ${token}`)
    console.log(`category ${category}`)
    console.log(`contents ${contents}`)
    console.log(`contract addess: ${contract.options.address}`)
    console.log(`sender address ${sender.address}`)
    console.log(`sender balande ${balance}`)
    console.log(`recipient address ${toAddress}`)

    const pebToken = cav.utils.toPeb(token, 'KLAY');

    if (parseFloat(balance) < parseFloat(pebToken)) {
      // throw new Error('balance is not enough')
      res.status(400).send({message: 'balance is not enough'})
      next()
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
      // type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      senderRawTransaction,
      feePayer: feePayer.address,
    });
    
    if(toAddress == res.locals.wallet.address) {
      const senderInfo = sender.address == cavConfig.loon.address ? cavConfig.loon : cavConfig.contractOwner;
      await prisma.createGemTransaction({
        senderUserRowId: senderInfo.userRowId, 
        senderAddress: senderInfo.address,
        receiverUserRowId: res.locals.user.id, 
        receiverAddress: res.locals.wallet.address, 
        amount: token,
        txhash: result.transactionHash,
        blockNumber: result.blockNumber.toString(),
        status: result.status,
        createTime: new Date(),
        rewardType: rewards ? rewards[0].contents : null
      })
    } else {
      await prisma.createGemTransaction({
        senderUserRowId: res.locals.user.id, 
        senderAddress: sender.address,
        receiverUserRowId: cavConfig.loon.userRowId,
        receiverAddress: toAddress, 
        amount: token,
        txhash: result.transactionHash,
        blockNumber: result.blockNumber.toString(),
        status: result.status,
        createTime: new Date(),
        rewardType: rewards ? rewards[0].contents : null
      })
    }

    if (!result.status) {
      // throw new Error('Transaction Error');
      // await prisma.createGemTransaction({senderId})
      res.status(400).send({message: 'Transaction Error'})
    } else {
      res.json({ message: result.transactionHash, status: true });
    }
    next()
  } catch (err) {
    console.log(err);
    res.status(400).send({message: err.message})
    next()
  }
};

// exports.mint = async (address, amount) => {
//   try {
//     const params = {
//       from: address,
//       gas: '3000000',
//     };
//     const sender = cav.klay.accounts.wallet.add('0xf3783e74baccb26c5070579efc9e3c4bef88d009c344945fe4536e4f33cd68d1');
//     const pebToken = cav.utils.toPeb(amount, 'KLAY');
//     const result = await contract.methods.mint(address, pebToken).send(params);
//     console.log(result)
//     return result
//   } catch(err) {
//     console.log(err)
//     return null
//   }
// }