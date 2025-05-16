<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get top players based on score and achievements
    $query = "SELECT 
        u.user_id,
        u.username,
        u.avatar_url,
        p.total_score,
        CASE
            WHEN p.total_score >= 15000 THEN 'MVP'
            WHEN p.total_score >= 10000 THEN 'Elite'
            ELSE 'Pro'
        END as rank
    FROM users u
    JOIN player_stats p ON u.user_id = p.user_id
    WHERE u.status = 'active'
    ORDER BY p.total_score DESC
    LIMIT 3";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $top_players = array_map(function($player) {
        return [
            'name' => $player['username'],
            'avatar' => $player['avatar_url'] ?? 'images/default-avatar.png',
            'score' => (int)$player['total_score'],
            'rank' => $player['rank']
        ];
    }, $results);

    echo json_encode($top_players);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 