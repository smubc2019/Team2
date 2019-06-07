const LIKEToken = artifacts.require("LIKEToken");

module.exports = function(deployer) {
  deployer.deploy(LIKEToken);
};
