"""Smoke-test every API endpoint with role-appropriate auth."""

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


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


async def _assert_ok(response, label: str) -> None:
    assert response.status_code in (200, 201), f"{label}: {response.status_code} {response.text}"


@pytest.mark.asyncio
async def test_health_endpoints(client):
    for path in ("/", "/health", "/ready"):
        response = await client.get(path)
        assert response.status_code == 200, f"{path}: {response.text}"


@pytest.mark.asyncio
async def test_auth_flow(client):
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": ROLES["patient"], "password": DEMO_PASSWORD, "role": "patient"},
    )
    assert login.status_code == 200
    tokens = login.json()
    assert "access_token" in tokens and "refresh_token" in tokens

    refresh = await client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert refresh.status_code == 200

    me = await client.get("/api/v1/auth/me", headers=_auth(tokens["access_token"]))
    assert me.status_code == 200
    assert me.json()["role"] == "patient"

    logout = await client.post("/api/v1/auth/logout", headers=_auth(tokens["access_token"]))
    assert logout.status_code == 200


@pytest.mark.asyncio
async def test_public_endpoints(client):
    doctors = await client.get("/api/v1/doctors")
    await _assert_ok(doctors, "GET /doctors")

    catalog = await client.get("/api/v1/lab/catalog")
    await _assert_ok(catalog, "GET /lab/catalog")

    announcements = await client.get("/api/v1/announcements")
    await _assert_ok(announcements, "GET /announcements")


@pytest.mark.asyncio
async def test_patient_endpoints(client):
    token = await _login(client, "patient")
    h = _auth(token)

    for path in (
        "/api/v1/auth/me",
        "/api/v1/prescriptions",
        "/api/v1/family-members",
        "/api/v1/insurance",
        "/api/v1/health-timeline",
        "/api/v1/appointments",
        "/api/v1/billing/invoices",
        "/api/v1/pharmacy/orders",
        "/api/v1/lab/reports",
        "/api/v1/notifications",
    ):
        response = await client.get(path, headers=h)
        await _assert_ok(response, f"GET {path}")

    profile = await client.patch("/api/v1/users/me/profile", headers=h, json={"phone": "+1234567890"})
    await _assert_ok(profile, "PATCH /users/me/profile")

    family = await client.post(
        "/api/v1/family-members",
        headers=h,
        json={
            "name": "Test Family",
            "relationship": "Sibling",
            "date_of_birth": "1995-01-01",
            "phone": "+1000000000",
            "blood_group": "O+",
        },
    )
    await _assert_ok(family, "POST /family-members")
    member_id = family.json()["_id"]
    delete_family = await client.delete(f"/api/v1/family-members/{member_id}", headers=h)
    await _assert_ok(delete_family, "DELETE /family-members/{id}")

    appointments = (await client.get("/api/v1/appointments", headers=h)).json()
    if appointments:
        apt_id = appointments[0]["_id"]
        response = await client.get(f"/api/v1/appointments/{apt_id}", headers=h)
        await _assert_ok(response, "GET /appointments/{id}")
        patch = await client.patch(
            f"/api/v1/appointments/{apt_id}",
            headers=h,
            json={"reason": "Updated reason in test"},
        )
        await _assert_ok(patch, "PATCH /appointments/{id}")

    invoices = (await client.get("/api/v1/billing/invoices", headers=h)).json()
    unpaid = [i for i in invoices if i.get("status") != "paid"]
    if unpaid:
        inv_id = unpaid[0]["_id"]
        response = await client.post(f"/api/v1/billing/invoices/{inv_id}/pay", headers=h)
        await _assert_ok(response, "POST /billing/invoices/{id}/pay")

    notifs = (await client.get("/api/v1/notifications", headers=h)).json()
    if notifs:
        nid = notifs[0]["_id"]
        read_one = await client.post(f"/api/v1/notifications/{nid}/read", headers=h)
        await _assert_ok(read_one, "POST /notifications/{id}/read")
    read_all = await client.post("/api/v1/notifications/read-all", headers=h)
    await _assert_ok(read_all, "POST /notifications/read-all")


