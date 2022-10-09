async function deployTestTokens () {
  const TestERC20 = await this.ethers.getContractFactory('TestERC20')
  const tokenA = await TestERC20.deploy('Token A', 'TKNA', 18)
  const tokenB = await TestERC20.deploy('Token B', 'TKNB', 18)
  return { tokenA, tokenB }
}

module.exports = deployTestTokens
