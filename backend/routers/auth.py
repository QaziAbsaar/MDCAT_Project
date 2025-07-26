from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from models.user import Token, User, UserCreate, UserUpdate
from utils.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_current_active_user,
    get_password_hash,
    verify_password,
)

# Create router
router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={401: {"description": "Unauthorized"}},
)


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """Authenticate user and return JWT token."""
    # In a real application, you would authenticate against a database
    # user = authenticate_user(form_data.username, form_data.password)
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Incorrect username or password",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    
    # For now, we'll accept any username/password combination for development
    # This should be replaced with proper authentication in production
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Register a new user."""
    # In a real application, you would check if the user already exists
    # and save the new user to the database
    
    # For now, we'll just create a token for the new user
    from datetime import datetime
    import uuid
    
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Create a new user (in a real app, this would be saved to the database)
    user_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    # Create access token for the new user
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    """Get the current authenticated user."""
    return current_user


@router.put("/me", response_model=User)
async def update_user_profile(user_update: UserUpdate, current_user: Annotated[User, Depends(get_current_active_user)]):
    """Update the current user's profile."""
    # In a real application, you would update the user in the database
    # For now, we'll just return the current user with updated fields
    
    updated_data = current_user.dict()
    
    if user_update.username is not None:
        updated_data['username'] = user_update.username
    if user_update.full_name is not None:
        updated_data['full_name'] = user_update.full_name
    
    # If password is provided, hash it (in real app, update in database)
    if user_update.password is not None:
        # In real app: updated_data['hashed_password'] = get_password_hash(user_update.password)
        pass
    
    return User(**updated_data)