export interface CriteriaComparison {
    element_a_id: string;
    element_b_id: string;
    value: number | null;
}

export interface AlternativesComparison {
    [criterion_id: string]: CriteriaComparison[];
}

export interface ExpertInputForm {
    criteria_comparisons: CriteriaComparison[];
    alternatives_comparisons: AlternativesComparison;
}