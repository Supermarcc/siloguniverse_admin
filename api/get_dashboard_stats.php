<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get active players count (players active in last 24 hours)
    $active_players_query = "SELECT COUNT(*) as count FROM users WHERE last_active >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    $active_players_stmt = $db->prepare($active_players_query);
    $active_players_stmt->execute();
    $active_players = $active_players_stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Calculate retention rate (players who returned within 7 days)
    $retention_query = "SELECT 
        (COUNT(DISTINCT CASE WHEN last_active >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN user_id END) * 100.0 / 
        COUNT(DISTINCT user_id)) as retention_rate
        FROM users";
    $retention_stmt = $db->prepare($retention_query);
    $retention_stmt->execute();
    $retention_rate = round($retention_stmt->fetch(PDO::FETCH_ASSOC)['retention_rate'], 1);

    // Get average session duration in minutes
    $session_query = "SELECT AVG(duration_minutes) as avg_session FROM game_sessions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    $session_stmt = $db->prepare($session_query);
    $session_stmt->execute();
    $avg_session = round($session_stmt->fetch(PDO::FETCH_ASSOC)['avg_session']);

    // Get daily revenue
    $revenue_query = "SELECT COALESCE(SUM(amount), 0) as daily_revenue FROM transactions WHERE DATE(created_at) = CURDATE()";
    $revenue_stmt = $db->prepare($revenue_query);
    $revenue_stmt->execute();
    $daily_revenue = $revenue_stmt->fetch(PDO::FETCH_ASSOC)['daily_revenue'];

    echo json_encode([
        'active_users' => $active_players,
        'retention_rate' => $retention_rate,
        'avg_session' => $avg_session,
        'daily_revenue' => $daily_revenue
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>