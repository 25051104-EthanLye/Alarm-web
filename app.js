const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // To parse form data

// In-memory array to store alarms
let alarms = [];

// Helper function to get top 3 latest alarms
const getLatestAlarms = () => alarms.slice(-3).reverse();

// --- ROUTES ---

// 1. Home Page
app.get('/', (req, res) => {
    res.render('index', { 
        latestAlarms: getLatestAlarms() 
    });
});

// 2. Manage Alarms Page (Updated to handle 'Edit' mode)
app.get('/manage', (req, res) => {
    const message = req.query.msg || null;
    const editId = req.query.edit || null;
    
    // If the user clicked "Edit", find that specific alarm to pre-fill the form
    let editAlarm = null;
    if (editId) {
        editAlarm = alarms.find(a => a.id === editId);
    }

    res.render('manage', { alarms, message, editAlarm });
});

// 3. Add a New Alarm
app.post('/add-alarm', (req, res) => {
    const { title, description, date, time } = req.body;
    
    const newAlarm = {
        id: Date.now().toString(), // Simple unique ID
        title,
        description,
        date,
        time,
        isActive: true
    };
    
    alarms.push(newAlarm);
    res.redirect('/manage?msg=Alarm successfully added!');
});

// 4. Toggle Alarm Status (From Home Page)
app.post('/toggle-alarm/:id', (req, res) => {
    const alarm = alarms.find(a => a.id === req.params.id);
    if (alarm) {
        alarm.isActive = !alarm.isActive;
    }
    res.redirect('/');
});

// 5. Edit an Existing Alarm
app.post('/edit-alarm/:id', (req, res) => {
    const { title, description, date, time } = req.body;
    const alarmIndex = alarms.findIndex(a => a.id === req.params.id);
    
    if (alarmIndex !== -1) {
        // Update the existing alarm's data, but keep its original ID and status
        alarms[alarmIndex] = {
            ...alarms[alarmIndex],
            title,
            description,
            date,
            time
        };
        res.redirect('/manage?msg=Alarm successfully updated!');
    } else {
        res.redirect('/manage?msg=Error: Alarm not found.');
    }
});

// 6. Delete an Alarm
app.post('/delete-alarm/:id', (req, res) => {
    // Filter out the alarm with the matching ID
    alarms = alarms.filter(a => a.id !== req.params.id);
    res.redirect('/manage?msg=Alarm deleted.');
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Alarm-Web is running at http://localhost:${PORT}`);
});