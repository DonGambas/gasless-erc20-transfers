## Test gasless transfer of ERC20 tokens using EIP-2612 and Polygon Native Meta Transactions

This repo has tests showing the use of `permit()` [eip-2612](https://eips.ethereum.org/EIPS/eip-2612) on an ERC20 contract and `executeMetaTransaction()` on a [polygon ERC20 child contract] (https://github.com/maticnetwork/pos-portal/blob/master/contracts/child/ChildToken/ChildERC20.sol) to gaslessly transfer ERC20 tokens. See examples in `./test`
