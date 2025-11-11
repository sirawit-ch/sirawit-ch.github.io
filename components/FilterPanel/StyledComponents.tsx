import { Radio, styled } from "@mui/material";

/**
 * Styled Radio Component
 * Gray radio button with consistent styling across the application
 */
export const GrayRadio = styled(Radio)({
  color: "#6B7280",
  "&.Mui-checked": {
    color: "#6B7280",
  },
});
