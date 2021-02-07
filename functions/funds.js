const axios = require("axios");

exports.handler = async (event) => {
  const key = event.queryStringParameters.key;

  const endpoint =
    "https://www.oslobors.no/ob/servlets/components?type=ranking&source=feed.omff.FUNDS&ranking=%2BSECURITYNAME&limit=50&offset=0&columns=ITEM%2C+ITEM_SECTOR%2C+SECURITYNAME%2C+FUNDMGRID%2C+GROUPID%2C+PRICE%2C+TIME%2CPRICECHANGEPCT+as+CHANGE_RETGAVG_PCT%2C%2C%2C&filter=SECURITYNAME%25%25s%5E((%3Fiu).*.*)%26FUNDMGRID%3D%3Dn130&cutoffAtZero=false&channel=0b8ce596cdb2d4e9bd570296fa75c114";

  const ret = await axios.get(endpoint);

  const keysToFilterOn = key ? key.split(",").map((k) => k.trim()) : [];

  const mapped = ret.data.rows
    .map((row) => {
      const { SECURITYNAME, PRICE, TIME } = row.values;

      const time = new Date(TIME);

      return {
        key: row["key"],
        name: SECURITYNAME,
        price: PRICE,
        time,
      };
    })
    .filter((row) =>
      keysToFilterOn.length > 0 ? keysToFilterOn.includes(row.key) : true
    );

  return {
    statusCode: 200,
    body: JSON.stringify(mapped),
  };
};
