"use client";

import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import {
  VOTE_OPTION_SINGLE_COLORS,
  VOTE_OPTION_GRADIENT_COLORS,
} from "./ThailandMap/constants";

interface MapLegendProps {
  selectedVoteOption: string | null;
}

export default function MapLegend({ selectedVoteOption }: MapLegendProps) {
  // Get the current gradient colors being displayed
  const getCurrentGradient = () => {
    if (!selectedVoteOption) {
      // Show all possible colors when "ทั้งหมด" is selected
      return null;
    }
    return VOTE_OPTION_GRADIENT_COLORS[
      selectedVoteOption as keyof typeof VOTE_OPTION_GRADIENT_COLORS
    ];
  };

  const currentGradient = getCurrentGradient();

  // Generate gradient for the legend
  const generateGradient = (lightColor: string, darkColor: string) => {
    return `linear-gradient(to right, ${lightColor}, ${darkColor})`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        p: 2,
        mt: 2,
      }}
    >
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            mb: 1.5,
            fontFamily: "var(--font-sukhumvit), system-ui, sans-serif",
            color: "text.primary",
          }}
        >
          คำอธิบายสี
        </Typography>

        {!selectedVoteOption ? (
          // Show all vote options when "ทั้งหมด" is selected
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                mb: 0.5,
                fontFamily: "var(--font-sukhumvit), system-ui, sans-serif",
                color: "text.secondary",
              }}
            >
              แสดงผลโหวตที่ชนะในแต่ละจังหวัด:
            </Typography>
            {Object.entries(VOTE_OPTION_SINGLE_COLORS).map(
              ([option, color]) => (
                <Box
                  key={option}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "4px",
                      backgroundColor: color,
                      border: "1px solid rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily:
                        "var(--font-sukhumvit), system-ui, sans-serif",
                      color: "text.primary",
                    }}
                  >
                    {option}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        ) : (
          // Show gradient for selected option
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "4px",
                  background: currentGradient
                    ? generateGradient(currentGradient[0], currentGradient[1])
                    : "#e0e0e0",
                  border: "1px solid rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "var(--font-sukhumvit), system-ui, sans-serif",
                  color: "text.primary",
                  fontWeight: "500",
                }}
              >
                {selectedVoteOption}
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontFamily: "var(--font-sukhumvit), system-ui, sans-serif",
                color: "text.secondary",
              }}
            >
              สัดส่วนคะแนน:
            </Typography>

            {/* Gradient Bar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "var(--font-sukhumvit), system-ui, sans-serif",
                  color: "text.secondary",
                  fontSize: "10px",
                  width: "24px",
                  flexShrink: 0,
                }}
              >
                0%
              </Typography>
              <Box
                sx={{
                  width: "40px",
                  height: 12,
                  borderRadius: "6px",
                  background: currentGradient
                    ? generateGradient(currentGradient[0], currentGradient[1])
                    : "#e0e0e0",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "var(--font-sukhumvit), system-ui, sans-serif",
                  color: "text.secondary",
                  fontSize: "10px",
                  width: "32px",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                100%
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
