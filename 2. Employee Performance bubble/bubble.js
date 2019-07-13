(function() {
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;



    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height - 30)
        .attr("width", width -10)
        .attr("viewBox", "100 200 400 600") //for panning & zooming
        .append("g")
        .attr("transform", "translate(-150,300)")


// To add tooltip

    var tooltip = d3.select("#chart")
    .append("div")
    .attr("height", "auto")
    .attr("width", "auto")
      
      .style("opacity", 1)
      .attr("class", "tooltip")
      .style("background-color", "grey")
      .style("border-radius", "15px")
      .style("padding", "10px")
      .style("color", "white")

// To show tooltip
  



  


    var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(10)
      
    tooltip
      .style("opacity", 1)
      .style("text-align","center")
     // .html("<h2> Employee Name: + d.name<h2>")

     .html("Employee Name: " + d.name + "<br> <br/>"+"Complaints Open: " + d.sales + "<br> <br/>"+ "Complaints Assigned: " + d.total+"<br> <br/>")


   //    .text("Employee Name: " + d.name)
	  // .text("Complaints Open " + d.sales)
   //    .text("Complaints Assigned " + d.total)

      .append("img")
      .attr("src",d.picture)
      .style("border-radius", "120px")
      .style("padding", "10px")
        .attr("xlink:href", "url")
        .attr("url", d.picture)
       
       // .html(html)
        .attr("x", "200")
        .attr("y", "200")
        .attr("width", "220")
        .attr("height", "220")

      



      //
      //.append('image')
      //.attr('xlink:href', d.picture)
      //.attr('width', 100)
      //.attr('height', 100)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }


  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")

  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }  

 




    var radiusScale = d3.scaleSqrt().domain([1, 300]).range([10, 80])


    var forceX = d3.forceX(function(d) {
        if (d.decade === 'pre-2000') {
            return 50
        } else {
            return 550
        }

    }).strength(0.2)

    var forceXcombine = d3.forceX((width)/2).strength(0.02)


    var forcecollide = d3.forceCollide(function(d) {
        return radiusScale(d.sales) + 1;
    })


    var simulation = d3.forceSimulation()
        //.velocityDecay(0.09)
        .force("x", forceXcombine)
        .force("y", d3.forceY((height-150) / 2).strength(0.02))
        .force("collide", forcecollide)

    var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }



    d3.queue()
        .defer(d3.csv, "https://raw.githubusercontent.com/AnuragSinghChaudhary/viz/master/employee.csv")
        .await(ready)

    function ready(error, datapoints) {
        var circles = svg.selectAll(".artist")
            .data(datapoints)
            .enter()
            .append("circle")
            .attr("class", "artist")
            .attr('r', 25)
            .attr("r", function(d) {
                return radiusScale(d.sales)
            })
          //  .attr("fill","url(#jon-snow)")

            .style("fill", function(d) {
                if (d.decade === 'pre-2000') {
                    return "salmon"
                } else {
                    return "#d3d3d3"
                }
            })

        // To add tooltip on over move and leave
            
            .on("mouseover", showTooltip )
    		    .on("mousemove", moveTooltip )
        		.on("mouseleave", hideTooltip )



        var node = svg.selectAll(".node")
      				  .append("text")
      				  .text(function(d) { return d.name; })
      				  .attr("dy", ".35em");

        node.append("svg:circle")
            .attr("class", "node")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("r", 5);        
					   
				                          

        d3.select("#decade") 
          .on("click", function() {
          simulation
                .force("x", forceX)
                .alphaTarget(0.5)
                .restart()
        })

        d3.select("#combine").on("click", function() {
            simulation
                .force("x", forceXcombine)
                .alphaTarget(0.1)
                .restart()
        })

        // let texts = svg.selectAll(null)
        //     .data(data)
        //     .enter()
        //     .append('text')
        //     .text(d => d.name)//     .attr('color', 'black')
        //     .attr('font-size', 15)

        //creating simulations

        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function(d) {
                    return d.x
                    // body...
                })
                .attr("cy", function(d) {
                    return d.y
                    // body...
                })
        }
    }
})();