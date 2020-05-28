const SpecKart = artifacts.require('SpecKart')
const SpecToken = artifacts.require('SpecToken')
const Dispute = artifacts.require('DisputeContract')
let SpecTokenInstance, DisputeInstance

const admins = ['0x0E2A1227DA6f21A14b5148137dd584681145C99B',
	'0x44fdb5700B29a4390DE5e2826Ff41B0F2D912ad7',
	'0x7300b4689dc8fFe9152E40ABb95f7d4800C4426a']

module.exports = async function (deployer) {
	deployer.deploy(SpecToken).then(instance => {
		SpecTokenInstance = instance
		return deployer.deploy(Dispute,
			admins,
			SpecTokenInstance.address)
	})
		.then(instance => {
			DisputeInstance = instance
			return deployer.deploy(SpecKart, SpecTokenInstance.address, DisputeInstance.address)
		})
}

