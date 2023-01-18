"use strict";
const { Alchemy, Network } = require("alchemy-sdk");

/**
 * article service.
 */

const config = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

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
      const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
      const nfts = await alchemy.nft.getNftsForOwner(wallet_address, {
        contractAddresses: [ensContractAddress],
      });
      if (nfts.ownedNfts.length) {
        return nfts.ownedNfts[0];
      }
      return {}
    },
    async fetchDataForAddress(wallet_address) {
      const contracts = [
        // see treasury tokens sheet for contract names
        "0x111111111117dc0aa78b770fa6a738034120c302",
        "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
        "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
        "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF",
        "0xa1faa113cbe53436df28ff0aee54275c13b40975",
        "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
        "0x31429d1856aD1377A8A0079410B297e1a9e214c2",
        "0x4104b135dbc9609fc1a9490e61369036497660c8",
        "0x0f71b8de197a1c84d31de0f1fa7926c365f052b3",
        "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
        "0xc0c293ce456ff0ed870add98a0828dd4d2903dbf",
        "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56",
        "0xba100000625a3754423978a60c9317c58a424e3D",
        "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
        "0xfe459828c90c0ba4bc8b42f5c5d44f316700b430",
        "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
        "0x0391d2021f89dc339f60fff84546ea23e337750f",
        "0xbc19712feb3a26080ebf6f2f7849b417fdd792ca",
        "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        "0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB",
        "0xd533a949740bb3306d119cc777fa900ba034cd52",
        "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
        "0x6b175474e89094c44da98b954eedeac495271d0f",
        "0xca1207647ff814039530d7d35df0e1dd2e91fa84",
        "0x865377367054516e17014CcdED1e7d814EDC9ce4",
        "0x1559fa1b8f28238fd5d76d9f434ad86fd20d1559",
        "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
        "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
        "0x5218e472cfcfe0b64a064f055b43b4cdc9efd3a6",
        "0xd9fcd98c322942075a5c3860693e9f4f03aae07b",
        "0x956f47f50a910163d8bf957cf5846d573e7f87ca",
        "0x4c2e59d098df7b6cbae0848d66de2f8a4889b9c3",
        "0x5faa989af96af85384b8a938c2ede4a7378d9875",
        "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
        "0x056fd409e1d7a124bd7017459dfea2f387b6d5cd",
        "0x584bc13c7d411c00c01a62e8019472de68768430",
        "0x6c6ee5e31d828de241282b9606c8e98ea48526e2",
        "0x111111517e4929d3dcbdfa7cce55d30d4b6bc4d6",
        "0x0954906da0bf32d5479e25f46056d22f08464cab",
        "0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68",
        "0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44",
        "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
        "0x514910771af9ca656af840dff83e8264ecf986ca",
        "0xc97232527B62eFb0D8ed38CF3EA103A6CcA4037e",
        "0x99295f1141d58a99e939f7be6bbe734916a875b8",
        "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
        "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
        "0x69af81e73a73b40adf4f3d4223cd9b1ece623074",
        "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        "0x6710c63432a2de02954fc0f851db07146a6c0312",
        "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
        "0x8888801af4d980682e47f1a9036e589479e835c5",
        "0x86772b1409b61c639eaac9ba0acfbb6e238e5f83",
        "0x0d438f3b5175bebc262bf23753c1e53d03432bde",
        "0x967da4048cd07ab37855c090aaf366e4ce1b9f48",
        "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
        "0x888888888889c00c67689029d7856aac1065ec11",
        "0x4a220e6096b25eadb88358cb44068a3248254675",
        "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919",
        "0xfca59cd816ab1ead66534d82bc21e7515ce441cf",
        "0x6123b0049f904d730db3c36a31167d9d4121fa6b",
        "0x408e41876cccdc0f92210600ef50372656052a38",
        "0x221657776846890989a759ba2973e427dff5c9bb",
        "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
        "0x607f4c5bb672230e8672085532f7e901544a7375",
        "0xfa5047c9c78b8877af97bdcb85db743fd7313d4a",
        "0xd33526068d116ce69f19a9ee46f0bd304f21a51f",
        "0x090185f2135308BaD17527004364eBcC2D37e5F6",
        "0x06325440D014e39736583c165C2963BA99fAf14E",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
        "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
        "0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f",
        "0x0000000000085d4780b73119b644ae5ecd22b376",
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "0x48fb253446873234f2febbf9bdeaa72d9d387f94",
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "0x0d438f3b5175bebc262bf23753c1e53d03432bde",
        "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
        "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
        "0x84E13785B5a27879921D6F685f041421C7F482dA",
        "0x790a60024bC3aea28385b60480f15a0771f26D09",
        "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE",
        "0xb9ef770b6a5e12e45983c5d80545258aa38f3b78",
        "0x6399c842dd2be3de30bf99bc7d1bbf6fa3650e70",
        "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
        "0x875773784Af8135eA0ef43b5a374AaD105c5D39e",
        "0x73968b9a57c6e53d41345fd57a6e6ae27d6cdb2f",
        "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7",
        "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
        "0x2e9d63788249371f1dfc918a52f8d799f4a38c94",
        "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
        "0x0100546f2cd4c9d97f798ffc9755e47865ff7ee6",
        "0x090185f2135308bad17527004364ebcc2d37e5f6",
        "0x5afe3855358e112b5647b952709e6165e1c1eeee",
        "0x4691937a7508860f876c9c0a2a617e7d9e945d4b", // woo
        "0x72377f31e30a405282b522d588aebbea202b4f23", // varen
        "0xcafe001067cdef266afb7eb5a286dcfd277f3de5", // PSP
      ];
      // Get token balances
      const balances = await alchemy.core.getTokenBalances(
        wallet_address,
        contracts
      );
      const ethBalance = await alchemy.core.getBalance(wallet_address);

      // Remove tokens with zero balance
      const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return (
          token.tokenBalance !==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
      });

      console.log(`Token balances of ${wallet_address} \n`);

      // Counter for SNo of final output
      let i = 1;
      const _balances = {
        ETH: +ethBalance._hex / Math.pow(10, 18),
      };

      // Loop through all tokens with non-zero balance
      for (let token of nonZeroBalances) {
        // Get balance of token
        let balance = token.tokenBalance;

        // Get metadata of token
        const metadata = await alchemy.core.getTokenMetadata(
          token.contractAddress
        );

        // Compute token balance in human-readable format
        balance = +balance / Math.pow(10, metadata.decimals);

        // Print name, balance, and symbol of token
        console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
        _balances[metadata.symbol] = balance;
      }

      const previousEntries = await strapi.db
        .query("api::treasury-account.treasury-account")
        .findMany({
          where: {
            wallet_address: wallet_address,
          },
        });

      if (!previousEntries.length) {
        await strapi.entityService.create(
          "api::treasury-account.treasury-account",
          {
            data: {
              data: _balances,
              wallet_address: wallet_address,
            },
          }
        );
      } else {
        await strapi.entityService.update(
          "api::treasury-account.treasury-account",
          previousEntries[0].id,
          {
            data: {
              data: _balances,
            },
          }
        );
      }

      return _balances;
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
  })
);
