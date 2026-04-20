export type RankingCriterion =
  | 'area'
  | 'city'
  | 'state'
  | 'guests'
  | 'topAmenities'
  | 'brand'
  | 'topMetrics';

export interface RankingConfig {
  criterion: RankingCriterion;
  weight: number;
  enabled: boolean;
  description: string;
}

export const SIMILAR_PROPERTIES_RANKING_CONFIG: RankingConfig[] = [
  {
    criterion: 'area',
    weight: 10,
    enabled: true,
    description: 'Properties in the same area/location',
  },
  {
    criterion: 'city',
    weight: 9,
    enabled: true,
    description: 'Properties in the same city',
  },
  {
    criterion: 'state',
    weight: 8,
    enabled: true,
    description: 'Properties in the same state',
  },
  {
    criterion: 'guests',
    weight: 7,
    enabled: true,
    description: 'Properties in the same state',
  },
  {
    criterion: 'topAmenities',
    weight: 6,
    enabled: true,
    description: 'Properties with similar top amenities',
  },
  {
    criterion: 'brand',
    weight: 5,
    enabled: true,
    description: 'Properties with the same brand',
  },
  {
    criterion: 'topMetrics',
    weight: 4,
    enabled: true,
    description:
      'Properties with similar top metrics (e.g., bedrooms, bathrooms)',
  },
];

export const getEnabledRankingCriteria = (): RankingConfig[] => {
  return SIMILAR_PROPERTIES_RANKING_CONFIG.filter((config) => config.enabled);
};

export const getTotalPossibleScore = (): number => {
  return SIMILAR_PROPERTIES_RANKING_CONFIG.filter((config) => config.enabled)
    .map((config) => config.weight)
    .reduce((sum, weight) => sum + weight, 0);
};
