# Attendance Dashboard - TypeScript Implementation

A modern, production-ready attendance tracking dashboard built with TypeScript and vanilla JavaScript.

## Features

- **Dynamic Statistics Cards**: Real-time display of total students, present count, absent count, and attendance percentage
- **Smart Filtering**: Filter attendance by ALL, PRESENT, or ABSENT status
- **Responsive Table**: Clean, sortable attendance records with hover effects
- **Analytics Visualization**: Pie chart showing attendance ratio and progress bars for weekly/monthly trends
- **Type-Safe Code**: Full TypeScript implementation with strict type checking
- **Modular Architecture**: Clean class-based structure for maintainability
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
/
├── attendance-dashboard.html       # Main HTML file
├── css/
│   └── style.css                  # Base styling (theme variables)
├── js/
│   ├── attendance-dashboard.js    # Compiled JavaScript (browser-ready)
│   └── attendance.js              # Original vanilla JS version
├── ts/
│   └── attendance-dashboard.ts    # TypeScript source file
├── tsconfig.json                  # TypeScript configuration
└── ATTENDANCE_DASHBOARD.md        # This file
```

## Getting Started

### Option 1: Using JavaScript (No Build Step Required)

Simply open `attendance-dashboard.html` in your browser. The pre-compiled JavaScript will load automatically.

```bash
# Serve the files locally
python3 -m http.server 8000
# Visit: http://localhost:8000/attendance-dashboard.html
```

### Option 2: Using TypeScript (Recommended for Development)

#### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

#### Setup Instructions

1. **Install TypeScript globally** (optional but recommended):
```bash
npm install -g typescript
```

2. **Compile TypeScript to JavaScript**:
```bash
# Using tsc directly
tsc

# Or watch mode for development
tsc --watch
```

3. **Serve and test**:
```bash
python3 -m http.server 8000
# Visit: http://localhost:8000/attendance-dashboard.html
```

The compiled JavaScript will be output to the `js/` directory automatically.

## Code Architecture

### AttendanceDashboard Class

The core class that manages the entire dashboard lifecycle:

```typescript
class AttendanceDashboard {
    private attendanceData: AttendanceRecord[];
    private currentFilter: string;
    private filteredData: AttendanceRecord[];
    private statistics: StatisticsData;
    
    constructor();
    private initializeData(): void;
    private calculateStatistics(): void;
    private applyFilter(filterValue: string): void;
    private render(): void;
    private renderStatistics(): void;
    private renderFilters(): void;
    private renderTable(): void;
    private renderAnalytics(): void;
    private renderPieChart(): void;
    private renderProgressBars(): void;
    private capitalizeStatus(status: string): string;
    private attachEventListeners(): void;
}
```

### Type Definitions

All data structures are strongly typed for safety and IDE support:

```typescript
interface AttendanceRecord {
    id: string;
    name: string;
    date: string;
    status: 'present' | 'absent';
}

interface StatisticsData {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
}

interface FilterType {
    name: string;
    value: string;
}
```

## Key Methods

### initializeData()
Initializes the dashboard with mock attendance data. Replace this method with API calls for real data:

```typescript
// Example: Fetching from API
private async initializeData(): Promise<void> {
    try {
        const response = await fetch('/api/attendance');
        this.attendanceData = await response.json();
        // ... rest of initialization
    } catch (error) {
        console.error('Failed to load attendance data:', error);
    }
}
```

### applyFilter(filterValue: string)
Filters attendance records based on the selected status:
- `'all'`: Shows all records
- `'present'`: Shows only present students
- `'absent'`: Shows only absent students

### calculateStatistics()
Computes statistics based on filtered data:
- Counts present and absent students
- Calculates attendance percentage
- Updates the pie chart and progress bars

### render()
Re-renders all dashboard components. Called after filter changes or data updates.

## Data Flow

```
1. User loads page
   ↓
2. DOMContentLoaded event fires
   ↓
3. AttendanceDashboard instance created
   ↓
4. initializeData() loads attendance records
   ↓
5. render() displays all components
   ↓
6. attachEventListeners() activates filter buttons
   ↓
7. User clicks filter button
   ↓
8. applyFilter() updates filtered data
   ↓
9. calculateStatistics() recomputes stats
   ↓
10. render() updates UI with new data
```

## Styling

The dashboard uses CSS custom properties (variables) defined in `css/style.css`:

```css
--color-forest: #27ac1f (Primary green)
--color-screamin: #13a53f (Secondary green)
--color-bunker: #0f1f1a (Dark text)
--color-white: #ffffff
--color-gray: #f5f5f5
--glass-border: rgba(0,0,0,0.1)
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
```

## Extending the Dashboard

### Adding API Integration

Replace the `initializeData()` method:

```typescript
private async initializeData(): Promise<void> {
    try {
        const response = await fetch('/api/attendance', {
            headers: { 'Authorization': `Bearer ${this.getToken()}` }
        });
        const data = await response.json();
        this.attendanceData = data.records;
        this.statistics.totalStudents = data.total;
        this.calculateStatistics();
    } catch (error) {
        this.handleError(error);
    }
}
```

### Adding New Statistics

Add to the `StatisticsData` interface and update `calculateStatistics()`:

```typescript
interface StatisticsData {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
    lateCount: number;        // New field
    excusedAbsentCount: number; // New field
}
```

### Custom Filtering

Extend the `applyFilter()` method:

```typescript
private applyFilter(filterValue: string): void {
    this.currentFilter = filterValue;
    
    switch(filterValue) {
        case 'present':
            this.filteredData = this.attendanceData.filter(r => r.status === 'present');
            break;
        case 'absent':
            this.filteredData = this.attendanceData.filter(r => r.status === 'absent');
            break;
        case 'late':
            this.filteredData = this.attendanceData.filter(r => r.status === 'late');
            break;
        default:
            this.filteredData = [...this.attendanceData];
    }
    
    this.calculateStatistics();
}
```

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: Modern versions (iOS Safari 14+, Chrome Android 90+)

## Performance Considerations

- **Virtual Scrolling**: For large datasets (500+ records), implement virtual scrolling
- **Debounced Rendering**: Use debounce for rapid filter changes
- **Lazy Loading**: Load images and heavy resources on demand
- **Memoization**: Cache computed statistics between renders

Example optimization:

```typescript
private renderTableOptimized(): void {
    const ITEMS_PER_PAGE = 25;
    const startIndex = (this.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleRecords = this.filteredData.slice(startIndex, endIndex);
    // Render only visible records
}
```

## Testing

Example test cases using Jest:

```typescript
describe('AttendanceDashboard', () => {
    let dashboard: AttendanceDashboard;

    beforeEach(() => {
        dashboard = new AttendanceDashboard();
    });

    test('filters present students correctly', () => {
        dashboard['applyFilter']('present');
        expect(dashboard['filteredData']).toHaveLength(7);
    });

    test('calculates attendance percentage correctly', () => {
        expect(dashboard['statistics'].attendanceRate).toBe(70);
    });
});
```

## Common Issues & Solutions

### Issue: Styles not loading
**Solution**: Ensure `css/style.css` is in the correct path and uses proper CSS custom properties.

### Issue: Filter not working
**Solution**: Check browser console for JavaScript errors. Ensure event listeners are attached after DOM is ready.

### Issue: Statistics not updating
**Solution**: Verify `calculateStatistics()` is called after `applyFilter()`.

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify TypeScript compilation (if using TS)
3. Ensure all dependencies are properly loaded
4. Test with mock data first before API integration
