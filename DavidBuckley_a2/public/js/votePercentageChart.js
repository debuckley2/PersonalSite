/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
    self.indRect = self.svg.append("rect");
    self.repRect = self.svg.append("rect");
    self.demRect = self.svg.append("rect");
    self.midLine = self.svg.append("line")
    .attr("x1", self.svgWidth/2)
    .attr("y1", 80)
    .attr("x2", self.svgWidth/2)
    .attr("y2", 45)
    .attr("fill", "black");
    self.midLabel = self.svg.append("text")
    .attr("x", self.svgWidth/2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .attr("class", "yearText")

    self.indText = self.svg.append("text");
    self.demText = self.svg.append("text");
    self.repText = self.svg.append("text");
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;
    self.midLine.attr("stroke", "black");
    self.midLabel.text("50%")
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            /* populate data in the following format
             * tooltip_data = {
             * "result":[
             * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
             * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
             * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
             * ]
             * }
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            return ;
        });

    
    // ******* TODO: PART III *******
    var totalRepVotes = 0;
    var totalIndVotes = 0;
    var totalDemVotes = 0;
    electionResult.forEach((item)=>{
        var dem = parseInt(item.D_Votes) || 0;
        var rep = parseInt(item.R_Votes) || 0;
        var ind = parseInt(item.I_Votes) || 0;

        totalDemVotes += dem;
        totalRepVotes += rep;
        totalIndVotes += ind;
    })
    var totalVotes = totalDemVotes + totalRepVotes + totalIndVotes;
    var scale = d3.scaleLinear()
        .domain([0,totalIndVotes + totalRepVotes +totalDemVotes])
        .range([0, self.svgWidth]);
    
    var x = 0;
    self.indText.attr("x", 0)
    .attr("y", 50)
    .text(()=>{
        if(electionResult[0].I_Nominee != undefined && Number.parseFloat(100*totalIndVotes/totalVotes).toFixed(1) > 0.0){
            return `${electionResult[0].I_Nominee}: ${Number.parseFloat(100*totalIndVotes/totalVotes).toFixed(1)}%`
        }
        return "";
    })
    .attr("class", "yeartext")
    .style("font-size", 10)
    .style("text-anchor", "start")
    self.indRect
    .attr("x",0)
    .attr("y", 50)
    .attr("width", (d)=>{
        width = scale(totalIndVotes);
        x += width;
        return width;
    })
    .attr("fill", "green")
    .attr("height", 25)

    
    self.demRect
    .attr("x",x)
    .attr("y", 50)
    .attr("width", (d)=>{
        width = scale(totalDemVotes);
        x += width;
        return width;
    })
    .attr("fill", "#0066CC")
    .attr("height", 25)

    self.demText.attr("x", x)
    .attr("y", 50)
    .text(`${electionResult[0].D_Nominee}: ${Number.parseFloat(100*totalDemVotes/totalVotes).toFixed(1)}%`)
    .attr("class", "yeartext")
    .style("font-size", 10)
    .style("text-anchor", "end")

    self.repRect
    .attr("x",x)
    .attr("y", 50)
    .attr("width", (d)=>{
        width = scale(totalRepVotes);
        x += width;
        return width;
    })
    .attr("fill", "#CC0000")
    .attr("height", 25)

    self.repText.attr("x", x)
    .attr("y", 50)
    .text(`${electionResult[0].R_Nominee}: ${Number.parseFloat(100*totalRepVotes/totalVotes).toFixed(1)}%`)
    .attr("class", "yeartext")
    .style("font-size", 10)
    .style("text-anchor", "end")

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

};
