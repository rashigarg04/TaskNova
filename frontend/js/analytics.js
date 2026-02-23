// Line Chart
const lineCtx = document.getElementById('lineChart');

new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
            label: 'Tasks Completed',
            data: [5, 15, 25, 20, 30],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.2)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        plugins: { legend: { display: false }},
        scales: {
            x: { ticks: { color: 'white' }},
            y: { ticks: { color: 'white' }}
        }
    }
});

// Pie Chart
const pieCtx = document.getElementById('pieChart');

new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
            data: [30, 22, 48],
            backgroundColor: ['#f87171', '#fbbf24', '#34d399']
        }]
    },
    options: {
        plugins: {
            legend: {
                labels: { color: 'white' }
            }
        }
    }
});