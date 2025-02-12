export interface Alternative {
    id: string;
    name: string;
}

export interface Criterion {
    id: string;
    name: string;
}

export interface CriteriaComparison {
    element_a_id: string;
    element_b_id: string;
    value: number;
}

export interface AlternativesComparison {
    [key: string]: CriteriaComparison[];
}

export interface ExpertInput {
    expert_id: string;
    criteria_comparisons: CriteriaComparison[];
    alternatives_comparisons: AlternativesComparison;
}

export interface Model {
    model_id: string;
    name: string;
    alternatives: Alternative[];
    criteria: Criterion[];
    expert_inputs: ExpertInput[];
}

export interface ModelResults {
    criteria_weights: Record<string, number>;
    criteria_consistency_ratio: number;
    alternative_weights: Record<string, Record<string, number>>;
    alternative_consistency_ratios: Record<string, number>;
    overall_scores: Record<string, number>;
}