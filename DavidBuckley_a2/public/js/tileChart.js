/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 150;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

    self.evText = self.svg.append("g");

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;
    var coordsList = [
        {x:1,y:1},
        {x:8,y:7},
        {x:6,y:6},
        {x:3,y:6},
        {x:2,y:5},
        {x:4,y:5},
        {x:11,y:4},
        {x:11,y:5},
        {x:10,y:6},
        {x:10,y:8},
        {x:9,y:7},
        {x:2,y:8},
        {x:6,y:4},
        {x:3,y:3},
        {x:7,y:3},
        {x:7,y:4},
        {x:5,y:6},
        {x:7,y:5},
        {x:6,y:7},
        {x:12,y:3},
        {x:10,y:5},
        {x:12,y:1},
        {x:9,y:3},
        {x:6,y:3},
        {x:6,y:5},
        {x:7,y:7},
        {x:4,y:3},
        {x:8,y:6},
        {x:5,y:3},
        {x:5,y:5},
        {x:12,y:2},
        {x:10,y:4},
        {x:4,y:6},
        {x:3,y:4},
        {x:10,y:3},
        {x:8,y:4},
        {x:5,y:7},
        {x:2,y:4},
        {x:9,y:4},
        {x:11,y:3},
        {x:9,y:6},
        {x:5,y:4},
        {x:7,y:6},
        {x:5,y:8},
        {x:3,y:5},
        {x:9,y:5},
        {x:11,y:2},
        {x:2,y:3},
        {x:8,y:3},
        {x:8,y:5},
        {x:4, y:4}
    ]
    electionResult.sort((a,b)=>{
        if(a.Abbreviation < b.Abbreviation){
            return -1;
        }
        else{
            return 1;
        }
    })
    if(parseInt(electionResult[0].Year) < 1960){
        electionResult.splice(0, 0, {State: "Alaska",
            Abbreviation: "AK",
            Total_EV: 0,
            D_Nominee: "None",
            D_Percentage: "0.0",
            D_Votes: "0",
            R_Nominee: "None",
            R_Percentage: "0.0",
            R_Votes: "0",
            I_Nominee: "None",
            I_Percentage: "0.0",
            I_Votes: "0",
            Year: electionResult[0].Year
        });
        electionResult.splice(7, 0, {
            State: "Washington D.C.",
            Abbreviation: "DC",
            Total_EV: 0,
            D_Nominee: "None",
            D_Percentage: "0.0",
            D_Votes: "0",
            R_Nominee: "None",
            R_Percentage: "0.0",
            R_Votes: "0",
            I_Nominee: "None",
            I_Percentage: "0.0",
            I_Votes: "0",
            Year: electionResult[0].Year
        });
        electionResult.splice(11, 0, {
                State: "Hawaii",
                Abbreviation: "HI",
                Total_EV: 0,
                D_Nominee: "None",
                D_Percentage: "0.0",
                D_Votes: "0",
                R_Nominee: "None",
                R_Percentage: "0.0",
                R_Votes: "0",
                I_Nominee: "None",
                I_Percentage: "0.0",
                I_Votes: "0",
                Year: electionResult[0].Year
        });
    }
    else if(electionResult[0].Year < 1964){
        electionResult.splice(7, 0, {
            State: "Washington D.C.",
            Abbreviation: "DC",
            Total_EV: 0,
            D_Nominee: "None",
            D_Percentage: "0.0",
            D_Votes: "0",
            R_Nominee: "None",
            R_Percentage: "0.0",
            R_Votes: "0",
            I_Nominee: "None",
            I_Percentage: "0.0",
            I_Votes: "0",
            Year: electionResult[0].Year
        });
    }
    console.log(electionResult)
    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function(event, d) {
            return [0,0];
        })
        .html(function(event, d) {
            console.log(d);
            var winner = "";
            var dVotes = parseInt(d.D_Votes);
            var rVotes = parseInt(d.R_Votes);
            var iVotes = parseInt(d.I_Votes) || 0;
            if(dVotes > rVotes && dVotes > iVotes){
                winner = d.D_Nominee;
            }
            else if(rVotes > dVotes && rVotes > iVotes){
                winner = d.R_Nominee;
            }
            else{
                winner = d.I_Nominee;
            }
            tooltip_data = {
                "state": d.State,
                "winner": winner,
                "electoralVotes" : d.Total_EV,
                "result":[
                    {"nominee": d.D_Nominee,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                    {"nominee": d.R_Nominee,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
                    {"nominee": d.I_Nominee,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"}
                ]
             }
            return self.tooltip_render(tooltip_data);
        });

    self.svg.call(tip);
    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile");

    var legendQuantile = d3.legendColor()
        .shapeWidth((self.svgWidth-self.margin.right)/10)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);


    var sWidth = self.svgWidth /12;
    var sHeight = self.svgHeight/8;
    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.
    self.legendSvg.select(".legendQuantile").style("transform", `translate(${this.svgWidth/2},0)`).call(legendQuantile)

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
    self.svg.selectAll("rect").data(electionResult).enter().append("rect").on("mouseover", tip.show).on("mouseout", tip.hide);
    self.svg.selectAll("rect").data(electionResult).attr("x",(d,i)=>{
        var xCoord = coordsList[i].x - 1;
        return xCoord*sWidth;
    })
    .attr("y",(d,i)=>{
        var yCoord = coordsList[i].y - 1;
        return yCoord*sHeight;
    })
    .attr("width", sWidth)
    .attr("height",sHeight)
    .attr("fill", (d)=>{
        if(parseInt(d.Total_EV) == 0){
            return "grey";
        }
        else{
            var repPer = parseInt(d.R_Percentage);
            var demPer = parseInt(d.D_Percentage);
            var indPer = parseInt(d.I_Percentage);
            if(indPer > repPer && indPer > demPer){
                return "green";
            }
            var gap = repPer - demPer;
            if(gap<0){
                gap -=5
            }
            else{
                gap+=5
            }
            return colorScale(gap);
        }
    })

    self.svg.selectAll("text").data(electionResult).enter().append("text");
    self.svg.selectAll("text").data(electionResult).attr("x",(d,i)=>{
        var xCoord = coordsList[i].x - 1;
        return xCoord*sWidth + sWidth/2;
    })
    .attr("y",(d,i)=>{
        var yCoord = coordsList[i].y - 1;
        return yCoord*sHeight + sHeight/2;
    }).text((d)=>{
        return `${d.Abbreviation}: ${d.Total_EV}`;
    })
    .style("text-anchor", "middle")
    .style("text-size", 5);

    // self.evText.selectAll("text").data(electionResult).enter().append("text");
    // self.evText.selectAll("text").data(electionResult).attr("x",(d,i)=>{
    //     var xCoord = coordsList[i].x - 1;
    //     return xCoord*sWidth + sWidth/2;
    // })
    // .attr("y",(d,i)=>{
    //     var yCoord = coordsList[i].y - 1;
    //     return yCoord*sHeight + sHeight/2 + sHeight/4;
    // }).text((d)=>{
    //     return d.Total_EV;
    // })
    // .attr("class", "tilestext")
    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};
