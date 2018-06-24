var url = "https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json";
var cache = {} , dict = {};
var xhr = new XMLHttpRequest();
var quotes = [];
xhr.open("GET" , url , false);
xhr.send(null);

if(xhr.status == 200)
{
	quotes = JSON.parse(xhr.responseText);
	var counter = 0;
	quotes.forEach(function(item)
	{
		if (item.quoteAuthor in cache)
		{
			if(cache[item.quoteAuthor].indexOf(item.quoteText) == -1)
				cache[item.quoteAuthor].push(item.quoteText);
		}
		else
			cache[item.quoteAuthor] = [item.quoteText];
	})
	quotes.splice(0 , quotes.length);
	dict = Object.assign({},cache);
}

function RandomElement(array)
{
	return array[Math.floor(Math.random() * array.length)];
}

function range(arg)
{
	var ar = [] , i = 0;
	while (i < arg)
		ar.push(i++);
	return ar;
}

function RandomQuotes()
{
	if(Object.keys(dict).length == 0)
	{
		alert("No authors chosen");
		return;
	}
	var tmp = Object.assign({} , dict) , i = 0;
	
	for(i in range(3))
	{
		var author = RandomElement(Object.keys(tmp));
		
		if(author == null)
		{
			while(i < 3)
				document.getElementById("quote" + i++).innerHTML = "";
			break;
		}
			
		var quote = RandomElement(tmp[author]);
		
		tmp[author] = tmp[author].slice(0);
		tmp[author].splice(tmp[author].indexOf(quote) , 1);
				
		if(tmp[author].length == 0)
			delete tmp[author];
		document.getElementById("quote" + i).innerHTML = "\"" + quote.replace(/[\uFFF0-\uFFFF]/g,'—') + "\" – " + (author != "" ? author : "author unknown");
	}
}

function Name_Reverse(string)
{
	var tmp = string.split(' ');
	if(tmp.length <= 1)
		return string;
	[tmp[0],tmp[tmp.length-1]] = [tmp[tmp.length-1],tmp[0]]
	return tmp.join(' ');
}

window.onload = function()
{		
	RandomQuotes();
	var bsort = document.getElementById("button1");
	bsort.disabled = false;
	document.getElementById("button0").onclick = function()
	{
		RandomQuotes();
		bsort.disabled = false;
	}
	bsort.onclick = function()
	{
		var current = [document.getElementById("quote0").innerHTML , document.getElementById("quote1").innerHTML , document.getElementById("quote2").innerHTML];
		current.sort(function(arg1 , arg2)
		{
			if (arg1 < arg2 || arg2 == "")
				return -1;
			if (arg1 > arg2 || arg1 == "")
				return 1;
			return 0;
		});
		for(var i in range(3))
			document.getElementById("quote" + i).innerHTML = current[i];
		bsort.disabled = true;
	};
	
	var checkall = document.getElementById("checkall");
	checkall.checked = true;
	var surname_first = [] , checkboxes = [];
	
	checkall.addEventListener("change" , function()
	{
		checkboxes.forEach(function(item)
		{
			if(item.checked != checkall.checked)
				item.dispatchEvent(new Event("_change"));
		})
	})
	
	Object.keys(dict).forEach(function(item)
	{
		surname_first.push(Name_Reverse(item));
	})
	
	surname_first.sort();
	
	surname_first.forEach(function(item)
	{
		var div = document.createElement("div"),
			checkbox = document.createElement("input"),
			label = document.createElement("label"),
			text = document.createTextNode(' ' + (item != "" ? item : "unknown"));
			
		checkbox.type = "checkbox";
		checkbox.checked = true;
		checkbox.id = Name_Reverse(item);
		
		function Change()
		{
			if(checkbox.checked)
				dict[checkbox.id] = cache[checkbox.id];
			else
			{
				checkall.checked = false;
				delete dict[checkbox.id];
			}
		}
		
		checkbox.addEventListener("change" , Change);
		
		checkbox.addEventListener("_change" , function()
		{
			checkbox.checked ^= 1;
			Change();
		})
		
		checkboxes.push(checkbox);
		
		label.appendChild(checkbox);
		label.appendChild(text);
		
		div.setAttribute("class" , "checkbox");
		div.appendChild(label);
		
		document.getElementById("checklist").appendChild(div);
	})
}
