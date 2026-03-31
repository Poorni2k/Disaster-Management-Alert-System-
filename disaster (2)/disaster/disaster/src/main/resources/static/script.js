// =========================================
// FINAL SCRIPT.JS - DISASTER MANAGEMENT SYSTEM
// =========================================

// -----------------------------
// BACKEND BASE URL
// -----------------------------
const API_BASE = "http://localhost:8080/api";

// -----------------------------
// ALL 38 TAMIL NADU DISTRICT COORDINATES
// -----------------------------
const districtCoordinates = {
    "Ariyalur": { lat: 11.1401, lng: 79.0786 },
    "Chengalpattu": { lat: 12.6841, lng: 79.9836 },
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Cuddalore": { lat: 11.7447, lng: 79.7680 },
    "Dharmapuri": { lat: 12.1277, lng: 78.1579 },
    "Dindigul": { lat: 10.3673, lng: 77.9803 },
    "Erode": { lat: 11.3410, lng: 77.7172 },
    "Kallakurichi": { lat: 11.7380, lng: 78.9630 },
    "Kanchipuram": { lat: 12.8342, lng: 79.7036 },
    "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
    "Karur": { lat: 10.9601, lng: 78.0766 },
    "Krishnagiri": { lat: 12.5186, lng: 78.2137 },
    "Madurai": { lat: 9.9252, lng: 78.1198 },
    "Mayiladuthurai": { lat: 11.1035, lng: 79.6550 },
    "Nagapattinam": { lat: 10.7656, lng: 79.8428 },
    "Namakkal": { lat: 11.2189, lng: 78.1674 },
    "Nilgiris": { lat: 11.4064, lng: 76.6932 },
    "Perambalur": { lat: 11.2333, lng: 78.8833 },
    "Pudukkottai": { lat: 10.3797, lng: 78.8208 },
    "Ramanathapuram": { lat: 9.3716, lng: 78.8308 },
    "Ranipet": { lat: 12.9273, lng: 79.3330 },
    "Salem": { lat: 11.6643, lng: 78.1460 },
    "Sivaganga": { lat: 9.8470, lng: 78.4836 },
    "Tenkasi": { lat: 8.9591, lng: 77.3152 },
    "Thanjavur": { lat: 10.7867, lng: 79.1378 },
    "Theni": { lat: 10.0104, lng: 77.4768 },
    "Thoothukudi": { lat: 8.7642, lng: 78.1348 },
    "Tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
    "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
    "Tirupathur": { lat: 12.4954, lng: 78.5678 },
    "Tiruppur": { lat: 11.1085, lng: 77.3411 },
    "Tiruvallur": { lat: 13.1439, lng: 79.9087 },
    "Tiruvannamalai": { lat: 12.2253, lng: 79.0747 },
    "Tiruvarur": { lat: 10.7722, lng: 79.6368 },
    "Vellore": { lat: 12.9165, lng: 79.1325 },
    "Viluppuram": { lat: 11.9390, lng: 79.4861 },
    "Virudhunagar": { lat: 9.5851, lng: 77.9579 }
};

// -----------------------------
// LOGOUT
// -----------------------------
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// -----------------------------
// ROLE NORMALIZER
// -----------------------------
function normalizeRole(role) {
    if (!role) return "CITIZEN";

    const r = role.toString().trim().toUpperCase();

    if (r === "ADMIN" || r === "ROLE_ADMIN") return "ADMIN";
    if (r === "CITIZEN" || r === "USER" || r === "ROLE_USER" || r === "ROLE_CITIZEN") return "CITIZEN";

    return "CITIZEN";
}

// -----------------------------
// SEVERITY HELPERS
// -----------------------------
function getSeverityBadge(severity) {
    const s = (severity || "").toUpperCase();

    if (s === "HIGH") {
        return `<span class="severity-badge high-badge">HIGH</span>`;
    } else if (s === "MEDIUM") {
        return `<span class="severity-badge medium-badge">MEDIUM</span>`;
    } else {
        return `<span class="severity-badge low-badge">LOW</span>`;
    }
}

