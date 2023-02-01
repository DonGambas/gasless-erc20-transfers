import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { signERC2612Permit } from "eth-permit";

describe("ERC20 Permit", function () {
  async function deployERC20Permit() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const name = "My Token";
    const ERC20Permit = await ethers.getContractFactory("ERC20Permit");
    const erc20Permit = await ERC20Permit.deploy("My Token", "MTK", 18);

    return { erc20Permit, owner, otherAccount, name };
  }
  describe("ERC20 transfer", function () {
    it("Should send initial balance to owner address", async function () {
      const { erc20Permit, owner, name } = await loadFixture(deployERC20Permit);
      expect(await erc20Permit.balanceOf(owner.address)).to.equal(
        BigNumber.from("1000000000000000000000000")
      );
      expect(await erc20Permit.name()).to.equal(name);
    });
    it("Should call permit function on ER20 Contract and increase other account allowance by 100", async function () {
      const { erc20Permit, owner, otherAccount } = await loadFixture(
        deployERC20Permit
      );
      const result = await signERC2612Permit(
        ethers.provider,
        erc20Permit.address,
        owner.address,
        otherAccount.address,
        100
      );
      await erc20Permit.permit(
        owner.address,
        otherAccount.address,
        100,
        result.deadline,
        result.v,
        result.r,
        result.s
      );
      expect(
        await erc20Permit.allowance(owner.address, otherAccount.address)
      ).to.equal(100);
    });
    it("should call transferFrom function on ERC20 contract transfering 100 tokens to other account", async function () {
      const { erc20Permit, owner, otherAccount } = await loadFixture(
        deployERC20Permit
      );
      const result = await signERC2612Permit(
        ethers.provider,
        erc20Permit.address,
        owner.address,
        otherAccount.address,
        100
      );
      await erc20Permit.permit(
        owner.address,
        otherAccount.address,
        100,
        result.deadline,
        result.v,
        result.r,
        result.s
      );

      await erc20Permit
        .connect(otherAccount)
        .transferFrom(owner.address, otherAccount.address, 100);
      expect(await erc20Permit.balanceOf(otherAccount.address)).to.equal(100);
    });
  });
});
