"use strict";
const { Alchemy, Network } = require("alchemy-sdk");
const {
  ETH_MAINNET_TOKENS,
  OPTIMISM_MAINNET_TOKENS,
  OPTIMISM_MAINNET_TOKENLIST,
} = require("./tokens");
const ethers = require("ethers");

/**
 * article service.
 */

const getAlchemy = (network) => {
  const config = {
    apiKey: process.env.ALCHEMY_KEY,
    network: network,
  };
  const alchemy = new Alchemy(config);
  return alchemy;
};

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::treasury-account.treasury-account",
  ({ strapi }) => ({
    async getByWallet(wallet_address) {
      const previousEntries = await strapi.db
        .query("api::treasury-account.treasury-account")
        .findMany({
          where: {
            wallet_address: wallet_address,
          },
        });

      return previousEntries;
    },
    async getAll() {
      const previousEntries = await strapi.db
        .query("api::treasury-account.treasury-account")
        .findMany();

      return previousEntries;
    },
    async resolveEns(wallet_address) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://ethereum-mainnet-rpc.allthatnode.com"
        );
        const name = await provider.lookupAddress(wallet_address);
        return { title: name };
      } catch (e) {
        console.error(e);
        return { error: true };
      }
    },
    async fetchDataForAddress(wallet_address) {
      const contracts = {
        [Network.ETH_MAINNET]: ETH_MAINNET_TOKENS,
        // [Network.ARB_MAINNET]: [],
        [Network.OPT_MAINNET]: OPTIMISM_MAINNET_TOKENS,
      };
      const tokenLists = {
        [Network.OPT_MAINNET]: OPTIMISM_MAINNET_TOKENLIST,
      };
      // Get token balances
      const _balances = {};

      for (const network of [
        Network.ETH_MAINNET,
        // Network.ARB_MAINNET,
        Network.OPT_MAINNET,
      ]) {
        try {
          _balances[network] = {};
          const alchemy = getAlchemy(network);
          const balances = await alchemy.core.getTokenBalances(
            wallet_address,
            contracts[network]
          );
          const ethBalance = await alchemy.core.getBalance(wallet_address);

          balances.tokenBalances = balances.tokenBalances.filter(
            (token) => token.tokenBalance !== "0x"
          );
          balances.tokenBalances = balances.tokenBalances.filter(
            (token) => !token.error
          );
          // Remove tokens with zero balance
          const nonZeroBalances = balances.tokenBalances.filter((token) => {
            return parseInt(token.tokenBalance) !== 0;
          });

          console.log(
            `\n\n\nToken balances of ${wallet_address} on ${network}\n`
          );

          // Counter for SNo of final output
          let i = 1;

          _balances[network] = {
            ETH: +ethBalance._hex / Math.pow(10, 18),
          };

          // Loop through all tokens with non-zero balance
          for (let token of nonZeroBalances) {
            // Get balance of token
            let balance = token.tokenBalance;
            let metadata;
            if (tokenLists[network]) {
              metadata = tokenLists[network].find(
                (item) => item.address === token.contractAddress
              );
            } else {
              // // Get metadata of token
              metadata = await alchemy.core.getTokenMetadata(
                token.contractAddress
              );
            }

            balance = +balance / Math.pow(10, metadata.decimals);
            _balances[network][metadata.symbol] = balance;

            // Print name, balance, and symbol of token
            console.log(
              `${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`
            );
            _balances[network][metadata.symbol] = balance;
          }

          const previousEntries = await strapi.db
            .query("api::treasury-account.treasury-account")
            .findMany({
              where: { wallet_address, network },
            });

          if (!previousEntries.length) {
            await strapi.entityService.create(
              "api::treasury-account.treasury-account",
              {
                data: {
                  network,
                  data: _balances[network],
                  wallet_address,
                },
              }
            );
          } else {
            await strapi.entityService.update(
              "api::treasury-account.treasury-account",
              previousEntries[0].id,
              {
                data: {
                  network,
                  data: _balances[network],
                },
              }
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async refreshData() {
      const projects = await strapi.db.query("api::project.project").findMany({
        populate: ["treasury_wallets"],
      });
      const relevantProjects = projects.filter(
        (project) => project.treasury_wallets?.length
      );
      for (const project of relevantProjects) {
        for (const { wallet_address } of project.treasury_wallets) {
          console.log(`${project.name}: ${wallet_address}`);
          await this.fetchDataForAddress(wallet_address);
        }
      }
    },
    async refreshSingle(wallet_address) {
      await this.fetchDataForAddress(wallet_address);
    },
  })
);
