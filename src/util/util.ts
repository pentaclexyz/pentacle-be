import { SocialDataToolsUser } from '../../types/social-data-tools-types';

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

export const getAttestationBody = ({ refUID, attester }: { refUID: string; attester: string }) => {
  const body = {
    operationName: 'Attestations',
    variables: {
      where: {
        refUID: {
          equals: refUID,
        },
        schemaId: {
          equals: process.env.EAS_SCHEMA_UID,
        },
      },
    },
    query:
      'query Attestations($where: AttestationWhereInput) {\n  attestations(take: 100, orderBy: {time: desc}, where: $where) {\n    attester\n    decodedDataJson\n    expirationTime\n    id\n    ipfsHash\n    isOffchain\n    recipient\n    refUID\n    revoked\n    schemaId\n    time\n    timeCreated\n    txid\n    __typename\n  }\n}',
  } as {
    operationName: string;
    variables: {
      where: {
        refUID: {
          equals: string;
        };
        schemaId: {
          equals: string;
        };
        attester?: {
          equals: string;
        };
      };
    };
    query: string;
  };
  if (attester) {
    body.variables.where.attester = { equals: attester };
  }
  return body;
};

export const mapAttestation = (data: {
  data: {
    attestations: {
      decodedData: any;
      decodedDataJson: string;
    }[];
  };
}) => {
  data.data.attestations = data.data.attestations.map(
    (attestation: { decodedData: any; decodedDataJson: string }) => {
      attestation.decodedData = JSON.parse(attestation.decodedDataJson);
      return attestation;
    },
  );
  return data;
};
