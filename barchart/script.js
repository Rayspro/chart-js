const data=[
    {height:100,fill:"red"},
    {height:250,fill:"green"},
    {height:70,fill:"yellow"},
    {height:300,fill:"pink"},
    {height:140,fill:"white"},
    {height:1400,fill:"red"},
    {height:1200,fill:"red"}
];

const graph={"width":300,"height":300,"marginLeft":40,"marginTop":40}
const canvasWidth=600;
const canvasHeight=500;
const graphWidth=canvasWidth-2*graph.marginLeft;
const graphHeight=canvasHeight-2*graph.marginTop;

let barchart=d3.select("div");

//Create Svg element...
let svg=barchart.append("svg")
                .attr("height",canvasHeight)
                .attr("width",canvasWidth)
                .style("background-color","grey")

//Add all bars in group...
let group=svg.append("g")
            .attr("width",graphWidth)
            .attr("height",graphHeight)
            .attr("transform",`translate(${graph.marginLeft},${graph.marginTop})`)

//Add group for axis...
let axisBottomGroup=group.append("g")
                        .attr("transform",`translate(0,${graphHeight})`);

let axisLeftGroup=group.append("g");

//Call Update Function...
update(data);

d3.interval(()=>{
    data.push({"height":parseInt(Math.random()*1000),"fill":"red"})
    data.shift();
    //update(data)
},5000)

function update(data){

    var y=d3.scaleLinear()
        .domain([0,1400])
        .range([graphHeight,0])

    var x=d3.scaleBand()
        .domain(data.map(d=>d.height))
        .range([0,graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    //Select all rect element and append in existing dom rect element...
    let bar=group.selectAll("rect")
                .data(data)
                .attr("x",(d,i)=>x(d.height))
                .attr("height",(d)=>graphHeight-y(d.height))
                .attr("width",x.bandwidth)
                .attr("y",d=>y(d.height))
                .attr("fill",d=>d.fill)

    //Add data on non existing dom virtual enter node...
    bar.enter()
        .append("rect")
        .attr("x",(d,i)=>x(d.height))
        .attr("height",0)
        .attr("y",graphHeight)
        .attr("width",x.bandwidth)
        .transition()
        .duration(1000)
        .attrTween("fill",colorTween)
        .attr("height",(d)=>graphHeight-y(d.height))
        .attr("y",d=>y(d.height))

    bar.exit().remove()

    //Add axis on graph...
    let bottom=d3.axisBottom(x);
    let left=d3.axisLeft(y)
                .ticks(9);  

    axisBottomGroup.call(bottom);
    axisLeftGroup.call(left);

    function widthTween(d){
        var i=d3.interpolate(0,x.bandwidth())
        console.log("i",i)
        return function(t){
            console.log(i(t),t)
            return i(t);
        }
    }

    function colorTween(d){
        return function(t){
            return d3.interpolateRgb("red","blue")(t)
        }
    }

}