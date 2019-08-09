'use strict';

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

switch (process.env.ENV) {
  case 'LOCAL':
    console.log('starting local...');
    require('./frontserver.local.js');
    break;
  case 'REAL':
    console.log('starting real...');
    require('./frontserver.real.js');
    break;
}