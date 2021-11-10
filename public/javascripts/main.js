(async () => {
  try {
    const statistics = await axios.get("http://localhost:3000/api/statistics");
    const date = moment().format("dddd MMMM D YYYY");
    document.querySelectorAll(".date")[0].innerText = date;
    document.querySelectorAll(".date")[1].innerText = date;
    document.getElementById("deathsNumber").innerText =
      statistics.data.deaths.toLocaleString();
    document.getElementById("infectedNumber").innerText =
      statistics.data.confirmed.toLocaleString();
    const countries = await axios.get("http://localhost:3000/api/allCountries");
    let countryOptions = `<option value="global">Global</option>`;
    countries.data.countries.forEach((items) => {
      countryOptions += `<option value="${items.country}">${items.country}</option>`;
    });
    const countrySelectBox = document.getElementById("country");
    countrySelectBox.innerHTML = countryOptions;
  } catch (err) {
    console.log(err);
  }
})();

async function myNewFunction(selected) {
  const country = selected.options[selected.selectedIndex].value;
  if (country === "global") {
    location.reload();
  } else {
    axios
      .get(`http://localhost:3000/api/country/${country}`)
      .then((res) => {
        document.getElementById("chart").innerHTML = `<div id="chartContainer">
        <canvas class="mt-1 mb-3 mx-auto" id="myChart" style="width: 80%"></canvas>
    </div>`;
        document.getElementById("deathsNumber").innerText =
          res.data.totalDeaths.toLocaleString();
        document.getElementById("infectedNumber").innerText =
          res.data.totalConfirmed.toLocaleString();
        drawChart(res.data.deaths, res.data.confirmed, res.data.dates);
      })
      .catch((err) => {
        if (err.response.status) {
          document.getElementById(
            "chart"
          ).innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">There is no statistics for this country.</strong>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>`;
          setTimeout(() => {
            location.reload();
          }, 3000);
        }
      });
  }
}

function drawChart(deaths, confirmed, dates) {
  myChart = new Chart("myChart", {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Infected",
          borderColor: "#3333ff",
          fill: true,
          data: confirmed,
        },
        {
          label: "Deaths",
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          fill: true,
          data: deaths,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: false,
        text: "Chart.js Line Chart - Logarithmic",
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Date",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            //type: 'logarithmic',
            scaleLabel: {
              display: true,
              labelString: "Cases",
            },
            ticks: {
              min: 0,
              max: Math.round(confirmed[confirmed.length - 1] * 2),
              // forces step size to be 5 units
              stepSize: Math.round(confirmed[confirmed.length - 1] / 3),
            },
          },
        ],
      },
    },
  });
}
