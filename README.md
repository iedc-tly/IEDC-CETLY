# IEDC-CETLY Website
Innovation and Entrepreneurship Development Centre - College of Engineering Thalassery

---

## 📅 Managing Events via Google Sheets

The events on `events.html` (and the home page events modal) can be managed and updated in real-time directly from a Google Sheet without modifying code or redeploying the site.

### 1. Create your Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. In the first row (Row 1), add the following column headers:
   | Title | Date | Description | Location | Status | Link | Button Text | Image | Tag |
   |---|---|---|---|---|---|---|---|---|
   | HACK-CET 2026 | AUG 25, 2026 | 24-hour campus hackathon solving real-world challenges. | CET THALASSERY | Upcoming | https://forms.gle/... | REGISTER NOW | https://... | HACKATHON |
   | STARTUP BOOTCAMP | SEP 10, 2026 | Ideation to MVP workshop with industry mentors. | CET THALASSERY | Upcoming | https://forms.gle/... | REGISTER NOW | | BOOTCAMP |

### 2. Share the Google Sheet
1. Click **Share** at the top right of the Google Sheet.
2. Under **General access**, change from *Restricted* to **"Anyone with the link"** (Role: **Viewer**).
3. Copy the link or Sheet ID.
   - Example URL: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - The **Sheet ID** is the long string between `/d/` and `/edit` (e.g. `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`).

### 3. Connect the Sheet to the Website
Open [`events.js`](./events.js) and update `sheetId` at the top:
```javascript
const EVENTS_CONFIG = {
  sheetId: "YOUR_GOOGLE_SHEET_ID_HERE",
  sheetName: "Events", // optional, defaults to first tab
  ...
};
```

### 4. Adding & Updating Events
- **Add a new event**: Add a new row in your Google Sheet.
- **Move to Past Events**: Set `Status` to `Past` (or `Completed`). The event will automatically move to the "PAST EVENTS" section with a "VIEW RECAP" button.
- **Event Posters/Images**: Put any direct image URL in the `Image` column. If left empty, a stylish event placeholder with the event tag/number will be displayed automatically.
