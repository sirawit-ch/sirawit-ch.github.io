"use client";

import React from "react";
import { MPActionSummary } from "@/lib/api-enhanced";
import {
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PersonOffIcon from "@mui/icons-material/PersonOff";

interface MPStatsCardProps {
  mp: MPActionSummary;
  compact?: boolean;
}

/**
 * Component แสดงสถิติการลงมติของ ส.ส. แต่ละคน
 */
export default function MPStatsCard({ mp, compact = false }: MPStatsCardProps) {
  const totalVotes =
    mp.เห็นด้วย +
    mp.ไม่เห็นด้วย +
    mp.งดออกเสียง +
    mp.ไม่ลงคะแนนเสียง +
    mp["ลา / ขาดลงมติ"];

  const agreePercent = totalVotes > 0 ? (mp.เห็นด้วย / totalVotes) * 100 : 0;
  const disagreePercent =
    totalVotes > 0 ? (mp.ไม่เห็นด้วย / totalVotes) * 100 : 0;

  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "#E8FBFF",
        ...(compact && {
          mb: 2,
        }),
      }}
    >
      <CardContent sx={compact ? { p: 2, "&:last-child": { pb: 2 } } : {}}>
        {/* Header: รูปและชื่อ */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: compact ? 1.5 : 2,
            mb: compact ? 1.5 : 2,
          }}
        >
          <Avatar
            src={mp.image || undefined}
            alt={mp.person}
            sx={{
              width: compact ? 48 : 56,
              height: compact ? 48 : 56,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={compact ? "body1" : "h6"}
              fontWeight="bold"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {mp.person}
            </Typography>
            <Chip
              label={mp.province || "ไม่ระบุจังหวัด"}
              size="small"
              color="primary"
              variant="outlined"
              sx={compact ? { height: 20, fontSize: "0.7rem" } : {}}
            />
          </Box>
        </Box>

        {/* สถิติการลงมติ */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: compact ? 1 : 1.5,
          }}
        >
          {/* เห็นด้วย */}
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <ThumbUpIcon
                sx={{ fontSize: compact ? 16 : 18, color: "success.main" }}
              />
              <Typography
                variant={compact ? "caption" : "body2"}
                color="text.secondary"
              >
                เห็นด้วย
              </Typography>
              <Typography
                variant={compact ? "caption" : "body2"}
                fontWeight="bold"
                sx={{ ml: "auto" }}
              >
                {mp.เห็นด้วย} ({agreePercent.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={agreePercent}
              sx={{
                height: compact ? 4 : 6,
                borderRadius: 3,
                bgcolor: "rgba(76, 175, 80, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "success.main",
                },
              }}
            />
          </Box>

          {/* ไม่เห็นด้วย */}
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <ThumbDownIcon
                sx={{ fontSize: compact ? 16 : 18, color: "error.main" }}
              />
              <Typography
                variant={compact ? "caption" : "body2"}
                color="text.secondary"
              >
                ไม่เห็นด้วย
              </Typography>
              <Typography
                variant={compact ? "caption" : "body2"}
                fontWeight="bold"
                sx={{ ml: "auto" }}
              >
                {mp.ไม่เห็นด้วย} ({disagreePercent.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={disagreePercent}
              sx={{
                height: compact ? 4 : 6,
                borderRadius: 3,
                bgcolor: "rgba(244, 67, 54, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "error.main",
                },
              }}
            />
          </Box>

          {/* อื่นๆ */}
          {!compact && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                pt: 1,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <RemoveCircleIcon
                    sx={{ fontSize: 16, color: "warning.main" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    งดออกเสียง
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {mp.งดออกเสียง}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonOffIcon sx={{ fontSize: 16, color: "grey.500" }} />
                  <Typography variant="caption" color="text.secondary">
                    ลา/ขาดลงมติ
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {mp["ลา / ขาดลงมติ"]}
                </Typography>
              </Box>
            </Box>
          )}

          {/* สรุป */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: compact ? 0.75 : 1,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HowToVoteIcon sx={{ fontSize: compact ? 18 : 24 }} />
              <Typography
                variant={compact ? "caption" : "body2"}
                fontWeight="bold"
              >
                รวมลงมติ
              </Typography>
            </Box>
            <Typography variant={compact ? "body1" : "h6"} fontWeight="bold">
              {mp.รวมลงมติ}
            </Typography>
          </Box>

          {/* แสดง งดออกเสียง และ ลา/ขาดลงมติ ใน compact mode */}
          {compact && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-around",
                pt: 0.5,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  งดออกเสียง
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {mp.งดออกเสียง}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  ลา/ขาด
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {mp["ลา / ขาดลงมติ"]}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
