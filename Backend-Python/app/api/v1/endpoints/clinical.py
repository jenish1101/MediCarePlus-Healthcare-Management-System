from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from app.core.dependencies import (
    ClinicalStaffUser,
    CurrentUser,
    DoctorUser,
    PatientUser,
)
from app.schemas.clinical import (
    AvailabilityOut,
    AvailabilityUpdate,
    DoctorOut,
    EarningsSummary,
    FamilyMemberCreate,
    FamilyMemberOut,
    InsuranceOut,
    NoteCreate,
    NoteOut,
    PrescriptionCreate,
    PrescriptionOut,
    ReferralCreate,
    ReferralOut,
    TimelineEvent,
)
from app.schemas.common import MessageResponse
from app.services import clinical as clinical_service

router = APIRouter(tags=["Patient & Clinical"])


@router.get("/doctors", response_model=List[DoctorOut])
async def list_doctors(
    search: Optional[str] = Query(None),
    specialization: Optional[str] = Query(None),
) -> List[DoctorOut]:
    return await clinical_service.list_doctors(search, specialization)


@router.get("/prescriptions", response_model=List[PrescriptionOut])
async def list_prescriptions(current_user: CurrentUser) -> List[PrescriptionOut]:
    return await clinical_service.list_prescriptions(current_user)


@router.post("/prescriptions", response_model=PrescriptionOut, status_code=status.HTTP_201_CREATED)
async def create_prescription(body: PrescriptionCreate, doctor: DoctorUser) -> PrescriptionOut:
    return await clinical_service.create_prescription(body, doctor)


@router.get("/medical-notes", response_model=List[NoteOut])
async def list_notes(
    doctor: ClinicalStaffUser,
    patient_id: Optional[PydanticObjectId] = Query(None),
) -> List[NoteOut]:
    return await clinical_service.list_notes(doctor, patient_id)


@router.post("/medical-notes", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
async def create_note(body: NoteCreate, doctor: DoctorUser) -> NoteOut:
    return await clinical_service.create_note(body, doctor)


@router.get("/referrals", response_model=List[ReferralOut])
async def list_referrals(doctor: DoctorUser) -> List[ReferralOut]:
    return await clinical_service.list_referrals(doctor)


@router.post("/referrals", response_model=ReferralOut, status_code=status.HTTP_201_CREATED)
async def create_referral(body: ReferralCreate, doctor: DoctorUser) -> ReferralOut:
    return await clinical_service.create_referral(body, doctor)


@router.get("/family-members", response_model=List[FamilyMemberOut])
async def list_family(patient: PatientUser) -> List[FamilyMemberOut]:
    return await clinical_service.list_family(patient)


@router.post("/family-members", response_model=FamilyMemberOut, status_code=status.HTTP_201_CREATED)
async def add_family(body: FamilyMemberCreate, patient: PatientUser) -> FamilyMemberOut:
    return await clinical_service.add_family(body, patient)


@router.delete("/family-members/{member_id}", response_model=MessageResponse)
async def remove_family(member_id: PydanticObjectId, patient: PatientUser) -> MessageResponse:
    await clinical_service.remove_family(member_id, patient)
    return MessageResponse(message="Family member removed")


@router.get("/insurance", response_model=Optional[InsuranceOut])
async def get_insurance(patient: PatientUser) -> Optional[InsuranceOut]:
    return await clinical_service.get_insurance(patient)


@router.get("/doctors/me/availability", response_model=AvailabilityOut)
async def get_my_availability(doctor: DoctorUser) -> AvailabilityOut:
    return await clinical_service.get_my_availability(doctor)


@router.put("/doctors/me/availability", response_model=AvailabilityOut)
async def update_my_availability(body: AvailabilityUpdate, doctor: DoctorUser) -> AvailabilityOut:
    return await clinical_service.update_my_availability(body, doctor)


@router.get("/doctors/me/earnings", response_model=EarningsSummary)
async def get_my_earnings(doctor: DoctorUser) -> EarningsSummary:
    return await clinical_service.get_my_earnings(doctor)


@router.get("/health-timeline", response_model=List[TimelineEvent])
async def get_health_timeline(patient: PatientUser) -> List[TimelineEvent]:
    return await clinical_service.get_health_timeline(patient)
