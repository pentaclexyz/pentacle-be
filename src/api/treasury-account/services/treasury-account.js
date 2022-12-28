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
    async fetchDataForAddress(wallet_address) {
      const contracts = [
        /* 3CRV */ "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
        /* AAVE */ "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
        /* ALCX */ "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF",
        /* ANGLE */ "0x31429d1856aD1377A8A0079410B297e1a9e214c2",
        /* BAL */ "0xba100000625a3754423978a60c9317c58a424e3D",
        /* COMP */ "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        /* COW */ "0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB",
        /* CRV */ "0xD533a949740bb3306d119CC777fa900bA034cd52",
        /* DAI */ "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        /* DOLA */ "0x865377367054516e17014CcdED1e7d814EDC9ce4",
        /* ENS */ "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        /* EUL */ "0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b",
        /* GRT */ "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
        /* INV */ "0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68",
        /* KP3R */ "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44",
        /* LDO */ "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
        /* lp-yCRV */ "0xc97232527B62eFb0D8ed38CF3EA103A6CcA4037e",
        /* MKR */ "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
        /* RBN */ "0x6123b0049f904d730db3c36a31167d9d4121fa6b",
        /* SPELL */ "0x090185f2135308BaD17527004364eBcC2D37e5F6",
        /* steCRV */ "0x06325440D014e39736583c165C2963BA99fAf14E",
        /* stETH */ "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
        /* stkAAVE */ "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
        /* sUSD */ "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        /* TUSD */ "0x0000000000085d4780B73119b644AE5ecd22b376",
        /* UNI */ "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        /* USDC */ "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        /* USDT */ "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        /* wBTC */ "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        /* WETH */ "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        /* YFI */ "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
        /* yvCurve-3pool */ "0x84E13785B5a27879921D6F685f041421C7F482dA",
        /* yvCurve-YFIETH */ "0x790a60024bC3aea28385b60480f15a0771f26D09",
        /* yvUSDC */ "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE",
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
