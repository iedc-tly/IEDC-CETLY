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

---

## 🚀 Growspace Digital Logbook (Google Sheets Integration)

Growspace (`growspace.html`) is an initiative of IEDC-CETLY to provide a dedicated workspace for students of College of Engineering Thalassery. It features a digital attendance logbook where students input their details and stay duration. Entry time and calculated exit time are logged directly into a Google Sheet.

### 1. Attendance Google Sheet
- **Active Sheet**: [IEDC Growspace Logbook Sheet](https://docs.google.com/spreadsheets/d/1GIyxyBwqo2ymGv2ud5oguk4H4_jHqWn9Fg2TtsTQI4E/edit?usp=sharing)
- Columns in Row 1:
   | Timestamp | Student Name | Department | Roll No | Class & Sem | Entry Time | Exit Time | Hours Stayed | Purpose |
   |---|---|---|---|---|---|---|---|---|

### 2. Add Google Apps Script Web App
1. Inside the Google Sheet, navigate to **Extensions** > **Apps Script**.
2. Replace any existing code in `Code.gs` with:
   ```javascript
   function doPost(e) {
     var lock = LockService.getScriptLock();
     lock.tryLock(10000);
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = JSON.parse(e.postData.contents);
       sheet.appendRow([
         data.timestamp || new Date(),
         data.name,
         data.department,
         data.rollNo,
         data.classSemester,
         data.entryTime,
         data.exitTime,
         data.hoursStayed,
         data.purpose || ''
       ]);
       return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
         .setMimeType(ContentService.MimeType.JSON);
     } finally {
       lock.releaseLock();
     }
   }
   ```
3. Click **Deploy** > **New deployment**.
4. Select type: **Web app**.
5. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy**, authorize access, and copy the **Web app URL**.

### 3. Connect to the Website
Open [`growspace.js`](./growspace.js) and paste your Web App URL into `GROWSPACE_CONFIG`:
```javascript
const GROWSPACE_CONFIG = {
  scriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  enableLocalStorage: true,
  maxLocalEntries: 20
};
```
*(If `scriptUrl` is not configured yet, entries are automatically cached in local browser storage so you can test immediately!)*

