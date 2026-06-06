# TypeScript Attendance Dashboard - Setup & Usage Guide

A production-ready TypeScript/JavaScript attendance dashboard with modern filtering, real-time statistics, and responsive design.

## Quick Start

### Option 1: Use the Pre-Compiled JavaScript (No Setup Required)

The dashboard comes with pre-compiled JavaScript ready to use immediately:

```bash
# Simply serve the files and open in a browser
python3 -m http.server 8000

# Visit: http://localhost:8000/attendance-dashboard.html
```

**Files needed:**
- `attendance-dashboard.html` - Main HTML file
- `js/attendance-dashboard.js` - Pre-compiled JavaScript
- `css/style.css` - CSS styling

### Option 2: Compile TypeScript Yourself (For Development)

#### Prerequisites

- Node.js 16 or higher
- npm or yarn

#### Installation & Compilation

1. **Install TypeScript** (if not already installed):
```bash
npm install -g typescript
```

2. **Verify installation**:
```bash
tsc --version
```

3. **Compile TypeScript to JavaScript**:
```bash
# One-time compilation
cd /vercel/share/v0-project
tsc

# Or watch mode (auto-recompile on changes)
tsc --watch
```

4. **Serve locally**:
```bash
python3 -m http.server 8000
```

5. **Open in browser**:
```
http://localhost:8000/attendance-dashboard.html
```

## Project Structure

```
attendance-dashboard/
├── attendance-dashboard.html          # Main HTML (entry point)
├── tsconfig.json                     # TypeScript configuration
├── TYPESCRIPT_SETUP.md               # This file
├── ATTENDANCE_DASHBOARD.md           # Feature documentation
├── css/
│   └── style.css                     # Global styles & theme variables
├── js/
│   └── attendance-dashboard.js       # Compiled JavaScript (browser-ready)
├── ts/
│   └── attendance-dashboard.ts       # TypeScript source code
└── html/ (original files)
    ├── attendance.html               # Original HTML version
    └── ... other pages
```

## Features

### Statistics Dashboard
- **Total Students**: Enrollment count
- **Present Today**: Students marked present
- **Absent Today**: Students marked absent  
- **Attendance Rate**: Percentage calculation (present / total × 100)

### Interactive Filters
- **ALL**: Show all attendance records
- **PRESENT**: Show only present students
- **ABSENT**: Show only absent students

Real-time updates to all statistics and visualizations when filters change.

### Analytics Visualization
- **Pie Chart**: Today's attendance ratio with dynamic color coding
  - Green arc: Present students
  - Red arc: Absent students
- **Progress Bars**: Weekly attendance tracking
  - Overall Goal: 85% target
  - This Week: 87% actual
  - This Month: 84% actual

### Responsive Table
Clean, sortable attendance records with:
- Student ID
- Student Name
- Date
- Status (Present/Absent badges)
- Hover effects for better UX

## TypeScript Configuration

The `tsconfig.json` enables strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

This ensures type safety and catches errors at compile time.

## Code Architecture

### Main Class: AttendanceDashboard

```typescript
class AttendanceDashboard {
    private attendanceData: AttendanceRecord[]
    private currentFilter: string
    private filteredData: AttendanceRecord[]
    private statistics: StatisticsData
    
    constructor()
    initializeData()
    calculateStatistics()
    applyFilter(filterValue: string)
    render()
    attachEventListeners()
}
```

### Data Structures

```typescript
// Attendance Record
{
    id: string           // e.g., "STU-001"
    name: string         // e.g., "Alice Johnson"
    date: string         // e.g., "Jun 6, 2026"
    status: 'present' | 'absent'
}

// Statistics
{
    totalStudents: number      // 10
    presentCount: number       // 7
    absentCount: number        // 3
    attendanceRate: number     // 70
}
```

## Customization Guide

### 1. Update Student Data

Modify `initializeData()` in `ts/attendance-dashboard.ts`:

```typescript
private initializeData() {
    this.attendanceData = [
        { id: 'STU-001', name: 'Your Student', date: 'Jun 6, 2026', status: 'present' },
        // Add more records...
    ];
}
```

### 2. Connect to API

Replace the static data with API calls:

```typescript
private async initializeData() {
    try {
        const response = await fetch('/api/attendance');
        this.attendanceData = await response.json();
        this.calculateStatistics();
    } catch (error) {
        console.error('Failed to fetch attendance:', error);
    }
}
```

### 3. Customize Colors

Edit `css/style.css` CSS variables:

```css
--color-forest: #27ac1f;     /* Primary green */
--color-screamin: #13a53f;   /* Secondary green */
--color-bunker: #0f1f1a;     /* Dark text */
```

### 4. Change Statistics Thresholds

Modify the progress bar percentages in `renderProgressBars()`:

