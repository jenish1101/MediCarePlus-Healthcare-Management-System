import random
from typing import List, Optional

from beanie import PydanticObjectId

from app.core.enums import EquipmentStatus, SampleStatus, UserRole
from app.core.exceptions import BadRequestError, NotFoundError
from app.core.utils import get_or_404
from app.models.lab import (
    LabCollectionAppointment,
    LabEquipment,
    LabReport,
    LabSample,
    LabTestCatalog,
)
from app.models.user import User
from app.schemas.lab import (
    CatalogCreate,
    CatalogOut,
    EquipmentOut,
    LabAppointmentOut,
    LabReportOut,
    LabReportUpdate,
    LabTestOut,
    SampleAdvance,
    SampleOut,
)


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
        raise BadRequestError("sample_id required")
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
