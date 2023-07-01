let countyData;
let educationData;

const createMap = () => {
    let svg = d3.select('#map')

    let tooltip = d3.select('#tooltip')
        .style('opacity', 0);

    svg.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (d) => {
            let county = educationData.find((item) => {
                 return item.fips === d.id;
            })
            let percentage = county.bachelorsOrHigher;
            if (percentage <= 10) {
                return 'rgb(255, 102, 102)';
              } else if (percentage <= 20) {
                return 'rgb(255, 178, 102)';
              } else if (percentage <= 30) {
                return 'rgb(255, 255, 102)';
              } else if (percentage <= 40) {
                return 'rgb(204, 255, 102)';
              } else {
                return 'rgb(50, 255, 50)'
              }
              
        })
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => {
            let county = educationData.find((item) => {
                return item.fips === d.id;
            })
            return (county.bachelorsOrHigher);
        })
        .on('mouseover', function (event, d) {
            tooltip.style('opacity', 0.9);
            tooltip
              .html(function () {
                var result = educationData.filter(function (obj) {
                  return obj.fips === d.id;
                });
                if (result[0]) {
                  return (
                    result[0]['area_name'] +
                    ', ' +
                    result[0]['state'] +
                    ': ' +
                    result[0].bachelorsOrHigher +
                    '%'
                  );
                }
                // could not find a matching fips id in the data
                return 0;
              })
              .attr('data-education', function () {
                var result = educationData.filter(function (obj) {
                  return obj.fips === d.id;
                });
                if (result[0]) {
                  return result[0].bachelorsOrHigher;
                }
                // could not find a matching fips id in the data
                return 0;
              })
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
        .on('mouseout', (d) => {
            tooltip.style('opacity', 0);
          });
    let legend = d3.select('#legend')
        .selectAll('g')
        .data([10, 20, 30, 40, 50])
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${50 + i * 50}, 40)`);
        
    legend
        .append('rect')
        .attr('width', 50)
        .attr('height', 20)
        .attr('fill', (d) => {
            if (d <= 10) {
                return 'rgb(255, 102, 102)';
              } else if (d <= 20) {
                return 'rgb(255, 178, 102)';
              } else if (d <= 30) {
                return 'rgb(255, 255, 102)';
              } else if (d <= 40) {
                return 'rgb(204, 255, 102)';
              } else {
                return 'rgb(50, 255, 50)'
              }
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
    
    legend
        .append('text')
        .attr('x', 25)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .text((d) => `${d}%`)
}

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json").then(
    (data, error) => {
        if(error) {
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features // Transform to GeoJSON
            console.log(countyData);
            d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json").then(
                (data, error) => {
                    if(error) {
                        console.log(log);
                    } else {
                        educationData = data;
                        console.log(educationData);
                        createMap();
                    }
                }
            )
        }
    }
)