function getSeverityClass(severity) {
    const s = (severity || "").toUpperCase();

    if (s === "HIGH") return "high";
    if (s === "MEDIUM") return "medium";
    return "low";
}

// -----------------------------
// LOCAL STORAGE ALERT HELPERS
// -----------------------------
function getLocalAlerts() {
    const alerts = localStorage.getItem("localAlerts");
    return alerts ? JSON.parse(alerts) : [];
}

function saveLocalAlerts(alerts) {
    localStorage.setItem("localAlerts", JSON.stringify(alerts));
}

function addLocalAlert(alertData) {
    const alerts = getLocalAlerts();
    const newAlert = {
        id: Date.now(),
        title: alertData.title,
        type: alertData.type,
        district: alertData.district,
        severity: alertData.severity,
        message: alertData.message,
        username: alertData.username || "admin"
    };
    alerts.unshift(newAlert);
    saveLocalAlerts(alerts);
}

function deleteLocalAlertById(id) {
    const alerts = getLocalAlerts().filter(alert => alert.id != id);
    saveLocalAlerts(alerts);
}

// -----------------------------
// GET ALL ALERTS (BACKEND + LOCAL FALLBACK)
// -----------------------------
async function getAllAlerts() {
    try {
        const response = await fetch(`${API_BASE}/alerts`);

        if (response.ok) {
            const backendAlerts = await response.json();
            const localAlerts = getLocalAlerts();
            return [...localAlerts, ...backendAlerts];
        } else {
            return getLocalAlerts();
        }
    } catch (error) {
        console.error("Fetch Alerts Error:", error);
        return getLocalAlerts();
    }
}

// -----------------------------
// REGISTER PAGE
// -----------------------------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("regUsername").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const role = document.getElementById("regRole").value;
        const registerMsg = document.getElementById("registerMsg");

        if (!username || !password || !role) {
            registerMsg.innerText = "Please fill all fields!";
            registerMsg.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role })
            });

            const text = await response.text();

            if (response.ok) {
                registerMsg.innerText = text || "Registration successful!";
                registerMsg.style.color = "lightgreen";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            } else {
                registerMsg.innerText = text || "Registration failed!";
                registerMsg.style.color = "red";
            }
        } catch (error) {
            console.error("Register Error:", error);
            registerMsg.innerText = "Backend connection failed!";
            registerMsg.style.color = "red";
        }
    });
}

// -----------------------------
// LOGIN PAGE
// -----------------------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const loginMsg = document.getElementById("loginMsg");

        if (!username || !password) {
            loginMsg.innerText = "Please fill all fields!";
            loginMsg.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const text = await response.text();
            let result = {};

            try {
                result = JSON.parse(text);
            } catch {
                result = { message: text };
            }

            if (response.ok) {
                let finalRole = normalizeRole(result.role);

                if (!result.role && username.toLowerCase() === "admin") {
                    finalRole = "ADMIN";
                }

                localStorage.setItem("username", result.username || username);
                localStorage.setItem("role", finalRole);

                loginMsg.innerText = result.message || "Login successful!";
                loginMsg.style.color = "lightgreen";

                setTimeout(() => {
                    if (finalRole === "ADMIN") {
                        window.location.href = "admin-dashboard.html";
                    } else {
                        window.location.href = "citizen-dashboard.html";
                    }
                }, 800);
            } else {
                loginMsg.innerText = result.message || "Invalid username or password!";
                loginMsg.style.color = "red";
            }
        } catch (error) {
            console.error("Login Error:", error);
            loginMsg.innerText = "Backend connection failed!";
            loginMsg.style.color = "red";
        }
    });
}

