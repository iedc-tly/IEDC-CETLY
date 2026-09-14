/**
 * IEDC-CETLY Dynamic Events Loader (Google Sheets Integration)
 *
 * Fetches event data in real-time from a public Google Sheet without requiring any API keys.
 * Anyone with edit access to the Google Sheet can add, edit, or remove events instantly.
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
const EVENTS_CONFIG = {
  // Google Sheet ID (from the sheet URL: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit)
  // Replace with your own Google Sheet ID when ready.
  // Leave empty or set to sample ID to use built-in fallback events.
  sheetId: "1gIk1SA39jaCySE1rlRcqGhKXZa1ep65XU4KUzmg79C4",

  // Sheet/Tab Name (optional, defaults to first sheet)
  sheetName: "Events",

  // Enable automatic categorization: if status is empty, compare event date with today
  autoCategorizeByDate: true,

  // Default fallback events displayed when sheet is loading, offline, or not yet configured
  fallbackEvents: [
    {
      title: "HACK-CET 2026",
      date: "AUG 25, 2026",
      description: "A 24-hour campus hackathon focused on solving real-world challenges through technology, creativity, and teamwork.",
      location: "CET THALASSERY",
      status: "upcoming",
      link: "#",
      buttonText: "REGISTER NOW",
      image: "",
      tag: "HACKATHON"
    },
    {
      title: "STARTUP BOOTCAMP",
      date: "SEP 10, 2026",
      description: "An ideation-to-MVP workshop designed to help students understand the process of developing and validating a startup idea.",
      location: "CET THALASSERY",
      status: "upcoming",
      link: "#",
      buttonText: "REGISTER NOW",
      image: "",
      tag: "BOOTCAMP"
    },
    {
      title: "FOUNDER SPEAKER SERIES",
      date: "OCT 02, 2026",
      description: "An interactive session with successful founders, alumni entrepreneurs, and technology professionals.",
      location: "CET THALASSERY",
      status: "upcoming",
      link: "#",
      buttonText: "JOIN LIST",
      image: "",
      tag: "SPEAKER"
    }
  ]
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Normalizes header keys to standard properties
 */
function normalizeHeader(header) {
  if (!header) return "";
  const h = header.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  
  if (["title", "eventtitle", "name", "eventname", "event"].includes(h)) return "title";
  if (["date", "eventdate", "time", "datetime", "when"].includes(h)) return "date";
  if (["description", "desc", "about", "details", "summary"].includes(h)) return "description";
  if (["location", "venue", "place", "where"].includes(h)) return "location";
  if (["status", "type", "category", "state", "section"].includes(h)) return "status";
  if (["link", "registrationlink", "registerlink", "registerurl", "url", "formlink"].includes(h)) return "link";
  if (["buttontext", "btntext", "buttonlabel", "action", "button", "bottomtext", "bottomlabel", "cta"].includes(h)) return "buttonText";
  if (["image", "imageurl", "poster", "banner", "photo", "img"].includes(h)) return "image";
  if (["tag", "badge", "label", "eventtag"].includes(h)) return "tag";
  
  return h;
}

/**
 * Parses Google Visualization API JSON response
 */
function parseGvizResponse(jsonText) {
  // gviz returns: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const startIdx = jsonText.indexOf("{");
  const endIdx = jsonText.lastIndexOf("}");
  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Invalid Google Visualization response format.");
  }

  const rawData = JSON.parse(jsonText.substring(startIdx, endIdx + 1));
  const table = rawData.table;
  if (!table || !table.cols || !table.rows) {
    throw new Error("Empty or malformed table in Google Sheets response.");
  }

  // Determine headers
  let headers = [];
  const colsHaveLabels = table.cols.some(col => col.label && col.label.trim() !== "");

  let startRowIndex = 0;
  if (colsHaveLabels) {
    headers = table.cols.map(col => normalizeHeader(col.label || ""));
  } else if (table.rows.length > 0) {
    // First row contains the column headers
    const firstRow = table.rows[0];
    headers = (firstRow.c || []).map(cell => normalizeHeader(cell ? (cell.v !== null ? cell.v : cell.f) : ""));
    startRowIndex = 1;
  }

  const events = [];
  for (let i = startRowIndex; i < table.rows.length; i++) {
    const row = table.rows[i];
    if (!row || !row.c) continue;

    const eventObj = {};
    let hasContent = false;

    headers.forEach((header, colIdx) => {
      if (!header) return;
      const cell = row.c[colIdx];
      let value = "";
      if (cell !== null && cell !== undefined) {
        // If Google Visualization sends a Date object as string "Date(year,month,day)"
        if (typeof cell.v === "string" && cell.v.startsWith("Date(")) {
          const parts = cell.v.replace(/Date\(|\)/g, "").split(",").map(n => parseInt(n.trim(), 10));
          if (parts.length >= 3) {
            const d = new Date(parts[0], parts[1], parts[2]);
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            value = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
          }
        } else if (cell.f !== null && cell.f !== undefined) {
          value = String(cell.f).trim();
        } else if (cell.v !== null && cell.v !== undefined) {
          value = String(cell.v).trim();
        }
      }

      if (value) hasContent = true;
      eventObj[header] = value;
    });

    // Only include rows that have at least a title
    if (hasContent && eventObj.title) {
      events.push(formatEventItem(eventObj));
    }
  }

  return events;
}

