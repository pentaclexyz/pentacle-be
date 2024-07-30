import { SocialDataToolsUser } from '../../types/social-data-tools-types';
import { BaseEcosystemTag } from '../../types/base-ecosystem';

export const getHandleFromTwitterUrl = (str = '') =>
  (str || '')
    .replace('https://x.com/', '')
    .replace('http://x.com/', '')
    .replace('http://wwww.x.com/', '')
    .replace('https://twitter.com/', '')
    .replace('http://twitter.com/', '')
    .replace('https://www.twitter.com/', '');

//TODO: Get Github return types and type response
export const fetchGithubProfile = async (handle: string) => {
  try {
    return fetch(`https://api.github.com/users/${handle}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  } catch (e) {
    console.error(e);
  }
};

export const fetchTwitterProfile = async (handle: string): Promise<SocialDataToolsUser | null> => {
  try {
    return fetch(`https://api.socialdata.tools/twitter/user/${handle}`, {
      headers: {
        Authorization: `Bearer ${process.env.SOCIALDATA_KEY}`,
      },
    }).then((res) => {
      console.log(`API returned :${res.status}: ${res.statusText}`);
      return res.json() as Promise<SocialDataToolsUser>;
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};

//TODO: Get Neynar return types and type response
export const fetchFarcasterProfile = async (handle: string) => {
  try {
    return fetch(`https://api.neynar.com/v2/farcaster/user/search?q=${handle}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEYNAR_API_KEY as string}`,
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    }).then(async (res) => {
      console.log(`API returned :${res.status}: ${res.statusText}`);
      const data = (await res.json()) as any;
      return data?.result.users?.[0];
    });
  } catch (e) {
    console.error(e);
  }
};

export const mapBaseEcosystemTagToWoTag = (tag: BaseEcosystemTag) => {
  switch (tag) {
    case 'social':
      return 'social';
    case 'defi':
      return 'defi';
    case 'nft':
      return 'nft';
    case 'infra':
      return 'infra';
    case 'gaming':
      return 'gaming';
    case 'wallet':
      return 'wallet';
    case 'onramp':
      return 'fiat-onramp';
    case 'dao':
      return 'dao';
    case 'bridge':
      return 'bridge';
    case 'security':
      return 'security';
    default:
      return undefined;
  }
};
