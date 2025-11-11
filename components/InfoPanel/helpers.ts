import type { MPStats } from "./types";

/**
 * Determines the voting action with the highest count
 */
export function getMajorityAction(stats: MPStats): string {
  const counts = [
    { action: "เห็นด้วย", count: stats.agreeCount },
    { action: "ไม่เห็นด้วย", count: stats.disagreeCount },
    { action: "งดออกเสียง", count: stats.abstainCount },
    { action: "ไม่ลงคะแนนเสียง", count: stats.noVoteCount },
    { action: "ลา / ขาดลงมติ", count: stats.absentCount },
  ];

  const max = Math.max(...counts.map((c) => c.count));
  const majority = counts.find((c) => c.count === max);
  return majority?.action || "ไม่ระบุ";
}

/**
 * Returns the appropriate color for each voting action
 */
export function getActionColor(action: string): string {
  switch (action) {
    case "เห็นด้วย":
      return "#00C758"; // Green
    case "ไม่เห็นด้วย":
      return "#EF4444"; // Red
    case "งดออกเสียง":
      return "#EDB200"; // Yellow
    case "ไม่ลงคะแนนเสียง":
      return "#1F2937"; // Dark gray
    case "ลา / ขาดลงมติ":
      return "#6B7280"; // Gray
    default:
      return "#D1D5DB"; // Light gray (default/no data)
  }
}
