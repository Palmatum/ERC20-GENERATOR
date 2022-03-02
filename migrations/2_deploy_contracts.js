const Generator = artifacts.require("Generator");

module.exports = function (deployer) {
  deployer.deploy(Generator);
};
