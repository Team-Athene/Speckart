const SpecKart = artifacts.require('SpecKart')
const SpecToken = artifacts.require('SpecToken')
let SpecTokenInstance
module.exports = async function(deployer) {
	deployer.deploy(SpecToken).then(instance => {
			SpecTokenInstance = instance
			console.log("TCL: SpecTokenMigrate", SpecTokenInstance.address)
		    return deployer.deploy(SpecKart,['0x876740dcc6AD21F9D223B77b2884F11C81e3B01e', '0x69986F35c99DD80E240e647ddEE30cc4061540D0', '0xDdd9f8e8a168271956fCf6C91D105143380A87a8'])
		    })
	
	// deployer.deploy(SpecKart)
}

// const CityClash = artifacts.require('CityClash');
// const CClink = artifacts.require('CClink');
// const GemToken = artifacts.require('CityGem');
// var LinkInstance, GameInstance;
// module.exports = async function(deployer, network, accounts) {
//   // Use deployer to state migration tasks.
//   deployer
//     .deploy(CClink, { from: accounts[0] })
//     .then(instance => {
//       LinkInstance = instance;
//       return deployer.deploy(CityClash, LinkInstance.address, {
//         from: accounts[0]
//       });
//     })
//     .then(instance => {
//       GameInstance = instance;
//       return LinkInstance.changeCCAddress(GameInstance.address, {
//         from: accounts[0]
//       });
//     })
//     .then(() => {
//       return GameInstance.CreateToken(10000000000000, 'CityGems', 2, 'CCG', {
//         from: accounts[0]
//       });
//     });
//   // .then(async () => {
//   //   let tokenAdd = await GameInstance.CityToken.call();
//   //   let tokenInstance = await GemToken.at(tokenAdd);
//   //   return tokenInstance.transfer(GameInstance.address, 8000000000000, {
//   //     from: accounts[0]
//   //   });
//   // });
// };
