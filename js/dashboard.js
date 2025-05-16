document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initializeStats();
    initializeGameModes();
    initializeTopPlayers();
    initializeRecentActivities();
    initializeServerStatus();

    // Set up real-time updates
    setInterval(updateDashboard, 30000); // Update every 30 seconds
});

function initializeStats() {
    // Fetch initial statistics
    fetch('api/get_dashboard_stats.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('active-users').textContent = formatNumber(data.active_users);
            document.getElementById('retention-rate').textContent = data.retention_rate + '%';
            document.getElementById('avg-session').textContent = formatTime(data.avg_session);
            document.getElementById('daily-revenue').textContent = formatCurrency(data.daily_revenue);
        })
        .catch(error => {
            console.error('Error fetching stats:', error);
            showErrorNotification('Failed to load dashboard statistics');
        });
}

function initializeGameModes() {
    // Fetch game modes data
    fetch('api/get_game_modes.php')
        .then(response => response.json())
        .then(data => {
            const gameModes = document.querySelector('.popular-game-modes');
            data.forEach(mode => {
                const trend = mode.trend >= 0 ? 'positive' : 'negative';
                const trendSign = mode.trend >= 0 ? '+' : '';
                
                const modeElement = document.createElement('div');
                modeElement.className = 'item';
                modeElement.innerHTML = `
                    <div class="img-box">
                        <span class="material-icons-sharp">${mode.icon}</span>
                    </div>
                    <div class="item-info">
                        <h3 class="name">${mode.name}</h3>
                        <div class="item-stats">
                            <span class="count">${formatNumber(mode.players)} players</span>
                            <span class="trend ${trend}">${trendSign}${mode.trend}%</span>
                        </div>
                    </div>
                `;
                gameModes.appendChild(modeElement);
            });
        })
        .catch(error => {
            console.error('Error fetching game modes:', error);
            showErrorNotification('Failed to load game modes');
        });
}

function initializeTopPlayers() {
    // Fetch top players data
    fetch('api/get_top_players.php')
        .then(response => response.json())
        .then(data => {
            const topPlayers = document.querySelector('.top-players');
            data.forEach(player => {
                const playerElement = document.createElement('div');
                playerElement.className = 'item';
                playerElement.innerHTML = `
                    <div class="img-box">
                        <img src="${player.avatar}" alt="${player.name}'s Avatar">
                    </div>
                    <div class="item-info">
                        <h3 class="name">${player.name}</h3>
                        <div class="item-stats">
                            <span class="count">Score: ${formatNumber(player.score)}</span>
                            <span class="badge">${player.rank}</span>
                        </div>
                    </div>
                `;
                topPlayers.appendChild(playerElement);
            });
        })
        .catch(error => {
            console.error('Error fetching top players:', error);
            showErrorNotification('Failed to load top players');
        });
}

function initializeRecentActivities() {
    // Fetch recent activities
    fetch('api/get_recent_activities.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#activities-table tbody');
            tbody.innerHTML = '';

            data.forEach(activity => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatTimeAgo(activity.timestamp)}</td>
                    <td>${activity.event}</td>
                    <td>${activity.player}</td>
                    <td>${activity.details}</td>
                    <td><span class="status-badge ${activity.status.toLowerCase()}">${activity.status}</span></td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching activities:', error);
            showErrorNotification('Failed to load recent activities');
        });
}

function initializeServerStatus() {
    // Fetch server status
    fetch('api/get_server_status.php')
        .then(response => response.json())
        .then(data => {
            updateServerStatus(data);
        })
        .catch(error => {
            console.error('Error fetching server status:', error);
            showErrorNotification('Failed to load server status');
        });
}

function updateDashboard() {
    initializeStats();
    initializeServerStatus();
    initializeRecentActivities();
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatTime(minutes) {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
        return 'just now';
    }
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min ago`;
    }
    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours}h ago`;
    }
    return date.toLocaleDateString();
}

function updateServerStatus(data) {
    const serverStatus = document.querySelector('.sales .status');
    if (serverStatus) {
        const statusBadge = serverStatus.querySelector('.status-badge');
        const percentage = serverStatus.querySelector('.percentage p');
        
        statusBadge.className = `status-badge ${data.status.toLowerCase()}`;
        statusBadge.textContent = data.status;
        percentage.textContent = data.uptime + '%';
    }
}

function showErrorNotification(message) {
    // Implement your error notification system here
    console.error(message);
}