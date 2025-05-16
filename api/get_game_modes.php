<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get game modes with player counts and trends
    $query = "SELECT 
        gm.mode_id,
        gm.name,
        gm.icon,
        COUNT(DISTINCT gs.player_id) as current_players,
        ((COUNT(DISTINCT gs.player_id) - 
          (SELECT COUNT(DISTINCT player_id) 
           FROM game_sessions gs2 
           WHERE gs2.mode_id = gm.mode_id 
           AND gs2.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 DAY) AND DATE_SUB(NOW(), INTERVAL 1 DAY))
         ) * 100.0 / 
         NULLIF((SELECT COUNT(DISTINCT player_id) 
                FROM game_sessions gs2 
                WHERE gs2.mode_id = gm.mode_id 
                AND gs2.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 DAY) AND DATE_SUB(NOW(), INTERVAL 1 DAY)
               ), 0)
        ) as trend
    FROM game_modes gm
    LEFT JOIN game_sessions gs ON gm.mode_id = gs.mode_id 
        AND gs.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    GROUP BY gm.mode_id, gm.name, gm.icon
    ORDER BY current_players DESC
    LIMIT 3";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $game_modes = array_map(function($mode) {
        return [
            'name' => $mode['name'],
            'icon' => $mode['icon'],
            'players' => (int)$mode['current_players'],
            'trend' => round($mode['trend'] ?? 0, 1)
        ];
    }, $results);

    echo json_encode($game_modes);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 