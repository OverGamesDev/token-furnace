/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  RunScriptResult,
  DeployContractExecutionResult,
  NetworkId,
} from "@alephium/web3";
import {
  BurnerNFT,
  BurnerNFTInstance,
  TokenFurnace,
  TokenFurnaceInstance,
} from ".";
import { default as testnetDeployments } from "../../deployments/.deployments.testnet.json";
import { default as devnetDeployments } from "../../deployments/.deployments.devnet.json";

export type Deployments = {
  deployerAddress: string;
  contracts: {
    BurnerNFT: DeployContractExecutionResult<BurnerNFTInstance>;
    TokenFurnace: DeployContractExecutionResult<TokenFurnaceInstance>;
  };
};

function toDeployments(json: any): Deployments {
  const contracts = {
    BurnerNFT: {
      ...json.contracts["BurnerNFT"],
      contractInstance: BurnerNFT.at(
        json.contracts["BurnerNFT"].contractInstance.address
      ),
    },
    TokenFurnace: {
      ...json.contracts["TokenFurnace"],
      contractInstance: TokenFurnace.at(
        json.contracts["TokenFurnace"].contractInstance.address
      ),
    },
  };
  return {
    ...json,
    contracts: contracts as Deployments["contracts"],
  };
}

export function loadDeployments(
  networkId: NetworkId,
  deployerAddress?: string
): Deployments {
  const deployments =
    networkId === "testnet"
      ? testnetDeployments
      : networkId === "devnet"
      ? devnetDeployments
      : undefined;
  if (deployments === undefined) {
    throw Error("The contract has not been deployed to the " + networkId);
  }
  const allDeployments: any[] = Array.isArray(deployments)
    ? deployments
    : [deployments];
  if (deployerAddress === undefined) {
    if (allDeployments.length > 1) {
      throw Error(
        "The contract has been deployed multiple times on " +
          networkId +
          ", please specify the deployer address"
      );
    } else {
      return toDeployments(allDeployments[0]);
    }
  }
  const result = allDeployments.find(
    (d) => d.deployerAddress === deployerAddress
  );
  if (result === undefined) {
    throw Error("The contract deployment result does not exist");
  }
  return toDeployments(result);
}
