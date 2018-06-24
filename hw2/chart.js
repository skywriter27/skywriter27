var margin = {top: 50, bottom: 10, left:300, right: 40};
var width = 900 - margin.left - margin.right;
var height = 2000 - margin.top - margin.bottom;
 
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleBand();

var max_rect_height = 20, rect_height;

var svg = d3.select("body").append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom);

var chart = svg.append("g")
.attr("transform", "translate("+margin.left+","+margin.top+")")
.attr("class", "chart");
 
d3.json("countries_1995_2012.json", function(data)
{
	d3.selectAll("input[type=checkbox]").on("change", update);
	d3.selectAll("input[name=aggregation]").on("change", update);
	d3.selectAll("input[name=encoding]").on("change", update);
	d3.selectAll("input[name=sorting]").on("change", function()
	{
		sort(d3.select('input[name=sorting]:checked').node().value);
	});
	
	var min_year = data[0].years[0].year, max_year = data[0].years[0].year;
	data.forEach(function(item)
	{
		item.years.forEach(function(y)
		{
			if (y.year < min_year)
				min_year = y.year;
			else if(y.year > max_year)
				max_year = y.year;
		});
	});
	
	d3.selectAll("input[type=range]")
	.attr("min", min_year)
	.attr("max", max_year)
	.on("input", update);
	
	d3.select("#before")
	.html("Time change: " + min_year);
	d3.select("#after")
	.html(max_year);
	
	update();
	
	function update()
	{
		var current_year = d3.selectAll("input[type=range]").node().value;
		
		var _data = data.map(function(item)
		{
			var l_year = item.years.filter(function(d){return d.year == current_year;})[0];
			var tmp = {};
			tmp.alpha2_code = item.alpha2_code;
			tmp.continent = item.continent;
			tmp.gdp = l_year.gdp;
			tmp.latitude = item.latitude;
			tmp.life_expectancy = l_year.life_expectancy;
			tmp.longitude = item.longitude;
			tmp.population = l_year.population;
			tmp.year = l_year.year;
			tmp.name = item.name;
			return tmp;
		});
		
		var continents = [];
				
		d3.selectAll("input[type=checkbox]").each(function()
		{
			checkbox = d3.select(this);
			if(checkbox.property("checked"))
				continents.push(checkbox.attr("name"));
		});
		
		var filtered = continents.length > 0 ? _data.filter(function(d)
		{
			return continents.includes(d["continent"]);
		}) : _data;
		
		if(d3.select('input[name=aggregation]:checked').node().value == "continent")
		{
			filtered = d3.nest()
			.key(function(d) { return d.continent; })
			.rollup(function(leaves)
			{
				return {
					name: leaves[0].continent,
					continent: leaves[0].continent,
					gdp: d3.sum(leaves, function(d) { return d.gdp; }),
					life_expectancy: d3.mean(leaves, function(d) { return d.life_expectancy; }),
					population: d3.sum(leaves, function(d) { return d.population; }),
					year: leaves[0].year
				};
			})
			.entries(filtered);
			filtered = filtered.map(function(item){ return item.value; });
		}
		
		var enc = d3.select('input[name=encoding]:checked').node().value;
		
		var max = d3.max(filtered, function(d)
		{
			return enc === "population" ? d.population : d.gdp;
		} );
		var min = 0;
		
		rect_height = height / (filtered.length * 1.3);
		if(rect_height > max_rect_height)
			rect_height = max_rect_height;
		
		yScale = d3.scaleBand().rangeRound([0, filtered.length * rect_height * 1.3]);
		xScale.domain([min, max]);
		yScale.domain(filtered.map(function(d, i) { return i; }));
	 
		var groups = chart.selectAll("g")
		.remove().exit().data(filtered);
		
		var enter = groups.enter().append("g");
		groups.exit().remove();
		groups = groups.merge(enter);
		
		var bars = groups.selectAll("rect")
		.data(function(d) { return d; });
		
		var labels = groups.selectAll("rect")
		.data(function(d) { return d; });
		
		groups.append("rect")
		.attr("width", function(d)
		{
			return xScale(enc === "population" ? d.population : d.gdp);	
		})
		.attr("height", rect_height)
		.attr("x", xScale(min))
		.attr("y", function(d, i) { return yScale(i); })
		.attr("fill", function(d)
		{
			var color = "black";
			switch(d.continent)
			{
				case "Americas": color = "#ff6666"; break;
				case "Africa": color = "#aaff80"; break;
				case "Asia": color = "#ff9966"; break;
				case "Europe": color = "#66ffcc"; break;
				case "Oceania": color = "#9999ff"; break;
				default: break;
			}
			return color;
		});
		
		groups.append("text").text(function(d)
		{
			return d.name;
		})
		.attr("text-anchor","end")
		.attr("x", -10)
		.attr("y",function(d, i) { return yScale(i) + rect_height * 0.8 ;})
		.attr("font-size", Math.floor(rect_height) + "px");
		
		bars.exit().remove();
		labels.exit().remove();
		
		sort(d3.select('select[id=dataset]:selected').node().value);
	}
	
	function sort(h)
	{
		var bars = chart.selectAll("rect");
		var labels = chart.selectAll("text");
		
		if (bars.size() <= 1 || labels.size() <= 1)
			return;
			
		bars.sort(function(a, b)
		{
			if (h === "population")
				return b.population - a.population;
			else if (h === "gdp")
				return b.gdp - a.gdp;
			else if (h === "country")
				return d3.descending(b.name, a.name);
		})
		.transition()
		.attr("y", function(d, i) { return yScale(i); });
		
		labels.sort(function(a, b)
		{
			if (h === "population")
				return b.population - a.population;
			else if (h === "gdp")
				return b.gdp - a.gdp;
			else if (h === "country")
				return d3.descending(b.name, a.name);
		})
		.transition()
		.attr("y", function(d, i) { return yScale(i) + rect_height * 0.8; });
	}
});
