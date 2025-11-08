"use client";

import React, { useEffect, useState } from "react";
import { Politician, ProvinceVoteStats } from "@/lib/api";
import { fetchProvinceVoteSummary, MPActionSummary } from "@/lib/api-enhanced";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import MPStatsCard from "./MPStatsCard";

interface InfoPanelProps {
  province: string | null;
  mps: Politician[];
  totalMPs: number;
  totalBills: number;
  passedBills: number;
  failedBills: number;
  pendingBills: number;
  latestVotingDate: string;
  provinceVoteStats?: ProvinceVoteStats;
}

export default function InfoPanel({
  province,
  mps,
  totalMPs,
  passedBills,
  failedBills,
  pendingBills,
}: InfoPanelProps) {
  // State for MP Action Statistics
  const [mpStats, setMPStats] = useState<MPActionSummary[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch MP stats when province changes
  useEffect(() => {
    const loadData = async () => {
      if (!province) {
        setMPStats([]);
        setLoadingStats(false);
        return;
      }

      setLoadingStats(true);

      try {
        // Try loading from static file first
        const staticRes = await fetch("/data/province-summary.json");
        if (staticRes.ok) {
          const allData: MPActionSummary[] = await staticRes.json();
          const provinceData = allData.filter((mp) => mp.province === province);

          if (provinceData.length > 0) {
            const sorted = provinceData.sort((a, b) => b.รวมลงมติ - a.รวมลงมติ);
            setMPStats(sorted);
            setLoadingStats(false);
            return;
          }
        }

        // Fallback to API if static file fails or no data
        console.log("Loading from API...");
        const data = await fetchProvinceVoteSummary(province);
        const sorted = data.sort((a, b) => b.รวมลงมติ - a.รวมลงมติ);
        setMPStats(sorted);
      } catch (error) {
        console.error("Error fetching MP stats:", error);
        setMPStats([]);
      } finally {
        setLoadingStats(false);
      }
    };

    loadData();
  }, [province]);

  // Default view - Overall statistics
  if (!province || mps.length === 0) {
    const totalVotes = passedBills + failedBills + pendingBills;
    const passedPercent = totalVotes > 0 ? (passedBills / totalVotes) * 100 : 0;
    const failedPercent = totalVotes > 0 ? (failedBills / totalVotes) * 100 : 0;

    return (
      <Paper
        elevation={3}
        sx={{
          height: "100%",
          background: "#E8FBFF",
          borderRadius: "20px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header: Total MPs */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ส. ทั้งหมด
          </Typography>
          <Typography variant="h3" fontWeight="bold" color="primary">
            {totalMPs}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ราย
          </Typography>
        </Box>

        {/* Visual representation of seats */}
        <Box>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
            {Array.from({ length: Math.min(totalMPs, 33) }).map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor:
                    idx < 11
                      ? "#17B9B9" // Cyan
                      : idx < 16
                      ? "#E63946" // Red
                      : idx < 20
                      ? "#6C757D" // Dark gray
                      : "#D3D3D3", // Light gray
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Voting Rights Chart (Donut) */}
        <Box>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            สัดส่วนการใช้สิทธิ์
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 200,
              mx: "auto",
              my: 2,
            }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#E0E0E0"
                strokeWidth="30"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#17B9B9"
                strokeWidth="30"
                strokeDasharray={`${2 * Math.PI * 80 * 0.75} ${
                  2 * Math.PI * 80
                }`}
                strokeDashoffset={2 * Math.PI * 80 * 0.25}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="#F0F8FF" />
            </svg>
          </Box>
        </Box>

        {/* Voting Overview (Bar Chart) */}
        <Box>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            ภาพรวมการโหวต
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
              height: 120,
              mt: 2,
            }}
          >
            {/* ผ่าน */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: `${Math.max(passedPercent, 10)}%`,
                  bgcolor: "#17B9B9",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                ผ่าน
              </Typography>
            </Box>

            {/* ไม่ผ่าน */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: `${Math.max(failedPercent, 10)}%`,
                  bgcolor: "#E63946",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                ไม่ผ่าน
              </Typography>
            </Box>

            {/* งดออกเสียง */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "30%",
                  bgcolor: "#6C757D",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                งดออกเสียง
              </Typography>
            </Box>

            {/* ไม่ลงคะแนน */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "20%",
                  bgcolor: "#ADB5BD",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                ไม่ลงคะแนน
              </Typography>
            </Box>

            {/* ลา/ขาดลงมติ */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "15%",
                  bgcolor: "#D3D3D3",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <Typography
                variant="caption"
                sx={{ mt: 0.5, fontSize: "0.65rem" }}
              >
                ลา/ขาดลงมติ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Province selected view - Show MP Action Statistics
  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        background: "#E8FBFF",
        borderRadius: "20px",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
      }}
    >
      {/* Header with Province name and MP count */}
      <Box
        sx={{
          textAlign: "center",
          pb: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          {province}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ส.ส. ทั้งหมด {mpStats.length} คน
        </Typography>
      </Box>

      {/* Loading State */}
      {loadingStats && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* MP Stats List - Scrollable */}
      {!loadingStats && mpStats.length > 0 && (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "rgba(0,0,0,0.05)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(0,0,0,0.2)",
              borderRadius: "10px",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          {mpStats.map((mp) => (
            <MPStatsCard key={mp.person} mp={mp} compact />
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!loadingStats && mpStats.length === 0 && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            ไม่พบข้อมูล ส.ส. ในจังหวัดนี้
          </Typography>
          <Typography variant="caption" color="text.secondary">
            กรุณาเลือกจังหวัดอื่น
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
