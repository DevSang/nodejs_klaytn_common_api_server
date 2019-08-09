'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }return step("next");
    });
  };
}

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

// const Caver = require('caver-js');

// const config = {
//   rpcURL: 'https://api.baobab.klaytn.net:8651',
// };
// const cav = new Caver(config.rpcURL);
var cav = require('../../utils/caver');

exports.createAccount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var account;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // create kalytn account
          account = cav.klay.accounts.create();

          console.log(JSON.stringify(account));

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));

exports.requestToken = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(address, value) {
    var senderAddress, myERC20, params, contractAddress, contract, events;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            senderAddress = '0xd378a66035ec7b43c3f8eebedf0446577ddb5c89';
            // cav.klay.accounts.wallet.add(
            //   '0xf66584dda7caabedc561f64196dd736c728e475a2bd1a5d99c334562899ba6c4',
            //   senderAddress
            // );

            myERC20 = require('../../../loon-token/build/contracts/MyERC20.json');
            params = {
              from: senderAddress,
              gas: '3000000'
            };
            contractAddress = '0x96b16d0C8dA2E05A464c58F51Bb118f9bF3F1D51';
            contract = new cav.klay.Contract(myERC20.abi, contractAddress, params);
            _context2.next = 7;
            return contract.events.allEvents();

          case 7:
            events = _context2.sent;
            return _context2.abrupt('return', contract.methods.transfer(address, cav.utils.toPeb(value, 'KLAY')).send(params).on('transactionHash', function (hash) {
              console.log(hash);
              console.log(typeof hash === 'undefined' ? 'undefined' : _typeof(hash));
              return hash;
              // console.log('-' * 50);
            })
            // // .on('receipt', (receipt) => {
            // //   // console.log(receipt);
            // // })
            .on('error', console.error));

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.sendToken = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fromAddress, toAddress, token) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_typeof, "_typeof", "build/api/klaytn/klaytn.js");
  reactHotLoader.register(_asyncToGenerator, "_asyncToGenerator", "build/api/klaytn/klaytn.js");
  reactHotLoader.register(__signature__, "__signature__", "build/api/klaytn/klaytn.js");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();