```typescript
const progressData = [
    { label: 'Your Label', percentage: 90 },
    // Customize as needed
];
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | Full    |
| Firefox | 88+     | Full    |
| Safari  | 14+     | Full    |
| Edge    | 90+     | Full    |

## Performance Tips

### For Large Datasets (500+ records)

Implement pagination:

```typescript
private renderTableOptimized() {
    const ITEMS_PER_PAGE = 50;
    const startIndex = (this.currentPage - 1) * ITEMS_PER_PAGE;
    const visibleRecords = this.filteredData.slice(startIndex, ITEMS_PER_PAGE);
    // Render only visible items
}
```

### Debounce Filter Changes

```typescript
private attachEventListeners() {
    const filterContainer = document.getElementById('filterContainer');
    filterContainer.addEventListener('click', (event) => {
        clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(() => {
            this.applyFilter(filterValue);
            this.render();
        }, 300);
    });
}
```

## Testing

### Manual Testing Checklist

- [ ] **ALL filter** shows all 10 students (70% attendance)
- [ ] **PRESENT filter** shows 7 students (100% attendance)
- [ ] **ABSENT filter** shows 3 students (0% attendance)
- [ ] Pie chart updates dynamically
- [ ] Progress bars display correctly
- [ ] Responsive design on mobile (375px viewport)
- [ ] Table sorting/filtering works smoothly
- [ ] Statistics cards update in real-time

### Example Test Cases (Jest)

```typescript
describe('AttendanceDashboard', () => {
    let dashboard: AttendanceDashboard;

    beforeEach(() => {
        dashboard = new AttendanceDashboard();
    });

    test('initializes with 10 students', () => {
        expect(dashboard['attendanceData']).toHaveLength(10);
    });

    test('PRESENT filter shows 7 students', () => {
        dashboard['applyFilter']('present');
        expect(dashboard['filteredData']).toHaveLength(7);
        expect(dashboard['statistics'].attendanceRate).toBe(100);
    });

    test('ABSENT filter shows 3 students', () => {
        dashboard['applyFilter']('absent');
        expect(dashboard['filteredData']).toHaveLength(3);
        expect(dashboard['statistics'].attendanceRate).toBe(0);
    });

    test('attendance rate calculated correctly', () => {
        expect(dashboard['statistics'].attendanceRate).toBe(70);
    });
});
```

## Troubleshooting

### TypeScript Compilation Errors

**Error: "Cannot find module 'typescript'"**
```bash
npm install -g typescript
```

**Error: "Unknown file extension .ts"**
Ensure you're using `tsc` to compile, not `node`
```bash
# Correct
tsc

# Incorrect
node ts/attendance-dashboard.ts
```

### JavaScript Not Loading

1. Verify file paths in HTML:
```html
<script src="js/attendance-dashboard.js"></script>
```

2. Check browser console for errors (F12)
3. Ensure HTTP server is running correctly
4. Clear browser cache (Ctrl+Shift+Delete)

### Styles Not Applying

1. Verify CSS file path: `css/style.css`
2. Check that CSS variables are defined
3. Inspect element to see applied styles (F12)
4. Ensure no conflicting CSS rules

## Development Workflow

```bash
# 1. Start TypeScript compiler in watch mode
tsc --watch

# 2. In another terminal, start HTTP server
python3 -m http.server 8000

# 3. Open browser
# http://localhost:8000/attendance-dashboard.html

# 4. Edit ts/attendance-dashboard.ts
# JavaScript auto-compiles
# Refresh browser to see changes
```

## Production Deployment

1. Compile TypeScript:
```bash
tsc
```

2. Minify JavaScript (optional):
```bash
npm install -g terser
terser js/attendance-dashboard.js -o js/attendance-dashboard.min.js
```

3. Update HTML to use minified version:
```html
<script src="js/attendance-dashboard.min.js"></script>
```

4. Deploy to web server
5. Test in production environment

## API Integration Example

Replace `initializeData()` with:

```typescript
private async initializeData() {
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch('/api/v1/attendance', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('API failed');

        const data = await response.json();
        this.attendanceData = data.records;
        this.statistics.totalStudents = data.total;
        
        this.filteredData = [...this.attendanceData];
        this.calculateStatistics();
    } catch (error) {
        console.error('Failed to load attendance:', error);
        this.showErrorMessage('Failed to load attendance data');
    }
}
```

## Support & Resources

- TypeScript Docs: https://www.typescriptlang.org/docs/
- MDN Web Docs: https://developer.mozilla.org/
- Browser DevTools: F12 (Chrome/Firefox/Edge)

## License

MIT License - Free to use and modify

## Changelog

### Version 1.0.0
- Initial TypeScript implementation
- Basic filtering (ALL, PRESENT, ABSENT)
- Statistics calculation
- Pie chart visualization
- Progress bars
- Responsive design
