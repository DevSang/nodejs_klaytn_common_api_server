const klaytn = require('../api/klaytn/klaytn');

module.exports = (router) => {
  // on routes that end in /bears
  // ----------------------------------------------------
  router.route('/token').post(async (req, res, next) => {
    try {
      console.log('token')
      const {
        fromPkey, fromAddress, toAddress, token,
      } = req.body;
      const result = await klaytn.sendToken(fromPkey, fromAddress, toAddress, token);
      if (result.status) {
        res.json({ message: result.msg });
      }
    } catch (err) {
      console.log(err);
      res.err(err);
    }
    next();
  });

  router.route('/token/:address').get(async (req, res, next) => {
    try {
      const result = await klaytn.getBalance(req.params.address);
      res.json({ balance: Number(result) });
    } catch (err) {
      console.log(err);
      res.err(err);
    }
    next();
  });
  router.route('/test').post(async (req, res, next)=> {
    const {
      fromPkey, fromAddress, toAddress, token,
    } = req.body;
    const result = await klaytn.feeDelegator(fromPkey, fromAddress, toAddress, token);
    res.json({ message: result })
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

  router.route('/test').get(function (req, res) {
    klaytn.createAccount();
    res.json({ message: 'good :)' });
  });

  router
    .route('/bears')
    // create a bear (accessed at POST http://localhost:8080/bears)
    .post(function (req, res) {
      res.json({ message: 'Bear created!' });
    })
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
      res.send(err);
    });

  // on routes that end in /bears/:bear_id
  // ----------------------------------------------------
};
