function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
     var url = `/metadata/${sample}`;
     d3.json(url).then(function(data){
     console.log(url);
     var metadata = d3.select('#sample-metadata');
     console.log(metadata);
    
     // Use `.html("") to clear any existing metadata
     metadata.html("");
    
 // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    md_todisplay = ""; 
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function ([key, value], index) {
      md_todisplay = md_todisplay + `${key}: ${value} <br>`;  
    });

    metadata.html(md_todisplay);
  });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  var url = `/samples/${sample}`;
  console.log(url);
  d3.json(url).then(function(data){
    var trace1 = {
      "labels": data["otu_ids"].slice(0,10),
      "values": data["sample_values"].slice(0,10),
      "hoverinfo": data["otu_labels"].slice(0,10),
      "type": "pie"
    };

    var layout= {
      title: `Top 10 samples pie chart`
    };

    data = [trace1];

    Plotly.newPlot("pie", data, layout);

  });
    // @TODO: Build a Bubble Chart using the sample data
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data){
    var trace2 = {
      x:data.otu_ids,
      y:data.sample_values,
      mode:'markers',
      text: data.otu_labels,
      marker:{
        color:data.otu_ids,
        size:data.sample_values,
      }
    };
      var layout = {
        title: 'Bubble chart',
        margin: {t :0},
        hovermode: "closest",
        showlegend: false
      };
    data = [trace2];

    Plotly.newPlot("bubble", data, layout);

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
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
