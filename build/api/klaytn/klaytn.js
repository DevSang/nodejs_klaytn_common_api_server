'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var Caver = require('caver-js');

var config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
};
var cav = new Caver(config.rpcURL);

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

            cav.klay.accounts.wallet.add('0xf66584dda7caabedc561f64196dd736c728e475a2bd1a5d99c334562899ba6c4', senderAddress);

            myERC20 = require('../../../loon-token/build/contracts/MyERC20.json');
            params = {
              from: senderAddress,
              gas: '3000000'
            };
            contractAddress = '0x96b16d0C8dA2E05A464c58F51Bb118f9bF3F1D51';
            contract = new cav.klay.Contract(myERC20.abi, contractAddress, params);
            _context2.next = 8;
            return contract.events.allEvents();

          case 8:
            events = _context2.sent;

            console.log(JSON.stringify(events));

            return _context2.abrupt('return', contract.methods.transfer(address, cav.utils.toPeb(value, 'KLAY')).send(_extends({}, params))
            // .on('transactionHash', (hash) => {
            //   // console.log(hash);
            //   // console.log('-' * 50);
            // })
            // // .on('receipt', (receipt) => {
            // //   // console.log(receipt);
            // // })
            .on('error', console.error));

          case 11:
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
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(config, 'config', 'server/api/klaytn/klaytn.js');
  reactHotLoader.register(cav, 'cav', 'server/api/klaytn/klaytn.js');
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();