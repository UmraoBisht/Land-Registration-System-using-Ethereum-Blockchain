const LandRegistrySystem = artifacts.require("LandRegistrySystem");

module.exports = function (deployer) {
  deployer.deploy(LandRegistrySystem);
};