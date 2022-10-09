async function latestBlock () {
  const blockNumber = await this.ethers.provider.getBlockNumber()
  const block = await this.ethers.provider.getBlock(blockNumber)
  return block
}

module.exports = latestBlock
