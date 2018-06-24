var ascending = false;
var sorting;

d3.json("countries_1995_2012.json", function(error, data)
{	
	var table = d3.select("body").append("table");
	table.append("caption").html("World Countries Ranking");
	var thead = table.append("thead");
	var tbody = table.append("tbody");

	var _columns = ["name", "continent", "gdp", "life_expectancy", "population", "year"];
	
	thead.selectAll("th")
    .data(_columns)
    .enter().append("th")
    .text(function(d) { return d; })
    .on("click", function(h)
    {
		ascending = !ascending;
		sorting = h;
		sort(sorting);
    });
     
	d3.selectAll("input").on("change", update);
	
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
		
		var rows = tbody.selectAll("tr")
		.data(filtered);
		var renter = rows.enter().append("tr");
		rows.exit().remove();
		rows = rows.merge(renter);

		var cells = rows.selectAll("td").data(function(row)
		{
			return _columns.map(function(col)
			{
				var ret = row[col];
				switch(col)
				{
					case "gdp" : ret = d3.formatPrefix(".1f", row[col])(row[col]); break;
					case "life_expectancy" : ret = d3.format(".1f")(row[col]); break;
					case "population" : ret = d3.format(",.0f")(row[col]); break;
					default : break;
				}
				return ret;
			})
		});
		
		var center = cells.enter().append("td");
		cells.exit().remove();
		cells = cells.merge(center);

		cells.text(function(d) { return d; });
		
		if(sorting != null)
			sort(sorting);
	}
	
	function sort(h)
	{
		var rows = tbody.selectAll("tr");
		
		if (rows.size() <= 1)
			return;
		
		rows.sort(function(a, b)
		{
			if(!(isNaN(a[h]) && isNaN(b[h])))
			{
				return ascending ? (b[h] - a[h]) : (a[h] - b[h]);
			}
			else if(h == "continent")
			{
				return ascending ? d3.ascending(b[h] + b["name"], a[h] + a["name"]) : d3.descending(b[h] + b["name"], a[h] + a["name"]);
			}
			else if(h == "name")
			{
				return ascending ? d3.ascending(b[h], a[h]) : d3.descending(b[h], a[h]);
			}
			else return 0;
		});
	}
});
