function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var outputArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var output = outputArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var metadataPanel = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        metadataPanel.html("");
        Object.entries(output).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        var outputArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        var output = outputArray[0];

        var subjectID = output.id;
        var otu_ids = output.otu_ids;
        var otu_labels = output.otu_labels;
        var sample_values = output.sample_values;

        // Build a Bubble Chart
        var bubbleLayout = {
            //title: "Belly Button Bacteria count",
            title: {
                text: `Belly Button Bacteria count of Subject#` + subjectID,
                font: {
                    family: 'Courier New, monospace',
                    size: 24
                }
            },
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Build Pie Chart
        var pieData = [{
            values: sample_values.slice(0, 10),
            labels: otu_ids,
            type: "pie"
        }];
        var pieLayout = {
            height: 400,
            width: 600
        };

        Plotly.newPlot("pie", pieData, pieLayout);

    });
}
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        console.log(data);
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();