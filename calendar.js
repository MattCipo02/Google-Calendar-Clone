const calendartEl = document.getElementById('calendar');
const monthYearEl = document.getElementById('monthYear');
const modalEl = document.getElementById('eventModal');

let currentDate = new Date();

function renderCalendar(date = new Date()) {
    calendartEl.innerHTML = '';

    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 0).getDay();

    // Display month and year
    monthYearEl.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    weekDays.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'day-name';
        dayEl.textContent = day;
        calendartEl.appendChild(dayEl);
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendartEl.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const cell = document.createElement('div');
        cell.className = 'day';

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        const dateEl = document.createElement('div');
        dateEl.className = 'date-number';
        dateEl.textContent = day;
        cell.appendChild(dateEl);

        const eventToday = events.filter(event => event.date === dateStr);
        const eventBox = document.createElement('div');
        eventBox.className = 'events';

        // Render events for the day
        eventToday.forEach(event => {
            const ev = document.createElement('div');
            ev.className = 'event';
            console.log(event.color||'error')
            ev.style.backgroundColor = event.color || '';

            const eventEl = document.createElement('div');
            eventEl.className = 'event_title';
            eventEl.textContent = '📋' + event.title.split(' - ')[0]; 

            const stakeholderEl = document.createElement('div');
            stakeholderEl.className = 'stakeholder';
            stakeholderEl.textContent = '🧑‍🏫' + event.title.split(' - ')[1];

            const timeEl = document.createElement('div');
            timeEl.className = 'time';
            timeEl.textContent = '🕛' + event.start_time.slice(0,5) + "-" + event.end_time.slice(0,5);

            ev.appendChild(eventEl);
            ev.appendChild(stakeholderEl);
            ev.appendChild(timeEl);
            eventBox.appendChild(ev);
        });

        // Overlay buttons
        const overlay = document.createElement('div');
        overlay.className = 'day-overlay';

        const addBtn = document.createElement('button');
        addBtn.className = 'overlay-btn';
        addBtn.id = 'addEventBtn';
        addBtn.innerHTML = '<span class="btn-text">+ Add</span>';

        addBtn.onclick = e => {
            e.stopPropagation();
            openModalForAdd(dateStr);
        };
        overlay.appendChild(addBtn);

        if (eventToday.length > 0) {
            const editBtn = document.createElement('button');
            editBtn.className = 'overlay-btn';
            editBtn.id = 'editEventBtn';
            editBtn.innerHTML = '<span class="btn-text">✏️Edit</span>';

            editBtn.onclick = e => {
                e.stopPropagation();
                openModalForEdit(eventToday);
            };
            overlay.appendChild(editBtn);
        }

        cell.appendChild(overlay);
        cell.appendChild(eventBox);
        calendartEl.appendChild(cell);
    }
}

function openModalForAdd(dateStr){
    document.querySelector('.modal-content').scrollTop = 0;
    document.getElementById('formAction').value = 'add';
    document.getElementById('eventId').value = '';
    document.getElementById('deleteEventId').value = '';
    document.getElementById('eventName').value = '';
    document.getElementById('stakeholderName').value = '';
    document.getElementById('startDate').value = dateStr;
    document.getElementById('endDate').value = dateStr;
    document.getElementById('startTime').value = '09:00';
    document.getElementById('endTime').value = '10:00';
    document.getElementById('color').value = '#3b82f6'; 

    // Update the color preview
    const colorPreview = document.getElementById('colorPreview');
    if (colorPreview) {
        colorPreview.style.backgroundColor = document.getElementById('color').value;
        colorPreview.style.display = 'block';
    }

    const selector = document.getElementById('eventSelector');
    const wrapper = document.getElementById('eventSelectorWrapper');

    if (selector && wrapper) {
        selector.innerHTML = '';
        wrapper.style.display = 'none';
    }

    modalEl.style.display = 'flex';

}

function openModalForEdit(eventsOnDate) {
    document.getElementById('formAction').value = 'edit';
    modalEl.style.display = 'flex';
    document.querySelector('.modal-content').scrollTop = 0;

    const selector = document.getElementById('eventSelector');
    const wrapper = document.getElementById('eventSelectorWrapper');
    selector.innerHTML = '<option disabled selected> Choose event... </option>';

    eventsOnDate.forEach(event => {
        const option = document.createElement('option');
        option.value = JSON.stringify(event);
        option.textContent = `${event.title} (${event.start}: ${event.start_time} ➡️ ${event.end}: ${event.end_time})`;
        selector.appendChild(option);
    });

    if (eventsOnDate.length > 1){
        wrapper.style.display = 'block';
    } else{
        wrapper.style.display = 'none';
    }

    event_selected = eventsOnDate[0];
    // Pre-fill the form with the first event's details
    document.getElementById('eventId').value = event_selected.id;
    document.getElementById('deleteEventId').value = event_selected.id;
    const [event, stakeholder] = event_selected.title.split(' - ').map(part => part.trim());
    document.getElementById('eventName').value = event || '';
    document.getElementById('stakeholderName').value = stakeholder || '';
    document.getElementById('startDate').value = event_selected.start || '';
    document.getElementById('endDate').value = event_selected.end || '';
    document.getElementById('startTime').value = event_selected.start_time || '';
    document.getElementById('endTime').value = event_selected.end_time || '';
    document.getElementById('color').value = event_selected.color || ''; 

    // Update the color preview
    const colorPreview = document.getElementById('colorPreview');
    if (colorPreview) {
        colorPreview.style.backgroundColor = document.getElementById('color').value;
        colorPreview.style.display = 'block';
    }

    // Handle the selection of an event from the dropdown
    selector.onchange = function() {
        const selectedValue = this.value;
        if (!selectedValue) return;
        const selectedEvent = JSON.parse(selectedValue);
        handleEventSelection(selectedValue);
    };

    handleEventSelection(JSON.stringify(eventsOnDate[0]));

}

function handleEventSelection(eventJSON) {
    const e = JSON.parse(eventJSON);
    document.getElementById('eventId').value = e.id;
    document.getElementById('deleteEventId').value = e.id;
    
    const [event, stakeholder] = e.title.split(' - ').map(part => part.trim());
    document.getElementById('eventName').value = event || '';
    document.getElementById('stakeholderName').value = stakeholder || '';
    document.getElementById('startDate').value = e.start || '';
    document.getElementById('endDate').value = e.end || '';
    document.getElementById('startTime').value = e.start_time || '';
    document.getElementById('endTime').value = e.end_time || '';
    document.querySelector('.modal-content').scrollTop = 0;
}

function closeModal() {
    modalEl.style.display = 'none';
    window.scrollTo(0, 0);
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar(currentDate);
}

function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    clockEl.textContent = [
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0')
    ].join(':');
}

renderCalendar(currentDate);
updateClock();
setInterval(updateClock, 1000);

document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));

document.getElementById('cancelBtn').addEventListener('click', closeModal);


let oldColor = document.getElementById('color').value; // colore iniziale all'avvio
let newColor = oldColor;

const colorInput = document.getElementById('color');

colorInput.addEventListener('change', function () {
    oldColor = newColor;         // salva il colore precedente
    newColor = this.value;       // aggiorna con il colore appena selezionato

    document.getElementById('colorPreview').style.backgroundColor = newColor;

    if (oldColor !== newColor) {
        console.log('Color changed from', oldColor, 'to', newColor);
        // Qui NON possiamo forzare la chiusura del color picker via JS
    }
});


