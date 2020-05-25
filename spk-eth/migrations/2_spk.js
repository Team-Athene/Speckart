const SpecKart = artifacts.require('SpecKart')
const SpecToken = artifacts.require('SpecToken')
let SpecTokenInstance
module.exports = async function(deployer) {
	deployer.deploy(SpecToken).then(instance => {
			SpecTokenInstance = instance
            console.log("TCL: SpecTokenInstance", SpecTokenInstance.address)
			return deployer.deploy(SpecKart,['0x0E2A1227DA6f21A14b5148137dd584681145C99B', 
			'0x44fdb5700B29a4390DE5e2826Ff41B0F2D912ad7',
			'0x7300b4689dc8fFe9152E40ABb95f7d4800C4426a'], SpecTokenInstance.address)
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
