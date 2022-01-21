import cubejs from "@cubejs-client/core";
import moment from "moment";

import Chart from "chart.js";

import "chartjs-plugin-colorschemes";
import { RdPu4 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

// Create an instance of Cube.js JavaScript Client
const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTQ2NjY4OTR9.0fdi5cuDZ2t3OSrPOMoc3B1_pwhnWj4ZmM3FHEX7Aus",
  {
    apiUrl:
      "https://awesome-ecom.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1"
  }
);

// Query data from Cube.js Backend
cubejsApi
  .load({
    measures: ["Orders.count"],
    dimensions: ["ProductCategories.name"],
    filters: [
      {
        member: "ProductCategories.name",
        operator: "equals",
        values: ["Beauty", "Clothing", "Computers", "Electronics"]
      }
    ],
    timeDimensions: [
      {
        dimension: "Orders.createdAt",
        granularity: "month",
        dateRange: "last 6 month"
      }
    ]
  })
  .then((resultSet) => {
    //Transform data for visualization
    const labels = resultSet
      .seriesNames({
        x: [],
        y: ["Orders.createdAt"]
      })
      .map((column) => moment(column.yValues[0]).format("MMMM"));

    const datasets = resultSet.series().map((item, i) => {
      return {
        label: item.title,
        data: item.series.map((item) => item.value)
      };
    });

    //Visualize the data
    var ctx = document.getElementById("chart").getContext("2d");
    window.myBar = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets
      },
      options: {
        legend: {
          position: "bottom",
          align: "start"
        },
        plugins: {
          colorschemes: {
            scheme: RdPu4
          }
        }
      }
    });
  });
