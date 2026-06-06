import { useState, useContext, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('phoneNumber', phoneNumber);
      if (password) {
        formData.append('password', password);
      }
      
      if (fileInputRef.current.files[0]) {
        formData.append('profilePic', fileInputRef.current.files[0]);
      }

      const { data } = await api.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateProfile({ ...user, ...data });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setPassword('');
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const profilePicUrl = user?.profilePic 
    ? (user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`)
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=random';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-center -mt-16 mb-8">
            <div className="relative">
              <img 
                src={profilePicUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white shadow-lg"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors border-2 border-white shadow-sm"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-center mb-6 text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6 max-w-xl mx-auto">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
            />
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="+919876543210"
              />
              <p className="text-xs text-gray-500 mt-1">Needed to receive WhatsApp broadcast messages.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold text-lg disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
