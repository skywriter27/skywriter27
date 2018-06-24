# HOMEWORK 2 ANSWERS

---

### Question 1.1

Looking at the page containing the table, what are the differences between the DOM
as shown by the DOM inspector and the HTML source code? Why would you use the DOM inspector? When
is the HTML source useful?

__Answer__

DOM Inspector shows us the current state of the DOM, i.e. using DOM Inspector you see the content
of the document after all JS manipulations have been applied. On the other hand, HTML source code
shows us raw HTML document before any dynamic manipulation occured.

---

### Question 1.2

Below we have partially reproduced the first lines from the table's dataset.
What piece of software generates this table? Where are the original data stored?

__Answer__

The table is generated with D3 JS library. Original data are stored in *.json file.

---

You've created filters by continents, which are a limited set of categorical data.

### Question 2.1

Would you filter other columns from the table the same way? E.g. would you use checkboxes or any
other HTML widget?

__Answer__

For any numerical attributes checkboxes are not efficient solution. I'd use sliders or textfields
to set limitations on them. If I wanted to filter countries based on their names, I'd use textfield.

---

You've aggregated countries by continents, which are (still) a limited set of categorical data.

### Question 3.1

Could you aggregate the table using other columns? If you think yes, explain which
ones and how you would group values. Which HTML widgets would be appropriate?

__Answer__

'Continent' attribute is the most suitable one for country aggragation, since one continent value
is a common property for a group of countries. I don't think it is appropriate to aggregate
countries using other columns.

---

Use this dataset countries_1995_2012.json as input for the previously created table.

### Question 4.1

What does the new attribute years hold?

__Answer__

Attribute 'years' is an array containing objects with following keys:
'year', 'population', 'life expectancy', 'gdp', 'top parteners'. Value of 'top partners' is an array
containing objects with 'total export' and 'country id' keys.

---

### Question 5.1

What are the pros and cons of using HTML vs. SVG? Give some examples in the context
of creating visualizations.

__Answer__

When visualization consists of big amount(thousands) of nodes, it is better performance-wise
to use HTML5 canvas. Except that, SVG is not supported by older versions of browsers.
Drawing with SVG is easy, the result is visually consistent across different browsers, and it
is pretty fast, as opposed to drawing with native HTML elements(e.g. divs).

---

### Question 7.1

Give an example of a situation where visualization is appropriate, following the
arguments discussed in lecture and in the textbook (the example cannot be the same as mentioned in
either lecture or textbook).

__Answer__

Visualization is great when we have to present our results, make them accesible.
It is easier to spot a pattern in a large dataset when it is visualized, rather than
just a huge set of numbers.
For example, weather change will be much easier to spot if it is drawn on the map and animated
(especially with some interactivity, e.g. controllable timeline).

---

### Question 7.2

Which limitations of static charts can you solve using interactivity?

__Answer__

Interactivity presents variety of perspectives on the same multidimensional data. If a number
of perspectives are present on static visualization, it gets too big or too cluttered, so properly
impemented interactivity makes needed data easily distinguishable, and therefore visualization
gets more informative. Also it allows to show changes in a very natural way.

---

### Question 7.3

What are the limitations of visualization?

__Answer__

Visualization is not appropriate if we need to get clear and precise answer
to well defined question. Especially if it needs to be done fast.

---

### Question 7.4

Why are data semantics important for data?

__Answer__



---

### Question 7.5

Which relationships are defined for two attributes of (a) quantitative,
(b) categorical, or (c) ordinal scale?

__Answer__

a) Ratio

b) Equalty

c) Order

---

### Question 7.6

Which visual variables are associative (i.e., allow grouping)?

__Answer__

Position, shape, hue, orientation, texture.

---

### Question 7.7

Which visual variables are quantitative (i.e., allow to judge a quantitative
difference between two data points)?

__Answer__

Position, size, value.
