"use client";

import React, { useMemo, useState } from "react";
import type { PersonData, VoteDetailData } from "@/lib/types";
import { Paper, Typography, Box, Avatar, Tooltip } from "@mui/material";
import D3DonutChart from "./InfoPanel/D3DonutChart";
import D3BarChart from "./InfoPanel/D3BarChart";
import { getMajorityAction, getActionColor } from "./InfoPanel/helpers";
import type { MPStats } from "./InfoPanel/types";

interface InfoPanelProps {
  province: string | null;
  mps: PersonData[];
  totalMPs: number;
  voteDetailData: VoteDetailData[];
  allVoteDetailData?: VoteDetailData[];
}

export default function InfoPanel({
  province,
  mps,
  totalMPs,
  voteDetailData,
  allVoteDetailData,
}: InfoPanelProps) {
  const [selectedMP, setSelectedMP] = useState<PersonData | null>(null);

  // Use all data for charts if provided, otherwise use filtered data
  const chartVoteDetailData = allVoteDetailData || voteDetailData;

  // นับจำนวนร่างกฎหมายที่มีการลงมติจริงๆ จาก voteDetailData
  const uniqueVoteEvents = useMemo(() => {
    const titles = new Set(allVoteDetailData?.map((vote) => vote.title) || []);
    return titles.size;
  }, [allVoteDetailData]);

  // Calculate MP stats from vote detail data for selected province
  const mpStats = useMemo(() => {
    if (!province) return [];

    // Filter vote details for this province
    const provinceVotes = voteDetailData.filter(
      (vote) => vote.province === province
    );

    // Group by person and count options
    const statsMap = new Map<string, MPStats>();

    provinceVotes.forEach((vote) => {
      if (!statsMap.has(vote.person_name)) {
        statsMap.set(vote.person_name, {
          person_name: vote.person_name,
          agreeCount: 0,
          disagreeCount: 0,
          abstainCount: 0,
          noVoteCount: 0,
          absentCount: 0,
          total: 0,
        });
      }

      const stats = statsMap.get(vote.person_name)!;

      if (vote.option === "เห็นด้วย") {
        stats.agreeCount++;
      } else if (vote.option === "ไม่เห็นด้วย") {
        stats.disagreeCount++;
      } else if (vote.option === "งดออกเสียง") {
        stats.abstainCount++;
      } else if (vote.option === "ไม่ลงคะแนนเสียง") {
        stats.noVoteCount++;
      } else if (vote.option === "ลา / ขาดลงมติ") {
        stats.absentCount++;
      }

      stats.total++;
    });

    // Convert to array and sort by total votes
    return Array.from(statsMap.values()).sort((a, b) => b.total - a.total);
  }, [province, voteDetailData]);

  // Get selected MP stats (using ALL data for charts)
  const selectedMPStats = useMemo(() => {
    if (!selectedMP || !province) return null;

    // Calculate stats from ALL vote data, not just filtered data
    const mpVotes = chartVoteDetailData.filter(
      (vote) =>
        vote.person_name === selectedMP.person_name &&
        vote.province === province
    );

    const stats: MPStats = {
      person_name: selectedMP.person_name,
      agreeCount: 0,
      disagreeCount: 0,
      abstainCount: 0,
      noVoteCount: 0,
      absentCount: 0,
      total: 0,
    };

    mpVotes.forEach((vote) => {
      if (vote.option === "เห็นด้วย") {
        stats.agreeCount++;
      } else if (vote.option === "ไม่เห็นด้วย") {
        stats.disagreeCount++;
      } else if (vote.option === "งดออกเสียง") {
        stats.abstainCount++;
      } else if (vote.option === "ไม่ลงคะแนนเสียง") {
        stats.noVoteCount++;
      } else if (vote.option === "ลา / ขาดลงมติ") {
        stats.absentCount++;
      }
      stats.total++;
    });

    return stats;
  }, [selectedMP, province, chartVoteDetailData]);

  // Get selected MP vote for CURRENT FILTERED bill
  const selectedMPCurrentVote = useMemo(() => {
    if (!selectedMP || !province) return null;

    // Use FILTERED data (voteDetailData) to get vote for current bill
    const mpFilteredVote = voteDetailData.find(
      (vote) =>
        vote.person_name === selectedMP.person_name &&
        vote.province === province
    );

    return mpFilteredVote || null;
  }, [selectedMP, province, voteDetailData]);

  // Default view - Overall statistics
  if (!province || mps.length === 0) {
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
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" textAlign="center">
          เลือกจังหวัดบนแผนที่
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          เพื่อดูข้อมูล ส.ส. และการลงมติ
        </Typography>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ส.ส. ทั้งหมด
          </Typography>
          <Typography variant="h3" fontWeight="bold" color="primary">
            {totalMPs}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            คน
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            การลงมติทั้งหมด
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {uniqueVoteEvents}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ครั้ง
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Province selected - Show MPs visualization
  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        background: "#E8FBFF",
        borderRadius: "20px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header - Fixed */}
      <Box
        sx={{
          mb: 2,
          pb: 1,
          borderBottom: 1,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          {province}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ส.ส. ทั้งหมด {mps.length} คน
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        {/* MPs Visualization - Circles */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            ส.ส. ทั้งหมด
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              p: 1,
              bgcolor: "white",
              borderRadius: 2,
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {mps.map((mp, index) => {
              const stats = mpStats.find(
                (s) => s.person_name === mp.person_name
              );
              const majorityAction = stats
                ? getMajorityAction(stats)
                : "ไม่ระบุ";
              const color = getActionColor(majorityAction);
              const isSelected = selectedMP?.person_name === mp.person_name;

              return (
                <Tooltip
                  key={index}
                  title={mp.person_name}
                  arrow
                  placement="top"
                >
                  <Box
                    onClick={() => setSelectedMP(mp)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      border: isSelected
                        ? "3px solid #FF6B00"
                        : "2px solid white",
                      boxShadow: isSelected
                        ? "0 0 8px rgba(255, 107, 0, 0.8)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* Selected MP Info */}
        {selectedMP && selectedMPStats && (
          <>
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                border: "2px solid #FF6B00",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={selectedMP.image || undefined}
                  variant="square"
                  sx={{
                    width: 56,
                    height: 56,
                    boxShadow: `6px 6px 0px ${selectedMP.party_color}`,
                    border: "3px solid white",
                  }}
                >
                  {selectedMP.person_name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="600">
                    {selectedMP.person_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedMP.member_of}
                  </Typography>
                </Box>
                {selectedMP.party_image && (
                  <Avatar
                    src={selectedMP.party_image}
                    sx={{ width: 40, height: 40 }}
                    variant="square"
                  />
                )}
              </Box>

              {/* การลงมติในร่างกฎหมายที่เลือก */}
              {selectedMPCurrentVote ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    bgcolor: "#F9FAFB",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: getActionColor(selectedMPCurrentVote.option),
                    }}
                  />
                  <Typography variant="body2" fontWeight="500">
                    {selectedMPCurrentVote.option}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    bgcolor: "#F9FAFB",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: "#9CA3AF",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ไม่มีข้อมูลการลงมติ
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Donut Chart - สัดส่วนการใช้สิทธิ */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                สัดส่วนการใช้สิทธิ์
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  width: 150,
                  height: 150,
                  mx: "auto",
                  my: 1,
                }}
              >
                <D3DonutChart stats={selectedMPStats} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: "#8B5CF6", // สีม่วง
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption">ใช้สิทธิ์</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: "#D1D5DB",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption">ไม่ใช้สิทธิ์</Typography>
                </Box>
              </Box>
            </Box>

            {/* Bar Chart - ภาพรวมการโหวต */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                ภาพรวมการโหวต
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* D3 Vertical Bar Chart */}
                <D3BarChart stats={selectedMPStats} />
              </Box>
            </Box>
          </>
        )}

        {/* No MP selected message */}
        {!selectedMP && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              คลิกที่วงกลม (ส.ส.) เพื่อดูรายละเอียด
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
