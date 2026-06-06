import { useState, useEffect, useContext, useRef } from 'react';
import { Users, Send, Image as ImageIcon, MessageCircle, Check, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import api from '../services/api';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { socket, onlineUsers } = useContext(SocketContext);
  
  const [contacts, setContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Array for multiple selection
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 1) {
      fetchChatHistory(selectedUsers[0]._id);
    } else {
      setMessages([]); // Clear messages when multiple or none selected
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        // If it's from the person we are currently chatting with
        if (selectedUsers.length === 1 && (message.sender._id === selectedUsers[0]._id || message.sender._id === user._id)) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => {
      if (socket) socket.off('receive-message');
    };
  }, [socket, selectedUsers, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/chat/users');
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts', error);
    }
  };

  const fetchChatHistory = async (userId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/chat/${userId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching history', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (contact) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u._id === contact._id);
      if (exists) {
        return prev.filter((u) => u._id !== contact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || selectedUsers.length === 0) return;

    const payload = {
      senderId: user._id,
      receiverIds: selectedUsers.map(u => u._id),
      text: newMessage,
    };

    socket.emit('send-message', payload);
    
    // Optimistically add to UI if single chat
    if (selectedUsers.length === 1) {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          text: newMessage,
          sender: { _id: user._id, name: user.name },
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      // If broadcast, just show an alert or toast
      alert(`In-app message broadcasted to ${selectedUsers.length} users!`);
    }

    setNewMessage('');
  };

  const sendRealWhatsApp = async () => {
    if (!newMessage.trim() || selectedUsers.length === 0) return;

    try {
      const payload = {
        receiverIds: selectedUsers.map(u => u._id),
        message: newMessage,
      };
      
      const { data } = await api.post('/whatsapp/broadcast', payload);
      alert(data.message + '\nCheck console for logs.');
      console.log('WhatsApp Broadcast Logs:', data.logs);
      setNewMessage('');
    } catch (error) {
      console.error(error);
      alert('Failed to send real WhatsApp message.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
      <div className="bg-white shadow-xl rounded-2xl flex h-full overflow-hidden border border-gray-100">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="text-indigo-600" />
              Contacts
            </h2>
            <p className="text-xs text-gray-500 mt-1">Select multiple to broadcast</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {contacts.map((contact) => {
              const isSelected = selectedUsers.some((u) => u._id === contact._id);
              const isOnline = onlineUsers.includes(contact._id);
              
              return (
                <div
                  key={contact._id}
                  onClick={() => toggleUserSelection(contact)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${
                    isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                  {isSelected && <CheckCircle2 size={20} className="text-indigo-600" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUsers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle size={64} className="mb-4 text-indigo-200" />
              <h2 className="text-2xl font-bold text-gray-600">MiniChat</h2>
              <p>Select a contact to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {selectedUsers.length === 1 ? selectedUsers[0].name.charAt(0) : <Users size={20} />}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {selectedUsers.length === 1 
                        ? selectedUsers[0].name 
                        : `Broadcasting to ${selectedUsers.length} users`}
                    </h2>
                    <p className="text-xs text-indigo-600 font-medium">
                      {selectedUsers.length === 1 
                        ? (onlineUsers.includes(selectedUsers[0]._id) ? 'Online' : 'Offline')
                        : 'Multiple Recipients'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {selectedUsers.length > 1 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <Users size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Broadcast Mode</h3>
                    <p className="text-gray-500 max-w-sm">
                      Type a message below to send it individually to all {selectedUsers.length} selected users.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender._id === user._id;
                      return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                            isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                            <span className={`text-[10px] mt-1 block ${isMe ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2 items-center">
                  <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <ImageIcon size={24} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={selectedUsers.length > 1 ? "Type a broadcast message..." : "Type a message..."}
                    className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-full px-4 py-2 text-sm transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </form>

                {selectedUsers.length > 0 && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={sendRealWhatsApp}
                      disabled={!newMessage.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                      <MessageCircle size={16} />
                      Send to Real WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
