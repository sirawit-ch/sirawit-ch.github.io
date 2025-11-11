import type { FactData, VoteDetailData } from "@/lib/types";
import {
  loadPersonData,
  loadFactData,
  loadVoteDetailData,
  groupPersonByProvince,
  getProvinceVoteStats,
  getVoteEvents,
} from "@/lib/new-api";

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

/**
 * Loads all required data for the application
 */
export async function loadAllData() {
  const [personData, factDataResult, voteDetailDataResult] = await Promise.all([
    loadPersonData(),
    loadFactData(),
    loadVoteDetailData(),
  ]);

  const grouped = groupPersonByProvince(personData, voteDetailDataResult);
  const events = getVoteEvents(factDataResult);

  return {
    personData,
    factData: factDataResult,
    voteDetailData: voteDetailDataResult,
    groupedPeople: grouped,
    voteEvents: events,
  };
}

/**
 * Filters vote detail data based on selected event and option
 */
export function filterVoteDetailData(
  voteDetailData: VoteDetailData[],
  selectedVoteEvent: string | null,
  selectedVoteOption: string | null
): VoteDetailData[] {
  let filtered = voteDetailData;

  if (selectedVoteEvent) {
    filtered = filtered.filter((vote) => vote.title === selectedVoteEvent);
  }

  if (selectedVoteOption) {
    filtered = filtered.filter((vote) => vote.option === selectedVoteOption);
  }

  return filtered;
}

/**
 * Filters fact data based on selected event and option
 */
export function filterFactData(
  factData: FactData[],
  selectedVoteEvent: string | null,
  selectedVoteOption: string | null
): FactData[] {
  let filtered = factData;

  if (selectedVoteEvent) {
    filtered = filtered.filter((fact) => fact.title === selectedVoteEvent);
  }

  if (selectedVoteOption) {
    filtered = filtered.filter(
      (fact) =>
        fact.option === selectedVoteOption && fact.type === selectedVoteOption
    );
  } else {
    filtered = filtered.filter((fact) => fact.type === "All");
  }

  return filtered;
}

/**
 * Converts province vote stats map to record object
 */
export function convertStatsToRecord(
  statsMap: Map<string, ProvinceVoteStats>
): Record<string, ProvinceVoteStats> {
  const statsRecord: Record<string, ProvinceVoteStats> = {};
  statsMap.forEach((value, key) => {
    statsRecord[key] = value;
  });
  return statsRecord;
}

/**
 * Applies filters to vote and fact data and returns filtered results with stats
 */
export function applyFilters(
  voteDetailData: VoteDetailData[],
  factData: FactData[],
  selectedVoteEvent: string | null,
  selectedVoteOption: string | null
) {
  const filteredDetails = filterVoteDetailData(
    voteDetailData,
    selectedVoteEvent,
    selectedVoteOption
  );
  const filteredFacts = filterFactData(
    factData,
    selectedVoteEvent,
    selectedVoteOption
  );

  const statsMap = getProvinceVoteStats(filteredFacts);
  const statsRecord = convertStatsToRecord(statsMap);

  return {
    filteredVoteDetailData: filteredDetails,
    filteredProvinceVoteStats: statsRecord,
  };
}
