import type { ProvinceVoteStats } from "./types";
import { VOTE_OPTION_GRADIENT_COLORS, DEFAULT_COLORS } from "./constants";

/**
 * Interpolates between two colors based on a factor (0-1)
 */
function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // Parse hex colors
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  // Interpolate
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Gets gradient color based on portion value (0-1)
 * Interpolates from light color to dark color based on the gradient range
 */
function getGradientColor(
  voteOption: keyof typeof VOTE_OPTION_GRADIENT_COLORS,
  portion: number
): string {
  if (portion <= 0) return DEFAULT_COLORS.NO_DATA;

  const clampedPortion = Math.min(Math.max(portion, 0), 1);
  const [lightColor, darkColor] = VOTE_OPTION_GRADIENT_COLORS[voteOption];

  return interpolateColor(lightColor, darkColor, clampedPortion);
}

/**
 * Calculates heatmap color for a province based on vote statistics
 * Uses gradient color system based on portion values
 */
export function getProvinceHeatmapColor(
  provinceName: string,
  provinceVoteStats: Record<string, ProvinceVoteStats>,
  selectedVoteOption: string | null
): string {
  const stats = provinceVoteStats[provinceName];

  // No voting data available
  if (!stats) {
    return DEFAULT_COLORS.NO_DATA;
  }

  // "All" option selected - show winning option color with usage portion intensity
  if (!selectedVoteOption) {
    if (stats.portion <= 0) return DEFAULT_COLORS.NO_DATA;

    // Use winning option color
    const winningOption = stats.winningOption || "ทั้งหมด";
    const gradientOption =
      winningOption as keyof typeof VOTE_OPTION_GRADIENT_COLORS;

    if (!VOTE_OPTION_GRADIENT_COLORS[gradientOption]) {
      // Fallback to gray gradient if winning option not found
      return interpolateColor("#9ca3af", "#4b5563", stats.portion);
    }

    return getGradientColor(gradientOption, stats.portion);
  }

  // Specific option selected
  const { portionValue, voteOption } = getVoteOptionData(
    selectedVoteOption,
    stats
  );

  if (!voteOption) {
    return DEFAULT_COLORS.NO_DATA;
  }

  if (portionValue <= 0) return DEFAULT_COLORS.NO_DATA;

  return getGradientColor(voteOption, portionValue);
}

/**
 * Gets portion value and vote option key for a specific vote option
 */
function getVoteOptionData(
  selectedVoteOption: string,
  stats: ProvinceVoteStats
): {
  portionValue: number;
  voteOption: keyof typeof VOTE_OPTION_GRADIENT_COLORS | null;
} {
  let portionValue = 0;
  let voteOption: keyof typeof VOTE_OPTION_GRADIENT_COLORS | null = null;

  switch (selectedVoteOption) {
    case "เห็นด้วย":
      portionValue = stats.agreeCount;
      voteOption = "เห็นด้วย";
      break;
    case "ไม่เห็นด้วย":
      portionValue = stats.disagreeCount;
      voteOption = "ไม่เห็นด้วย";
      break;
    case "งดออกเสียง":
      portionValue = stats.abstainCount;
      voteOption = "งดออกเสียง";
      break;
    case "ไม่ลงคะแนนเสียง":
      portionValue = stats.noVoteCount;
      voteOption = "ไม่ลงคะแนนเสียง";
      break;
    case "ลา / ขาดลงมติ":
      portionValue = stats.absentCount;
      voteOption = "ลา / ขาดลงมติ";
      break;
  }

  return { portionValue, voteOption };
}

/**
 * Calculates relative luminance of a color to determine if it's dark
 * Returns true if the color is dark (needs white text)
 */
function isColorDark(hexColor: string): boolean {
  // Convert hex to RGB
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

  // Return true if luminance is less than 0.5 (dark color)
  return luminance < 0.5;
}

/**
 * Gets appropriate text color (white or dark gray) based on background color
 */
export function getTextColorForBackground(backgroundColor: string): string {
  return isColorDark(backgroundColor) ? "#ffffff" : DEFAULT_COLORS.GRAY_800;
}
