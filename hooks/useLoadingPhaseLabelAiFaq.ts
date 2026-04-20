import { LoadingPhase } from './useAIFaq';

const LOADING_PHASE_LABELS: Record<LoadingPhase, string> = {
  analyzing: 'Analyzing your question',
  understanding: 'Understanding your needs',
  searching: 'Searching for the best info',
  gathering: 'Gathering relevant details',
  drafting: 'Drafting a helpful answer',
  polishing: 'Polishing the response',
  finalizing: 'Putting the final touches',
};

export function useLoadingPhaseLabel(phase: LoadingPhase | null): {
  label: string;
} {
  const label = phase
    ? LOADING_PHASE_LABELS[phase]
    : 'Finding the perfect results for you!';
  return { label };
}

export default useLoadingPhaseLabel;
