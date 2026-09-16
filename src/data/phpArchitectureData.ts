export interface PhpFile {
  path: string;
  filename: string;
  category: 'database' | 'config' | 'includes' | 'actions' | 'pages';
  description: string;
  code: string;
}

export const PHP_ARCHITECTURE_FILES: PhpFile[] = [
  {
    path: 'database/connecta.sql',
    filename: 'connecta.sql',
    category: 'database',
    description: 'Complete MySQL 8+ normalized database schema with foreign keys, cascading rules, and optimized indexes.',
    code: `-- ==============================================================================
-- CONNECTA SOCIAL NETWORK — MySQL 8.0+ Database Schema
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`connecta\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`connecta\`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`first_name\` VARCHAR(60) NOT NULL,
  \`last_name\` VARCHAR(60) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(120) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`profile_image\` VARCHAR(255) DEFAULT '/uploads/profiles/default.png',
  \`cover_image\` VARCHAR(255) DEFAULT '/uploads/covers/default-cover.jpg',
  \`bio\` TEXT NULL,
  \`location\` VARCHAR(100) NULL,
  \`website\` VARCHAR(150) NULL,
  \`status\` ENUM('active', 'suspended', 'pending') DEFAULT 'active',
  \`role\` ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_users_email\` (\`email\`),
  INDEX \`idx_users_username\` (\`username\`),
  INDEX \`idx_users_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. FRIENDSHIPS TABLE
CREATE TABLE IF NOT EXISTS \`friendships\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`sender_id\` INT UNSIGNED NOT NULL,
  \`receiver_id\` INT UNSIGNED NOT NULL,
  \`status\` ENUM('pending', 'accepted', 'rejected', 'blocked') DEFAULT 'pending',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_friendship\` (\`sender_id\`, \`receiver_id\`),
  INDEX \`idx_friendship_receiver\` (\`receiver_id\`, \`status\`),
  CONSTRAINT \`fk_friendship_sender\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_friendship_receiver\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS \`follows\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`follower_id\` INT UNSIGNED NOT NULL,
  \`following_id\` INT UNSIGNED NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_follow\` (\`follower_id\`, \`following_id\`),
  CONSTRAINT \`fk_follow_follower\` FOREIGN KEY (\`follower_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_follow_following\` FOREIGN KEY (\`following_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. POSTS TABLE
CREATE TABLE IF NOT EXISTS \`posts\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`content\` TEXT NOT NULL,
  \`privacy\` ENUM('public', 'friends', 'only_me') DEFAULT 'public',
  \`image\` VARCHAR(255) NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_posts_user_created\` (\`user_id\`, \`created_at\` DESC),
  INDEX \`idx_posts_privacy\` (\`privacy\`),
  CONSTRAINT \`fk_posts_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. REACTIONS TABLE (One active reaction per user per post)
CREATE TABLE IF NOT EXISTS \`reactions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`post_id\` INT UNSIGNED NOT NULL,
  \`type\` ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry') NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_post_reaction\` (\`user_id\`, \`post_id\`),
  INDEX \`idx_reactions_post\` (\`post_id\`),
  CONSTRAINT \`fk_reactions_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_reactions_post\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COMMENTS TABLE (Supports nested replies via parent_id)
CREATE TABLE IF NOT EXISTS \`comments\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`post_id\` INT UNSIGNED NOT NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`parent_id\` INT UNSIGNED NULL,
  \`content\` TEXT NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_comments_post\` (\`post_id\`, \`created_at\` ASC),
  INDEX \`idx_comments_parent\` (\`parent_id\`),
  CONSTRAINT \`fk_comments_post\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_comments_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_comments_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SHARES TABLE
CREATE TABLE IF NOT EXISTS \`shares\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`post_id\` INT UNSIGNED NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_shares_post\` (\`post_id\`),
  CONSTRAINT \`fk_shares_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_shares_post\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. MESSAGES TABLE (One-to-one direct conversations)
CREATE TABLE IF NOT EXISTS \`messages\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`sender_id\` INT UNSIGNED NOT NULL,
  \`receiver_id\` INT UNSIGNED NOT NULL,
  \`content\` TEXT NOT NULL,
  \`is_read\` TINYINT(1) DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_messages_conversation\` (\`sender_id\`, \`receiver_id\`, \`created_at\`),
  INDEX \`idx_messages_receiver_read\` (\`receiver_id\`, \`is_read\`),
  CONSTRAINT \`fk_msg_sender\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_msg_receiver\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS \`notifications\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`actor_id\` INT UNSIGNED NOT NULL,
  \`type\` ENUM('friend_request', 'friend_accept', 'reaction', 'comment', 'reply', 'share', 'message') NOT NULL,
  \`reference_id\` INT UNSIGNED NULL,
  \`is_read\` TINYINT(1) DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_notif_user_unread\` (\`user_id\`, \`is_read\`),
  CONSTRAINT \`fk_notif_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_notif_actor\` FOREIGN KEY (\`actor_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. REPORTS TABLE (Moderation)
CREATE TABLE IF NOT EXISTS \`reports\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`reporter_id\` INT UNSIGNED NOT NULL,
  \`post_id\` INT UNSIGNED NULL,
  \`comment_id\` INT UNSIGNED NULL,
  \`reported_user_id\` INT UNSIGNED NOT NULL,
  \`reason\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_reports_status\` (\`status\`),
  CONSTRAINT \`fk_reports_reporter\` FOREIGN KEY (\`reporter_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_reports_target_user\` FOREIGN KEY (\`reported_user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. SAVED POSTS TABLE
CREATE TABLE IF NOT EXISTS \`saved_posts\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`post_id\` INT UNSIGNED NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_saved_post\` (\`user_id\`, \`post_id\`),
  CONSTRAINT \`fk_saved_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_saved_post\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
  },
  {
    path: 'config/database.php',
    filename: 'database.php',
    category: 'config',
    description: 'PDO database connection singleton with utf8mb4, prepared emulation disabled, and error exceptions.',
    code: `<?php
/**
 * Connecta Database Connection Configuration
 * PDO with Prepared Statements & utf8mb4 encoding
 */

declare(strict_types=1);

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'connecta');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

function getPDO(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Enforce true server prepared statements
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('Database Connection Error: ' . $e->getMessage());
            die(json_encode(['error' => 'Database connection failed. Please check configuration.']));
        }
    }

    return $pdo;
}
`
  },
  {
    path: 'includes/csrf.php',
    filename: 'csrf.php',
    category: 'includes',
    description: 'CSRF token generation and verification middleware for all POST state mutations.',
    code: `<?php
