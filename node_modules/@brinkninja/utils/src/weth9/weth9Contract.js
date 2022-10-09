const WETH9JSON = require('./WETH9.json')

module.exports = async function () {
  const [signer] = await this.ethers.getSigners()
  const { abi, bytecode } = WETH9JSON
  const weth9 = new this.ethers.ContractFactory(abi, bytecode, signer)
  return weth9
}
