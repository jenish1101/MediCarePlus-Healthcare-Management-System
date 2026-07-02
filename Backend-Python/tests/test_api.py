import pytest
from httpx import AsyncClient

DEMO_PASSWORD = "demo123"
ROLES = {
    "patient": "patient@demo.com",
    "doctor": "doctor@demo.com",
    "admin": "admin@demo.com",
    "pharmacist": "pharmacist@demo.com",
    "lab_tech": "lab@demo.com",
    "receptionist": "receptionist@demo.com",
    "nurse": "nurse@demo.com",
    "supplier": "supplier@demo.com",
}


async def _login(client: AsyncClient, role: str) -> str:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": ROLES[role], "password": DEMO_PASSWORD, "role": role},
    )
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


@pytest.mark.asyncio
async def test_public_doctors_directory(client):
    response = await client.get("/api/v1/doctors")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


@pytest.mark.asyncio
@pytest.mark.parametrize("role", list(ROLES.keys()))
async def test_role_login(client, role):
    token = await _login(client, role)
    assert token

    me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["role"] == role


@pytest.mark.asyncio
async def test_patient_timeline_and_billing(client):
    token = await _login(client, "patient")
    headers = {"Authorization": f"Bearer {token}"}

    timeline = await client.get("/api/v1/health-timeline", headers=headers)
    assert timeline.status_code == 200

    invoices = await client.get("/api/v1/billing/invoices", headers=headers)
    assert invoices.status_code == 200


@pytest.mark.asyncio
async def test_doctor_availability_and_earnings(client):
    token = await _login(client, "doctor")
    headers = {"Authorization": f"Bearer {token}"}

    availability = await client.get("/api/v1/doctors/me/availability", headers=headers)
    assert availability.status_code == 200
    assert "availability_days" in availability.json()

    earnings = await client.get("/api/v1/doctors/me/earnings", headers=headers)
    assert earnings.status_code == 200
    assert "total_earnings" in earnings.json()

    patients = await client.get("/api/v1/users/patients", headers=headers)
    assert patients.status_code == 200


@pytest.mark.asyncio
async def test_pharmacy_sales_and_alerts(client):
    token = await _login(client, "pharmacist")
    headers = {"Authorization": f"Bearer {token}"}

    sales = await client.get("/api/v1/pharmacy/sales", headers=headers)
    assert sales.status_code == 200

    alerts = await client.get("/api/v1/pharmacy/expiry-alerts", headers=headers)
    assert alerts.status_code == 200


@pytest.mark.asyncio
async def test_lab_tests_queue(client):
    token = await _login(client, "lab_tech")
    headers = {"Authorization": f"Bearer {token}"}

    tests = await client.get("/api/v1/lab/tests", headers=headers)
    assert tests.status_code == 200
    assert isinstance(tests.json(), list)
