from pydantic import BaseModel
from typing import List, Optional
from fastapi import status, HTTPException
from fastapi import APIRouter
from sqlalchemy.orm import joinedload
from api.models import Workout, Routine
from api.dep import db_dependency, user_dependency

router = APIRouter(
    prefix="/routines",
    tags=["routines"]
)

class RoutineBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoutineCreate(RoutineBase):
    workout_ids: List[int] = []

@router.get("/")
def get_routines(db: db_dependency, user: user_dependency):
    return db.query(Routine).options(joinedload(Routine.workouts)).filter(Routine.user_id == user.get('id')).all()

@router.post('/', status_code=201)
def create_routine(db: db_dependency, user: user_dependency, routine: RoutineCreate):

    db_routine = Routine(
        name=routine.name,
        description=routine.description,
        user_id=user.get('id')
    )
    for workout in routine.workout_ids:
        workout = db.query(Workout).filter(Workout.id == workout, Workout.user_id == user.get('id')).first()
        if workout:
                db_routine.workouts.append(workout)
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    db_routine = db.query(Routine).options(joinedload(Routine.workouts)).filter(Routine.id == db_routine.id).first()
    return db_routine

@router.delete("/{routine_id}", status_code=204)
def delete_routine(routine_id: int, db: db_dependency, user: user_dependency):
    db_routine = db.query(Routine).filter(Routine.id == routine_id, Routine.user_id == user.get('id')).first()
    if db_routine:
        db.delete(db_routine)
        db.commit()
    return db_routine


@router.delete("/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_routine(routine_id: int, db: db_dependency, user: user_dependency):
    """
    Deletes a routine after verifying existence and ownership.
    """
    # Step 1: Find the routine by its ID to check for existence.
    db_routine = db.query(Routine).filter(Routine.id == routine_id).first()

    # Step 2: If it doesn't exist, raise a 404 error.
    if db_routine is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Routine not found")

    # Step 3: If it exists, check for ownership. If not the owner, raise a 403 error.
    if db_routine.user_id != user.get('id'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Sorry, you cannot delete routine '{db_routine.name}', as it is not yours"
        )

    # If both checks pass, proceed with deletion.
    db.delete(db_routine)
    db.commit()

    # A 204 response should not have a body, so we return nothing.
    return