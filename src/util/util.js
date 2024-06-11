const getHandleFromTwitterUrl = (str = "") =>
  (str || "")
    .replace("https://x.com/", "")
    .replace("http://x.com/", "")
    .replace("http://wwww.x.com/", "")
    .replace("https://twitter.com/", "")
    .replace("http://twitter.com/", "")
    .replace("https://www.twitter.com/", "");

module.exports = {
  getHandleFromTwitterUrl,
};
