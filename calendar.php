<?php

// Connect to the database
include 'connection.php';

$successMsg = '';
$errorMsg = '';
$eventsFromDB = []; // Initialize an empty array to hold events

/* add event */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'add') {
    // Handle form submission to add a new event
    $event = trim($_POST['event_name'] ?? '');
    $stakeholder = trim($_POST['stakeholder_name'] ?? '');
    $start = trim($_POST['start_date'] ?? '');
    $end = trim($_POST['end_date'] ?? '');
    $startTime = trim($_POST['start_time'] ?? '');
    $endTime = trim($_POST['end_time'] ?? '');

    $date1 = new DateTime($start . 'T' . $startTime);
    $date2 = new DateTime($end . 'T' . $endTime);

    if ($event && $stakeholder && $date1 <= $date2) {
        // Prepare and execute the SQL statement to insert the event
        $stmt = $conn->prepare("INSERT INTO events (event_name, stakeholder_name, start_date, end_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $event, $stakeholder, $start, $end, $startTime, $endTime);
        
        $stmt->execute();
        
        $stmt->close();

        header("Location: " . $_SERVER['PHP_SELF'] . "?success=1");
        exit;
    } else {
        header("Location: " . $_SERVER['PHP_SELF'] . "?error=1");
        exit;
    }
}

/* edit event */
if($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'edit') {
    $id = $_POST['event_id'] ?? null;
    $event = trim($_POST['event_name'] ?? '');
    $stakeholder = trim($_POST['stakeholder_name'] ?? '');
    $start = trim($_POST['start_date'] ?? '');
    $end = trim($_POST['end_date'] ?? '');
    $startTime = trim($_POST['start_time'] ?? '');
    $endTime = trim($_POST['end_time'] ?? '');

    $date1 = new DateTime($start . 'T' . $startTime);
    $date2 = new DateTime($end . 'T' . $endTime);

    if ($id && $event && $stakeholder && $date1 <= $date2) {
        // Prepare and execute the SQL statement to update the event
        $stmt = $conn->prepare("UPDATE events SET event_name = ?, stakeholder_name = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ? WHERE id = ?");
        $stmt->bind_param("ssssssi", $event, $stakeholder, $start, $end, $startTime, $endTime, $id);
        
        $stmt->execute();
        
        $stmt->close();

        header("Location: " . $_SERVER['PHP_SELF'] . "?success=2");
        exit;
    } else {
        header("Location: " . $_SERVER['PHP_SELF'] . "?error=2");
        exit;
    }
}

/* delete event */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    // Handle event deletion
    $id = $_POST['event_id'] ?? null;

    if ($id) {
        // Prepare and execute the SQL statement to delete the event
        $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        $stmt->execute();
        
        $stmt->close();

        header("Location: " . $_SERVER['PHP_SELF'] . "?success=3");
        exit;
    }
}

# Success
if (isset($_GET['success'])) {
    $successMsg = match ($_GET['success']) {
        '1' => "✅ Event added successfully!",
        '2' => "✅ Event updated successfully!",
        '3' => "✅ Event deleted successfully!",
        default => ""
    };
}

# Error
if (isset($_GET['error'])) {
    $errorMsg = "❌ Failed to add event. Please check your input.";
}

/* Fetch ALL events from the database */
$result = $conn->query("SELECT * FROM events");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $start = new DateTime($row['start_date']);
        $end = new DateTime($row['end_date']);

        while($start <= $end) {
            $eventsFromDB[] = [
                'id' => $row['id'],
                'title' => "{$row['event_name']} - {$row['stakeholder_name']}",
                'date' => $start->format('Y-m-d'),
                'start' => $row['start_date'],
                'end' => $row['end_date'],
                'start_time' => $row['start_time'],
                'end_time' => $row['end_time']
            ];
            $start->modify('+1 day'); // Increment by one day
        }
    }
}

// Close the database connection
$conn->close();
?>