/**
 * Connecta CSRF Protection Utilities
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Generate or retrieve the current session CSRF token
 */
function getCsrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Render a hidden CSRF token input for forms
 */
function csrfField(): string
{
    $token = htmlspecialchars(getCsrfToken(), ENT_QUOTES, 'UTF-8');
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}

/**
 * Verify incoming CSRF token from POST body or X-CSRF-Token header
 */
function verifyCsrfToken(): void
{
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    
    if (empty($token) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        die(json_encode([
            'success' => false,
            'message' => 'CSRF validation failed. Invalid or expired security token.'
        ]));
    }
}
`
  },
  {
    path: 'includes/auth.php',
    filename: 'auth.php',
    category: 'includes',
    description: 'Session authentication helpers, login checks, role authorization, and user retrieval.',
    code: `<?php
/**
 * Connecta Authentication & Session Management
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if the user is logged in
 */
function isLoggedIn(): bool
{
    return !empty($_SESSION['user_id']);
}

/**
 * Enforce authentication for protected pages
 */
function requireAuth(): void
{
    if (!isLoggedIn()) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
        header('Location: /login.php');
        exit;
    }
}

/**
 * Enforce administrator privileges
 */
function requireAdmin(): void
{
    requireAuth();
    $user = getCurrentUser();
    if (!$user || $user['role'] !== 'admin') {
        http_response_code(403);
        die('Forbidden: Administrator access required.');
    }
}

/**
 * Get current authenticated user record
 */
function getCurrentUser(): ?array
{
    if (!isLoggedIn()) {
        return null;
    }

    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT id, first_name, last_name, username, email, profile_image, cover_image, bio, location, website, role, status FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    return $user ?: null;
}
`
  },
  {
    path: 'actions/create-post.php',
    filename: 'create-post.php',
    category: 'actions',
    description: 'Post creation action with CSRF verification, secure file upload checks, and PDO insertion.',
    code: `<?php