@pytest.mark.asyncio
async def test_doctor_endpoints(client):
    token = await _login(client, "doctor")
    h = _auth(token)

    for path in (
        "/api/v1/users/patients",
        "/api/v1/prescriptions",
        "/api/v1/medical-notes",
        "/api/v1/referrals",
        "/api/v1/doctors/me/availability",
        "/api/v1/doctors/me/earnings",
        "/api/v1/appointments",
        "/api/v1/messages",
        "/api/v1/notifications",
    ):
        response = await client.get(path, headers=h)
        await _assert_ok(response, f"GET {path}")

    avail = await client.put(
        "/api/v1/doctors/me/availability",
        headers=h,
        json={"availability_days": ["Mon", "Wed", "Fri"], "availability_slots": ["09:00", "10:00"]},
    )
    await _assert_ok(avail, "PUT /doctors/me/availability")

    patients = (await client.get("/api/v1/users/patients", headers=h)).json()
    if patients:
        patient_id = patients[0]["_id"]
        note = await client.post(
            "/api/v1/medical-notes",
            headers=h,
            json={
                "patient_id": patient_id,
                "title": "Test note",
                "content": "Automated test note",
            },
        )
        await _assert_ok(note, "POST /medical-notes")

        rx = await client.post(
            "/api/v1/prescriptions",
            headers=h,
            json={
                "patient_id": patient_id,
                "diagnosis": "Test diagnosis",
                "medicines": [{"name": "Aspirin", "dosage": "100mg", "frequency": "daily", "duration": "7d"}],
            },
        )
        await _assert_ok(rx, "POST /prescriptions")

        referral = await client.post(
            "/api/v1/referrals",
            headers=h,
            json={
                "patient_id": patient_id,
                "patient_name": patients[0]["name"],
                "specialist": "Dr Specialist",
                "specialty": "Cardiology",
                "reason": "Follow-up",
                "date": "2026-07-01",
            },
        )
        await _assert_ok(referral, "POST /referrals")

    threads = (await client.get("/api/v1/messages", headers=h)).json()
    if threads:
        thread_id = threads[0]["_id"]
        msg = await client.post(
            f"/api/v1/messages/{thread_id}",
            headers=h,
            json={"text": "Test message from doctor"},
        )
        await _assert_ok(msg, "POST /messages/{id}")


@pytest.mark.asyncio
async def test_admin_endpoints(client):
    token = await _login(client, "admin")
    h = _auth(token)

    for path in (
        "/api/v1/users",
        "/api/v1/beds",
        "/api/v1/departments",
        "/api/v1/billing/invoices",
        "/api/v1/audit-log",
        "/api/v1/doctor-onboarding",
        "/api/v1/analytics/summary",
        "/api/v1/notifications",
        "/api/v1/lab/reports",
        "/api/v1/lab/equipment",
    ):
        response = await client.get(path, headers=h)
        await _assert_ok(response, f"GET {path}")

    dept = await client.post(
        "/api/v1/departments",
        headers=h,
        json={"name": "Test Dept", "head": "Dr Test", "staff_count": 5, "beds": 10},
    )
    await _assert_ok(dept, "POST /departments")
    dept_id = dept.json()["_id"]

    ann = await client.post(
        "/api/v1/announcements",
        headers=h,
        json={"title": "Test", "message": "Test announcement", "target_roles": ["all"]},
    )
    await _assert_ok(ann, "POST /announcements")
    ann_id = ann.json()["_id"]

    archive = await client.patch(f"/api/v1/announcements/{ann_id}/archive", headers=h)
    await _assert_ok(archive, "PATCH /announcements/{id}/archive")

    delete_dept = await client.delete(f"/api/v1/departments/{dept_id}", headers=h)
    await _assert_ok(delete_dept, "DELETE /departments/{id}")

    beds = (await client.get("/api/v1/beds", headers=h)).json()
    if beds:
        bed_id = beds[0]["_id"]
        patch = await client.patch(f"/api/v1/beds/{bed_id}", headers=h, json={"status": "available"})
        await _assert_ok(patch, "PATCH /beds/{id}")

    onboarding = (await client.get("/api/v1/doctor-onboarding", headers=h)).json()
    if onboarding:
        doc_id = onboarding[0]["_id"]
        approve = await client.post(f"/api/v1/doctor-onboarding/{doc_id}/approve", headers=h)
        await _assert_ok(approve, "POST /doctor-onboarding/{id}/approve")


