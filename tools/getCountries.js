const axios = require("axios");
const fs = require("fs");

module.exports = function getCountries() {
  axios
    .get("https://countriesnow.space/api/v0.1/countries")
    .then((res) => {
      fs.writeFile(
        "../countries.json",
        JSON.stringify(res.data.data),
        "utf8",
        (err) => {
          if (err) console.log("Cannot write coutries list into file");
          console.log("All countries list write into the file");
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
