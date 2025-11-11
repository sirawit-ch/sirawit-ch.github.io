export interface ProvinceVoteStats {
  province: string;
  agreeCount: number;
  disagreeCount: number;
  abstainCount: number;
  noVoteCount: number;
  absentCount: number;
  total: number;
  portion: number;
}

export interface TooltipState {
  isVisible: boolean;
  position: { x: number; y: number };
  provinceName: string;
  mps: import("@/lib/types").PersonData[];
  voteStats?: ProvinceVoteStats;
}
