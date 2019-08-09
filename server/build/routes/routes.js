'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var klaytn = require('../api/klaytn/klaytn');

module.exports = function (router) {
  // on routes that end in /bears
  // ----------------------------------------------------
  router.route('/token').post(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return klaytn.requestToken(req.body.address, req.body.value);

            case 3:
              result = _context.sent;

              res.json({ message: result });
              _context.next = 11;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              console.log(_context.t0);
              res.err(_context.t0);

            case 11:
              next();

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 7]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());

  router.route('/').post(function (req, res) {
    try {
      // console.log(JSON.stringify(req.body));
      var cont = {
        title: 'REWARDS',
        contents: {
          welcome: {
            text: 'Welcome',
            coin: 30
          }
        }
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