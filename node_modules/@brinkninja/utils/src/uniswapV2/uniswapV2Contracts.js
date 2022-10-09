const UniswapV2FactoryJSON = require('./UniswapV2Factory.json')
const UniswapV2Pair = require('./UniswapV2Pair.json')
const UniswapV2Router02 = require('./UniswapV2Router02.json')

const artifacts = [
  {
    contractName: 'UniswapV2Factory',
    abi: UniswapV2FactoryJSON.abi,
    bytecode: UniswapV2FactoryJSON.bytecode
  },
  {
    contractName: 'UniswapV2Pair',
    abi: UniswapV2Pair.abi,
    bytecode: UniswapV2Pair.bytecode
  },
  {
    contractName: 'UniswapV2Router02',
    abi: UniswapV2Router02.abi,
    bytecode: UniswapV2Router02.bytecode
  }
]

module.exports = async function () {
  const [signer] = await this.ethers.getSigners()
  let _contracts = {}

  for (var i in artifacts) {
    const { contractName, abi, bytecode } = artifacts[i]
    _contracts[contractName] = new this.ethers.ContractFactory(abi, bytecode, signer)
  }

  return _contracts
}