@pytest.mark.asyncio
async def test_pharmacist_endpoints(client):
    token = await _login(client, "pharmacist")
    h = _auth(token)

    for path in (
        "/api/v1/pharmacy/inventory",
        "/api/v1/pharmacy/orders",
        "/api/v1/pharmacy/fulfillment",
        "/api/v1/pharmacy/purchase-orders",
        "/api/v1/pharmacy/returns",
        "/api/v1/pharmacy/suppliers",
        "/api/v1/pharmacy/expiry-alerts",
        "/api/v1/pharmacy/sales",
        "/api/v1/notifications",
    ):
        response = await client.get(path, headers=h)
        await _assert_ok(response, f"GET {path}")

    inv = await client.post(
        "/api/v1/pharmacy/inventory",
        headers=h,
        json={
            "medicine_name": "TestMed",
            "batch_number": "BATCH-TEST",
            "quantity": 100,
            "expiry_date": "2027-12-31",
            "supplier": "Test Supplier",
            "price": 9.99,
        },
    )
    await _assert_ok(inv, "POST /pharmacy/inventory")

    fulfillment = (await client.get("/api/v1/pharmacy/fulfillment", headers=h)).json()
    if fulfillment:
        fid = fulfillment[0]["_id"]
        adv = await client.post(f"/api/v1/pharmacy/fulfillment/{fid}/advance", headers=h)
        await _assert_ok(adv, "POST /pharmacy/fulfillment/{id}/advance")

    po = await client.post(
        "/api/v1/pharmacy/purchase-orders",
        headers=h,
        json={
            "supplier": "Test Supplier",
            "items": [{"name": "Aspirin", "quantity": 50, "unit_price": 2.5}],
            "order_date": "2026-01-01",
            "expected_delivery": "2026-01-15",
        },
    )
    await _assert_ok(po, "POST /pharmacy/purchase-orders")

    orders = (await client.get("/api/v1/pharmacy/orders", headers=h)).json()
    if orders:
        oid = orders[0]["_id"]
        status_patch = await client.patch(
            f"/api/v1/pharmacy/orders/{oid}/status",
            headers=h,
            params={"status_value": "confirmed"},
        )
        await _assert_ok(status_patch, "PATCH /pharmacy/orders/{id}/status")

    returns = (await client.get("/api/v1/pharmacy/returns", headers=h)).json()
    if returns:
        rid = returns[0]["_id"]
        ret_patch = await client.patch(
            f"/api/v1/pharmacy/returns/{rid}/status",
            headers=h,
            params={"status_value": "approved"},
        )
        await _assert_ok(ret_patch, "PATCH /pharmacy/returns/{id}/status")


@pytest.mark.asyncio
async def test_lab_tech_endpoints(client):
    token = await _login(client, "lab_tech")
    h = _auth(token)

    for path in (
        "/api/v1/lab/reports",
        "/api/v1/lab/catalog",
        "/api/v1/lab/samples",
        "/api/v1/lab/equipment",
        "/api/v1/lab/appointments",
        "/api/v1/lab/tests",
        "/api/v1/notifications",
    ):
        response = await client.get(path, headers=h)
        await _assert_ok(response, f"GET {path}")

    catalog = await client.post(
        "/api/v1/lab/catalog",
        headers=h,
        json={
            "name": "Test Panel",
            "category": "Blood",
            "price": 49.99,
            "turnaround": "24h",
            "sample_type": "Blood",
        },
    )
    await _assert_ok(catalog, "POST /lab/catalog")

    samples = (await client.get("/api/v1/lab/samples", headers=h)).json()
    if samples:
        sid = samples[0]["_id"]
        adv = await client.post(f"/api/v1/lab/samples/{sid}/advance", headers=h)
        await _assert_ok(adv, "POST /lab/samples/{id}/advance")
        scan = await client.post(
            "/api/v1/lab/samples/scan",
            headers=h,
            json={"sample_id": samples[0].get("sample_id")},
        )
        await _assert_ok(scan, "POST /lab/samples/scan")

    equipment = (await client.get("/api/v1/lab/equipment", headers=h)).json()
    if equipment:
        eid = equipment[0]["_id"]
        qc = await client.post(f"/api/v1/lab/equipment/{eid}/run-qc", headers=h)
        await _assert_ok(qc, "POST /lab/equipment/{id}/run-qc")

    reports = (await client.get("/api/v1/lab/reports", headers=h)).json()
    if reports:
        rid = reports[0]["_id"]
        patch = await client.patch(
            f"/api/v1/lab/reports/{rid}",
            headers=h,
            json={"doctor_notes": "Reviewed in automated test"},
        )
        await _assert_ok(patch, "PATCH /lab/reports/{id}")


