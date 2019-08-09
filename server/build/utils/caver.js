'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var Caver = require('caver-js');

var config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
};

var cav = exports.cav = new Caver(config.rpcURL);
var senderAddress = '0xd378a66035ec7b43c3f8eebedf0446577ddb5c89';
cav.klay.accounts.wallet.add('0xf66584dda7caabedc561f64196dd736c728e475a2bd1a5d99c334562899ba6c4', senderAddress);

module.exports = cav;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(config, 'config', 'server/utils/caver.js');
  reactHotLoader.register(cav, 'cav', 'server/utils/caver.js');
  reactHotLoader.register(senderAddress, 'senderAddress', 'server/utils/caver.js');
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();