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

    const sender = cav.klay.accounts.wallet.add(fromPkey);
    // let sender = fromPkey == cavConfig.contractOwner.pKey? feePayer : cav.klay.accounts.wallet.add(fromPkey);
    let senderInfo = sender.address == cavConfig.loon.address ? cavConfig.loon : cavConfig.contractOwner;
    let receiverInfo = res.locals.wallet;

    // reward token 값 확인
    let dbToken;
    let rewards = null;
    if(category === 'REWARDS') {
      // history 확인
      const today = new Date();
      let paidGem = 0;
      if(contents == 'WELCOME' || contents == 'PHR') {
        const gemHistory = await prisma.gemTransactions({where: {rewardType: contents, receiverUserRowId: res.locals.user.id, status: true}, orderBy: 'createTime_DESC'});
        if(gemHistory.length > 0) {
          console.log('[ERROR]: ALREADY PAID')
          return res.status(401).json({message: 'ALREADY PAID'});
        }
      } else if(contents == 'INVITE FRIEND') {
        let receiverUser = await prisma.userWallets({where: {address: toAddress}});
        if(!receiverUser || receiverUser.length == 0) return res.status(401).json({message: `Recever User not found(adderss: ${address})`});
        receiverInfo = receiverUser[0];
      }else {
        const gemHistory = await prisma.gemTransactions({where: {rewardType: contents, receiverUserRowId: res.locals.user.id, status: true, createTime_gte: new Date(`${today.getFullYear()}-${today.getMonth()}-01`)}, orderBy: 'createTime_DESC'});
        if(gemHistory.length > 0) {
          const check = await gemHistory.some((old) => {
              paidGem += old.amount;
              if(paidGem >=50) return true;
          })
          if(check) {
            console.log(`paidGem ${paidHistory}`)
            return res.status(401).json({message: 'ALREADY PAID'});
          }
        }
      }

      let feeQuery = contents.includes('RECORD') ? {contents_in: ['RECORD', 'CAMERA RECORD']} : {contents};
      rewards = await prisma.gemRewardTypes({where: feeQuery, orderBy: 'contents_DESC'});
      console.log(`recordedDayCount : ${recordedDayCount} isImageColorCount: ${isImageColorCount} rewards: ${rewards[0].amount} rewards: ${rewards[1].amount}`)
      if(contents.includes('RECORD')) {
        if(rewards[0].contents == 'RECORD') {
            dbToken = rewards[0].amount * recordedDayCount + rewards[1].amount * isImageColorCount;
            if(paidGem + dbToken > 50) {
              dbToken = 50 - paidGem;
            }
        } else {
            dbToken = rewards[1].amount * recordedDayCount + rewards[0].amount * isImageColorCount;
        }
      } else {
          dbToken = rewards[0].amount;
      }

      console.log(`LOON AI TOKEN ${dbToken}`)
      if(dbToken !== token) {
        res.status(400).send(`The requested value does not match the actual value ${dbToken} token${token}`);
        next();
        return;
      }
    }

    const balance = await contract.methods.balanceOf(fromAddress).call();
    console.log(`fromPkey ${fromPkey} fromAddress ${fromAddress} toAddress ${toAddress} token ${token} category ${category} contents ${contents} sender address ${sender.address}`)

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
      senderRawTransaction,
      feePayer: feePayer.address,
    });
    
     
    await prisma.createGemTransaction({ 
        senderUserRowId: senderInfo.userRowId, 
        senderAddress: senderInfo.address,
        receiverUserRowId: receiverInfo.userRowId, 
        receiverAddress: receiverInfo.address, 
        amount: token,
        txhash: result.transactionHash,
        blockNumber: result.blockNumber.toString(),
        status: result.status,
        createTime: new Date(),
        rewardType: rewards ? rewards[0].contents : null
      })

    if (!result.status) {
      // throw new Error('Transaction Error');
      // await prisma.createGemTransaction({senderId})
      console.log(result)
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

exports.sendCameraToken = async (req, res, next) => {
  try {
    let {
      userId,
      toAddress,
      contents,
      token,
    } = req.body;

    const cavConfig = await getDbCavInfo();

    cav.klay.accounts.wallet.clear();
    const feePayer = cav.klay.accounts.wallet.add(process.env.FEE_PAYER_KEY, process.env.FEE_PAYER_ADDRESS); // 대납 feePayer wallet
    fromPkey = cavConfig.contractOwner.pKey; // gen token 보내는 private key(없으면 loon ai pk)
    fromAddress = cavConfig.contractOwner.address; // gen token 보내는 address(없으면 loon ai address)
    const sender = cav.klay.accounts.wallet.add(fromPkey);
    // let sender = fromPkey == cavConfig.contractOwner.pKey? feePayer : cav.klay.accounts.wallet.add(fromPkey);
    let senderInfo = cavConfig.contractOwner;
    let user = await prisma.users({where: {userId}});
    if(user.length == 0) return res.status(401).json({message: `NO USER ID: ${userId}`});

    let receiverInfo = await prisma.userWallets({where: {userRowId: user[0].id, address: toAddress, status: true}});
    if(receiverInfo.length == 0) return res.status(401).json({message: `NO USER ADDRESS ${toAddress}`});
    receiverInfo = receiverInfo[0];
    
    const today = new Date();
    const gemHistory = await prisma.gemTransactions({where: {rewardType: contents, receiverUserRowId: receiverInfo.userRowId, status: true, createTime_gte: new Date(`${today.getFullYear()}-${today.getMonth()}-01`)}, orderBy: 'createTime_DESC'});
    if(gemHistory.length >= 5) {
      console.log('[ERROR]: ALREADY PAID')
      return res.status(401).json({message: 'ALREADY PAID'});
    } 

    let rewards = await prisma.gemRewardTypes({where: {contents}, orderBy: 'contents_DESC'});
    token = rewards[0].amount;

    const pebToken = cav.utils.toPeb(token, 'KLAY');

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
      senderRawTransaction,
      feePayer: feePayer.address,
    });
    console.log(`transactionHash ${result.transactionHash}`)
      
    await prisma.createGemTransaction({ 
      senderUserRowId: senderInfo.userRowId, 
      senderAddress: senderInfo.address,
      receiverUserRowId: receiverInfo.userRowId, 
      receiverAddress: receiverInfo.address, 
      amount: token,
      txhash: result.transactionHash,
      blockNumber: result.blockNumber.toString(),
      status: result.status,
      createTime: new Date(),
      rewardType: rewards ? rewards[0].contents : null
    })
    if (!result.status) {
      // throw new Error('Transaction Error');
      // await prisma.createGemTransaction({senderId})
      res.status(400).send({message: 'Transaction Error'})
    } else {
      res.json({ message: result.transactionHash, status: true });
    }
    next()
  } catch(err) {
    console.log(err);
    res.status(400).send({message: err.message})
    next()
  }
}

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