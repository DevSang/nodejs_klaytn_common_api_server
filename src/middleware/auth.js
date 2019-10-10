const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.json');
const serviceAccount = require('../../config/serviceAccountKey.json');
const fs = require('fs');
const path = require('path');
const certAccessPublic = fs.readFileSync(path.resolve(jwtConfig.certAccessPublic));
const { prisma } = require('../generated/prisma-client')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

module.exports = async (req, res, next) => {
    const firebaseAuth = req.header('Authorization');
    const accessToken = req.header('LOON-HEADER-ACCESSTOKEN');
    const adminToken = req.header('LOON-ADMIN-TOKEN');

    // console.log('>> [REQUEST]');
    console.log('>>> accessToken  : ', accessToken);
    // console.log('>>> refreshToken : ', refreshToken);
    // console.log('>>> firebaseAuth : ', firebaseAuth);
    // console.log('');
    if (firebaseAuth) {
        let parsed = firebaseAuth.split('Bearer ')[1];
        // console.log(admin.auth())
        console.log(parsed)
        try {
            const firebaseUser = await admin.auth().verifyIdToken(parsed);
            const user = await prisma.users({where: {email: firebaseUser.email}})
            console.log(req)
            if(user.length < 1) return res.status(401).send({message: `NO_USER ${firebaseUser.email}`});
            else {
                const wallet = await prisma.userWallets({where: {status: true, userRowId: user[0].id}})
                res.locals.user = user[0];
                res.locals.wallet = wallet[0];
                next();
                return;
            }
        } catch(err) {
            next(err);
        }

    } else if(accessToken){
        let parsed = accessToken.split('Bearer ')[1];

        jwt.verify(parsed, certAccessPublic, async (err, decoded) => {
            //Loon data 분석 시스템 로그인 시
            if(!decoded) {
                res.status(400).send({message:'EXPIRED_ACCESS_TOKEN'});
                return
            } else if(decoded.email === 'admin@looncup.com'){
                console.log('>> [LOON DATA ANALYSIS SYSTEM REQUEST]', decoded.email);
                next();
                return;
            } else if (err) {
                if(err.name=='TokenExpiredError') {
                    res.status(400).send({message:'EXPIRED_ACCESS_TOKEN'});
                    return;
                }
                else next(err);
                return;
            }
            console.log('>> [COMMON REQUEST] from :', decoded.email);
            const user = await prisma.users({where: {email: decoded.email}})
            console.log(JSON.stringify(user))
            if(user.length > 0) {
                let wallet = await prisma.userWallets({where: {status: true, userRowId: user[0].id}})
                console.log(wallet)
                if(wallet.length == 0 && (req.body.address || req.body.toAddress)) {
                    wallet = await prisma.createUserWallet({userRowId: user[0].id, address: req.body.address ? req.body.address : req.body.toAddress, status: true, createTime: new Date()})
                    res.locals.wallet = wallet
                } else {
                    res.locals.wallet = wallet.length> 0 ? wallet[0] : wallet;
                }
                res.locals.user = user[0];
                next();
                return;
            } else if(req.originalUrl == '/api/user' && req.body.email == decoded.email) {
                next();
                return;
            } else {
                return res.status(401).send({message: `NO_USER ${decoded.email}`});
            }
            // access token 만료 10분 전일 때-사용하지 않음
            // if (decoded.exp-new Date().getTime()/1000 < 10 * 60){
            //     res.set('JWT-TOKEN-NOTICE', 'NEED_REFRESH_TOKEN');
            // }
            // 얘는 user를 넘기면 안되고 필요도 없음.
            
        });
    } else{
        return res.status(401).send({message:'NO_TOKEN'});
    }
}
