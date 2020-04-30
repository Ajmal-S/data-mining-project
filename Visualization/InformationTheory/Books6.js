var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;
    graphWidth = width
    radius = 3;
    var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(graphWidth / 2, height / 2))
    .force("x", d3.forceX(graphWidth / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("link", d3.forceLink().strength(1).id(function(d) { return d.id; }))
    .alphaTarget(0)
    .alphaDecay(0.05)

var dataset = d3.json("cbdata1.json").then(function(data)
{return data;
});

var blues = d3.scaleOrdinal(d3.schemeSet1);
var transform = d3.zoomIdentity;
dataset.then(function(graph) {
    console.log(graph)
    function zoomed() {
        console.log("zooming")
        transform = d3.event.transform;
        simulationUpdate();
      }
    simulation
        .nodes(graph.nodes)
        .on("tick", simulationUpdate);

    simulation.force("link")
        .links(graph.links);

    d3.select(canvas)
            .call(d3.drag()
            .container(canvas)
            .subject(dragsubject2)
            .on("start", dragstarted2)
            .on("drag", dragged2)
            .on("end", dragended2))
            .call(d3.zoom()
            .scaleExtent([1 / 10, 8])
            .on("zoom", zoomed)
            );

    function dragsubject2() {
        var i,
        x = transform.invertX(d3.event.x),
        y = transform.invertY(d3.event.y),
        dx,
        dy;
        for (i = graph.nodes.length - 1; i >= 0; --i) {
            node = graph.nodes[i];
            dx = x - node.x;
            dy = y - node.y;
    
            if (dx * dx + dy * dy < radius * radius) {
    
            return node;
            }
        }
        }

    function dragstarted2() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
        }
    
    function dragged2() {
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);

        }

    function dragended2() {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
        }
  function simulationUpdate(){
    context.save();

    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    graph.links.forEach(function(d) {
          context.beginPath();
          context.moveTo(d.source.x, d.source.y);
          context.lineTo(d.target.x, d.target.y);
          context.stroke();
      });

      // Draw the nodes
      graph.nodes.forEach(function(d, i) {

          context.beginPath();
          context.arc(d.x, d.y, 3, 0, 2 * Math.PI, true);
          context.fillStyle = blues(d.group*d.media);
          context.fill();
          if(d.media == 1){
            context.font = "6px Georgia";
            context.fillText(d.name, d.x+3, d.y+2);
          }
                    
      });

      context.restore();
//        transform = d3.zoomIdentity;
  }

});
