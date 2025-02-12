import numpy as np
from typing import List, Dict
from app.core.models import DecisionModel, PairwiseComparison


def build_pairwise_comparison_matrix(elements_ids: List[str], comparisons: List[PairwiseComparison]) -> np.ndarray:
    """
    Build a pairwise comparison matrix from comparisons.

    Args:
        elements_ids: List of element IDs in order.
        comparisons: List of comparisons.

    Returns:
        The pairwise comparison matrix.

    Usage notes:
        Only unique pairs need to be provided with the main diagonal automatically
        populated.
    """
    n = len(elements_ids)
    matrix = np.ones((n, n))

    # Create a mapping from element IDs to indices
    id_to_index = {element_id: idx for idx, element_id in enumerate(elements_ids)}

    # Fill in the matrix with the comparison values
    for comparison in comparisons:
        i = id_to_index[comparison.element_a_id]
        j = id_to_index[comparison.element_b_id]
        value = comparison.value
        matrix[i][j] = value
        matrix[j][i] = 1 / value

    return matrix


def calculate_priority_vector(matrix: np.ndarray) -> np.ndarray:
    """
    Calculate the priority vector (weights) for a pairwise comparison matrix.

    Args:
        matrix: The pairwise comparison matrix

    Returns:
        The priority vector
    """
    column_sums = matrix.sum(axis=0)
    normalized_matrix = matrix / column_sums
    priority_vector = normalized_matrix.mean(axis=1)

    return priority_vector


def aggregate_expert_inputs(matrices: List[np.ndarray]) -> np.ndarray:
    """
    Aggregate multiple pairwise comparison matrices using geometric mean.

    Args:
        matrices: List of pairwise comparison matrices.

    Returns:
        The aggregated matrix.
    """
    # Stack matrices into a 3D array
    stacked_matrices = np.stack(matrices, axis=2)

    # Compute the geometric mean across the third dimension.
    aggregated_matrix = np.exp(np.mean(np.log(stacked_matrices), axis=2))

    return aggregated_matrix


def calculate_consistency_ratio(matrix: np.ndarray, priority_vector: np.ndarray) -> float:
    """
    Calculate the Consistency Ratio for a pairwise comparison matrix.

    Args:
        matrix: The pairwise comparison matrix.
        priority_vector: The priority vector from the matrix.

    Returns:
        The consistency ratio.
    """
    n = matrix.shape[0]

    # Calculate the weighted sum vector
    weighted_sum = np.matmul(matrix, priority_vector)

    # Calculate principal eigenvalue
    lambda_max = np.mean(weighted_sum / priority_vector)

    # Calculate the Consistency Index
    ci = (lambda_max - n) / (n - 1)

    # Random Index (RI) values
    ri_values = {1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
                 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}
    ri = ri_values.get(n, 1.49)  # Use 1.49 for n > 10

    # Calculate the Consistency Ratio (CR)
    if ri == 0:
        cr = 0
    else:
        cr = ci / ri

    return cr


def calculate_ahp(model: DecisionModel) -> Dict:
    """
    Calculate AHP rankings and inconsistency indices for the decision model.

    Args:
        model: The decision model.

    Returns:
        Results including rankings and inconsistencies.
    """
    # Get criteria and alternatives IDs
    criteria_ids = [criterion.id for criterion in model.criteria]
    alternatives_ids = [alternative.id for alternative in model.alternatives]

    # Aggregate criteria comparisons
    criteria_matrices = []
    for expert in model.expert_inputs:
        matrix = build_pairwise_comparison_matrix(criteria_ids, expert.criteria_comparisons)
        criteria_matrices.append(matrix)
    aggregated_criteria_matrix = aggregate_expert_inputs(criteria_matrices)
    criteria_weights = calculate_priority_vector(aggregated_criteria_matrix)
    criteria_cr = calculate_consistency_ratio(aggregated_criteria_matrix, criteria_weights)

    # Aggregate alternative comparisons per criterion
    alternative_weights = {}
    alternative_crs = {}
    for criterion_id in criteria_ids:
        matrices = []
        for expert in model.expert_inputs:
            comparisons = expert.alternatives_comparisons.get(criterion_id, [])
            if comparisons:
                matrix = build_pairwise_comparison_matrix(alternatives_ids, comparisons)
                matrices.append(matrix)
        if matrices:
            aggregated_matrix = aggregate_expert_inputs(matrices)
            weights = calculate_priority_vector(aggregated_matrix)
            cr = calculate_consistency_ratio(aggregated_matrix, weights)
        else:
            # Assign equal weights if no comparisons are provided
            weights = np.full(len(alternatives_ids), 1 / len(alternatives_ids))
            cr = 0.0
        alternative_weights[criterion_id] = weights
        alternative_crs[criterion_id] = cr

    # Calculate overall scores
    overall_scores = np.zeros(len(alternatives_ids))
    for idx, criterion_id in enumerate(criteria_ids):
        overall_scores += criteria_weights[idx] * alternative_weights[criterion_id]

    # Normalize the overall_scores vector
    overall_scores = overall_scores / overall_scores.sum()

    results = {
        "criteria_weights": dict(zip(criteria_ids, criteria_weights)),
        "criteria_consistency_ratio": criteria_cr,
        "alternative_weights": {
            criterion_id: dict(zip(alternatives_ids, weights))
            for criterion_id, weights in alternative_weights.items()
        },
        "alternative_consistency_ratios": alternative_crs,
        "overall_scores": dict(zip(alternatives_ids, overall_scores))
    }

    return results