// -----------------------------
// ADMIN DASHBOARD CHECK
// -----------------------------
if (document.getElementById("welcomeAdmin")) {
    const username = localStorage.getItem("username") || "Admin";
    const role = normalizeRole(localStorage.getItem("role"));

    if (role !== "ADMIN") {
        window.location.href = "login.html";
    } else {
        document.getElementById("welcomeAdmin").innerText = `Welcome, ${username} (Admin)`;
        loadAdminAlerts();
    }
}

// -----------------------------
// CITIZEN DASHBOARD CHECK
// -----------------------------
if (document.getElementById("welcomeCitizen")) {
    const username = localStorage.getItem("username") || "Citizen";
    const role = normalizeRole(localStorage.getItem("role"));

    if (role === "ADMIN") {
        window.location.href = "admin-dashboard.html";
    } else {
        document.getElementById("welcomeCitizen").innerText = `Welcome, ${username} (Citizen)`;
        loadCitizenAlerts();

        // auto refresh every 5 sec
        setInterval(loadCitizenAlerts, 5000);
    }
}

// -----------------------------
// ADMIN CREATE ALERT
// -----------------------------
const alertForm = document.getElementById("alertForm");

if (alertForm) {
    alertForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const title = document.getElementById("alertTitle").value.trim();
        const type = document.getElementById("alertType").value;
        const district = document.getElementById("alertDistrict").value;
        const severity = document.getElementById("alertSeverity").value;
        const message = document.getElementById("alertMessage").value.trim();
        const alertMsg = document.getElementById("alertMsg");
        const username = localStorage.getItem("username") || "admin";

        if (!title || !type || !district || !severity || !message) {
            alertMsg.innerText = "Please fill all alert fields!";
            alertMsg.style.color = "red";
            return;
        }

        const alertData = { title, type, district, severity, message, username };

        try {
            const response = await fetch(`${API_BASE}/alerts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alertData)
            });

            const text = await response.text();
            console.log("Create Alert Response:", text);

            if (response.ok) {
                alertMsg.innerText = text || "Alert created successfully!";
                alertMsg.style.color = "lightgreen";
                alertForm.reset();
                loadAdminAlerts();
            } else {
                addLocalAlert(alertData);
                alertMsg.innerText = "Alert saved locally (backend POST failed, demo mode active)!";
                alertMsg.style.color = "orange";
                alertForm.reset();
                loadAdminAlerts();
            }

        } catch (error) {
            console.error("Create Alert Error:", error);
            addLocalAlert(alertData);
            alertMsg.innerText = "Alert saved locally (backend connection failed, demo mode active)!";
            alertMsg.style.color = "orange";
            alertForm.reset();
            loadAdminAlerts();
        }
    });
}

// -----------------------------
// LOAD ADMIN ALERTS
// -----------------------------
async function loadAdminAlerts() {
    const adminAlertTableBody = document.getElementById("adminAlertTableBody");
    if (!adminAlertTableBody) return;

    const alerts = await getAllAlerts();

    adminAlertTableBody.innerHTML = "";

    let high = 0;
    let medium = 0;
    let low = 0;

    alerts.forEach((alert) => {
        const sev = (alert.severity || "").toUpperCase();

        if (sev === "HIGH") high++;
        else if (sev === "MEDIUM") medium++;
        else low++;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${alert.id ?? "-"}</td>
            <td>${alert.title ?? "-"}</td>
            <td>${alert.type ?? "-"}</td>
            <td>${alert.district ?? "-"}</td>
            <td>${getSeverityBadge(alert.severity)}</td>
            <td>${alert.message ?? "-"}</td>
            <td>${alert.username ?? "admin"}</td>
            <td><button class="delete-btn" onclick="deleteAlert(${alert.id})">Delete</button></td>
        `;
        adminAlertTableBody.appendChild(row);
    });

    const totalAlerts = document.getElementById("totalAlerts");
    const highAlerts = document.getElementById("highAlerts");
    const mediumAlerts = document.getElementById("mediumAlerts");
    const lowAlerts = document.getElementById("lowAlerts");

    if (totalAlerts) totalAlerts.innerText = alerts.length;
    if (highAlerts) highAlerts.innerText = high;
    if (mediumAlerts) mediumAlerts.innerText = medium;
    if (lowAlerts) lowAlerts.innerText = low;

    updateAlertMap(alerts);
}

