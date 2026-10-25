# Growspace Logbook
**IEDC-CETLY · College of Engineering Thalassery**

A digital attendance logbook for the Growspace workspace.
Students log their check-in from any phone or laptop — entries go directly to a Google Sheet.

---

## Features

### Live Clock
A real-time clock is shown at the top of the page, updating every second.
Shows the current time and full date so students confirm they are logging the right session.

### Today's Check-in Counter
Displays how many students have checked in today, pulled live from the Google Sheet.
The number animates with a small bounce every time a new entry is added.

### Workspace Guidelines Panel
A collapsible section above the form lists the workspace rules.
Students can tap to expand and read the guidelines before logging in.

### Logbook Entry Form
Students fill in:
- Full Name
- Department (dropdown: CSE, ECE, EEE, ME, CE, IT, MCA, Other)
- Roll Number
- Semester (S1 to S8)
- Class / Batch (optional)
- Duration — how long they plan to stay
- Purpose — what they are working on

### Duration Chips + Custom Input
Quick-tap buttons for common durations: 0.5 hr, 1 hr, 1.5 hr, 2 hr, 3 hr, 4 hr.
A **Custom** chip reveals a text box for any duration beyond 4 hours — no upper limit.

### Calculated Session Times
As soon as a duration is selected, the form automatically calculates and shows:
- Entry time (current time)
- Exit time (entry + duration)
- Total hours
This updates live as the student changes the duration.

### Purpose Quick-Select Tags
Tap a tag to fill the purpose field instantly:
Project Work · Hackathon Prep · Study / Research · Hardware Testing · Team Meeting · Workshop
Or type a custom purpose in the text box below.

### Green Flash + Toast Confirmation
When a student submits, the screen flashes green and a toast bar slides up from the bottom showing **✓ ENTRY SUCCESSFUL**. This gives clear visual feedback that the entry was saved.

### Receipt Card
After submitting, the form is replaced by a receipt showing all the logged details:
name, department, roll no, class, entry time, exit time, duration, and purpose.
A "Log Another Entry" button resets the form for the next student.

### Offline Mode
If a student has no internet connection when submitting, the entry is saved inside their browser temporarily. A yellow banner appears saying entries are pending. The moment the connection returns, all pending entries are sent to the Google Sheet automatically.

### Form Validation
Required fields are checked before submission. If a field is empty, it is highlighted with a red dashed border and a clear error message. Errors clear as soon as the student starts typing.

---

## Files

| File | Purpose |
|---|---|
| `growspace2.html` | Page structure and content |
| `growspace2.css`  | All visual styling |
| `growspace2.js`   | All logic and interactivity |
| `README.md`       | This file |

---

## Setup

1. Copy `growspace2.html`, `growspace2.css`, and `growspace2.js` into your website folder.
2. All three files must be in the same folder — they reference each other by filename.
3. Open `growspace2.html` in a browser. The logbook is ready to use.

To change the Google Sheet or Script URL, open `growspace2.js` and update the two lines at the top:

```js
const SCRIPT_URL = "https://script.google.com/macros/s/...";
const SHEET_ID   = "1GIyxyBwqo2ymGv2ud5oguk4H4_jHqWn9Fg2TtsTQI4E";
```

---

*IEDC-CETLY Growspace Digital Logbook*
