const { padLeft } = require('web3-utils')
const { BigNumber } = require('@ethersproject/bignumber')
const { from: BN } = BigNumber
const bnToBinaryString = require('../bnToBinaryString')

async function nextAvailableBit (contract) {
  let curBitmap, curBitmapBinStr
  let curBitmapIndex = -1
  let nextBitIndex = -1
  while(nextBitIndex < 0) {
    curBitmapIndex++
    curBitmap = await contract.getReplayProtectionBitmap(curBitmapIndex)
    curBitmapBinStr = reverseStr(padLeft(bnToBinaryString(curBitmap), 256, '0'))
    for (let i = 0; i < curBitmapBinStr.length; i++) {
      if (curBitmapBinStr.charAt(i) == '0') {
        nextBitIndex = i
        break
      }
    }
  }
  return {
    bitmapIndex: BN(curBitmapIndex),
    bit: BN(2).pow(BN(nextBitIndex))
  }
}

function reverseStr (str) {
  return str.split("").reverse().join("")
}

module.exports = nextAvailableBit
