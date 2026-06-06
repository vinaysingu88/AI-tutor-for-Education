// js/attendance.js
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const rows = document.querySelectorAll('#attendanceTable tbody tr');

    // Function to count filtered rows
    function countVisibleRows(filterValue) {
        let count = 0;
        rows.forEach(row => {
            const isVisible = filterValue === 'all' || row.getAttribute('data-status') === filterValue;
            if (isVisible) {
                count++;
            }
        });
        return count;
    }

    // Function to update statistics
    function updateStats(filterValue) {
        let presentCount = 0;
        let absentCount = 0;
        let visibleRows = 0;

        rows.forEach(row => {
            const isVisible = filterValue === 'all' || row.getAttribute('data-status') === filterValue;
            const status = row.getAttribute('data-status');

            if (isVisible) {
                visibleRows++;
                if (status === 'present') {
                    presentCount++;
                } else if (status === 'absent') {
                    absentCount++;
                }
            }
        });

        // Calculate percentage
        const attendanceRate = visibleRows > 0 ? Math.round((presentCount / visibleRows) * 100) : 0;

        // Update stat cards based on filter
        const statCards = document.querySelectorAll('.stat-card');
        if (filterValue === 'all') {
            statCards[1].querySelector('.stat-value').textContent = presentCount;
            statCards[2].querySelector('.stat-value').textContent = absentCount;
        } else if (filterValue === 'present') {
            statCards[1].querySelector('.stat-value').textContent = presentCount;
            statCards[2].querySelector('.stat-value').textContent = '0';
        } else if (filterValue === 'absent') {
            statCards[1].querySelector('.stat-value').textContent = '0';
            statCards[2].querySelector('.stat-value').textContent = absentCount;
        }

        statCards[3].querySelector('.stat-value').textContent = attendanceRate + '%';

        // Update pie chart
        if (visibleRows > 0) {
            const piePercentage = Math.round((presentCount / visibleRows) * 100);
            const pieChart = document.querySelector('.pie-chart');
            pieChart.style.background = `conic-gradient(var(--color-forest) 0% ${piePercentage}%, #dc2626 ${piePercentage}% 100%)`;

            // Update legend
            const legend = document.querySelector('.pie-legend');
            if (legend) {
                const items = legend.querySelectorAll('.pie-legend-item span');
                if (items.length >= 2) {
                    items[0].textContent = `${piePercentage}% Present`;
                    items[1].textContent = `${100 - piePercentage}% Absent`;
                }
            }
        }
    }

    // Add filter button listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Get filter value
            const filterValue = btn.getAttribute('data-filter');

            // Filter table rows
            rows.forEach(row => {
                if (filterValue === 'all' || row.getAttribute('data-status') === filterValue) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });

            // Update statistics
            updateStats(filterValue);
        });
    });

    // Initialize with default stats
    updateStats('all');
});
