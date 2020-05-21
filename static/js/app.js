var samples = "../../samples.json"

var menu = d3.select("#selDataset");
var optionValue = menu.property("value");
menu.on("change", optionChanged);

function optionChanged() {
    d3.json(samples).then(function(data) {
        // Add list of ids to drop-down menu    
        var ids = data.names;
        ids.forEach(function(id) {
            menu.append("option").text(id);
        });

        var summaryData = {}
        for (i=0; i<ids.length; i++) {
            summaryData.id = ids[i];
            summaryData.sample_values = data.samples[i].sample_values;
            summaryData.otu_ids = data.samples[i].otu_ids;
            summaryData.otu_labels = data.samples[i].otu_labels;
        };

        //Select metadata for specific id
        var metadata = data.metadata[0];
        var metaData = metadata.filter(data => data.id === optionValue);

        //Add metadata for selected id to demographics table
        var demographicData = d3.select("#sample-metadata");
        Object.entries(metaData).forEach(([key, value]) => {
            demographicData.append("p").text(`${key}: ${value}`);
        });

        //Get top 10 sample values for specific id
        var idData = summaryData.filter(data => data.id === optionValue);
        var top10 = idData.sort((a,b) => b.sample_values - a.sample_values).slice(0,10);
        reversedData = top10.reverse();

        //Create bar plot
        var trace1 = {
            x: reversedData.map(object => object.sample_values),
            y: reversedData.map(object => object.otu_ids),
            text: reversedData.map(object => object.otu_labels),
            type: 'bar',
            orientation: 'h'
        };

        var data1 = [trace1];

        Plotly.newPlot("bar", data1);

        //Create bubble plot
        var trace2 = {
            x: reversedData.map(object => object.otu_ids),
            y: reversedData.map(object => object.sample_values),
            text: reversedData.map(object => object.otu_labels),
            mode: 'markers',
            marker: {
                color: reversedData.map(object => object.otu_ids),
                size: reversedData.map(object => object.sample_values)
            }
        };

        var data2 = [trace2];

        Plotly.newPlot("bubble", data2)
    });

};
