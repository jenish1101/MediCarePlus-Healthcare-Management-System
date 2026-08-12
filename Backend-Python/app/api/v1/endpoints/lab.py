from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from app.core.dependencies import (
    CurrentUser,
    LabReportEditorUser,
    LabTechOrAdminUser,
    LabTechOrReceptionistUser,
    LabTechUser,
)
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
from app.services import lab as lab_service

router = APIRouter(prefix="/lab", tags=["Lab"])


@router.get("/reports", response_model=List[LabReportOut])
async def list_reports(current_user: CurrentUser) -> List[LabReportOut]:
    return await lab_service.list_reports(current_user)


@router.patch("/reports/{report_id}", response_model=LabReportOut)
async def update_report(
    report_id: PydanticObjectId,
    body: LabReportUpdate,
    _: LabReportEditorUser,
) -> LabReportOut:
    return await lab_service.update_report(report_id, body)


@router.get("/catalog", response_model=List[CatalogOut])
async def list_catalog(category: Optional[str] = Query(None)) -> List[CatalogOut]:
    return await lab_service.list_catalog(category)


@router.post("/catalog", response_model=CatalogOut, status_code=status.HTTP_201_CREATED)
async def create_catalog_item(body: CatalogCreate, _: LabTechOrAdminUser) -> CatalogOut:
    return await lab_service.create_catalog_item(body)


@router.get("/samples", response_model=List[SampleOut])
async def list_samples(_: LabTechUser) -> List[SampleOut]:
    return await lab_service.list_samples()


@router.post("/samples/{sample_db_id}/advance", response_model=SampleOut)
async def advance_sample(sample_db_id: PydanticObjectId, _: LabTechUser) -> SampleOut:
    return await lab_service.advance_sample(sample_db_id)


@router.post("/samples/scan", response_model=SampleOut)
async def scan_sample(body: SampleAdvance, _: LabTechUser) -> SampleOut:
    return await lab_service.scan_sample(body)


@router.get("/equipment", response_model=List[EquipmentOut])
async def list_equipment(_: LabTechOrAdminUser) -> List[EquipmentOut]:
    return await lab_service.list_equipment()


@router.post("/equipment/{equipment_id}/run-qc", response_model=EquipmentOut)
async def run_qc(equipment_id: PydanticObjectId, _: LabTechUser) -> EquipmentOut:
    return await lab_service.run_qc(equipment_id)


@router.get("/appointments", response_model=List[LabAppointmentOut])
async def list_lab_appointments(_: LabTechOrReceptionistUser) -> List[LabAppointmentOut]:
    return await lab_service.list_lab_appointments()


@router.get("/tests", response_model=List[LabTestOut])
async def list_lab_tests(
    _: LabTechUser,
    status_filter: Optional[str] = Query(None, alias="status"),
) -> List[LabTestOut]:
    return await lab_service.list_lab_tests(status_filter)
