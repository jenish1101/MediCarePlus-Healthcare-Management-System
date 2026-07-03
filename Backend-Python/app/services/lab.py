import random
from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import (
    CatalogTestStatus,
    EquipmentStatus,
    LabReportStatus,
    SampleStatus,
    UserRole,
)
from app.core.exceptions import AppError, NotFoundError
from app.core.utils import get_or_404
from app.models.lab import (
    LabCollectionAppointment,
    LabEquipment,
    LabReport,
    LabResultRow,
    LabSample,
    LabTestCatalog,
)
from app.models.user import User


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


class LabAppointmentOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    date: str
    time: str
    status: str

    model_config = {"populate_by_name": True}


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


def _advance_sample_status(sample: LabSample) -> None:
    steps = list(SampleStatus)
    idx = steps.index(sample.status)
    if idx < len(steps) - 1:
        sample.status = steps[idx + 1]


async def list_reports(current_user: User) -> List[LabReportOut]:
    if current_user.role == UserRole.PATIENT:
        items = await LabReport.find(LabReport.patient_id == current_user.id).to_list()
    else:
        items = await LabReport.find_all().to_list()
    return [LabReportOut(_id=r.id, **r.model_dump(exclude={"id"})) for r in items]


async def update_report(report_id: PydanticObjectId, body: LabReportUpdate) -> LabReportOut:
    report = await get_or_404(LabReport, report_id, "Report not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(report, k, v)
    await report.save()
    return LabReportOut(_id=report.id, **report.model_dump(exclude={"id"}))


async def list_catalog(category: Optional[str] = None) -> List[CatalogOut]:
    query = LabTestCatalog.find()
    if category:
        query = LabTestCatalog.find(LabTestCatalog.category == category)
    items = await query.to_list()
    return [CatalogOut(_id=i.id, **i.model_dump(exclude={"id"})) for i in items]


async def create_catalog_item(body: CatalogCreate) -> CatalogOut:
    item = LabTestCatalog(**body.model_dump())
    await item.insert()
    return CatalogOut(_id=item.id, **item.model_dump(exclude={"id"}))


async def list_samples() -> List[SampleOut]:
    items = await LabSample.find_all().to_list()
    return [SampleOut(_id=s.id, **s.model_dump(exclude={"id"})) for s in items]


async def advance_sample(sample_db_id: PydanticObjectId) -> SampleOut:
    sample = await get_or_404(LabSample, sample_db_id, "Sample not found")
    _advance_sample_status(sample)
    await sample.save()
    return SampleOut(_id=sample.id, **sample.model_dump(exclude={"id"}))


async def scan_sample(body: SampleAdvance) -> SampleOut:
    if not body.sample_id:
        raise AppError("sample_id required", status_code=400)
    sample = await LabSample.find_one(LabSample.sample_id == body.sample_id)
    if not sample:
        raise NotFoundError("Sample not found")
    _advance_sample_status(sample)
    await sample.save()
    return SampleOut(_id=sample.id, **sample.model_dump(exclude={"id"}))


async def list_equipment() -> List[EquipmentOut]:
    items = await LabEquipment.find_all().to_list()
    return [EquipmentOut(_id=e.id, **e.model_dump(exclude={"id"})) for e in items]


async def run_qc(equipment_id: PydanticObjectId) -> EquipmentOut:
    equip = await get_or_404(LabEquipment, equipment_id, "Equipment not found")
    equip.status = EquipmentStatus.OPERATIONAL
    equip.qc_score = 95 + random.randint(0, 4)
    await equip.save()
    return EquipmentOut(_id=equip.id, **equip.model_dump(exclude={"id"}))


async def list_lab_appointments() -> List[LabAppointmentOut]:
    items = await LabCollectionAppointment.find_all().to_list()
    return [LabAppointmentOut(_id=a.id, **a.model_dump(exclude={"id"})) for a in items]


async def list_lab_tests(status_filter: Optional[str] = None) -> List[LabTestOut]:
    reports = await LabReport.find_all().to_list()
    if status_filter:
        reports = [r for r in reports if r.status.value == status_filter]
    result: List[LabTestOut] = []
    for r in reports:
        patient = await User.get(r.patient_id)
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
