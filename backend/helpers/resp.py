from fastapi.responses import JSONResponse
from typing import Any


def success(data: Any) -> JSONResponse:
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "data": data
        },
        headers={"Access-Control-Allow-Origin": "*"},
    )


def error(status: int, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={
            "success": False,
            "status": status,
            "message": message if message else "Internal Server Error"
        },
        headers={"Access-Control-Allow-Origin": "*"},
    )
