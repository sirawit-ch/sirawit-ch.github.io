import type { ProvinceVoteStats } from "./types";
import {
  VOTE_OPTION_COLORS,
  DEFAULT_COLORS,
  OPACITY_CONFIG,
} from "./constants";
import { clampOpacity } from "./helpers";

/**
 * Calculates heatmap color for a province based on vote statistics
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

  // "All" option selected - show usage portion
  if (!selectedVoteOption) {
    const opacity = clampOpacity(
      stats.portion,
      OPACITY_CONFIG.MIN,
      OPACITY_CONFIG.MAX
    );
    return `rgba(${DEFAULT_COLORS.ALL_OPTION_BASE}, ${opacity})`;
  }

  // Specific option selected
  const { portionValue, baseColor } = getVoteOptionData(
    selectedVoteOption,
    stats
  );

  if (!baseColor) {
    return DEFAULT_COLORS.NO_DATA;
  }

  const opacity = clampOpacity(
    portionValue,
    OPACITY_CONFIG.MIN,
    OPACITY_CONFIG.MAX
  );
  return `rgba(${baseColor}, ${opacity})`;
}

/**
 * Gets portion value and base color for a specific vote option
 */
function getVoteOptionData(
  selectedVoteOption: string,
  stats: ProvinceVoteStats
): { portionValue: number; baseColor: string } {
  let portionValue = 0;
  let baseColor = "";

  switch (selectedVoteOption) {
    case "เห็นด้วย":
      portionValue = stats.agreeCount;
      baseColor = VOTE_OPTION_COLORS["เห็นด้วย"];
      break;
    case "ไม่เห็นด้วย":
      portionValue = stats.disagreeCount;
      baseColor = VOTE_OPTION_COLORS["ไม่เห็นด้วย"];
      break;
    case "งดออกเสียง":
      portionValue = stats.abstainCount;
      baseColor = VOTE_OPTION_COLORS["งดออกเสียง"];
      break;
    case "ไม่ลงคะแนนเสียง":
      portionValue = stats.noVoteCount;
      baseColor = VOTE_OPTION_COLORS["ไม่ลงคะแนนเสียง"];
      break;
    case "ลา / ขาดลงมติ":
      portionValue = stats.absentCount;
      baseColor = VOTE_OPTION_COLORS["ลา / ขาดลงมติ"];
      break;
  }

  return { portionValue, baseColor };
}