/**
 * Standardize event item properties
 */
function formatEventItem(raw) {
  const isPastStatus = (raw.status || "").toLowerCase().includes("past") ||
                       (raw.status || "").toLowerCase().includes("closed") ||
                       (raw.status || "").toLowerCase().includes("completed") ||
                       (raw.status || "").toLowerCase().includes("ended");

  let status = isPastStatus ? "past" : "upcoming";

  // Check date if status is not explicitly set
  if (!raw.status && EVENTS_CONFIG.autoCategorizeByDate && raw.date) {
    const parsedDate = Date.parse(raw.date);
    if (!isNaN(parsedDate)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate < today.getTime()) {
        status = "past";
      }
    }
  }

  const defaultBtnText = status === "past" ? "VIEW RECAP" : "REGISTER NOW";

  return {
    title: raw.title || "Untitled Event",
    date: raw.date || "DATE TBA",
    description: raw.description || "No description provided.",
    location: raw.location || "CET THALASSERY",
    status: status,
    link: raw.link && raw.link.trim() !== "" ? raw.link.trim() : "#",
    buttonText: raw.buttonText || raw.buttontext || defaultBtnText,
    image: raw.image || "",
    tag: raw.tag || ""
  };
}

// =============================================================================
// DOM RENDERING
// =============================================================================

function renderEventCard(event, index) {
  const indexStr = String(index + 1).padStart(2, "0");
  const hasImage = Boolean(event.image && event.image.trim() !== "");
  const isPast = event.status === "past";
  const isExternalLink = event.link && event.link !== "#" && event.link.startsWith("http");

  return `
    <article class="event-card ${isPast ? 'event-card-past' : ''}">
      <div class="event-image-wrapper">
        ${hasImage ? `
          <img src="${escapeHtml(event.image)}"
               alt="${escapeHtml(event.title)}"
               class="event-image"
               loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="event-image-placeholder" style="display: none;">
            ${escapeHtml(event.tag || `EVENT ${indexStr}`)}
          </div>
        ` : `
          <div class="event-image-placeholder">
            ${escapeHtml(event.tag || `EVENT ${indexStr}`)}
          </div>
        `}
      </div>

      <div class="event-card-content">
        <div class="event-card-top font-mono">
          <span class="event-date">${escapeHtml(event.date)}</span>
          ${event.tag ? `<span class="event-tag-badge">${escapeHtml(event.tag.toUpperCase())}</span>` : ""}
        </div>

        <h3 class="event-title">
          ${escapeHtml(event.title)}
        </h3>

        <p class="event-description">
          ${escapeHtml(event.description)}
        </p>

        <div class="event-details font-mono">
          <span>
            LOCATION: ${escapeHtml(event.location)}
          </span>
        </div>

        <a href="${escapeHtml(event.link)}"
           class="event-register btn ${isPast ? 'btn-outline' : 'btn-primary'} font-mono"
           ${isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          ${escapeHtml(event.buttonText)}
        </a>
      </div>
    </article>
  `;
}

function renderEvents(events) {
  const upcomingContainer = document.getElementById("upcoming-events-grid");
  const pastContainer = document.getElementById("past-events-grid");
  const pastFallback = document.getElementById("past-events-fallback");

  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const pastEvents = events.filter(e => e.status === "past");

  // 1. Render Events Page: Upcoming Grid
  if (upcomingContainer) {
    if (upcomingEvents.length > 0) {
      upcomingContainer.innerHTML = upcomingEvents.map((evt, idx) => renderEventCard(evt, idx)).join("");
    } else {
      upcomingContainer.innerHTML = `
        <div class="events-empty-state font-mono">
          <span class="empty-icon">//</span>
          <p class="empty-text">NO UPCOMING EVENTS SCHEDULED CURRENTLY</p>
          <p class="empty-sub">Check back soon or follow our social channels for announcements.</p>
        </div>
      `;
    }
  }

  // 2. Render Events Page: Past Grid
  if (pastContainer) {
    if (pastEvents.length > 0) {
      pastContainer.style.display = "grid";
      pastContainer.innerHTML = pastEvents.map((evt, idx) => renderEventCard(evt, idx)).join("");
      if (pastFallback) pastFallback.style.display = "none";
    } else {
      pastContainer.style.display = "none";
      if (pastFallback) pastFallback.style.display = "block";
    }
  }

  // 3. Render Landing Page Hero Mini Cards
  renderLandingMiniCards(upcomingEvents);

  // 4. Render Index Modal
  renderIndexEventsModal(upcomingEvents);
}

