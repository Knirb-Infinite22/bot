const { ethers } = require('hardhat')
const { expect } = require('chai')

const utils = require('../index')

describe('brink-utils', function() {
  describe('testHelpers', function () {
    beforeEach(function () {
      this.testHelpers = utils.testHelpers(ethers)
    })
    describe('latestBlock', function () {
      it('should return latest block', async function () {
        const block = await this.testHelpers.latestBlock()
        expect(block.hash).not.to.be.undefined
      })
    })
    describe('constants', function () {
      it('should be exported', function () {
        expect(utils.constants).not.to.be.undefined
      })
    })
  })
})
