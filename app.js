// Step 1 - Plotly.js
// var url ="/samples/<sample>";

function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
  var myUrl = `/samples/${sample}`;
  d3.json(myUrl).then(function(response) {
      console.log(response)
  //  // ***HINT: You will need to use slice() to grab the top 10 sample_values,
  //   //*** */ otu_ids, and labels (10 each).
    
  // buildPie (data);
      val1 = response.sample_values.sort((first, second) => second - first);
      const left = val1.slice(0, 10);
      console.log(left);

    // @TODO: Build a Pie Chart
    var data = [{
      values: left,
      labels: response.otu_ids,
      hovertext: response.otu_labels,
      type: "pie"
      }];
    var layout = {
    height: 700,
    width: 900,
    title: "Pie Chart"
    };
    Plotly.plot("pie", data, layout);
  
      // @TODO: Build a Bubble Chart using the sample data
    var data = [{
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color:  response.otu_ids
      },  
      hovertext: response.otu_labels
      }];
    var layout = {
      title: 'Bubble Chart',
      showlegend: false
      // height: 600,
      // width: 800
      };
    Plotly.newPlot('bubble', data, layout);
  });    
}

function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var myUrl = `/metadata/${sample}`;
  d3.json(myUrl).then(function(responseMeta) {
      console.log(responseMeta)
      // Use d3 to select the panel with id of `#sample-metadata`
  var selector = d3.select("#sample-metadata");  
    // Use `.html("") to clear any existing metadata
    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // var myObject = responseMeta.forEach((sample_metadata) => selector,
  // var myObject = myObject.map(selector => responseMeta.sample);
  //   console.log(myObject);

    Object.entries(responseMeta).forEach((key) => {
      selector.append("h6").text(key[0] + " : " + key[1])
    })

    // function objectMap(object, mapFn) {
    //   return Object.keys(object).reduce(function(result, key) {
    //     result[key] = mapFn(object[key])
    //     return result
    //   }, {})
    // },
      
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  console.log(newSample);
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
