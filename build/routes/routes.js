'use strict';

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var klaytn = require('../api/klaytn/klaytn');

module.exports = function (router) {
  // on routes that end in /bears
  // ----------------------------------------------------
  router.route('/token').post(function (req, res, next) {
    try {
      console.log(JSON.stringify(req.body));
      klaytn.requestToken(req.body.address, req.body.value);
    } catch (err) {
      console.log(err);
    }
    res.json({ message: 'hooray! welcome to our api!' });
    next();
  });

  router.route('/').post(function (req, res) {
    try {
      // console.log(JSON.stringify(req.body));
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

  router.route('/bears')
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
  router.route('/bears/:bear_id')
  // get the bear with that id
  .get(function (req, res) {})
  // update the bear with this id
  .put(function (req, res) {
    // Bear.findById(req.params.bear_id, function(err, bear) {

    // 	if (err)
    // 		res.send(err);

    // 	bear.name = req.body.name;
    // 	bear.save(function(err) {
    // 		if (err)
    // 			res.send(err);

    // 		res.json({ message: 'Bear updated!' });
    // 	});

    // });
    res.json({ message: 'Bear updated!' });
  })
  // delete the bear with this id
  .delete(function (req, res) {
    // Bear.remove({
    // 	_id: req.params.bear_id
    // }, function(err, bear) {
    // 	if (err)
    // 		res.send(err);

    // 	res.json({ message: 'Successfully deleted' });
    // });
    res.json({ message: 'Bear updated!' });
  });
};