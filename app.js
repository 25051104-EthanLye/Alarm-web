// --- UPDATED & NEW ROUTES FOR APP.JS ---

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

// 5. Edit an Existing Alarm (NEW)
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

// 6. Delete an Alarm (NEW)
app.post('/delete-alarm/:id', (req, res) => {
    // Filter out the alarm with the matching ID
    alarms = alarms.filter(a => a.id !== req.params.id);
    res.redirect('/manage?msg=Alarm deleted.');
});