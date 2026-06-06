/**
 * Attendance Dashboard TypeScript Implementation
 * Handles filtering, statistics calculation, and dynamic rendering
 */

// Type definitions for better type safety
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

interface StatCard {
    label: string;
    value: string;
    subtext: string;
    className: string;
}

interface ProgressData {
    label: string;
    percentage: number;
}

/**
 * AttendanceDashboard class handles all dashboard functionality
 */
class AttendanceDashboard {
    private attendanceData: AttendanceRecord[] = [];
    private currentFilter: string = 'all';
    private filteredData: AttendanceRecord[] = [];
    private statistics: StatisticsData = {
        totalStudents: 0,
        presentCount: 0,
        absentCount: 0,
        attendanceRate: 0,
    };

    constructor() {
        this.initializeData();
        this.render();
        this.attachEventListeners();
    }

    /**
     * Initialize mock attendance data
     */
    private initializeData(): void {
        this.attendanceData = [
            { id: 'STU-001', name: 'Alice Johnson', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-002', name: 'Bob Smith', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-003', name: 'Charlie Davis', date: 'Jun 6, 2026', status: 'absent' },
            { id: 'STU-004', name: 'Diana Prince', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-005', name: 'Ethan Brown', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-006', name: 'Fiona Green', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-007', name: 'George Wilson', date: 'Jun 6, 2026', status: 'absent' },
            { id: 'STU-008', name: 'Hannah Lee', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-009', name: 'Isaac Martinez', date: 'Jun 6, 2026', status: 'present' },
            { id: 'STU-010', name: 'Julia Taylor', date: 'Jun 6, 2026', status: 'absent' },
        ];

        this.statistics.totalStudents = this.attendanceData.length;
        this.filteredData = [...this.attendanceData];
        this.calculateStatistics();
    }

    /**
     * Calculate statistics based on filtered data
     */
    private calculateStatistics(): void {
        this.statistics.presentCount = this.filteredData.filter(
            (record) => record.status === 'present'
        ).length;

        this.statistics.absentCount = this.filteredData.filter(
            (record) => record.status === 'absent'
        ).length;

        const totalVisible = this.filteredData.length;
        this.statistics.attendanceRate =
            totalVisible > 0 ? Math.round((this.statistics.presentCount / totalVisible) * 100) : 0;
    }

    /**
     * Filter data based on selected filter
     */
    private applyFilter(filterValue: string): void {
        this.currentFilter = filterValue;

        if (filterValue === 'all') {
            this.filteredData = [...this.attendanceData];
        } else {
            this.filteredData = this.attendanceData.filter(
                (record) => record.status === (filterValue as 'present' | 'absent')
            );
        }

        this.calculateStatistics();
    }

    /**
     * Render all dashboard components
     */
    private render(): void {
        this.renderStatistics();
        this.renderFilters();
        this.renderTable();
        this.renderAnalytics();
    }

    /**
     * Render statistics cards
     */
    private renderStatistics(): void {
        const statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) return;

        const stats: StatCard[] = [
            {
                label: 'Total Students',
                value: this.statistics.totalStudents.toString(),
                subtext: 'Enrolled this semester',
                className: 'stat-total',
            },
            {
                label: 'Present Today',
                value: this.statistics.presentCount.toString(),
                subtext: 'Last class session',
                className: 'stat-present',
            },
            {
                label: 'Absent Today',
                value: this.statistics.absentCount.toString(),
                subtext: 'Not present',
                className: 'stat-absent',
            },
            {
                label: 'Attendance Rate',
                value: `${this.statistics.attendanceRate}%`,
                subtext: 'Overall average',
                className: 'stat-percent',
            },
        ];

        statsContainer.innerHTML = stats
            .map(
                (stat) => `
                <div class="stat-card ${stat.className}">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-subtext">${stat.subtext}</div>
                </div>
            `
            )
            .join('');
    }

    /**
     * Render filter buttons
     */
    private renderFilters(): void {
        const filterContainer = document.getElementById('filterContainer');
        if (!filterContainer) return;

        const filters: FilterType[] = [
            { name: 'ALL', value: 'all' },
            { name: 'PRESENT', value: 'present' },
            { name: 'ABSENT', value: 'absent' },
        ];

        filterContainer.innerHTML = filters
            .map(
                (filter) => `
                <button 
                    class="filter-btn ${this.currentFilter === filter.value ? 'active' : ''}"
                    data-filter="${filter.value}"
                >
                    ${filter.name}
                </button>
            `
            )
            .join('');
    }

    /**
     * Render attendance table
     */
    private renderTable(): void {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        if (this.filteredData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px;">
                        <p>No attendance records found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.filteredData
            .map(
                (record) => `
                <tr data-status="${record.status}">
                    <td>${record.id}</td>
                    <td>${record.name}</td>
                    <td>${record.date}</td>
                    <td><span class="badge badge-${record.status}">${this.capitalizeStatus(record.status)}</span></td>
                </tr>
            `
            )
            .join('');
    }

    /**
     * Render analytics section (pie chart and progress bars)
     */
    private renderAnalytics(): void {
        this.renderPieChart();
        this.renderProgressBars();
    }

    /**
     * Render pie chart
     */
    private renderPieChart(): void {
        const pieChart = document.getElementById('pieChart');
        const pieLegend = document.getElementById('pieLegend');

        if (!pieChart || !pieLegend) return;

        const percentage = this.statistics.attendanceRate;

        pieChart.style.background = `conic-gradient(var(--color-forest) 0% ${percentage}%, #dc2626 ${percentage}% 100%)`;

        pieLegend.innerHTML = `
            <div class="pie-legend-item">
                <div class="legend-dot" style="background: var(--color-forest);"></div>
                <span>${percentage}% Present</span>
            </div>
            <div class="pie-legend-item">
                <div class="legend-dot" style="background: #dc2626;"></div>
                <span>${100 - percentage}% Absent</span>
            </div>
        `;
    }

    /**
     * Render progress bars
     */
    private renderProgressBars(): void {
        const progressContainer = document.getElementById('progressContainer');
        if (!progressContainer) return;

        const progressData: ProgressData[] = [
            { label: 'Overall Goal', percentage: 85 },
            { label: 'This Week', percentage: 87 },
            { label: 'This Month', percentage: 84 },
        ];

        progressContainer.innerHTML = progressData
            .map(
                (progress) => `
                <div class="progress-section">
                    <div class="progress-header">
                        <span>${progress.label}</span>
                        <span class="progress-value">${progress.percentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%;"></div>
                    </div>
                </div>
            `
            )
            .join('');
    }

    /**
     * Capitalize status string
     */
    private capitalizeStatus(status: string): string {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    /**
     * Attach event listeners to interactive elements
     */
    private attachEventListeners(): void {
        const filterContainer = document.getElementById('filterContainer');

        if (filterContainer) {
            filterContainer.addEventListener('click', (event: Event) => {
                const target = event.target as HTMLButtonElement;
                if (target.classList.contains('filter-btn')) {
                    const filterValue = target.getAttribute('data-filter');
                    if (filterValue) {
                        this.applyFilter(filterValue);
                        this.render();
                    }
                }
            });
        }
    }
}

/**
 * Initialize dashboard when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceDashboard();
});
