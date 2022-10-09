const { BigNumber } = require('@ethersproject/bignumber')
const { from: BN } = BigNumber
const { BN18, MAX_UINT256 } = require('../constants')
const uniswapV2Contracts = require('../uniswapV2/uniswapV2Contracts')
const weth9Contract = require('../weth9/weth9Contract')

async function getSigners () {
  const [ defaultAccount, liqProvider ] = await this.ethers.getSigners()
  return {
    defaultAccount,
    liqProvider
  }
}

async function deployUniswapV2 () {
  const { UniswapV2Factory, UniswapV2Router02 } = await uniswapV2Contracts()
  const WETH9 = await weth9Contract()
  const { defaultAccount, liqProvider } = await getSigners.bind(this)()
  const weth = await WETH9.deploy()
  const factory = await UniswapV2Factory.deploy(defaultAccount.address)
  const router = await UniswapV2Router02.deploy(factory.address, weth.address)

  // create WETH-TKNA Pair
  const { token1: tokenA, pair: pairA } = await _setupUniV2Pair({
    factory, router, weth, token0: weth, token0Amt: BN(50).mul(BN18), token1Amt: BN(100).mul(BN18), liqProvider: liqProvider
  })

  // create WETH-TKNB Pair
  const { token1: tokenB, pair: pairB } = await _setupUniV2Pair({
    factory, router, weth, token0: weth, token0Amt: BN(100).mul(BN18), token1Amt: BN(150).mul(BN18), liqProvider: liqProvider
  })

  // create WETH-TKNC Pair
  const { token1: tokenC, pair: pairC } = await _setupUniV2Pair({
    factory, router, weth, token0: weth, token0Amt: BN(150).mul(BN18), token1Amt: BN(200).mul(BN18), liqProvider: liqProvider
  })

  // create TKNA-TKNB Pair
  const { pair: pairAB } = await _setupUniV2Pair({
    factory, router, token0: tokenA, token1: tokenB, token0Amt: BN(20).mul(BN18), token1Amt: BN(40).mul(BN18), liqProvider: liqProvider
  })

  return { weth, factory, router, tokenA, pairA, tokenB, pairB, tokenC, pairC, pairAB }
}

async function _setupUniV2Pair ({
  factory, router, weth, token0, token1, token0Amt, token1Amt, liqProvider
}) {
  const TestERC20 = await this.ethers.getContractFactory('TestERC20')
  const { UniswapV2Pair, UniswapV2Router02 } = await uniswapV2Contracts()

  if (token1 && weth && weth.address == token1.address) {
    throw new Error(`WETH has to be token0`)
  }

  if (!token0) {
    token0 = await TestERC20.deploy('Test Token', 'TT', 18)
  }

  if (!token1) {
    token1 = await TestERC20.deploy('Test Token', 'TT', 18)
  }

  const token0_fromLiqProvider = await TestERC20.attach(token0.address).connect(liqProvider)
  const token1_fromLiqProvider = await TestERC20.attach(token1.address).connect(liqProvider)
  const router_fromLiqProvider = await UniswapV2Router02.attach(router.address).connect(liqProvider)

  if (!weth || token0.address !== weth.address) {
    await token0.mint(liqProvider.address, token0Amt)
    await token0_fromLiqProvider.approve(router.address, token0Amt)
  }

  await token1.mint(liqProvider.address, token1Amt)
  await token1_fromLiqProvider.approve(router.address, token1Amt)

  await factory.createPair(token0.address, token1.address)
  const pair = await (UniswapV2Pair.attach(
    await factory.getPair(token0.address, token1.address))
  )

  if (weth && token0.address == weth.address) {
    await router_fromLiqProvider.addLiquidityETH(
      token1.address, token1Amt, token1Amt, token0Amt, liqProvider.address, MAX_UINT256,
      { value: token0Amt }
    )
  } else {
    await router_fromLiqProvider.addLiquidity(
      token0.address, token1.address,
      token0Amt, token1Amt,
      token0Amt, token1Amt,
      liqProvider.address, MAX_UINT256
    )
  }

  return { token0, token1, pair }
}

module.exports = deployUniswapV2
