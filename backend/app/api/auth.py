from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserResponse,
    TokenResponse
)
from app.models.organization import Organization
from app.models.membership import Membership


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(
            user_data.password
        ),
        role="admin"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    workspace_name = f"{new_user.name}'s Workspace"

    workspace_slug = (
        new_user.email
        .split("@")[0]
        .lower()
        .replace(".", "-")
        .replace("_", "-")
    )

    existing_workspace = (
        db.query(Organization)
        .filter(
            Organization.slug == workspace_slug
        )
        .first()
    )

    if existing_workspace:
        workspace_slug = (
            f"{workspace_slug}-{new_user.id}"
        )

    organization = Organization(
        name=workspace_name,
        slug=workspace_slug
    )

    db.add(organization)
    db.commit()
    db.refresh(organization)

    membership = Membership(
        user_id=new_user.id,
        organization_id=organization.id,
        role="admin"
    )

    db.add(membership)
    db.commit()

    return new_user


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user