from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser, require_roles
from app.core.enums import (
    CatalogTestStatus,
    EquipmentStatus,
    LabReportStatus,
    SampleStatus,
    UserRole,
)
from app.models.lab import (
    LabCollectionAppointment,
    LabEquipment,
    LabReport,
    LabResultRow,
    LabSample,
    LabTestCatalog,
)
from app.models.user import User

router = APIRouter(prefix="/lab", tags=["Lab"])


class LabReportOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    test_name: str
    date: str
    status: LabReportStatus
    results_summary: Optional[str] = None
    result_rows: List[LabResultRow] = []
    doctor_notes: Optional[str] = None

    model_config = {"populate_by_name": True}


class LabReportUpdate(BaseModel):
    status: Optional[LabReportStatus] = None
    results_summary: Optional[str] = None
    result_rows: Optional[List[LabResultRow]] = None
    doctor_notes: Optional[str] = None


@router.get("/reports", response_model=List[LabReportOut])
async def list_reports(current_user: CurrentUser) -> List[LabReportOut]:
    if current_user.role == UserRole.PATIENT:
        items = await LabReport.find(LabReport.patient_id == current_user.id).to_list()
    else:
        items = await LabReport.find_all().to_list()
    return [LabReportOut(_id=r.id, **r.model_dump(exclude={"id"})) for r in items]


@router.patch("/reports/{report_id}", response_model=LabReportOut)
async def update_report(
    report_id: PydanticObjectId,
    body: LabReportUpdate,
    _: User = Depends(require_roles(UserRole.LAB_TECH, UserRole.DOCTOR, UserRole.ADMIN)),
) -> LabReportOut:
    report = await LabReport.get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(report, k, v)
    await report.save()
    return LabReportOut(_id=report.id, **report.model_dump(exclude={"id"}))


# Catalog
class CatalogOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    category: str
    price: float
    turnaround: str
    sample_type: str
    status: CatalogTestStatus

    model_config = {"populate_by_name": True}


class CatalogCreate(BaseModel):
    name: str
    category: str
    price: float
    turnaround: str
    sample_type: str
    status: CatalogTestStatus = CatalogTestStatus.AVAILABLE


@router.get("/catalog", response_model=List[CatalogOut])
async def list_catalog(category: Optional[str] = Query(None)) -> List[CatalogOut]:
    query = LabTestCatalog.find()
    if category:
        query = LabTestCatalog.find(LabTestCatalog.category == category)
    items = await query.to_list()
    return [CatalogOut(_id=i.id, **i.model_dump(exclude={"id"})) for i in items]


@router.post("/catalog", response_model=CatalogOut, status_code=status.HTTP_201_CREATED)
async def create_catalog_item(
    body: CatalogCreate,
    _: User = Depends(require_roles(UserRole.LAB_TECH, UserRole.ADMIN)),
) -> CatalogOut:
    item = LabTestCatalog(**body.model_dump())
    await item.insert()
    return CatalogOut(_id=item.id, **item.model_dump(exclude={"id"}))


# Samples
class SampleOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    sample_id: str
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    collected_at: str
    status: SampleStatus
    location: str

    model_config = {"populate_by_name": True}


class SampleAdvance(BaseModel):
    sample_id: Optional[str] = None
    status: Optional[SampleStatus] = None


@router.get("/samples", response_model=List[SampleOut])
async def list_samples(_: User = Depends(require_roles(UserRole.LAB_TECH))) -> List[SampleOut]:
    items = await LabSample.find_all().to_list()
    return [SampleOut(_id=s.id, **s.model_dump(exclude={"id"})) for s in items]


@router.post("/samples/{sample_db_id}/advance", response_model=SampleOut)
async def advance_sample(sample_db_id: PydanticObjectId, _: User = Depends(require_roles(UserRole.LAB_TECH))) -> SampleOut:
    sample = await LabSample.get(sample_db_id)
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    steps = list(SampleStatus)
    idx = steps.index(sample.status)
    if idx < len(steps) - 1:
        sample.status = steps[idx + 1]
        await sample.save()
    return SampleOut(_id=sample.id, **sample.model_dump(exclude={"id"}))


@router.post("/samples/scan", response_model=SampleOut)
async def scan_sample(body: SampleAdvance, _: User = Depends(require_roles(UserRole.LAB_TECH))) -> SampleOut:
    if not body.sample_id:
        raise HTTPException(status_code=400, detail="sample_id required")
    sample = await LabSample.find_one(LabSample.sample_id == body.sample_id)
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    steps = list(SampleStatus)
    idx = steps.index(sample.status)
    if idx < len(steps) - 1:
        sample.status = steps[idx + 1]
        await sample.save()
    return SampleOut(_id=sample.id, **sample.model_dump(exclude={"id"}))


# Equipment
class EquipmentOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    model: str
    location: str
    last_calibration: str
    next_calibration: str
    status: EquipmentStatus
    qc_score: Optional[int] = None

    model_config = {"populate_by_name": True}


@router.get("/equipment", response_model=List[EquipmentOut])
async def list_equipment(_: User = Depends(require_roles(UserRole.LAB_TECH, UserRole.ADMIN))) -> List[EquipmentOut]:
    items = await LabEquipment.find_all().to_list()
    return [EquipmentOut(_id=e.id, **e.model_dump(exclude={"id"})) for e in items]


@router.post("/equipment/{equipment_id}/run-qc", response_model=EquipmentOut)
async def run_qc(equipment_id: PydanticObjectId, _: User = Depends(require_roles(UserRole.LAB_TECH))) -> EquipmentOut:
    import random

    equip = await LabEquipment.get(equipment_id)
    if not equip:
        raise HTTPException(status_code=404, detail="Equipment not found")
    equip.status = EquipmentStatus.OPERATIONAL
    equip.qc_score = 95 + random.randint(0, 4)
    await equip.save()
    return EquipmentOut(_id=equip.id, **equip.model_dump(exclude={"id"}))


# Collection appointments
class LabAppointmentOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    date: str
    time: str
    status: str

    model_config = {"populate_by_name": True}


@router.get("/appointments", response_model=List[LabAppointmentOut])
async def list_lab_appointments(_: User = Depends(require_roles(UserRole.LAB_TECH, UserRole.RECEPTIONIST))) -> List[LabAppointmentOut]:
    items = await LabCollectionAppointment.find_all().to_list()
    return [LabAppointmentOut(_id=a.id, **a.model_dump(exclude={"id"})) for a in items]


# Test queue (lab worklist)
class LabTestOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    test_name: str
    patient_name: str
    requested_by: str
    date: str
    priority: str
    status: str
    results: Optional[str] = None

    model_config = {"populate_by_name": True}


@router.get("/tests", response_model=List[LabTestOut])
async def list_lab_tests(
    status_filter: Optional[str] = Query(None, alias="status"),
    _: User = Depends(require_roles(UserRole.LAB_TECH)),
) -> List[LabTestOut]:
    from app.models.user import User as UserModel

    reports = await LabReport.find_all().to_list()
    if status_filter:
        reports = [r for r in reports if r.status.value == status_filter]
    result: List[LabTestOut] = []
    for r in reports:
        patient = await UserModel.get(r.patient_id)
        priority = "urgent" if r.status.value == "pending" and "urgent" in (r.test_name or "").lower() else "routine"
        result.append(
            LabTestOut(
                _id=r.id,
                test_name=r.test_name,
                patient_name=patient.name if patient else "Unknown",
                requested_by="Doctor",
                date=r.date,
                priority=priority,
                status=r.status.value,
                results=r.results_summary,
            )
        )
    return result
