"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "GemRewardType",
    embedded: false
  },
  {
    name: "GemTransaction",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "UserWallet",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:5000`
});
exports.prisma = new exports.Prisma();