/**
 * Renders compact small cards for upcoming events on the landing page below hero card
 */
function renderLandingMiniCards(upcomingEvents) {
  const landingSection = document.getElementById("landing-events-section");
  const landingGrid = document.getElementById("landing-events-grid");
  if (!landingGrid) return;

  if (upcomingEvents.length === 0) {
    if (landingSection) landingSection.style.display = "none";
    return;
  }

  if (landingSection) landingSection.style.display = "block";

  // Show up to 3 upcoming events on the landing page
  const displayEvents = upcomingEvents.slice(0, 3);

  landingGrid.innerHTML = displayEvents.map((evt, idx) => {
    const hasValidLink = evt.link && evt.link !== "#" && evt.link.trim() !== "";
    const isExternalLink = hasValidLink && (evt.link.startsWith("http://") || evt.link.startsWith("https://"));
    const targetLink = hasValidLink ? (isExternalLink ? evt.link : (evt.link.startsWith("http") ? evt.link : `https://${evt.link}`)) : "events.html";
    const tagText = evt.tag ? evt.tag.toUpperCase() : `EVENT 0${idx + 1}`;
    const btnText = (evt.buttonText && evt.buttonText.trim() !== "") ? evt.buttonText.toUpperCase() : "REGISTER NOW";

    return `
      <article class="small-event-card">
        <div>
          <div class="small-event-top font-mono">
            <span class="small-event-date">${escapeHtml(evt.date)}</span>
            <span class="small-event-tag">${escapeHtml(tagText)}</span>
          </div>

          <h4 class="small-event-title">${escapeHtml(evt.title)}</h4>
          <p class="small-event-desc">${escapeHtml(evt.description)}</p>
        </div>

        <div>
          <div class="small-event-details font-mono">
            <span>LOCATION: ${escapeHtml(evt.location)}</span>
          </div>

          <a href="${escapeHtml(targetLink)}"
             class="btn btn-outline btn-sm small-event-btn font-mono"
             ${isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            ${escapeHtml(btnText)} →
          </a>
        </div>
      </article>
    `;
  }).join("");
}

/**
 * Updates the events modal in index.html if user opens index.html
 */
function renderIndexEventsModal(upcomingEvents) {
  const modalList = document.querySelector("#modal-events .events-list");
  if (!modalList) return;

  if (upcomingEvents.length > 0) {
    modalList.innerHTML = upcomingEvents.map(evt => {
      const isExternalLink = evt.link && evt.link !== "#" && evt.link.startsWith("http");
      return `
        <div class="event-item">
          <span class="event-date">${escapeHtml(evt.date)}</span>
          <div class="event-info">
            <h4 class="event-heading">${escapeHtml(evt.title)}</h4>
            <p>${escapeHtml(evt.description)}</p>
          </div>
          <a href="${escapeHtml(evt.link)}" class="btn btn-outline btn-sm" ${isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            ${escapeHtml(evt.buttonText || 'REGISTER')}
          </a>
        </div>
      `;
    }).join("");
  }
}

// =============================================================================
// FETCHING DATA FROM GOOGLE SHEETS
// =============================================================================

async function fetchEventsFromGoogleSheet() {
  const sheetId = EVENTS_CONFIG.sheetId;

  // If no custom sheet ID configured or sample ID is used, use fallback events
  if (!sheetId || sheetId.includes("SAMPLE_OR_YOUR_SHEET_ID")) {
    console.info("IEDC Events: Using default fallback events. Set EVENTS_CONFIG.sheetId to connect your Google Sheet.");
    renderEvents(EVENTS_CONFIG.fallbackEvents);
    return;
  }

  const sheetNameParam = EVENTS_CONFIG.sheetName ? `&sheet=${encodeURIComponent(EVENTS_CONFIG.sheetName)}` : "";
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetNameParam}&_nc=${Date.now()}`;

  try {
    const response = await fetch(gvizUrl);
    if (!response.ok) {
      throw new Error(`Google Sheets fetch failed with status: ${response.status}`);
    }

    const text = await response.text();
    const events = parseGvizResponse(text);

    if (events.length > 0) {
      renderEvents(events);
    } else {
      console.warn("IEDC Events: Google Sheet returned 0 event rows. Showing fallback events.");
      renderEvents(EVENTS_CONFIG.fallbackEvents);
    }
  } catch (error) {
    console.error("IEDC Events: Error fetching from Google Sheet:", error);
    renderEvents(EVENTS_CONFIG.fallbackEvents);
  }
}

// Initialise on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  fetchEventsFromGoogleSheet();
});
