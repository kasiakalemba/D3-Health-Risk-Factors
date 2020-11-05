# Health Risk Factor Analysis

## Summary 
I analyzed the relationship betweem factors such poverty, age, or household income in relation to to obesity, smoking, and lack of healthcare by making an interactive graph that let's the user explore different trends based on these factor combinations.  

[Webpage Analysis](https://kasiakalemba.github.io/Health-Risk-Factors/)

## Table of Contents
1. [Technologies](#technologies)
2. [Developement](#development)
3. [Usage](#usage)
4. [Observations](#observations)

## Technologies
* Javascript: D3
* HTML, Boostrap, CSS

## Development
First I downloaded the data from [2014 ACS 1-year estimates](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). I created a scatter plot between each of the data variables such as Healthcare vs. Poverty or Smokers vs. Age, etc. by using the D3. Each state is represented with circle elements. I included animated transitions for the circles' locations as well as the range of the axes and added tooltips to circles with the data that the user has selected. 

![](images/page.png)

## Usage 
* Clone the repository 
* Ryn python -m http.server to run the visualization. This will host the page at local host in your web browser. 

## Observations 
The most apparent trends seems to be related to income. The higher the income, the less uninsured people in the corresponsing state as well as lower smoking and obesity levels. As poverty % increases in a given state, those same factors have the opposite trend. The results are expected as states with higher income generally have more resources to keep their populations healthier. 

Southern states displayed the strongest correlations between observed correlations such as increased smoking and obesity. 





















