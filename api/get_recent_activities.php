<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get recent game activities
    $query = "SELECT 
        a.activity_id,
        a.event_type,
        a.details,
        a.created_at,
        u.username,
        a.status
    FROM game_activities a
    LEFT JOIN users u ON a.user_id = u.user_id
    ORDER BY a.created_at DESC
    LIMIT 10";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $activities = array_map(function($activity) {
        return [
            'timestamp' => $activity['created_at'],
            'event' => ucfirst(str_replace('_', ' ', $activity['event_type'])),
            'player' => $activity['username'],
            'details' => $activity['details'],
            'status' => $activity['status']
        ];
    }, $results);

    echo json_encode($activities);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>