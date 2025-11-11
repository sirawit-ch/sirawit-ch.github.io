import type { PersonData } from "@/lib/types";

/**
 * Groups politicians by their province
 */
export function groupPoliticiansByProvince(
  politicians: PersonData[]
): Record<string, PersonData[]> {
  const grouped: Record<string, PersonData[]> = {};

  politicians.forEach((person) => {
    if (person.m__province) {
      if (!grouped[person.m__province]) {
        grouped[person.m__province] = [];
      }
      grouped[person.m__province].push(person);
    }
  });

  return grouped;
}

/**
 * Calculates the total tile size including spacing
 */
export function calculateTotalTileSize(
  tileSize: number,
  spacing: number
): number {
  return tileSize + spacing;
}

/**
 * Calculates tile position coordinates
 */
export function calculateTilePosition(
  row: number,
  col: number,
  totalTileSize: number,
  marginLeft: number,
  marginTop: number
): { x: number; y: number } {
  return {
    x: col * totalTileSize + marginLeft,
    y: row * totalTileSize + marginTop,
  };
}

/**
 * Clamps opacity value between min and max
 */
export function clampOpacity(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
