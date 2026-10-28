/**
 * IEDC-CETLY Growspace Workspace & Logbook
 * --------------------------------------------------------------------------
 * Features:
 * 1. Digital Logbook Form with live entry & exit time calculations.
 * 2. Google Sheets Integration via Google Apps Script Web App.
 * 3. Local fallback persistence in localStorage for recent check-ins.
 * 4. Responsive mobile navigation & live clock display.
 * --------------------------------------------------------------------------
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
const GROWSPACE_CONFIG = {
  // Connected Google Sheet ID & URL
  sheetId: "1GIyxyBwqo2ymGv2ud5oguk4H4_jHqWn9Fg2TtsTQI4E",
  sheetUrl: "https://docs.google.com/spreadsheets/d/1GIyxyBwqo2ymGv2ud5oguk4H4_jHqWn9Fg2TtsTQI4E/edit?usp=sharing",

  // Google Apps Script Web App URL for submitting new entries directly to Google Sheets:
  scriptUrl: "https://script.google.com/macros/s/AKfycbyuReZ1-8RGxYGXWAm2AOmqFVn7vupx1S8OPiErPXeLVBRAiqrX2G2coYfq6oIN7_LmYg/exec",

  // Enable fallback to browser localStorage for offline logging & instant previews
  enableLocalStorage: true,

  // Maximum recent check-ins to store locally
  maxLocalEntries: 20
};

// =============================================================================
// READY EVENT LISTENER
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initLiveClock();
  initMobileNav();
  initLogbookForm();
  initRecentCheckins();
});

// =============================================================================
// 1. LIVE CLOCK
// =============================================================================
function initLiveClock() {
  const clockTimeEl = document.getElementById("live-clock-time");
  const clockDateEl = document.getElementById("live-clock-date");
  if (!clockTimeEl || !clockDateEl) return;

  function updateClock() {
    const now = new Date();
    clockTimeEl.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    clockDateEl.textContent = now.toLocaleDateString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    }).toUpperCase();
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// =============================================================================
// 2. MOBILE NAVIGATION
// =============================================================================
function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navActions = document.getElementById("nav-actions");

  if (!navToggle || !navActions) return;

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    navToggle.classList.toggle("active");
    navActions.classList.toggle("active");
  });

  navActions.querySelectorAll("a, button").forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.classList.remove("active");
        navActions.classList.remove("active");
      }
    });
  });
}

// =============================================================================
// 3. LOGBOOK FORM & CALCULATION ENGINE
// =============================================================================
function initLogbookForm() {
  const form = document.getElementById("growspace-logbook-form");
  const successCard = document.getElementById("logbook-success-card");
  const logAgainBtn = document.getElementById("btn-log-again");
  const submitBtn = document.getElementById("log-submit");

  // Inputs
  const nameInput = document.getElementById("log-name");
  const deptInput = document.getElementById("log-department");
  const rollInput = document.getElementById("log-rollno");
  const semesterInput = document.getElementById("log-semester");
  const classInput = document.getElementById("log-class");
  const entryTimeInput = document.getElementById("log-entry-time");
  const hoursInput = document.getElementById("log-hours");
  const purposeInput = document.getElementById("log-purpose");
  const chipsContainer = document.getElementById("duration-chips");

  // Preview elements
  const previewEntry = document.getElementById("preview-entry-val");
  const previewExit = document.getElementById("preview-exit-val");
  const previewDuration = document.getElementById("preview-duration-val");

  if (!form) return;

  // Set default entry time to current local datetime
  function setCurrentEntryTime() {
    const now = new Date();
    // format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    entryTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  setCurrentEntryTime();

  // Helper: Format readable date and time
  function formatHumanTime(date) {
    if (!date || isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  function formatHumanDateTime(date) {
    if (!date || isNaN(date.getTime())) return "--";
    const datePart = date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    const timePart = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${datePart}, ${timePart}`;
  }

  // Update calculated Exit Time in real time
  function updateCalculatedTimes() {
    let entryVal = entryTimeInput.value;
    let entryDate = entryVal ? new Date(entryVal) : new Date();

    if (isNaN(entryDate.getTime())) {
      entryDate = new Date();
    }

    let hours = parseFloat(hoursInput.value);
    if (isNaN(hours) || hours <= 0) {
      hours = 1.0;
    }

    const exitDate = new Date(entryDate.getTime() + (hours * 60 * 60 * 1000));

    if (previewEntry) previewEntry.textContent = formatHumanTime(entryDate);
    if (previewExit) previewExit.textContent = formatHumanTime(exitDate);
    if (previewDuration) previewDuration.textContent = `${hours.toFixed(1)} hrs`;

    return {
      entryDate,
      exitDate,
      hours,
      entryFormatted: formatHumanDateTime(entryDate),
      exitFormatted: formatHumanDateTime(exitDate)
    };
  }

  // Initial calculation
  updateCalculatedTimes();

  // Event listeners for recalculation
  entryTimeInput.addEventListener("input", updateCalculatedTimes);
  hoursInput.addEventListener("input", () => {
    // sync chip active state
    const currentVal = parseFloat(hoursInput.value);
    if (chipsContainer) {
      chipsContainer.querySelectorAll(".duration-chip").forEach(chip => {
        const chipVal = parseFloat(chip.dataset.hours);
        chip.classList.toggle("active", chipVal === currentVal);
      });
    }
    updateCalculatedTimes();
  });

  // Duration preset chips
  if (chipsContainer) {
    chipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".duration-chip");
      if (!chip) return;
      const hours = chip.dataset.hours;
      hoursInput.value = hours;
      chipsContainer.querySelectorAll(".duration-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      updateCalculatedTimes();
    });
  }

  // Validation helpers
  function setFieldError(inputEl, errorId, msg) {
    inputEl.classList.add("invalid");
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = msg;
    return false;
  }

  function clearFieldError(inputEl, errorId) {
    inputEl.classList.remove("invalid");
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = "";
  }

  // Clear errors on input
  [nameInput, deptInput, rollInput, semesterInput, classInput].forEach(el => {
    if (!el) return;
    el.addEventListener("input", () => {
      el.classList.remove("invalid");
      const errEl = el.parentElement.querySelector(".field-error");
      if (errEl) errEl.textContent = "";
    });
  });

  // Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    const name = nameInput.value.trim();
    const department = deptInput.value.trim();
    const rollNo = rollInput.value.trim().toUpperCase();
    const semester = semesterInput.value.trim();
    const classBatch = classInput.value.trim().toUpperCase();
    const classSemester = `${semester} ${classBatch}`.trim();
    const purpose = purposeInput ? purposeInput.value.trim() : "";

    if (!name) isValid = setFieldError(nameInput, "err-name", "Name is required");
    else clearFieldError(nameInput, "err-name");

    if (!department) isValid = setFieldError(deptInput, "err-dept", "Please select a department");
    else clearFieldError(deptInput, "err-dept");

    if (!rollNo) isValid = setFieldError(rollInput, "err-roll", "Roll number is required");
    else clearFieldError(rollInput, "err-roll");

    if (!semester) isValid = setFieldError(semesterInput, "err-class", "Select semester");
    else clearFieldError(semesterInput, "err-class");

    if (!classBatch) isValid = setFieldError(classInput, "err-class", "Enter class / batch");
    else clearFieldError(classInput, "err-class");

    if (!isValid) return;

    const times = updateCalculatedTimes();

    const entryRecord = {
      id: "LOG-" + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toISOString(),
      name,
      department,
      rollNo,
      classSemester,
      entryTime: times.entryFormatted,
      exitTime: times.exitFormatted,
      hoursStayed: times.hours,
      purpose: purpose || "General Workspace / Projects"
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>RECORDING ENTRY...</span>`;

    let sheetSuccess = false;

    // Send to Google Sheets if endpoint is configured
    if (GROWSPACE_CONFIG.scriptUrl) {
      try {
        await submitToGoogleSheet(entryRecord);
        sheetSuccess = true;
      } catch (err) {
        console.warn("Google Sheets submission notice:", err);
      }
    } else {
      console.info("Growspace: Google Sheet URL not yet configured. Storing in local session.");
    }

    // Save to local storage
    if (GROWSPACE_CONFIG.enableLocalStorage) {
      saveLocalEntry(entryRecord);
      renderRecentCheckins();
    }

    // Show Success Card with Receipt
    showReceipt(entryRecord, sheetSuccess || !GROWSPACE_CONFIG.scriptUrl);

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>RECORD LOGBOOK ENTRY →</span>`;
  });

  function showReceipt(record, isSynced) {
    form.hidden = true;
    successCard.hidden = false;

    document.getElementById("receipt-name").textContent = record.name;
    document.getElementById("receipt-dept").textContent = record.department;
    document.getElementById("receipt-roll").textContent = record.rollNo;
    document.getElementById("receipt-class").textContent = record.classSemester;
    document.getElementById("receipt-entry").textContent = record.entryTime;
    document.getElementById("receipt-exit").textContent = record.exitTime;
    document.getElementById("receipt-hours").textContent = `${record.hoursStayed} Hours`;

    const statusNote = document.getElementById("success-status-note");
    if (statusNote) {
      if (GROWSPACE_CONFIG.scriptUrl) {
        statusNote.innerHTML = `<span>✓ Logged to Google Sheet & Local Register</span>`;
      } else {
        statusNote.innerHTML = `<span>✓ Logged Locally (Connect Google Sheet in growspace.js to sync)</span>`;
      }
    }

    successCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Reset to form
  if (logAgainBtn) {
    logAgainBtn.addEventListener("click", () => {
      form.hidden = false;
      successCard.hidden = true;
      form.reset();
      setCurrentEntryTime();
      hoursInput.value = "1.0";
      if (chipsContainer) {
        chipsContainer.querySelectorAll(".duration-chip").forEach(c => {
          c.classList.toggle("active", c.dataset.hours === "1.0");
        });
      }
      updateCalculatedTimes();
      nameInput.focus();
    });
  }
}

// =============================================================================
// 4. GOOGLE SHEETS DISPATCHER
// =============================================================================
async function submitToGoogleSheet(data) {
  // Using POST with text/plain body to avoid CORS preflight limitations on Google Apps Script
  const response = await fetch(GROWSPACE_CONFIG.scriptUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });
  return response;
}

// =============================================================================
// 5. LOCAL STORAGE RECENT ENTRIES (24-HOUR AUTO-PURGE RETENTION)
// =============================================================================
const STORAGE_KEY = "iedc_growspace_logbook";
const RETENTION_MS = 24 * 60 * 60 * 1000; // 24 hours

function parseSheetTimestamp(raw) {
  if (!raw) return null;
  const str = String(raw).trim();

  // GViz format: Date(YYYY, M, D, H, M, S)
  const gvizMatch = str.match(/Date\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+),\s*(\d+)(?:,\s*(\d+))?)?\)/);
  if (gvizMatch) {
    const y = parseInt(gvizMatch[1], 10);
    const m = parseInt(gvizMatch[2], 10);
    const d = parseInt(gvizMatch[3], 10);
    const h = gvizMatch[4] ? parseInt(gvizMatch[4], 10) : 0;
    const min = gvizMatch[5] ? parseInt(gvizMatch[5], 10) : 0;
    const s = gvizMatch[6] ? parseInt(gvizMatch[6], 10) : 0;
    return new Date(y, m, d, h, min, s);
  }

  // Standard ISO or date string
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }

  // "DD/MM/YYYY HH:mm:ss" or "DD-MM-YYYY HH:mm:ss"
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10) - 1;
    const y = parseInt(dmyMatch[3], 10);
    const h = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
    const min = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
    const s = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;
    return new Date(y, m, d, h, min, s);
  }

  return null;
}

function getLocalEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries = JSON.parse(raw);
    if (!Array.isArray(entries)) return [];

    const now = Date.now();
    // Prune entries older than 24 hours
    const activeEntries = entries.filter(e => {
      if (!e.timestamp) return true;
      const t = new Date(e.timestamp).getTime();
      return !isNaN(t) && (now - t) < RETENTION_MS;
    });

    // If any old entries were deleted, update localStorage immediately
    if (activeEntries.length !== entries.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeEntries));
    }

    return activeEntries;
  } catch (_) {
    return [];
  }
}

function saveLocalEntry(entry) {
  try {
    const entries = getLocalEntries();
    entries.unshift(entry);
    if (entries.length > GROWSPACE_CONFIG.maxLocalEntries) {
      entries.pop();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error("Failed to save entry to localStorage:", err);
  }
}

function renderEntriesList(entries) {
  const tableBody = document.getElementById("recent-checkins-body");
  const countBadge = document.getElementById("today-count-badge");
  if (!tableBody) return;

  if (countBadge) {
    countBadge.textContent = `${entries.length} SESSIONS (LAST 24H)`;
  }

  if (entries.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="table-empty font-mono">
          // NO CHECK-INS IN THE PAST 24 HOURS. ENTER YOUR LOGBOOK SESSION ABOVE.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = entries.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td>${escapeHtml(item.department)}</td>
      <td>${escapeHtml(item.rollNo)}</td>
      <td>${escapeHtml(item.classSemester)}</td>
      <td>${escapeHtml(item.entryTime)}</td>
      <td style="color: var(--color-green-light); font-weight: 700;">${escapeHtml(item.exitTime)} (${item.hoursStayed}h)</td>
    </tr>
  `).join("");
}

async function fetchGoogleSheetEntries() {
  if (!GROWSPACE_CONFIG.sheetId) return [];

  const url = `https://docs.google.com/spreadsheets/d/${GROWSPACE_CONFIG.sheetId}/gviz/tq?tqx=out:json&_nc=${Date.now()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1) return [];

    const json = JSON.parse(text.substring(startIdx, endIdx + 1));
    const table = json.table;
    if (!table || !table.rows) return [];

    const sheetEntries = [];
    const now = Date.now();
    const startIndex = (table.rows.length > 0 && table.rows[0].c && table.rows[0].c[1] && table.rows[0].c[1].v === "Student Name") ? 1 : 0;

    for (let i = startIndex; i < table.rows.length; i++) {
      const row = table.rows[i];
      if (!row || !row.c) continue;
      const getVal = (idx) => (row.c[idx] && row.c[idx].v !== null && row.c[idx].v !== undefined) ? String(row.c[idx].v) : "";

      const name = getVal(1);
      if (!name) continue; // skip blank rows

      // Verify 24-hour retention window
      const rawTimestamp = row.c[0] ? (row.c[0].f || row.c[0].v || "") : "";
      if (rawTimestamp) {
        const entryDate = parseSheetTimestamp(rawTimestamp);
        if (entryDate && (now - entryDate.getTime()) > RETENTION_MS) {
          // Entry is older than 24 hours: do not show
          continue;
        }
      }

      sheetEntries.unshift({
        timestamp: rawTimestamp,
        name: name,
        department: getVal(2),
        rollNo: getVal(3),
        classSemester: getVal(4),
        entryTime: getVal(5),
        exitTime: getVal(6),
        hoursStayed: getVal(7),
        purpose: getVal(8)
      });
    }
    return sheetEntries;
  } catch (err) {
    console.warn("Failed to fetch live Google Sheet entries:", err);
    return [];
  }
}

async function renderRecentCheckins() {
  const localEntries = getLocalEntries();
  renderEntriesList(localEntries);

  if (GROWSPACE_CONFIG.sheetId) {
    const sheetEntries = await fetchGoogleSheetEntries();
    if (sheetEntries.length > 0) {
      // Merge unique entries by name + entryTime + rollNo
      const combined = [...sheetEntries];
      localEntries.forEach(loc => {
        const exists = combined.some(s => s.rollNo === loc.rollNo && s.entryTime === loc.entryTime);
        if (!exists) combined.unshift(loc);
      });
      renderEntriesList(combined);
    }
  }
}

function initRecentCheckins() {
  renderRecentCheckins();

  // Automatically refresh and prune entries every 60 seconds
  setInterval(renderRecentCheckins, 60000);

  const clearBtn = document.getElementById("btn-clear-local");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear local device check-in history? (Google Sheet records remain untouched)")) {
        localStorage.removeItem(STORAGE_KEY);
        renderRecentCheckins();
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
