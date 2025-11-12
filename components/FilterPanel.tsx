"use client";

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Autocomplete,
  TextField,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { GrayRadio } from "./FilterPanel/StyledComponents";

interface FilterPanelProps {
  voteEvents: string[];
  selectedVoteEvent: string | null;
  onVoteEventChange: (voteEvent: string | null) => void;
  selectedVoteOption: string | null;
  onVoteOptionChange: (voteOption: string | null) => void;
}

export default function FilterPanel({
  voteEvents,
  selectedVoteEvent,
  onVoteEventChange,
  selectedVoteOption,
  onVoteOptionChange,
}: FilterPanelProps) {
  const handleVoteOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    onVoteOptionChange(value === "" ? null : value);
  };

  return (
    <>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        {/* ร่างกฎหมาย Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            ร่างกฎหมาย
          </Typography>
          <Autocomplete
            options={voteEvents}
            value={selectedVoteEvent || undefined}
            onChange={(event, newValue) => onVoteEventChange(newValue)}
            disableClearable
            getOptionLabel={(option) => option}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  {...otherProps}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" fontSize="0.875rem">
                    {option}
                  </Typography>
                  {selectedVoteEvent === option && (
                    <CheckIcon sx={{ fontSize: 18, color: "#1976D2", ml: 1 }} />
                  )}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="ค้นหาร่างกฎหมายที่สนใจ..."
                size="small"
                multiline
                sx={{
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    minHeight: "40px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                    overflow: "visible",
                  },
                }}
              />
            )}
            ListboxProps={{
              sx: {
                maxWidth: "600px",
                "& .MuiAutocomplete-option": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                },
              },
            }}
          />
        </Box>

        {/* รูปแบบการโหวต Section */}
        <Box>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Typography variant="subtitle1" fontWeight="600">
                รูปแบบการโหวต
              </Typography>
            </FormLabel>
            <RadioGroup
              value={selectedVoteOption || ""}
              onChange={handleVoteOptionChange}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                value=""
                control={<GrayRadio size="small" />}
                label={
                  <Typography variant="body2" fontSize="0.875rem">
                    ทั้งหมด
                  </Typography>
                }
              />
              <FormControlLabel
                value="เห็นด้วย"
                control={<GrayRadio size="small" />}
                label={
                  <Typography variant="body2" fontSize="0.875rem">
                    เห็นด้วย
                  </Typography>
                }
              />
              <FormControlLabel
                value="ไม่เห็นด้วย"
                control={<GrayRadio size="small" />}
                label={
                  <Typography variant="body2" fontSize="0.875rem">
                    ไม่เห็นด้วย
                  </Typography>
                }
              />
              <FormControlLabel
                value="งดออกเสียง"
                control={<GrayRadio size="small" />}
                label={
                  <Typography variant="body2" fontSize="0.875rem">
                    งดออกเสียง
                  </Typography>
                }
              />
              <FormControlLabel
                value="ไม่ลงคะแนนเสียง"
                control={<GrayRadio size="small" />}
                label={
                  <Typography variant="body2" fontSize="0.875rem">
                    ไม่ลงคะแนนเสียง
                  </Typography>
                }
              />
              <FormControlLabel
                value="ลา / ขาดลงมติ"
                control={<GrayRadio size="small" />}
                label={
                  <Typography variant="body2" fontSize="0.875rem">
                    ลา/ขาดลงมติ
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Paper>
    </>
  );
}
