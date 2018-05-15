let Identities = artifacts.require("./Identities.sol");

const USER_TIME_LOCK = 3600;
const ADMIN_TIME_LOCK = 129600;
const ADMIN_RATE = 1200;

module.exports = (deployer) => {
    deployer.deploy(Identities, USER_TIME_LOCK, ADMIN_TIME_LOCK, ADMIN_RATE);
};
