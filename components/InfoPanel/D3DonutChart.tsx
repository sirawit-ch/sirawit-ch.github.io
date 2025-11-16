"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { MPStats } from "./types";
import { VOTE_OPTION_SINGLE_COLORS } from "../ThailandMap/constants";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface D3DonutChartProps {
  stats: MPStats;
  selectedVoteOption: string | null;
  width?: number;
  height?: number;
}

/**
 * D3 Donut Chart Component
 * Visualizes voting statistics using a donut chart
 * Shows all vote statuses or filtered by selected option
 */
export default function D3DonutChart({
  stats,
  selectedVoteOption,
  width = 150,
  height = 150,
}: D3DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !stats) return;

    // Create tooltip element if not exists
    let tooltip = tooltipRef.current;
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.style.position = "absolute";
      tooltip.style.padding = "8px 12px";
      tooltip.style.background = "rgba(0, 0, 0, 0.8)";
      tooltip.style.color = "white";
      tooltip.style.borderRadius = "6px";
      tooltip.style.fontSize = "13px";
      tooltip.style.fontFamily = "var(--font-sukhumvit), system-ui, sans-serif";
      tooltip.style.pointerEvents = "none";
      tooltip.style.opacity = "0";
      tooltip.style.transition = "opacity 0.2s";
      tooltip.style.zIndex = "1000";
      tooltip.style.whiteSpace = "nowrap";
      document.body.appendChild(tooltip);
      tooltipRef.current = tooltip;
    }

    // Prepare data based on selected filter
    const allData: ChartData[] = [
      {
        label: "เห็นด้วย",
        value: stats.agreeCount,
        color: VOTE_OPTION_SINGLE_COLORS.เห็นด้วย,
      },
      {
        label: "ไม่เห็นด้วย",
        value: stats.disagreeCount,
        color: VOTE_OPTION_SINGLE_COLORS.ไม่เห็นด้วย,
      },
      {
        label: "งดออกเสียง",
        value: stats.abstainCount,
        color: VOTE_OPTION_SINGLE_COLORS.งดออกเสียง,
      },
      {
        label: "ไม่ลงคะแนนเสียง",
        value: stats.noVoteCount,
        color: VOTE_OPTION_SINGLE_COLORS.ไม่ลงคะแนนเสียง,
      },
      {
        label: "ลา/ขาดลงมติ",
        value: stats.absentCount,
        color: VOTE_OPTION_SINGLE_COLORS["ลา / ขาดลงมติ"],
      },
    ];

    // Filter data based on selected vote option
    let data: ChartData[] = allData;
    let centerLabel = "ทั้งหมด";

    if (selectedVoteOption && selectedVoteOption !== "") {
      // Show only the selected option with proportion
      const selectedData = allData.find(
        (d) => d.label === selectedVoteOption
      );
      if (selectedData) {
        data = [
          selectedData,
          {
            label: "อื่นๆ",
            value: stats.total - selectedData.value,
            color: "#e5e7eb", // gray-200 for "others"
          },
        ] as ChartData[];
        centerLabel = `${((selectedData.value / stats.total) * 100).toFixed(2)}%`;
      }
    } else {
      // Show all statuses
      centerLabel = "ทั้งหมด";
    }

    // Filter out zero values for cleaner visualization
    data = data.filter((d) => d.value > 0);

    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create pie layout
    const pie = d3
      .pie<ChartData>()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    // Draw arcs
    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .join("path")
      .attr("class", "arc")
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        // Highlight arc
        d3.select(this).style("opacity", 0.8);

        // Calculate percentage
        const percentage = ((d.data.value / stats.total) * 100).toFixed(1);

        // Show tooltip
        if (tooltip) {
          tooltip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 2px;">${d.data.label}</div>
            <div>${d.data.value} ครั้ง (${percentage}%)</div>
          `;
          tooltip.style.opacity = "1";
        }
      })
      .on("mousemove", function (event) {
        // Update tooltip position
        if (tooltip) {
          tooltip.style.left = `${event.pageX + 10}px`;
          tooltip.style.top = `${event.pageY - 10}px`;
        }
      })
      .on("mouseleave", function () {
        // Remove highlight
        d3.select(this).style("opacity", 1);

        // Hide tooltip
        if (tooltip) {
          tooltip.style.opacity = "0";
        }
      });

    // Animate arcs
    arcs
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || "";
        };
      });

    // Add center text
    const centerText = g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", width > 130 ? "20px" : "16px")
      .attr("font-weight", "bold")
      .attr("font-family", "var(--font-sukhumvit), system-ui, sans-serif")
      .attr("fill", "#1f2937")
      .text(centerLabel)
      .style("opacity", 0);

    // Animate center text
    centerText.transition().duration(800).style("opacity", 1);

    // Cleanup function
    return () => {
      if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, [stats, selectedVoteOption, width, height]);

  return <svg ref={svgRef}></svg>;
}

