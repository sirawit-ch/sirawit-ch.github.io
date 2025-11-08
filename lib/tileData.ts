// Tile data for parliament visualization
export interface TileData {
  id: string;
  label: string;
  color: "purple" | "darkBlue" | "brown";
  province?: string;
  x: number;
  y: number;
}

export const TILE_COLORS = {
  purple: "#6551CC",
  darkBlue: "#000340",
  brown: "#998383",
} as const;

// Mock tile data - represents parliament seats
export const parliamentTiles: TileData[] = [
  // Row 1 - Top section
  {
    id: "sv3",
    label: "ส.ว.3",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 50,
    y: 80,
  },
  {
    id: "sv4",
    label: "ส.ว.4",
    color: "purple",
    province: "เชียงใหม่",
    x: 92,
    y: 80,
  },
  {
    id: "bao",
    label: "บ่าว",
    color: "darkBlue",
    province: "ภูเก็ต",
    x: 134,
    y: 80,
  },
  {
    id: "ba",
    label: "บ่า",
    color: "darkBlue",
    province: "สงขลา",
    x: 176,
    y: 80,
  },
  {
    id: "osm",
    label: "อ.ส.ม.",
    color: "brown",
    province: "นครราชสีมา",
    x: 218,
    y: 80,
  },
  {
    id: "sb6",
    label: "ส.บ.6",
    color: "brown",
    province: "ขอนแก่น",
    x: 260,
    y: 80,
  },
  {
    id: "chm5",
    label: "ชม.5",
    color: "purple",
    province: "อุบลราชธานี",
    x: 302,
    y: 80,
  },
  {
    id: "sv2",
    label: "ส.ว.2",
    color: "purple",
    province: "นครศรีธรรมราช",
    x: 344,
    y: 80,
  },
  {
    id: "chw",
    label: "ช.ว.",
    color: "darkBlue",
    province: "ชลบุรี",
    x: 386,
    y: 80,
  },
  {
    id: "aiw",
    label: "อาอิว",
    color: "brown",
    province: "ระยอง",
    x: 428,
    y: 80,
  },
  {
    id: "aan",
    label: "อาอัน",
    color: "brown",
    province: "สุราษฎร์ธานี",
    x: 470,
    y: 80,
  },

  // Row 2
  {
    id: "ss1",
    label: "ส.ส.",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 50,
    y: 124,
  },
  {
    id: "ss2",
    label: "ส.ส.",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 92,
    y: 124,
  },
  {
    id: "ss3",
    label: "ส.ส.",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 134,
    y: 124,
  },
  {
    id: "ss4",
    label: "ส.ส.",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 176,
    y: 124,
  },
  {
    id: "ss5",
    label: "ส.ส.",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 218,
    y: 124,
  },
  {
    id: "db1",
    label: "ส.ส.",
    color: "darkBlue",
    province: "เชียงใหม่",
    x: 260,
    y: 124,
  },
  {
    id: "db2",
    label: "ส.ส.",
    color: "darkBlue",
    province: "เชียงใหม่",
    x: 302,
    y: 124,
  },
  {
    id: "db3",
    label: "ส.ส.",
    color: "darkBlue",
    province: "เชียงใหม่",
    x: 344,
    y: 124,
  },
  {
    id: "db4",
    label: "ส.ส.",
    color: "darkBlue",
    province: "เชียงใหม่",
    x: 386,
    y: 124,
  },
  {
    id: "br1",
    label: "ส.ส.",
    color: "brown",
    province: "ภูเก็ต",
    x: 428,
    y: 124,
  },
  {
    id: "br2",
    label: "ส.ส.",
    color: "brown",
    province: "ภูเก็ต",
    x: 470,
    y: 124,
  },

  // Row 3
  { id: "gray1", label: "", color: "brown", x: 50, y: 168 },
  { id: "gray2", label: "", color: "brown", x: 92, y: 168 },
  { id: "gray3", label: "", color: "brown", x: 134, y: 168 },
  { id: "gray4", label: "", color: "brown", x: 176, y: 168 },
  { id: "gray5", label: "", color: "brown", x: 218, y: 168 },
  { id: "gray6", label: "", color: "brown", x: 260, y: 168 },
  { id: "gray7", label: "", color: "brown", x: 302, y: 168 },
  { id: "gray8", label: "", color: "brown", x: 344, y: 168 },
  { id: "gray9", label: "", color: "brown", x: 386, y: 168 },
  { id: "gray10", label: "", color: "brown", x: 428, y: 168 },
  { id: "gray11", label: "", color: "brown", x: 470, y: 168 },

  // Additional rows for more tiles
  {
    id: "uu1",
    label: "อูอู",
    color: "purple",
    province: "สงขลา",
    x: 50,
    y: 212,
  },
  {
    id: "uu2",
    label: "อูอุ",
    color: "purple",
    province: "นครศรีธรรมราช",
    x: 92,
    y: 212,
  },
  {
    id: "uung",
    label: "อูอุง",
    color: "purple",
    province: "ขอนแก่น",
    x: 134,
    y: 212,
  },
  {
    id: "sv9",
    label: "ส.ว.9",
    color: "darkBlue",
    province: "อุบลราชธานี",
    x: 176,
    y: 212,
  },
  {
    id: "aama",
    label: "อามา",
    color: "darkBlue",
    province: "นครราชสีมา",
    x: 218,
    y: 212,
  },

  // More tiles for complete grid (simplified for example)
  {
    id: "tile_30",
    label: "ส.ส.",
    color: "purple",
    province: "กรุงเทพมหานคร",
    x: 260,
    y: 212,
  },
  {
    id: "tile_31",
    label: "ส.ส.",
    color: "darkBlue",
    province: "เชียงใหม่",
    x: 302,
    y: 212,
  },
  {
    id: "tile_32",
    label: "ส.ส.",
    color: "brown",
    province: "ภูเก็ต",
    x: 344,
    y: 212,
  },
  {
    id: "tile_33",
    label: "ส.ส.",
    color: "purple",
    province: "สงขลา",
    x: 386,
    y: 212,
  },
  {
    id: "tile_34",
    label: "ส.ส.",
    color: "darkBlue",
    province: "ชลบุรี",
    x: 428,
    y: 212,
  },
  {
    id: "tile_35",
    label: "ส.ส.",
    color: "brown",
    province: "ระยอง",
    x: 470,
    y: 212,
  },
];

export const TILE_SIZE = {
  width: 38,
  height: 36,
  borderRadius: 4,
};
