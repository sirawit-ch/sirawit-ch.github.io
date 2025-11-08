"use client";

import React, { useEffect, useState } from "react";
import { fetchMPActionSummary, MPActionSummary } from "@/lib/api-enhanced";
import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import MPStatsCard from "./MPStatsCard";

/**
 * Component หลักแสดงรายการ ส.ส. ทั้งหมด
 */
export default function MPActionList() {
  const [mps, setMPs] = useState<MPActionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMPActionSummary();
        // เรียงตามจำนวนการลงมติมากที่สุด
        const sorted = data.sort((a, b) => b.รวมลงมติ - a.รวมลงมติ);
        setMPs(sorted);
      } catch (err) {
        console.error("Error loading MP data:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #6DD5ED 0%, #2193B0 100%)",
        }}
      >
        <Typography variant="h6" color="white" gutterBottom>
          กำลังโหลดข้อมูล ส.ส.
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={3}
        sx={{ p: 4, textAlign: "center", bgcolor: "#FFE8E8" }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          เกิดข้อผิดพลาด
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #6DD5ED 0%, #2193B0 100%)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
          สถิติการลงมติของ ส.ส.
        </Typography>
        <Typography variant="body1" color="white">
          แสดงข้อมูลการลงมติของ ส.ส. ทั้งหมด {mps.length} คน
        </Typography>
      </Paper>

      {/* Grid of MP Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {mps.map((mp) => (
          <MPStatsCard key={mp.person} mp={mp} />
        ))}
      </Box>

      {/* Empty State */}
      {mps.length === 0 && (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            ไม่พบข้อมูล ส.ส.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
