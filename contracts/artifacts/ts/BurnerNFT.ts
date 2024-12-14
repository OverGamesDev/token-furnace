/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  Asset,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
  SignExecuteContractMethodParams,
  SignExecuteScriptTxResult,
  signExecuteMethod,
  addStdIdToFields,
  encodeContractFields,
  Narrow,
} from "@alephium/web3";
import { default as BurnerNFTContractJson } from "../BurnerNFT.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";

// Custom types for the contract
export namespace BurnerNFTTypes {
  export type Fields = {
    collectionId: HexString;
    nftIndex: bigint;
    tokenIdBurned: HexString;
    amountBurned: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getTokenUri: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getCollectionIndex: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[HexString, bigint]>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
  export type MulticallReturnType<Callss extends MultiCallParams[]> = {
    [index in keyof Callss]: MultiCallResults<Callss[index]>;
  };

  export interface SignExecuteMethodTable {
    getTokenUri: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getCollectionIndex: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];
}

class Factory extends ContractFactory<
  BurnerNFTInstance,
  BurnerNFTTypes.Fields
> {
  encodeFields(fields: BurnerNFTTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      []
    );
  }

  at(address: string): BurnerNFTInstance {
    return new BurnerNFTInstance(address);
  }

  tests = {
    getTokenUri: async (
      params: Omit<
        TestContractParamsWithoutMaps<BurnerNFTTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getTokenUri", params, getContractByCodeHash);
    },
    getCollectionIndex: async (
      params: Omit<
        TestContractParamsWithoutMaps<BurnerNFTTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<[HexString, bigint]>> => {
      return testMethod(
        this,
        "getCollectionIndex",
        params,
        getContractByCodeHash
      );
    },
  };

  stateForTest(
    initFields: BurnerNFTTypes.Fields,
    asset?: Asset,
    address?: string
  ) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const BurnerNFT = new Factory(
  Contract.fromJson(
    BurnerNFTContractJson,
    "",
    "c23a88b49c10b4bcd35f802d42e866bd3381475c392720ec134ada4b5e1c8193",
    []
  )
);
registerContract(BurnerNFT);

// Use this class to interact with the blockchain
export class BurnerNFTInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<BurnerNFTTypes.State> {
    return fetchContractState(BurnerNFT, this);
  }

  view = {
    getTokenUri: async (
      params?: BurnerNFTTypes.CallMethodParams<"getTokenUri">
    ): Promise<BurnerNFTTypes.CallMethodResult<"getTokenUri">> => {
      return callMethod(
        BurnerNFT,
        this,
        "getTokenUri",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getCollectionIndex: async (
      params?: BurnerNFTTypes.CallMethodParams<"getCollectionIndex">
    ): Promise<BurnerNFTTypes.CallMethodResult<"getCollectionIndex">> => {
      return callMethod(
        BurnerNFT,
        this,
        "getCollectionIndex",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    getTokenUri: async (
      params: BurnerNFTTypes.SignExecuteMethodParams<"getTokenUri">
    ): Promise<BurnerNFTTypes.SignExecuteMethodResult<"getTokenUri">> => {
      return signExecuteMethod(BurnerNFT, this, "getTokenUri", params);
    },
    getCollectionIndex: async (
      params: BurnerNFTTypes.SignExecuteMethodParams<"getCollectionIndex">
    ): Promise<
      BurnerNFTTypes.SignExecuteMethodResult<"getCollectionIndex">
    > => {
      return signExecuteMethod(BurnerNFT, this, "getCollectionIndex", params);
    },
  };

  async multicall<Calls extends BurnerNFTTypes.MultiCallParams>(
    calls: Calls
  ): Promise<BurnerNFTTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends BurnerNFTTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<BurnerNFTTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends
      | BurnerNFTTypes.MultiCallParams
      | BurnerNFTTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(
      BurnerNFT,
      this,
      callss,
      getContractByCodeHash
    );
  }
}