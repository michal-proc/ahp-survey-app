from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from typing import Dict
from pydantic import ValidationError
from app.core.models import DecisionModel, DecisionModelCreate, ExpertInput, Alternative, Criterion, Ranking
from app.core.services import calculate_ahp
from helpers import resp
import json
import uuid

router = APIRouter()

# In-memory storage for decision models
decision_models: Dict[str, DecisionModel] = {}


# Index decision models
@router.get("/models/", response_model=list[DecisionModel])
def get_decision_model():
    return resp.success([model.dict() for key, model in decision_models.items()])


# Get a decision model
@router.get("/models/{model_id}", response_model=DecisionModel)
def get_decision_model(model_id: str):
    if not model_id in decision_models.keys():
        raise HTTPException(status_code=404, detail="Model not found")
    return resp.success(decision_models[model_id].dict())


# Create a new decision model
@router.post("/models/", response_model=DecisionModel)
def create_decision_model(model_data: DecisionModelCreate):
    new_model_id = str(uuid.uuid4())

    alternatives = [Alternative(name=name) for name in model_data.alternatives]
    criteria = [Criterion(name=name) for name in model_data.criteria]

    if len(alternatives) < 2:
        raise HTTPException(status_code=422, detail="Cannot create model with 1 alternative or less")
    if len(criteria) == 0:
        raise HTTPException(status_code=422, detail="Cannot create model without criteria")

    model = DecisionModel(
        model_id=new_model_id,
        name=model_data.name,
        alternatives=alternatives,
        criteria=criteria
    )

    decision_models[model.model_id] = model

    return resp.success(model.dict())


# Delete decision model
@router.delete("/models/{model_id}", response_model=DecisionModel)
def delete_decision_model(model_id: str):
    model = decision_models.pop(model_id, None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return resp.success(model.dict())


# Submit expert input
@router.post("/models/{model_id}/experts/", response_model=DecisionModel)
def submit_expert_input(model_id: str, expert_input: ExpertInput):
    model = decision_models.get(model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    model.expert_inputs.append(expert_input)

    return resp.success(model.dict())


# Import model data from JSON file
# Extract file as a form field in the multipart/form-data
@router.post("/models/import/", response_model=DecisionModel)
async def import_model(file: UploadFile = File(...)):
    try:
        content = await file.read()
        data = json.loads(content)
        model = DecisionModel(**data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except ValidationError as e:
        errors = e.errors()
        raise HTTPException(status_code=400, detail=errors)

    if model.model_id in decision_models:
        raise HTTPException(status_code=400, detail="Model ID already exists")
    decision_models[model.model_id] = model

    return resp.success(model.dict())


# Export model data to JSON
@router.get("/models/{model_id}/export/", response_model=DecisionModel)
def export_model(model_id: str):
    model = decision_models.get(model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return resp.success(model.dict())


# Calculate rankings and inconsistency indices
@router.get("/models/{model_id}/rankings/", response_model=Ranking)
def calculate_rankings(model_id: str):
    model = decision_models.get(model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return resp.success(calculate_ahp(model))
