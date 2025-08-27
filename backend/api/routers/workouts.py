from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status, HTTPException

from api.models import Workout
from api.dep import db_dependency, user_dependency


router = APIRouter(
    prefix="/workouts",
    tags=["workouts"]
)

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkoutCreate(WorkoutBase):
    pass

@router.get("/{workout_id}")
def get_my_workout(workout_id: int, db: db_dependency, user: user_dependency):

    # Step 1: Find the workout by its ID to check for existence.
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()

    # Step 2: If it doesn't exist, raise a 404 error.
    if db_workout is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    # Step 3: If it exists, check for ownership. If not the owner, raise a 403 error.
    if db_workout.user_id != user.get('id'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Sorry, you cannot view '{db_workout.name}', as it is not your workout"
        )

    # ✅ If both checks pass, return the workout.
    return db_workout


    # workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == user['id']).first()
    # if workout is None:
    #     raise HTTPException(status_code=404, detail="Workout not found")
    # return workout
    



@router.get("/")
def get_workouts(db: db_dependency, user: user_dependency):
    return db.query(Workout).filter(Workout.user_id == user['id']).all()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_workout(db: db_dependency, user: user_dependency, workout: WorkoutCreate):
    db_workout = Workout(
        **workout.model_dump(),
        user_id = user['id']
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout


@router.delete("/{workout_id}") # Changed to a path parameter
def delete_workout(workout_id: int, db: db_dependency, user: user_dependency):
    # Step 1: Find the workout by its ID to check for existence.
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()

    # Step 2: If it doesn't exist, raise a 404 error.
    if db_workout is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    # Step 3: If it exists, check for ownership. If not the owner, raise a 403 error.
    if db_workout.user_id != user.get('id'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Sorry, you cannot delete '{db_workout.name}', as it is not your workout"
        )

    # ✅ If both checks pass, proceed with the deletion.
    db.delete(db_workout)
    db.commit()
    return {"detail": f"Workout '{db_workout.name}' deleted successfully"}

# @router.delete("/")
# def delete_workout(db: db_dependency, user: user_dependency, workout_id: int):
#     db_workout = db.query(Workout).filter(Workout.id == workout_id).first()
#     if db_workout:
#         db.delete(db_workout)
#         db.commit()
#         return {"detail": "Workout deleted"}
#     return {"detail": "Workout not found"}
