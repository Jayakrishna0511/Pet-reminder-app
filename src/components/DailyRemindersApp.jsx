import React, { useState, useEffect } from 'react';

const DailyRemindersApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSettings, setShowSettings] = useState(true);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showReminderMenu, setShowReminderMenu] = useState(null);
  const [formData, setFormData] = useState({
    pet: 'Browny',
    category: 'General',
    title: '',
    notes: '',
    startDate: new Date().toLocaleDateString('en-GB'),
    endDate: '',
    time: '12:00 PM',
    frequency: 'Everyday'
  });

  const petOptions = ['Browny', 'Max', 'Luna', 'Charlie', 'Bella', 'Rocky', 'Daisy', 'Buddy'];
  const categoryOptions = ['General', 'Walking', 'Feeding', 'Medical', 'Grooming', 'Training', 'Playing', 'Sleeping'];

  useEffect(() => {
    const sampleReminders = [
      {
        id: 1,
        title: 'Morning Walk',
        pet: 'Browny',
        time: '8:00 AM',
        type: 'Everyday',
        completed: false,
        category: 'pending',
        date: new Date().toDateString(),
        notes: 'Take the usual route around the park'
      },
      {
        id: 2,
        title: 'Evening Walk',
        pet: 'Browny',
        time: '6:00 PM',
        type: 'Everyday',
        completed: false,
        category: 'pending',
        date: new Date().toDateString()
      },
      {
        id: 3,
        title: 'Breakfast',
        pet: 'Browny',
        time: '7:00 AM',
        type: 'Everyday',
        completed: false,
        category: 'pending',
        date: new Date().toDateString()
      },
      {
        id: 4,
        title: 'Lunch',
        pet: 'Browny',
        time: '1:00 PM',
        type: 'Everyday',
        completed: false,
        category: 'pending',
        date: new Date().toDateString()
      },
      {
        id: 5,
        title: 'Vet visit',
        pet: 'Browny',
        time: '3:00 PM',
        type: 'Once',
        completed: false,
        category: 'pending',
        date: new Date(Date.now() + 86400000).toDateString() // Tomorrow
      },
      {
        id: 6,
        title: 'Morning Walk',
        pet: 'Browny',
        time: '8:00 AM',
        type: 'Everyday',
        completed: true,
        category: 'completed',
        date: new Date(Date.now() - 86400000).toDateString() // Yesterday
      }
    ];
    setReminders(sampleReminders);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const newReminder = {
      id: Date.now(),
      title: formData.title,
      pet: formData.pet,
      time: formData.time,
      type: formData.frequency,
      completed: false,
      category: 'pending',
      date: selectedDate.toDateString(),
      notes: formData.notes
    };

    setReminders([...reminders, newReminder]);

    // Reset form
    setFormData({
      pet: 'Browny',
      category: 'General',
      title: '',
      notes: '',
      startDate: new Date().toLocaleDateString('en-GB'),
      endDate: '',
      time: '12:00 PM',
      frequency: 'Everyday'
    });

    // Reset dropdown states
    setShowPetDropdown(false);
    setShowCategoryDropdown(false);
    setShowNotesInput(false);
    setCurrentView('home');
  };

  const toggleComplete = (id) => {
    setReminders(reminders.map(r =>
      r.id === id ? {
        ...r,
        completed: !r.completed,
        category: !r.completed ? 'completed' : 'pending'
      } : r
    ));
    setShowReminderMenu(null);
  };

  const markAsRead = (id) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, read: true } : r
    ));
    setShowReminderMenu(null);
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    setShowReminderMenu(null);
  };

  const editReminder = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      setFormData({
        pet: reminder.pet,
        category: 'General',
        title: reminder.title,
        notes: reminder.notes || '',
        startDate: new Date(reminder.date).toLocaleDateString('en-GB'),
        endDate: '',
        time: reminder.time,
        frequency: reminder.type
      });
      setCurrentView('add');
      setShowReminderMenu(null);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const hasRemindersOnDate = (date) => {
    const dateStr = date.toDateString();
    return reminders.some(r => r.date === dateStr);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();

    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${prevMonthDays - i}`} className="text-center p-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSameDay(currentDate, selectedDate);
      const isToday = isSameDay(currentDate, today);
      const hasReminders = hasRemindersOnDate(currentDate);

      days.push(
        <div
          key={day}
          className="text-center p-1"
          style={{
            fontSize: '14px',
            fontWeight: isSelected || isToday ? 'bold' : 'normal',
            backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : 
                           isToday ? 'rgba(255,255,255,0.7)' : 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            color: isSelected ? '#333' : isToday ? '#333' : 'white',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: hasReminders ? '2px solid rgba(255,255,255,0.8)' : 'none'
          }}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {hasReminders && (
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                backgroundColor: isSelected ? '#32D74B' : 'white',
                borderRadius: '50%'
              }}
            />
          )}
        </div>
      );
    }

    // Next month days to fill the grid
    const totalCells = Math.ceil((adjustedFirstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (adjustedFirstDay + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="text-center p-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          {day}
        </div>
      );
    }

    return days;
  };

  // Filter reminders for selected date
  const selectedDateStr = selectedDate.toDateString();
  const todaysReminders = reminders.filter(r => r.date === selectedDateStr);
  const pendingReminders = todaysReminders.filter(r => !r.completed);
  const completedReminders = todaysReminders.filter(r => r.completed);

  if (currentView === 'add') {
    return (
      <div style={{
        maxWidth: '375px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
          rel="stylesheet"
        />

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <button
            className="btn p-0 d-flex align-items-center"
            onClick={() => setCurrentView('home')}
            style={{ fontSize: '18px', color: '#333' }}
          >
            ←
          </button>
          <h6 className="mb-0" style={{ fontSize: '17px', fontWeight: '600', color: '#333' }}>Add Reminder</h6>
          <button
            className="btn text-primary p-0"
            onClick={handleSave}
            style={{ fontSize: '17px', fontWeight: '400', color: '#007AFF' }}
          >
            Save
          </button>
        </div>

        {/* Selected Date Display */}
        <div className="px-3 py-2" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <small style={{ fontSize: '13px', color: '#8E8E93' }}>
            Reminder for: {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </small>
        </div>

        {/* Form Content */}
        <div style={{ padding: '16px' }}>
          {/* Pet and Category Selection */}
          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px' }}>Select Pet</label>
              <div style={{ position: 'relative' }}>
                <button
                  className="btn w-100 text-start d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#F2F2F7',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    color: '#333'
                  }}
                  onClick={() => setShowPetDropdown(!showPetDropdown)}
                >
                  <span>🐕 {formData.pet}</span>
                  <span style={{ fontSize: '12px', color: '#8E8E93', transform: showPetDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {showPetDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #E5E5EA',
                    borderRadius: '8px',
                    marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {petOptions.map(pet => (
                      <button
                        key={pet}
                        className="btn w-100 text-start"
                        style={{
                          border: 'none',
                          padding: '12px',
                          fontSize: '16px',
                          backgroundColor: formData.pet === pet ? '#F2F2F7' : 'transparent'
                        }}
                        onClick={() => {
                          setFormData({...formData, pet});
                          setShowPetDropdown(false);
                        }}
                      >
                        🐕 {pet}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px' }}>Select Category</label>
              <div style={{ position: 'relative' }}>
                <button
                  className="btn w-100 text-start d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#F2F2F7',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    color: '#333'
                  }}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span>🏷 {formData.category}</span>
                  <span style={{ fontSize: '12px', color: '#8E8E93', transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {showCategoryDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #E5E5EA',
                    borderRadius: '8px',
                    marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {categoryOptions.map(category => (
                      <button
                        key={category}
                        className="btn w-100 text-start"
                        style={{
                          border: 'none',
                          padding: '12px',
                          fontSize: '16px',
                          backgroundColor: formData.category === category ? '#F2F2F7' : 'transparent'
                        }}
                        onClick={() => {
                          setFormData({...formData, category});
                          setShowCategoryDropdown(false);
                        }}
                      >
                        🏷 {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reminder Info */}
          <div
            className="mb-3"
            style={{
              backgroundColor: '#1C1C1E',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Reminder Info
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Set a reminder for...
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Type here..."
                style={{
                  fontSize: '16px',
                  border: '1px solid #E5E5EA',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#fff'
                }}
              />
              <small
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '-20px',
                  fontSize: '13px',
                  color: '#8E8E93'
                }}
              >
                {formData.title.length}/100
              </small>
            </div>
          </div>

          <div className="mb-4" style={{ marginTop: '24px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0" style={{ fontSize: '16px', fontWeight: '400', color: '#333' }}>
                Add Notes (Optional)
              </label>
              <button
                className="btn p-0"
                style={{ fontSize: '16px', color: '#34C759', fontWeight: '400' }}
                onClick={() => setShowNotesInput(!showNotesInput)}
              >
                {showNotesInput ? 'Hide' : 'Add'}
              </button>
            </div>
            {showNotesInput && (
              <div style={{ marginTop: '12px' }}>
                <textarea
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes here..."
                  rows="4"
                  style={{
                    fontSize: '16px',
                    border: '1px solid #E5E5EA',
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: '#fff',
                    resize: 'vertical'
                  }}
                />
                <small
                  style={{
                    fontSize: '13px',
                    color: '#8E8E93',
                    display: 'block',
                    marginTop: '4px'
                  }}
                >
                  {formData.notes.length}/500 characters
                </small>
              </div>
            )}
          </div>

          {/* Reminder Settings */}
          <div
            className="mb-3 d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: '#1C1C1E',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => setShowSettings(!showSettings)}
          >
            <span>Reminder Settings</span>
            <span style={{ fontSize: '12px', transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              ▼
            </span>
          </div>

          {showSettings && (
            <div>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                  Reminder Time
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    style={{
                      fontSize: '16px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#F2F2F7',
                      paddingRight: '40px'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#8E8E93' }}>
                    🕐
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  Reminder Frequency
                </label>
                <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px' }}>
                  How often should this reminder repeat?
                </p>
                <select
                  className="form-select"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '16px',
                    border: '1px solid #E5E5EA',
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: '#F2F2F7'
                  }}
                >
                  <option value="Everyday">Everyday</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Once">Once</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '375px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#fff' }}>
        <div>
          <h5 className="mb-0" style={{ fontSize: '28px', fontWeight: '700', color: '#333' }}>daily reminders</h5>
          <div className="d-flex align-items-center mt-1">
            <span style={{ fontSize: '14px', color: '#8E8E93' }}>🔥 your streaks</span>
          </div>
        </div>
        <button
          className="btn text-primary p-0"
          style={{ fontSize: '17px', color: '#007AFF' }}
          onClick={() => {/* View all functionality */}}
        >
          View all
        </button>
      </div>

      {/* Calendar */}
      <div className="mx-3 mb-3" style={{ backgroundColor: '#32D74B', borderRadius: '16px', padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn p-0 text-white"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            style={{ fontSize: '18px', opacity: 0.8 }}
          >
            ‹
          </button>
          <h6 className="text-white mb-0" style={{ fontSize: '18px', fontWeight: '600' }}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()} {currentMonth.getFullYear()}
          </h6>
          <button
            className="btn p-0 text-white"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            style={{ fontSize: '18px', opacity: 0.8 }}
          >
            ›
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
            <div key={day} className="text-center text-white" style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>
              {day}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {renderCalendar()}
        </div>
      </div>

      {/* Selected Date Info */}
      <div className="px-3 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span style={{ fontSize: '16px', color: '#8E8E93' }}>
              📅 {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <span style={{ fontSize: '18px', color: '#8E8E93' }}>≡</span>
        </div>
      </div>

      {/* Pending Goals Header */}
      {pendingReminders.length > 0 && (
        <div className="px-3 mb-2">
          <p className="mb-0" style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'lowercase' }}>
            pending goals ({pendingReminders.length})
          </p>
        </div>
      )}

      {/* Reminders List */}
      <div className="px-3 mb-3">
        {pendingReminders.map(reminder => (
          <div key={reminder.id} className="bg-white rounded mb-2 shadow-sm" style={{ borderRadius: '12px', padding: '16px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <h6 className="mb-2" style={{ 
                  fontSize: '17px', 
                  fontWeight: '600', 
                  color: '#333',
                  opacity: reminder.read ? 0.6 : 1
                }}>
                  {reminder.title}
                  {reminder.read && <span style={{ fontSize: '12px', color: '#8E8E93', marginLeft: '8px' }}>✓ read</span>}
                </h6>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <span style={{ fontSize: '14px', color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🐕 For {reminder.pet}
                  </span>
                  <span style={{ fontSize: '14px', color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🕐 At {reminder.time}
                  </span>
                  <span style={{ fontSize: '14px', color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📅 {reminder.type}
                  </span>
                </div>
                {reminder.notes && (
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
                    {reminder.notes}
                  </p>
                )}
              </div>
              <button
                className="btn p-0"
                style={{ fontSize: '18px', color: '#C7C7CC' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReminderMenu(showReminderMenu === reminder.id ? null : reminder.id);
                }}
              >
                ⋮
              </button>
            </div>

            {/* Dropdown Menu */}
            {showReminderMenu === reminder.id && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '16px',
                backgroundColor: 'white',
                border: '1px solid #E5E5EA',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 10,
                minWidth: '150px'
              }}>
                <button
                  className="btn w-100 text-start"
                  style={{ border: 'none', padding: '12px', fontSize: '14px' }}
                  onClick={() => markAsRead(reminder.id)}
                >
                  📖 Mark as Read
                </button>
                <button
                  className="btn w-100 text-start"
                  style={{ border: 'none', padding: '12px', fontSize: '14px' }}
                  onClick={() => toggleComplete(reminder.id)}
                >
                  ✅ Mark as Complete
                </button>
                <button
                  className="btn w-100 text-start"
                  style={{ border: 'none', padding: '12px', fontSize: '14px' }}
                  onClick={() => editReminder(reminder.id)}
                >
                  ✏ Edit
                </button>
                <button
                  className="btn w-100 text-start"
                  style={{ border: 'none', padding: '12px', fontSize: '14px', color: '#FF3B30' }}
                  onClick={() => deleteReminder(reminder.id)}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completed Goals Header */}
      {completedReminders.length > 0 && (
        <div className="px-3 mb-2" style={{ marginTop: '24px' }}>
          <p className="mb-0" style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'lowercase' }}>
            completed goals ({completedReminders.length})
          </p>
        </div>
      )}

      {/* Completed Goals */}
      <div className="px-3 mb-4">
        {completedReminders.map(reminder => (
          <div key={reminder.id} className="mb-2" style={{ backgroundColor: '#F2F2F7', borderRadius: '12px', padding: '16px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1">
                <span
                  style={{
                    fontSize: '17px',
                    color: '#8E8E93',
                    textDecoration: 'line-through',
                    fontWeight: '400'
                  }}
                >
                  {reminder.title}
                </span>
                <div style={{ fontSize: '13px', color: '#8E8E93', marginTop: '4px' }}>
                  🕐 {reminder.time} • 🐕 {reminder.pet}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn p-0"
                  onClick={() => toggleComplete(reminder.id)}
                  style={{
                    fontSize: '16px',
                    color: '#34C759',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                  title="Mark as incomplete"
                >
                  ↩
                </button>
                <button
                  className="btn p-0"
                  onClick={() => deleteReminder(reminder.id)}
                  style={{
                    fontSize: '18px',
                    color: '#8E8E93',
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: 'white', fontSize: '12px', lineHeight: '1' }}>✕</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pendingReminders.length === 0 && completedReminders.length === 0 && (
        <div className="px-3 mb-4 text-center" style={{ marginTop: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h6 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
            No reminders for this date
          </h6>
          <p style={{ fontSize: '14px', color: '#8E8E93' }}>
            Tap the + button to add your first reminder
          </p>
        </div>
      )}

      {/* Add Button */}
      <div className="position-fixed" style={{ bottom: '90px', right: '20px', zIndex: 10 }}>
        <button
          className="btn rounded-circle d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: '#32D74B',
            width: '56px',
            height: '56px',
            border: 'none',
            boxShadow: '0 8px 24px rgba(50,215,75,0.4)'
          }}
          onClick={() => setCurrentView('add')}
        >
          <span style={{ color: 'white', fontSize: '28px', lineHeight: '1', fontWeight: '300' }}>+</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div
        className="position-fixed bottom-0 bg-white d-flex justify-content-around align-items-center"
        style={{
          width: '375px',
          height: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTop: '0.5px solid #C7C7CC',
          paddingBottom: '20px',
          paddingTop: '8px'
        }}
      >
        <button className="btn p-0 d-flex flex-column align-items-center">
          <span style={{ fontSize: '24px', marginBottom: '4px' }}>🏠</span>
        </button>
        <button className="btn p-0 d-flex flex-column align-items-center">
          <span style={{ fontSize: '24px', marginBottom: '4px' }}>❤</span>
        </button>
        <div className="d-flex flex-column align-items-center">
          <div
            style={{
              backgroundColor: '#1C1C1E',
              borderRadius: '20px',
              padding: '8px 16px',
              marginBottom: '4px'
            }}
          >
            <span style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>reminders</span>
          </div>
        </div>
        <button className="btn p-0 d-flex flex-column align-items-center">
          <span style={{ fontSize: '24px', marginBottom: '4px' }}>👤</span>
        </button>
      </div>

      {/* Click outside to close menu */}
      {showReminderMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5
          }}
          onClick={() => setShowReminderMenu(null)}
        />
      )}
    </div>
  );
};

export default DailyRemindersApp;