// -----------------------------
// DELETE ALERT
// -----------------------------
async function deleteAlert(id) {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    let deleted = false;

    try {
        const response = await fetch(`${API_BASE}/alerts/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            deleted = true;
        }
    } catch (error) {
        console.error("Delete Backend Error:", error);
    }

    deleteLocalAlertById(id);

    if (!deleted) {
        alert("Alert deleted locally (backend delete may not exist).");
    } else {
        alert("Alert deleted successfully!");
    }

    loadAdminAlerts();
}

// -----------------------------
// LOAD CITIZEN ALERTS
// -----------------------------
async function loadCitizenAlerts() {
    const citizenAlertTableBody = document.getElementById("citizenAlertTableBody");
    const alertCardsContainer = document.getElementById("citizenAlertCards");

    const alerts = await getAllAlerts();

    // ALERT CARDS
    if (alertCardsContainer) {
        alertCardsContainer.innerHTML = "";

        if (alerts.length === 0) {
            alertCardsContainer.innerHTML = `
                <div class="alert-card low">
                    <h3>No Active Alerts</h3>
                    <p><strong>Status:</strong> Safe</p>
                    <p><strong>Message:</strong> There are currently no active disaster alerts.</p>
                </div>
            `;
        } else {
            alerts.forEach((alert) => {
                const card = document.createElement("div");
                card.className = `alert-card ${getSeverityClass(alert.severity)}`;
                card.innerHTML = `
                    <h3>${alert.title ?? "Alert"}</h3>
                    <p><strong>Type:</strong> ${alert.type ?? "-"}</p>
                    <p><strong>District:</strong> ${alert.district ?? "-"}</p>
                    <p><strong>Severity:</strong> ${alert.severity ?? "-"}</p>
                    <p><strong>Message:</strong> ${alert.message ?? "-"}</p>
                    <p><strong>Created By:</strong> ${alert.username ?? "admin"}</p>
                `;
                alertCardsContainer.appendChild(card);
            });
        }
    }

    // TABLE
    if (citizenAlertTableBody) {
        citizenAlertTableBody.innerHTML = "";

        alerts.forEach((alert) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${alert.title ?? "-"}</td>
                <td>${alert.type ?? "-"}</td>
                <td>${alert.district ?? "-"}</td>
                <td>${getSeverityBadge(alert.severity)}</td>
                <td>${alert.message ?? "-"}</td>
                <td>${alert.username ?? "admin"}</td>
            `;
            citizenAlertTableBody.appendChild(row);
        });
    }
}

// -----------------------------
// ADMIN MAP UPDATE
// -----------------------------
function updateAlertMap(alerts) {
    const mapFrame = document.getElementById("alertMapFrame");
    const mapInfo = document.getElementById("mapInfo");

    if (!mapFrame) return;

    if (!alerts || alerts.length === 0) {
        mapFrame.src = "https://www.google.com/maps?q=Tamil+Nadu&output=embed";
        if (mapInfo) mapInfo.innerText = "No active alerts. Showing Tamil Nadu map.";
        return;
    }

    const latestAlert = alerts[0];
    const district = latestAlert.district || "Tamil Nadu";

    if (districtCoordinates[district]) {
        const coords = districtCoordinates[district];
        mapFrame.src = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=10&output=embed`;
    } else {
        mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(district)}&output=embed`;
    }

    if (mapInfo) {
        mapInfo.innerText = `Showing latest alerted area: ${district}`;
    }
}