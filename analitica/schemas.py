# analitica/schemas.py
from pydantic import BaseModel
from typing import List

class CountByItem(BaseModel):
    item: str
    count: int

class MetricResponse(BaseModel):
    metric_name: str
    data: List[CountByItem]
