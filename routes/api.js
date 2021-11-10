const express = require("express");
const router = express.Router();
const moment = require("moment");
const axios = require("axios");
const fs = require("fs");

router.get("/statistics", async (req, res, next) => {
  try {
    const statistics = await axios.get("https://covid19.mathdro.id/api/");
    return res.json({
      confirmed: statistics.data.confirmed.value,
      deaths: statistics.data.deaths.value,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/allCountries", async (req, res, next) => {
  try {
    const countries = JSON.parse(fs.readFileSync("../countries.json"));
    return res.json({
      countries,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/country/:country", async (req, res, next) => {
  try {
    const { country } = req.params;
    const countryData = await axios.get(
      `https://api.covid19api.com/total/country/${country.toLowerCase()}`
    );
    let size = Object.values(countryData.data).length - 1;
    let deaths = [],
      confirmed = [],
      dates = [];
    for (let index = size; ; index = index - 30) {
      if (dates.length > 12) break;
      deaths.push(countryData.data[index].Deaths);
      confirmed.push(countryData.data[index].Confirmed);
      dates.push(moment(countryData.data[index].Date).format("MM-DD-YYYY"));
    }
    return res.json({
      totalDeaths: countryData.data[size].Deaths,
      totalConfirmed: countryData.data[size].Confirmed,
      deaths: deaths.reverse(),
      confirmed: confirmed.reverse(),
      dates: dates.reverse(),
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
