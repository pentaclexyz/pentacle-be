const getHandleFromTwitterUrl = (str = "") =>
  (str || "")
    .replace("https://x.com/", "")
    .replace("http://x.com/", "")
    .replace("http://wwww.x.com/", "")
    .replace("https://twitter.com/", "")
    .replace("http://twitter.com/", "")
    .replace("https://www.twitter.com/", "");

const fetchGithubProfile = async (handle) => {
  try {
    const res = await (
      await fetch(`https://api.github.com/users/${handle}`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }).catch((e) => console.error(e))
    )
      .json()
      .catch((e) => console.error(e));
    return res;
  } catch (e) {
    console.error(e);
  }
};

const fetchTwitterProfile = async (handle) => {
  try {
    return fetch(`https://api.socialdata.tools/twitter/user/${handle}`, {
      headers: {
        Authorization: `Bearer ${process.env.SOCIALDATA_KEY}`,
      },
    }).then((res) => {
      console.log(`API returned :${res.status}: ${res.statusText}`);
      return res.json();
    });
  } catch (e) {
    console.error(e);
  }
};
const fetchFarcasterProfile = async (handle) => {
  try {
    return fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${handle}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEYNAR_API_KEY}`,
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    ).then((res) => {
      console.log(`API returned :${res.status}: ${res.statusText}`);
      return res.json().then((data) => data.result.users[0]);
    });
  } catch (e) {
    console.error(e);
  }
};
module.exports = {
  getHandleFromTwitterUrl,
  fetchTwitterProfile,
  fetchGithubProfile,
  fetchFarcasterProfile,
};
