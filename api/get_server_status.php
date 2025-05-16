<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get server status metrics
    $query = "SELECT 
        status,
        uptime_percentage,
        response_time_ms,
        current_load_percentage
    FROM server_metrics
    WHERE server_id = 1
    ORDER BY timestamp DESC
    LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'status' => $result['status'],
            'uptime' => round($result['uptime_percentage'], 1),
            'response_time' => $result['response_time_ms'],
            'load' => $result['current_load_percentage']
        ]);
    } else {
        // Default values if no metrics are available
        echo json_encode([
            'status' => 'Online',
            'uptime' => 99.9,
            'response_time' => 85,
            'load' => 48
        ]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 