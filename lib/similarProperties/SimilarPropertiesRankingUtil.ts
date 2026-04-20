import { getEnabledRankingCriteria } from '@/lib/similarProperties/RankingCriterion';
import { Property, Metric, Amenity } from '@/contexts/property/property-types';

interface PropertyScore {
  property: Property;
  score: number;
  breakdown: Record<string, number>;
}

export const calculatePropertyScore = (
  currentProperty: Property,
  candidateProperty: Property
): PropertyScore => {
  const breakdown: Record<string, number> = {};
  let totalScore = 0;

  const enabledCriteria = getEnabledRankingCriteria();

  enabledCriteria.forEach((config) => {
    let criterionScore = 0;

    switch (config.criterion) {
      case 'area':
        criterionScore = checkAreaMatch(
          currentProperty.location,
          candidateProperty.location
        )
          ? config.weight
          : 0;
        break;

      case 'city':
        criterionScore = checkCityMatch(
          currentProperty.city,
          candidateProperty.city
        )
          ? config.weight
          : 0;
        break;

      case 'state':
        criterionScore = checkStateMatch(
          currentProperty.state,
          candidateProperty.state
        )
          ? config.weight
          : 0;
        break;

      case 'guests':
        criterionScore = checkMaxOccupancyMatch(
          currentProperty.maxOccupancy,
          candidateProperty.maxOccupancy
        )
          ? config.weight
          : 0;
        break;

      case 'brand':
        criterionScore = checkBrandMatch(
          currentProperty.brand,
          candidateProperty.brand
        )
          ? config.weight
          : 0;
        break;

      case 'topMetrics':
        criterionScore =
          calculateMetricSimilarity(
            currentProperty.metrics,
            candidateProperty.metrics
          ) * config.weight;
        break;

      case 'topAmenities':
        criterionScore =
          calculateAmenitySimilarity(
            currentProperty.topAmenities,
            candidateProperty.topAmenities
          ) * config.weight;
        break;
    }

    breakdown[config.criterion] = criterionScore;
    totalScore += criterionScore;
  });

  return {
    property: candidateProperty,
    score: totalScore,
    breakdown,
  };
};

export const rankPropertiesBySimilarity = (
  currentProperty: Property,
  candidateProperties: Property[],
  limit: number = 5
): Property[] => {
  const scoredProperties = candidateProperties.map((candidate) =>
    calculatePropertyScore(currentProperty, candidate)
  );

  const rankedProperties = scoredProperties
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((scored) => scored.property);

  return rankedProperties;
};

export const getRankingDetails = (
  currentProperty: Property,
  candidateProperties: Property[]
): PropertyScore[] => {
  const scoredProperties = candidateProperties.map((candidate) =>
    calculatePropertyScore(currentProperty, candidate)
  );

  return scoredProperties.sort((a, b) => b.score - a.score);
};

const checkAreaMatch = (
  location1?: string | null,
  location2?: string | null
): boolean => {
  if (!location1 || !location2) return false;
  return normalizeString(location1) === normalizeString(location2);
};

const checkCityMatch = (city1?: string, city2?: string): boolean => {
  if (!city1 || !city2) return false;
  return normalizeString(city1) === normalizeString(city2);
};

const checkStateMatch = (
  state1?: string | null,
  state2?: string | null
): boolean => {
  if (!state1 || !state2) return false;
  return normalizeString(state1) === normalizeString(state2);
};

const checkMaxOccupancyMatch = (
  guests1?: number,
  guests2?: number
): boolean => {
  if (!guests1 || !guests2) return false;
  return guests1 === guests2;
};

const checkBrandMatch = (
  brand1?: string | null,
  brand2?: string | null
): boolean => {
  if (!brand1 || !brand2) return false;
  return normalizeString(brand1) === normalizeString(brand2);
};

const calculateMetricSimilarity = (
  metrics1?: Metric[],
  metrics2?: Metric[]
): number => {
  if (
    !metrics1 ||
    !metrics2 ||
    metrics1.length === 0 ||
    metrics2.length === 0
  ) {
    return 0;
  }

  // Only check bedrooms and bathrooms
  const relevantMetrics = ['bedrooms', 'bathrooms'];

  const metricsMap1 = new Map(
    metrics1.map((m) => [normalizeString(m.name), normalizeString(m.value)])
  );

  const metricsMap2 = new Map(
    metrics2.map((m) => [normalizeString(m.name), normalizeString(m.value)])
  );

  let matchCount = 0;
  let totalMetrics = 0;

  relevantMetrics.forEach((metricName) => {
    if (metricsMap1.has(metricName) && metricsMap2.has(metricName)) {
      totalMetrics++;
      if (metricsMap1.get(metricName) === metricsMap2.get(metricName)) {
        matchCount++;
      }
    }
  });

  return totalMetrics > 0 ? matchCount / totalMetrics : 0;
};

const calculateAmenitySimilarity = (
  amenities1?: Amenity[],
  amenities2?: Amenity[]
): number => {
  if (
    !amenities1 ||
    !amenities2 ||
    amenities1.length === 0 ||
    amenities2.length === 0
  ) {
    return 0;
  }

  const amenitySet1 = new Set(amenities1.map((a) => normalizeString(a.name)));
  const amenitySet2 = new Set(amenities2.map((a) => normalizeString(a.name)));

  const intersection = new Set(
    [...amenitySet1].filter((x) => amenitySet2.has(x))
  );

  const union = new Set([...amenitySet1, ...amenitySet2]);

  return union.size > 0 ? intersection.size / union.size : 0;
};

const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};
