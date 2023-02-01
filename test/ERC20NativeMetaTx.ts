import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getTypedData } from "./metaTx712";
describe("ERC20 Native Meta Transactions (Polygon Pos)", function () {
  async function deployERC20MetaTx() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ERC20MetaTx = await ethers.getContractFactory(
      "ERC20NativeMetaTransaction"
    );
    const erc20MetaTx = await ERC20MetaTx.deploy();
    await erc20MetaTx.initialize(
      "Rally Polygon",
      "pRLY",
      18,
      owner.address,
      1_000_000
    );

    return { erc20MetaTx, owner, otherAccount };
  }
  describe("ERC20 transfer", function () {
    it("hould send initial balance to owner address", async function () {
      const { erc20MetaTx, owner } = await loadFixture(deployERC20MetaTx);
      expect(await erc20MetaTx.balanceOf(owner.address)).to.equal(
        BigNumber.from(1_000_000)
      );
    });
    it("Should call execute native meta tx on ERC20 contract transfering 100 tokens to other account", async function () {
      const { erc20MetaTx, owner, otherAccount } = await loadFixture(
        deployERC20MetaTx
      );

      // get function signature
      const data = await erc20MetaTx.interface.encodeFunctionData("transfer", [
        otherAccount.address,
        100,
      ]);

      // name and chainId to be used in EIP712

      const name = await erc20MetaTx.name();
      const { chainId } = await ethers.provider.getNetwork();

      // typed data for signing
      const eip712Data = getTypedData({
        name,
        version: "1",
        salt: ethers.utils.hexZeroPad(ethers.utils.hexlify(chainId), 32),
        verifyingContract: erc20MetaTx.address,
        nonce: 0,
        from: owner.address,
        functionSignature: data,
      });

      //signature for metatransaction
      const signature = await owner._signTypedData(
        eip712Data.domain,
        eip712Data.types,
        eip712Data.message
      );

      //get r,s,v from signature

      const { r, s, v } = ethers.utils.splitSignature(signature);

      // execute meta transaction shoudl transfer 100 tokens from owner to otherAccount
      await erc20MetaTx.executeMetaTransaction(owner.address, data, r, s, v);

      expect(await erc20MetaTx.balanceOf(owner.address)).to.equal(
        BigNumber.from(1_000_000).sub(100)
      );
    });
  });
});
