"use strict";

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

// const Migrations = artifacts.require("Migrations");

// module.exports = function(deployer) {
//   deployer.deploy(Migrations);
// };

var Migrations = artifacts.require("./Migrations.sol");
var MyERC20 = artifacts.require("./MyERC20.sol");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MyERC20, 'LOONAITOKEN', 'LAT', 18);
};
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Migrations, "Migrations", "loon-token/migrations/1_initial_migration.js");
  reactHotLoader.register(MyERC20, "MyERC20", "loon-token/migrations/1_initial_migration.js");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();