from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership


router = APIRouter(
    prefix="/workspace",
    tags=["Workspace"]
)


# -------------------------
# Schemas
# -------------------------

class AddMemberRequest(BaseModel):
    email: EmailStr
    role: str = "viewer"


ALLOWED_ROLES = {
    "admin",
    "product_manager",
    "support_agent",
    "viewer"
}


# -------------------------
# GET CURRENT WORKSPACE
# -------------------------

@router.get("/me")
def get_my_workspace(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == current_user.id
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=404,
            detail="Workspace membership not found"
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.id
            == membership.organization_id
        )
        .first()
    )

    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    return {
        "id": organization.id,
        "name": organization.name,
        "slug": organization.slug,
        "role": membership.role
    }


# -------------------------
# GET WORKSPACE MEMBERS
# -------------------------

@router.get("/members")
def get_workspace_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == current_user.id
        )
        .first()
    )

    if not current_membership:
        raise HTTPException(
            status_code=404,
            detail="Workspace membership not found"
        )

    memberships = (
        db.query(Membership)
        .filter(
            Membership.organization_id
            == current_membership.organization_id
        )
        .all()
    )

    members = []

    for membership in memberships:
        user = (
            db.query(User)
            .filter(
                User.id == membership.user_id
            )
            .first()
        )

        if user:
            members.append({
                "id": membership.id,
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "role": membership.role,
                "status": (
                    "Active"
                    if user.is_active
                    else "Inactive"
                )
            })

    return members


# -------------------------
# ADD WORKSPACE MEMBER
# -------------------------

@router.post("/members")
def add_workspace_member(
    request: AddMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == current_user.id
        )
        .first()
    )

    if not current_membership:
        raise HTTPException(
            status_code=404,
            detail="Workspace membership not found"
        )

    # Only admins can add members
    if current_membership.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only workspace admins can add members"
        )

    role = request.role.lower().strip()

    if role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace role"
        )

    # Find existing LOOP user
    new_user = (
        db.query(User)
        .filter(
            User.email == request.email
        )
        .first()
    )

    if not new_user:
        raise HTTPException(
            status_code=404,
            detail=(
                "User not found. The user must create "
                "a LOOP account before being added."
            )
        )

    # Check whether already in this workspace
    existing_membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == new_user.id,
            Membership.organization_id
            == current_membership.organization_id
        )
        .first()
    )

    if existing_membership:
        raise HTTPException(
            status_code=400,
            detail="User is already a workspace member"
        )

    membership = Membership(
        user_id=new_user.id,
        organization_id=current_membership.organization_id,
        role=role
    )

    db.add(membership)
    db.commit()
    db.refresh(membership)

    return {
        "message": "Member added successfully",
        "name": new_user.name,
        "email": new_user.email,
        "role": membership.role
    }