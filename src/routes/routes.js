const tokenAPI = require('../api/token/tokenAPI');

module.exports = (router) => {
  // on routes that end in /bears
  // ----------------------------------------------------
  router.route('/token').post(tokenAPI.sendToken, (req, res, next) => {
    next();
  });

  router.route('/token/camera').post(tokenAPI.sendAdminToken, (req, res, next) => {
    next();
  });

  router.route('/token/admin').post(tokenAPI.sendAdminToken, (req, res, next) => {
    next();
  });

  router.route('/token/:address').get(tokenAPI.getBalance, (req, res, next) => {
    next();
  });



  router.route('/user').post(tokenAPI.createAccount, (req, res, next) => {
    next();
  });

  router.route('/user/wallet').put(tokenAPI.updateWallet, (req, res, next) => {
    next();
  });

  router.route('/test').get(tokenAPI.test, async (req, res, next)=> {
    next()
  })

  router.route('/').post(function (req, res) {
    try {
      // console.log(JSON.stringify(req.body));
      const cont = {
        title: 'REWARDS',
        contents: {
          welcome: {
            text: 'Welcome',
            coin: 30,
          },
        },
      };
      console.log(cont.contents.keys()[0]);
      console.log('aaaa');
      // const result = klaytn.requestToken(req.body.address, req.body.value);
      // console.log(result);
    } catch (err) {
      console.log(err);
    }
    res.json({ message: 'hooray! welcome to our api!' });
  });


  // on routes that end in /bears/:bear_id
  // ----------------------------------------------------
};
