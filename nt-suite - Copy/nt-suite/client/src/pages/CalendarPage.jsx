import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Calendar as CalIcon, Plus, Clock, MapPin, User, ChevronLeft,
  ChevronRight, CheckCircle
} from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEventModal, setNewEventModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    api.get('/calendar').then((res) => {
      setEvents(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const start = new Date(`${eventDate}T${startTime}:00`);
      const end = new Date(`${eventDate}T${endTime}:00`);

      await api.post('/calendar', {
        title,
        start,
        end,
        notes
      });
      setNewEventModal(false);
      setTitle('');
      setNotes('');
      loadData();
    } catch (err) {
      alert('Error scheduling event: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalIcon className="text-[#E74C3C]" /> Calendar & Meeting Scheduler
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Coordinate customer demo calls, board reviews, team standups, and internal agendas
          </p>
        </div>

        <button
          onClick={() => setNewEventModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> Schedule Event
        </button>
      </div>

      {/* Events Agenda List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No calendar events scheduled. Click "Schedule Event" to add a meeting.
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="o-card border-l-4 border-l-[#E74C3C] space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {evt.title}
                </h3>
                <span className="o-badge o-badge-teal">
                  {new Date(evt.start).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-500" />
                  <span>
                    {new Date(evt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(evt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {evt.partner && (
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-[#714B67]" />
                    <span>With: {evt.partner.name}</span>
                  </div>
                )}
              </div>

              {evt.notes && (
                <p className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-gray-600 dark:text-gray-300">
                  {evt.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Event Modal */}
      {newEventModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Schedule Calendar Event</span>
              <button onClick={() => setNewEventModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Event Title:</label>
                  <input
                    required
                    placeholder="e.g. Q3 Sales Review with Client"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Date:</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Start Time:</label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>End Time:</label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="o-field">
                  <label>Meeting Notes / Zoom Link:</label>
                  <textarea
                    rows={2}
                    placeholder="Agenda items or call link..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewEventModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Confirm Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