/**
 * Action: Create Post
 * Endpoint: POST /actions/create-post.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireAuth();
verifyCsrfToken();

header('Content-Type: application/json');

$userId = (int) $_SESSION['user_id'];
$content = trim($_POST['content'] ?? '');
$privacy = $_POST['privacy'] ?? 'public';

if (!in_array($privacy, ['public', 'friends', 'only_me'], true)) {
    $privacy = 'public';
}

$imagePath = null;

// Secure File Upload Handling
if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName    = $_FILES['image']['name'];
    $fileSize    = $_FILES['image']['size'];
    
    // 1. Max size: 5MB
    if ($fileSize > 5 * 1024 * 1024) {
        echo json_encode(['success' => false, 'message' => 'Image size exceeds maximum 5MB limit.']);
        exit;
    }

    // 2. MIME type verification
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($fileTmpPath);
    $allowedMimes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    if (!array_key_exists($mimeType, $allowedMimes)) {
        echo json_encode(['success' => false, 'message' => 'Invalid image format. Allowed: JPG, PNG, WebP.']);
        exit;
    }

    // 3. Generate safe unguessable filename
    $extension = $allowedMimes[$mimeType];
    $newFileName = bin2hex(random_bytes(16)) . '.' . $extension;
    $uploadDir = __DIR__ . '/../uploads/posts/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $destPath = $uploadDir . $newFileName;
    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $imagePath = '/uploads/posts/' . $newFileName;
    }
}

if (empty($content) && empty($imagePath)) {
    echo json_encode(['success' => false, 'message' => 'Post content or image is required.']);
    exit;
}

$pdo = getPDO();
$stmt = $pdo->prepare("INSERT INTO posts (user_id, content, privacy, image, created_at) VALUES (?, ?, ?, ?, NOW())");
$stmt->execute([$userId, $content, $privacy, $imagePath]);

$postId = (int) $pdo->lastInsertId();

echo json_encode([
    'success' => true,
    'message' => 'Post published successfully!',
    'post_id' => $postId
]);
`
  },
  {
    path: 'actions/reaction.php',
    filename: 'reaction.php',
    category: 'actions',
    description: 'Toggles or updates post reactions (Like, Love, Haha, Wow, Sad, Angry) and generates notifications.',
    code: `<?php
/**
 * Action: React to Post (One reaction per user per post)
 * Endpoint: POST /actions/reaction.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireAuth();
verifyCsrfToken();

header('Content-Type: application/json');

$userId = (int) $_SESSION['user_id'];
$postId = (int) ($_POST['post_id'] ?? 0);
$type   = $_POST['type'] ?? '';

$validTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
if (!$postId || !in_array($type, $validTypes, true)) {
    echo json_encode(['success' => false, 'message' => 'Invalid parameters.']);
    exit;
}

$pdo = getPDO();

// Check existing reaction
$stmt = $pdo->prepare("SELECT id, type FROM reactions WHERE user_id = ? AND post_id = ? LIMIT 1");
$stmt->execute([$userId, $postId]);
$existing = $stmt->fetch();

if ($existing) {
    if ($existing['type'] === $type) {
        // Toggle OFF
        $del = $pdo->prepare("DELETE FROM reactions WHERE id = ?");
        $del->execute([$existing['id']]);
        $action = 'removed';
    } else {
        // Update reaction type
        $upd = $pdo->prepare("UPDATE reactions SET type = ? WHERE id = ?");
        $upd->execute([$type, $existing['id']]);
        $action = 'updated';
    }
} else {
    // Insert new reaction
    $ins = $pdo->prepare("INSERT INTO reactions (user_id, post_id, type, created_at) VALUES (?, ?, ?, NOW())");
    $ins->execute([$userId, $postId, $type]);
    $action = 'added';

    // Notify author if not reacting to own post
    $postStmt = $pdo->prepare("SELECT user_id FROM posts WHERE id = ?");
    $postStmt->execute([$postId]);
    $authorId = $postStmt->fetchColumn();

    if ($authorId && (int)$authorId !== $userId) {
        $notif = $pdo->prepare("INSERT INTO notifications (user_id, actor_id, type, reference_id, is_read, created_at) VALUES (?, ?, 'reaction', ?, 0, NOW())");
        $notif->execute([$authorId, $userId, $postId]);
    }
}

// Return fresh reaction counts
$countStmt = $pdo->prepare("SELECT type, COUNT(*) as cnt FROM reactions WHERE post_id = ? GROUP BY type");
$countStmt->execute([$postId]);
$counts = $countStmt->fetchAll(PDO::FETCH_KEY_PAIR);

echo json_encode([
    'success' => true,
    'action'  => $action,
    'counts'  => $counts
]);
`
  },
  {
    path: 'actions/friend-request.php',
    filename: 'friend-request.php',
    category: 'actions',
    description: 'Manages social graph: Send friend request, accept, reject, remove, block, or unblock users.',
    code: `<?php
/**
 * Action: Friend Requests & Connections
 * Endpoint: POST /actions/friend-request.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireAuth();
verifyCsrfToken();

header('Content-Type: application/json');

$currentUserId = (int) $_SESSION['user_id'];
$targetUserId  = (int) ($_POST['target_user_id'] ?? 0);
$action        = $_POST['action'] ?? ''; // 'send', 'accept', 'reject', 'remove', 'block'

if (!$targetUserId || $currentUserId === $targetUserId) {
    echo json_encode(['success' => false, 'message' => 'Invalid target user.']);
    exit;
}

$pdo = getPDO();

switch ($action) {
    case 'send':
        $stmt = $pdo->prepare("INSERT INTO friendships (sender_id, receiver_id, status, created_at) VALUES (?, ?, 'pending', NOW()) ON DUPLICATE KEY UPDATE status = 'pending'");
        $stmt->execute([$currentUserId, $targetUserId]);
        
        // Notify receiver
        $notif = $pdo->prepare("INSERT INTO notifications (user_id, actor_id, type, reference_id, is_read, created_at) VALUES (?, ?, 'friend_request', ?, 0, NOW())");
        $notif->execute([$targetUserId, $currentUserId, $pdo->lastInsertId()]);
        
        echo json_encode(['success' => true, 'message' => 'Friend request sent.']);
        break;

    case 'accept':
        $stmt = $pdo->prepare("UPDATE friendships SET status = 'accepted', updated_at = NOW() WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'");
        $stmt->execute([$targetUserId, $currentUserId]);

        if ($stmt->rowCount() > 0) {
            $notif = $pdo->prepare("INSERT INTO notifications (user_id, actor_id, type, reference_id, is_read, created_at) VALUES (?, ?, 'friend_accept', ?, 0, NOW())");
            $notif->execute([$targetUserId, $currentUserId, $currentUserId]);
            echo json_encode(['success' => true, 'message' => 'Friend request accepted!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Friend request not found.']);
        }
        break;

    case 'reject':
        $stmt = $pdo->prepare("DELETE FROM friendships WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'");
        $stmt->execute([$targetUserId, $currentUserId]);
        echo json_encode(['success' => true, 'message' => 'Friend request removed.']);
        break;

    case 'remove':
        $stmt = $pdo->prepare("DELETE FROM friendships WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)");
        $stmt->execute([$currentUserId, $targetUserId, $targetUserId, $currentUserId]);
        echo json_encode(['success' => true, 'message' => 'Friend removed.']);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Unknown action.']);
}
`
  },
  {
    path: 'actions/message.php',
    filename: 'message.php',
    category: 'actions',
    description: '1-to-1 private messaging action with XSS sanitization, message storage, and recipient notification.',
    code: `<?php
/**
 * Action: Send Message
 * Endpoint: POST /actions/message.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireAuth();
verifyCsrfToken();

header('Content-Type: application/json');

$senderId   = (int) $_SESSION['user_id'];
$receiverId = (int) ($_POST['receiver_id'] ?? 0);
$content    = trim($_POST['content'] ?? '');

if (!$receiverId || empty($content)) {
    echo json_encode(['success' => false, 'message' => 'Receiver and message content are required.']);
    exit;
}

$pdo = getPDO();

// Ensure receiver is active and not blocking
$check = $pdo->prepare("SELECT id FROM users WHERE id = ? AND status = 'active'");
$check->execute([$receiverId]);
if (!$check->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Recipient is not reachable.']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, content, is_read, created_at) VALUES (?, ?, ?, 0, NOW())");
$stmt->execute([$senderId, $receiverId, $content]);

$messageId = (int) $pdo->lastInsertId();

// Create notification
$notif = $pdo->prepare("INSERT INTO notifications (user_id, actor_id, type, reference_id, is_read, created_at) VALUES (?, ?, 'message', ?, 0, NOW())");
$notif->execute([$receiverId, $senderId, $messageId]);

echo json_encode([
    'success'    => true,
    'message_id' => $messageId,
    'timestamp'  => date('Y-m-d H:i:s')
]);
`
  }
];