@pytest.mark.asyncio
async def test_receptionist_endpoints(client):
    token = await _login(client, "receptionist")
    h = _auth(token)

    for path in (
        "/api/v1/appointments",
        "/api/v1/beds",
        "/api/v1/lab/appointments",
        "/api/v1/notifications",
    ):
        response = await client.get(path, headers=h)
        await _assert_ok(response, f"GET {path}")

    doctors = (await client.get("/api/v1/doctors")).json()
    patients = (await client.get("/api/v1/users/patients", headers=h)).json()
    if doctors and patients:
        book = await client.post(
            "/api/v1/appointments",
            headers=h,
            json={
                "doctor_id": doctors[0]["_id"],
                "patient_id": patients[0]["_id"],
                "date": "2026-08-01",
                "time": "10:00",
                "reason": "Receptionist booked appointment",
            },
        )
        await _assert_ok(book, "POST /appointments (receptionist)")


@pytest.mark.asyncio
async def test_nurse_endpoints(client):
    token = await _login(client, "nurse")
    h = _auth(token)

    beds = await client.get("/api/v1/beds", headers=h)
    await _assert_ok(beds, "GET /beds (nurse)")

    tasks = await client.get("/api/v1/nurse/tasks", headers=h)
    await _assert_ok(tasks, "GET /nurse/tasks")

    task_list = tasks.json()
    if task_list:
        tid = task_list[0]["_id"]
        complete = await client.patch(f"/api/v1/nurse/tasks/{tid}/complete", headers=h)
        await _assert_ok(complete, "PATCH /nurse/tasks/{id}/complete")

    notes = await client.get("/api/v1/medical-notes", headers=h)
    await _assert_ok(notes, "GET /medical-notes (nurse)")


@pytest.mark.asyncio
async def test_supplier_endpoints(client):
    token = await _login(client, "supplier")
    h = _auth(token)

    products = await client.get("/api/v1/supplier/products", headers=h)
    await _assert_ok(products, "GET /supplier/products")

    orders = await client.get("/api/v1/supplier/orders", headers=h)
    await _assert_ok(orders, "GET /supplier/orders")

    notifs = await client.get("/api/v1/notifications", headers=h)
    await _assert_ok(notifs, "GET /notifications (supplier)")


@pytest.mark.asyncio
async def test_admin_user_crud(client):
    token = await _login(client, "admin")
    h = _auth(token)

    create = await client.post(
        "/api/v1/users",
        headers=h,
        json={
            "email": "crud-test-user@demo.com",
            "password": "demo123",
            "name": "CRUD Test User",
            "role": "receptionist",
        },
    )
    if create.status_code == 409:
        users = (await client.get("/api/v1/users", headers=h)).json()
        user = next((u for u in users if u["email"] == "crud-test-user@demo.com"), None)
        assert user, "Expected existing CRUD test user"
        user_id = user["_id"]
    else:
        await _assert_ok(create, "POST /users")
        user_id = create.json()["_id"]

    get_user = await client.get(f"/api/v1/users/{user_id}", headers=h)
    await _assert_ok(get_user, "GET /users/{id}")

    update = await client.patch(f"/api/v1/users/{user_id}", headers=h, json={"name": "CRUD Updated"})
    await _assert_ok(update, "PATCH /users/{id}")

    delete = await client.delete(f"/api/v1/users/{user_id}", headers=h)
    await _assert_ok(delete, "DELETE /users/{id}")


@pytest.mark.asyncio
async def test_auth_signup(client):
    import uuid

    email = f"signup-test-{uuid.uuid4().hex[:8]}@demo.com"
    response = await client.post(
        "/api/v1/auth/signup",
        json={"name": "Signup Test", "email": email, "password": "demo123"},
    )
    await _assert_ok(response, "POST /auth/signup")
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_unauthorized_access_rejected(client):
    protected = (
        "/api/v1/auth/me",
        "/api/v1/users",
        "/api/v1/appointments",
        "/api/v1/pharmacy/inventory",
    )
    for path in protected:
        response = await client.get(path)
        assert response.status_code in (401, 403), f"{path} should require auth: got {response.status_code}"
