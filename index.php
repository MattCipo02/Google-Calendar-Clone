<?php
include 'calendar.php';
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Calendar Project</title>

        <meta name="description" content="My Own Calendar Project"/>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="style.css"/>
    </head>

    <body>
        <header>
            <h1>📅 Event Calendar <br> My Calendar Project</h1>
        </header>

        <!-- Clock -->
        <div class="clock-container">
            <div id="clock" ></div>
        </div>

        <!-- Calendar -->
        <div class="calendar">
            <div class="nav-btn-container">
                <div class="nav-btn" id='prevMonth'>⏮️</div>
                <h2 id="monthYear" style="margin: 0"></h2>
                <button class="nav-btn" id='nextMonth'>⏭️</button>
            </div>

            <div class="calendar-grid" id="calendar"></div>
        </div>

        <!-- Modal for Add/Edit/Delete event -->
        <div class="modal" id="eventModal">
            <div class="modal-content">
                <div id="eventSelectorWrapper">
                    <label for="eventSelector">
                        <strong>Select Event:</strong>
                    </label>
                        <select name="" id="eventSelector">
                            <option disabled selected> Choose Event...</option>
                        </select>            
                </div>

                <!-- Main Form -->
                <form method="POST" id="eventForm">
                    <input type="hidden" name="action" id ="formAction" value="add">
                    <input type="hidden" name="event_id" id="eventId">

                    <label for="eventName">Event Title:</label>
                    <input type="text" name="event_name" id="eventName" required>

                    <label for="stakeholderName">Stakeholder Name:</label>
                    <input type="text" name="stakeholder_name" id="stakeholderName" required>

                    <label for="startDate">Start Date:</label>
                    <input type="date" name="start_date" id="startDate" required>

                    <label for="endDate">End Date:</label>
                    <input type="date" name="end_date" id="endDate" required>

                    <label for="startTime">Start time:</label>
                    <input type="time" name="start_time" id="startTime" required>

                    <label for="endTime">End time:</label>
                    <input type="time" name="end_time" id="endTime" required>

                    <button type="submit">✅ Save</button>
                </form>

                <!-- Delete Form -->
                <form method="POST" onsubmit="return confirm('Are you sure you want to delete this event?')">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="event_id" id="deleteEventId">
                    <button type="submit" class="submit-btn"> 🗑️ Delete</button>
                </form>

                <!-- Cancel Form -->
                <button type="button" class="submit-btn" id='cancelBtn'>❌ Cancel</button>
            </div>
        </div>
        

        <script>
            const events = <?= json_encode($eventsFromDB, JSON_UNESCAPED_UNICODE); ?>;
        </script>

        <script src="calendar.js"></script>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
            const popup = document.getElementById('popup-message');
            if (popup) {
                setTimeout(() => {
                popup.style.opacity = '0';
                setTimeout(() => {
                popup.remove();
                }, 500); // Rimozione dopo la transizione
                }, 2000); // Mostra per 2 secondi
            }
            });
        </script>


    </body>

    <?php if ($successMsg || $errorMsg): ?>
        <div id="popup-message" class="<?= $successMsg ? 'success' : 'error' ?>">
            <?= htmlspecialchars($successMsg ?: $errorMsg, ENT_QUOTES, 'UTF-8') ?>
        </div>
    <?php endif; ?>

</html>