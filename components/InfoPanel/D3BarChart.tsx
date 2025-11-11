"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { MPStats } from "./types";

interface D3BarChartProps {
  stats: MPStats;
}

/**
 * D3 Bar Chart Component
 * Displays vote breakdown across all voting categories
 * Shows count for each: Agree, Disagree, Abstain, No Vote, Absent
 */
export default function D3BarChart({ stats }: D3BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !stats) return;

    const data = [
      { label: "เห็น\nด้วย", count: stats.agreeCount, color: "#00C758" },
      { label: "ไม่เห็น\nด้วย", count: stats.disagreeCount, color: "#EF4444" },
      { label: "งด\nออกเสียง", count: stats.abstainCount, color: "#EDB200" },
      { label: "ไม่ลง\nคะแนน", count: stats.noVoteCount, color: "#1F2937" },
      { label: "ลา/\nขาดลงมติ", count: stats.absentCount, color: "#6B7280" },
    ];

    const width = 360;
    const height = 180;
    const margin = { top: 10, right: 10, bottom: 40, left: 10 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, stats.total || 1])
      .range([chartHeight, 0]);

    // Draw bars
    chart
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label) || 0)
      .attr("y", chartHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => d.color)
      .attr("rx", 2)
      .transition()
      .duration(500)
      .attr("y", (d) => yScale(d.count))
      .attr("height", (d) => chartHeight - yScale(d.count));

    // Add count labels on top of bars
    chart
      .selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#374151")
      .text((d) => (d.count > 0 ? d.count : ""))
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Add x-axis labels
    chart
      .selectAll(".x-label")
      .data(data)
      .join("text")
      .attr("class", "x-label")
      .attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr("y", chartHeight + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#6B7280")
      .each(function (d) {
        const lines = d.label.split("\n");
        const text = d3.select(this);
        lines.forEach((line, i) => {
          text
            .append("tspan")
            .attr("x", (xScale(d.label) || 0) + xScale.bandwidth() / 2)
            .attr("dy", i === 0 ? 0 : 11)
            .text(line);
        });
      });
  }, [stats]);

  return <svg ref={svgRef}></svg>;
}
