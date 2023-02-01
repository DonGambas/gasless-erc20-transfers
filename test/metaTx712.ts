export interface MetaTransaction {
  name?: string;
  version?: string;
  salt?: string;
  verifyingContract?: string;
  nonce: number;
  from: string;
  functionSignature: string;
}

export const getTypedData = ({
  name,
  version,
  salt,
  verifyingContract,
  nonce,
  from,
  functionSignature,
}: MetaTransaction) => {
  return {
    types: {
      /*EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
        {
          name: "salt",
          type: "bytes32",
        },
      ],*/
      MetaTransaction: [
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "from",
          type: "address",
        },
        {
          name: "functionSignature",
          type: "bytes",
        },
      ],
    },
    domain: {
      name,
      version,
      verifyingContract,
      salt,
    },
    primaryType: "MetaTransaction",
    message: {
      nonce,
      from,
      functionSignature,
    },
  };
};
