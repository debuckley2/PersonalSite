
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
    self.ind = self.svg.append("g");
    self.rep = self.svg.append("g");
    self.dem = self.svg.append("g");
    self.indText = self.svg.append("text");
    self.demText = self.svg.append("text");
    self.repText = self.svg.append("text");
    self.midLine = self.svg.append("line")
    .attr("x1", self.svgWidth/2)
    .attr("y1", 80)
    .attr("x2", self.svgWidth/2)
    .attr("y2", 30)
    .attr("fill", "black");
    self.midLabel = self.svg.append("text")
    .attr("x", self.svgWidth/2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .attr("class", "yearText");

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
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
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;
    self.midLine.attr("stroke", "black")
    var container = {
        r: [],
        d: [],
        i: []
    }
    electionResult.forEach((data)=>{
        var rVotes = parseInt(data.R_Votes) || 0;
        var dVotes = parseInt(data.D_Votes) || 0;
        var iVotes = parseInt(data.I_Votes) || 0;
        if(rVotes > dVotes && rVotes > iVotes ){
            container.r.push(data);
        }
        else if(dVotes > rVotes && dVotes > iVotes ){
            container.d.push(data);
        }
        else{
            container.i.push(data);
        }
    })
    container.r.sort((a,b)=>{
        if(parseInt(a.D_Percentage) - parseInt(a.R_Percentage) > parseInt(b.D_Percentage) - parseInt(b.R_Percentage) ){
            return -1;
        }
        else{
            return 1;
        }
    })
    container.d.sort((a,b)=>{
        if(parseInt(a.D_Percentage) - parseInt(a.R_Percentage) > parseInt(b.D_Percentage) - parseInt(b.R_Percentage) ){
            return -1;
        }
        else{
            return 1;
        }
    })
    var totalEVotes = 0;
    electionResult.forEach((d)=>{
        totalEVotes += parseInt(d.Total_EV);
    })
    self.midLabel.text(`Electoral Votes (${Math.floor(totalEVotes/2)} needed to win)`)
    self.widthScale = d3.scaleLinear()
        .domain([0, totalEVotes])
        .range([0, self.svgWidth]);

    var curX = 0;
    var indRect = self.ind.selectAll("rect").data(container.i);
    indRect.enter().append("rect");

    indRect
    .attr("y", 50)
    .attr("height", 25)
    .attr("width", (d)=>{
        var width = self.widthScale(parseInt(d.Total_EV));
        d.xCoord = curX;
        curX += width;
        return self.widthScale(parseInt(d.Total_EV));
    })
    .attr("x", (d)=>{
        return d.xCoord;
    })
    .attr("fill", "green");

    indRect.exit().remove();
    self.indText.attr("x", 0)
    .attr("y", 50)
    .attr("class", (d)=>{
        if(container.i.length > 0){
            return "yearText";
        }
        else{
            return "";
        }
    })
    .attr("fill", (d)=>{
        if(container.i.length > 0){
            return "black";
        }
        else{
            return "white";
        }
    })
    .text((d)=>{
        var tot = 0;
        container.i.forEach((item)=>{
            tot += parseInt(item.Total_EV);
        })
        return `${Number.parseFloat(100*tot/totalEVotes).toFixed(1)}%`;
    })
    self.demText.attr("x", curX)
    .attr("y", 50)
    .attr("class", (d)=>{
        if(container.d.length > 0){
            return "yearText";
        }
        else{
            return "";
        }
    })
    .text((d)=>{
        var tot = 0;
        container.d.forEach((item)=>{
            tot += parseInt(item.Total_EV);
        })
        return `${Number.parseFloat(100*tot/totalEVotes).toFixed(1)}%`;
    })
    var demRect = self.dem.selectAll("rect").data(container.d);
    demRect.enter().append("rect")

    demRect
    .attr("y", 50)
    .attr("height", 25)
    .attr("width", (d)=>{
        var width = self.widthScale(parseInt(d.Total_EV));
        d.xCoord = curX;
        curX += width;
        return self.widthScale(parseInt(d.Total_EV));
    })
    .attr("x", (d)=>{
        return d.xCoord;
    })
    .attr("fill", (d)=>{
        var gap = parseInt(d.R_Percentage) - parseInt(d.D_Percentage) - 5;
        return colorScale(gap);
    });

    demRect.exit().remove();
   
    self.repText.attr("x", self.svgWidth -50)
    .attr("y", 50)
    .attr("class", (d)=>{
        return "yearText";
    })
    .text((d)=>{
        var tot = 0;
        container.r.forEach((item)=>{
            tot += parseInt(item.Total_EV);
        })
        return `${Number.parseFloat(100*tot/totalEVotes).toFixed(1)}%`;
    })
    var repRect = self.rep.selectAll("rect").data(container.r);
    repRect.enter().append("rect")
    
    repRect
    .attr("y", 50)
    .attr("height", 25)
    .attr("width", (d)=>{
        var width = self.widthScale(parseInt(d.Total_EV));
        d.xCoord = curX;
        curX += width;
        return self.widthScale(parseInt(d.Total_EV));
    })
    .attr("x", (d)=>{
        return d.xCoord;
    })
    .attr("fill", (d)=>{
        var gap = parseInt(d.R_Percentage) - parseInt(d.D_Percentage) + 5;
        return colorScale(gap);
    });

    repRect.exit().remove();
    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
