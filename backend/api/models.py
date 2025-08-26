from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base


workout_exercises = Table(
    'workout_routine', Base.metadata,
    Column('workout_id', Integer, ForeignKey('workouts.id')),
    Column('routine_id', Integer, ForeignKey('routines.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    routines = relationship("Routine", back_populates="owner")
    workouts = relationship("Workout", back_populates="owner")


class Routine(Base):
    __tablename__ = 'routines'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    owner = relationship("User", back_populates="routines")
    workouts = relationship("Workout", secondary=workout_exercises, back_populates="routines")


class Workout(Base):
    __tablename__ = 'workouts'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    owner = relationship("User", back_populates="workouts")
    routines = relationship("Routine", secondary=workout_exercises, back_populates="workouts")


# Workout.routines = relationship("Routine", secondary=workout_exercises, back_populates="workouts")