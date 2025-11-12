"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { MPStats } from "./types";

interface D3BarChartProps {
  stats: MPStats;
}

/**
 * D3 Horizontal Bar Chart Component
 * Displays vote breakdown across all voting categories
 * Shows count for each: Agree, Disagree, Abstain, No Vote, Absent
 */
export default function D3BarChart({ stats }: D3BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stats) return;

    const data = [
      { label: "เห็นด้วย", count: stats.agreeCount, color: "#00C758" },
      { label: "ไม่เห็นด้วย", count: stats.disagreeCount, color: "#EF4444" },
      { label: "งดออกเสียง", count: stats.abstainCount, color: "#EDB200" },
      { label: "ไม่ลงคะแนน", count: stats.noVoteCount, color: "#1F2937" },
      { label: "ลา/ขาดลงมติ", count: stats.absentCount, color: "#6B7280" },
    ];

    const containerWidth = containerRef.current.clientWidth || 360;
    const barHeight = 8;
    const itemSpacing = 28;
    const totalHeight = data.length * itemSpacing + 60;

    // Clear previous content
    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", totalHeight)
      .style("background", "white")
      .style("border-radius", "8px")
      .style("padding", "8px");

    // Scale for bar width
    const xScale = d3
      .scaleLinear()
      .domain([0, stats.total || 1])
      .range([0, containerWidth - 16]);

    // Create groups for each item
    const items = svg
      .selectAll(".item")
      .data(data)
      .join("g")
      .attr("class", "item")
      .attr("transform", (_, i) => `translate(0, ${i * itemSpacing})`);

    // Add labels (left)
    items
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "12px")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#6B7280")
      .text((d) => d.label);

    // Add counts (right)
    items
      .append("text")
      .attr("x", containerWidth - 16)
      .attr("y", 0)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#374151")
      .text((d) => d.count);

    // Add background bars
    items
      .append("rect")
      .attr("x", 0)
      .attr("y", 4)
      .attr("width", containerWidth - 16)
      .attr("height", barHeight)
      .attr("fill", "#E5E7EB")
      .attr("rx", 4);

    // Add colored bars with animation
    items
      .append("rect")
      .attr("x", 0)
      .attr("y", 4)
      .attr("width", 0)
      .attr("height", barHeight)
      .attr("fill", (d) => d.color)
      .attr("rx", 4)
      .transition()
      .duration(500)
      .attr("width", (d) => xScale(d.count));

    // Add divider line
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", containerWidth - 16)
      .attr("y1", data.length * itemSpacing + 12)
      .attr("y2", data.length * itemSpacing + 12)
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1);

    // Add total label
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", data.length * itemSpacing + 32)
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#374151")
      .text("รวมทั้งหมด");

    // Add total count
    svg
      .append("text")
      .attr("x", containerWidth - 16)
      .attr("y", data.length * itemSpacing + 32)
      .attr("text-anchor", "end")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#1976D2")
      .text(`${stats.total} ครั้ง`);
  }, [stats]);

  return (
    <div ref={containerRef} style={{ width: "100%", minHeight: "200px" }} />
  );
}
