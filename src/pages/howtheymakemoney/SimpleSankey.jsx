import './SimpleSankey.css';
import StatsBar from './StatsBar';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';


const SimpleSankey = ({ sankeyData, highlightedNode, zoomLevel, zoomFocus }) => {
  const svgRef = useRef(null);
  const width = 1200; // Increased width to accommodate labels
  const height = 600; // Increased height for better spacing

  useEffect(() => {
    if (!sankeyData || !sankeyData.nodes || !sankeyData.links) {
      console.error('Invalid or missing sankeyData');
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Define SVG filter for neon effect
    const defs = svg.append("defs");

    // Create a main group for all Sankey elements
    const mainGroup = svg.append("g");

    const colorScale = d3.scaleOrdinal()
      .domain(['revenue', 'expense', 'profit'])
      .range(['#70706F', '#FF0000', '#008000']);

    const customNodeOrder = [
      "Auto Revenue", "Energy Revenue", "Services and other Revenue", "Total Revenue",
      "Cost of Revenue", "Gross Profit", "Operation Profit", "Operation Expenses",
      "Net Profit", "Others", "Tax", "R&D", "SG&A"
    ];

    const rightSideNodes = ["Others", "Net Profit", "Tax", "R&D", "SG&A"];
    const rightSidePositions = {};
    rightSideNodes.forEach((nodeName, index) => {
      rightSidePositions[nodeName] = (index + 1) * (height / (rightSideNodes.length + 1));
    });

    const sankeyGenerator = sankey()
      .nodeWidth(20)
      .nodePadding(10)
      .extent([[100, 50], [width - 100, height - 50]])
      .nodeSort((a, b) => customNodeOrder.indexOf(a.name) - customNodeOrder.indexOf(b.name));

    let { nodes, links } = sankeyGenerator(sankeyData);

    // Adjust positions of right-side nodes
    nodes.forEach(node => {
      if (rightSideNodes.includes(node.name)) {
        const targetY = rightSidePositions[node.name];
        const nodeHeight = node.y1 - node.y0;
        node.y0 = targetY - nodeHeight / 2;
        node.y1 = targetY + nodeHeight / 2;
      }

      if (node.name === 'Cost of Revenue') {
        const shift = 590 - node.x0;
        node.x0 += shift;
        node.x1 += shift;
      } else if (node.name === 'Net Profit') {
        const shift = 1000 - node.x0;
        node.x0 += shift;
        node.x1 += shift;
      } else if (node.name === 'Others') {
        const shift = 950 - node.x0; // Shift "Others" 50 pixels to the left
        node.x0 += shift;
        node.x1 += shift;
      }
    });
    // Update layout after position adjustments
    sankeyGenerator.update({ nodes, links });

        // First, draw the border (subtle stroke) for the links
// First, draw the border (subtle stroke) for the links
    const linkBorder = mainGroup.append("g")
      .attr("fill", "none")
      .attr("stroke", "#333") // Dark border color
      .attr("stroke-width", 5) // Border stroke width
      .attr("stroke-opacity", 1) // Slight opacity for subtle effect
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal());


    // Draw links
    const link = mainGroup.append("g")
      .attr("stroke-opacity", 1)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", d => colorScale(d.type))
      .attr("stroke-width", d => Math.max(1, d.width))
      .style("mix-blend-mode", "multiply")
      .attr("stroke-dasharray", function () { return this.getTotalLength() + " " + this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); });

    link.append("path")
      .attr("d", sankeyLinkHorizontal())
      .style("mix-blend-mode", "multiply")
      .attr("stroke-dasharray", function () { return this.getTotalLength() + " " + this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); });

    const linkGroup = mainGroup.append("g")  

    const linkPaths = linkGroup.selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", d => colorScale(d.type))
      .attr("stroke-width", d => Math.max(1, d.width))
      .style("mix-blend-mode", "multiply")
      .attr("stroke-dasharray", function () { return this.getTotalLength() + " " + this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); });

    // Function to create multiple icons along a path
    function createMultipleIcons(link, iconCount, path) {
      const pathLength = path.getTotalLength();
      const iconSpacing = pathLength / iconCount;

      return Array.from({ length: iconCount }, (_, i) => {
        const point = path.getPointAtLength(i * iconSpacing);
        return {
          x: point.x,
          y: point.y,
          progress: i / (iconCount - 1),
          link: link
        };
      });
    }

    // Create dollar icons
    const iconCount = 3;
    const greenDollarIconURL = '/dollarstock.svg';
    const redDollarIconURL = '/dollarstockred.svg';

    const allIcons = links.flatMap((link, i) => {
      const path = linkPaths.nodes()[i];
      return createMultipleIcons(link, iconCount, path);
    });

    const dollarImages = mainGroup.append("g")
      .attr("class", "dollar-icons")
      .selectAll("image")
      .data(allIcons)
      .join("image")
      .attr("xlink:href", d => d.link.type === 'expense' ? redDollarIconURL : greenDollarIconURL)
      .attr("width", 40)
      .attr("height", 40)
      .attr("x", d => d.x - 20)
      .attr("y", d => d.y - 20)
      .attr("filter", d => d.link.type === 'expense' ? 'url(#redNeonFilter)' : 'url(#greenNeonFilter)')
      .attr("opacity", 0);

    // Draw nodes
    const node = mainGroup.append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => Math.max(1, d.y1 - d.y0))
      .attr("width", d => Math.max(1, d.x1 - d.x0))
      .attr("fill", d => d.name === 'Net Profit' ? '#39FF14' : colorScale(d.type))
      .attr("opacity", 1);


    // Draw labels
    const labels = mainGroup.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 5 : d.x0 - 5)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => `${d.name}\n$${d.value.toFixed(3)} BN`)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("opacity", 1);

    // Animations
    node.transition().duration(1000).attr("opacity", 1);
    labels.transition().duration(1000).attr("opacity", 1);
    link.transition().duration(2000).attr("stroke-dashoffset", 0);

    function getAnimationDelay(nodeName) {
      if (['Auto Revenue', 'Energy Revenue', 'Services and other Revenue', 'Cost of Revenue'].includes(nodeName)) {
        return 0;
      } else if (['R&D', 'SG&A', 'Operation Expenses', 'Gross Profit'].includes(nodeName)) {
        return 4000;
      } else if (['Operation Profit', 'Tax', 'Others'].includes(nodeName)) {
        return 8000;
      } else if (['Net Profit'].includes(nodeName)) {
        return 13000;
      }
      return 0;
    }

    function animateDollarsAlongPath() {
      dollarImages.each(function (d) {
        const path = linkPaths.filter(p => p === d.link).node();
        if (!path) {
          console.error(`Path not found for link`);
          return;
        }
        const pathLength = path.getTotalLength();
        if (pathLength === 0) {
          console.error(`Path length is 0 for link`);
          return;
        }

        const animationDirection = d.link.type === 'expense' ? 1 : 0;
        const delay = getAnimationDelay(d.link.source.name);

        d3.select(this)
          .transition()
          .delay(delay)
          .attr("opacity", 1)
          .duration(0)
          .transition()
          .duration(5000)
          .attrTween("transform", function () {
            return function (t) {
              const progress = animationDirection ? (1 - t) : t;
              const point = path.getPointAtLength((progress + d.progress) % 1 * pathLength);
              return `translate(${point.x - d.x}, ${point.y - d.y})`;
            };
          })
          .transition()
          .duration(1000)
          .attr("opacity", 0)
          .on("end", animateDollarsAlongPath);
      });
    }

    // Start animation along paths with a slight delay
    setTimeout(() => {
      animateDollarsAlongPath(dollarImages, links);
    }, 100);



  }, [sankeyData, highlightedNode, zoomLevel, zoomFocus]);

return (
  <div className="container">
      <StatsBar
        marketCap={120}
        revenue={30}
        grossMargin={20}
        profit={1.8}
        tradingMultiple={50}
      />
    <div className="svg-container">
        <div style={{ paddingTop: '0px' }}>
      <svg ref={svgRef} width={width} height={height} />
      </div>
    </div>
  </div>
  );
};
export default SimpleSankey;
