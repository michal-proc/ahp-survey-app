from typing import List, Dict
from pydantic import BaseModel, Field
import uuid


class Alternative(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Name or description of the alternative.


class Criterion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Name of description of the criterion.


class PairwiseComparison(BaseModel):
    element_a_id: str  # ID of the first element.
    element_b_id: str  # ID of the second element.
    value: float


class ExpertInput(BaseModel):
    expert_id: str = str(uuid.uuid4())
    criteria_comparisons: List[PairwiseComparison]  # Pairwise comparisons between criteria to determine their weights
    alternatives_comparisons: Dict[
        str, List[PairwiseComparison]]  # Pairwise comparisons between alternatives for each criterion.


class DecisionModelCreate(BaseModel):
    name: str
    alternatives: List[str]
    criteria: List[str]


class DecisionModel(BaseModel):
    model_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    alternatives: List[Alternative]
    criteria: List[Criterion]
    expert_inputs: List[ExpertInput] = Field(default_factory=lambda: [])


class Ranking(BaseModel):
    criteria_weights: Dict[str, float] = Field(...,
                                               description="Normalized weight of each criterion specified by its UUID.")
    criteria_consistency_ratio: float = Field(...,
                                              description="Consistency ratio of criteria pairwise comparison matrix.")
    alternative_weights: Dict[str, Dict[str, float]] = Field(...,
                                                             description="Local priority for a given criterion and alternative specified by their UUIDs.")
    alternative_consistency_ratios: Dict[str, float] = Field(...,
                                                             description="Consistency ratio of alternative pairwise comparison matrix with respect to the criteria given by the UUID.")
    overall_scores: Dict[str, float] = Field(...,
                                             description="Normalized global priority of the alternative specified by the UUID.")
