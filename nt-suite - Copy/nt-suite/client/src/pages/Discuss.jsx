import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  MessageSquare, Hash, Lock, Send, Plus, Users, User,
  Smile, Paperclip
} from 'lucide-react';

export default function Discuss() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');

  const messagesEndRef = useRef(null);

  const loadChannels = () => {
    api.get('/discuss/channels').then((res) => {
      setChannels(res || []);
      if (res && res.length > 0 && !activeChannel) {
        setActiveChannel(res[0]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const loadMessages = (chanId) => {
    if (!chanId) return;
    api.get(`/discuss/channels/${chanId}/messages`).then((res) => {
      setMessages(res || []);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  };

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
    }
  }, [activeChannel]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChannel) return;
    try {
      await api.post(`/discuss/channels/${activeChannel.id}/messages`, {
        content: newMsg
      });
      setNewMsg('');
      loadMessages(activeChannel.id);
    } catch (err) {
      alert('Error sending message: ' + err.message);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!channelName) return;
    try {
      const res = await api.post('/discuss/channels', {
        name: channelName.toLowerCase().replace(/\s+/g, '-'),
        type: channelType
      });
      setNewChannelModal(false);
      setChannelName('');
      loadChannels();
      setActiveChannel(res);
    } catch (err) {
      alert('Error creating channel: ' + err.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-var(--topbar-h))] bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Channels List */}
      <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-[#E26D5C]" /> Discuss & Chat
          </h2>
          <button
            onClick={() => setNewChannelModal(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            title="Create Channel"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1">Channels</div>
          {channels.map((chan) => (
            <button
              key={chan.id}
              onClick={() => setActiveChannel(chan)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeChannel?.id === chan.id
                  ? 'bg-[#714B67] text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {chan.type === 'private' ? <Lock size={13} /> : <Hash size={13} />}
              <span className="truncate">{chan.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="h-12 px-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-gray-400" />
            <span className="font-bold text-sm text-gray-900 dark:text-white">
              {activeChannel?.name || 'Select a channel'}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {activeChannel?.description || 'Public communication'}
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => {
            const isMe = m.userId === user?.id;
            return (
              <div key={m.id} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                  style={{ backgroundColor: m.user?.color || '#714B67' }}
                >
                  {(m.user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-xs text-gray-900 dark:text-white">
                      {m.user?.name || 'Teammate'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg inline-block">
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message #${activeChannel?.name || 'channel'}...`}
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#714B67] dark:text-white"
            />
            <button
              type="submit"
              disabled={!newMsg.trim()}
              className="bg-[#714B67] hover:bg-[#5A3C52] disabled:opacity-50 text-white p-2.5 rounded-xl transition"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* New Channel Modal */}
      {newChannelModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Create Channel</span>
              <button onClick={() => setNewChannelModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateChannel}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Channel Name:</label>
                  <input
                    required
                    placeholder="e.g. project-apollo"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                </div>
                <div className="o-field">
                  <label>Privacy:</label>
                  <select
                    value={channelType}
                    onChange={(e) => setChannelType(e.target.value)}
                  >
                    <option value="public">Public (Everyone can join)</option>
                    <option value="private">Private (Invite only)</option>
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewChannelModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Create Channel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
