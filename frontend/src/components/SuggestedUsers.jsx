import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      const response = await userAPI.getSuggestedUsers();
      setSuggestedUsers(response.data.users.slice(0, 5));
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userAPI.followUser(userId);
      setSuggestedUsers(suggestedUsers.filter((u) => u._id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-4">
      {/* Current User */}
      <div className="flex items-center justify-between">
        <Link
          to={`/profile/${user?.username}`}
          className="flex items-center gap-3"
        >
          <img
            src={user?.profilePicture}
            alt={user?.username}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-sm">{user?.username}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {user?.fullName || user?.username}
            </div>
          </div>
        </Link>
        <Link
          to="/edit-profile"
          className="text-primary-500 text-xs font-semibold hover:text-primary-600"
        >
          Edit
        </Link>
      </div>

      {/* Suggested Header */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
          Suggested for you
        </span>
        <Link
          to="/explore"
          className="text-xs font-semibold hover:text-gray-600 dark:hover:text-gray-300"
        >
          See All
        </Link>
      </div>

      {/* Suggested Users */}
      <div className="space-y-3">
        {suggestedUsers.map((suggestedUser) => (
          <div key={suggestedUser._id} className="flex items-center justify-between">
            <Link
              to={`/profile/${suggestedUser.username}`}
              className="flex items-center gap-3"
            >
              <img
                src={suggestedUser.profilePicture}
                alt={suggestedUser.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-sm">{suggestedUser.username}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  {suggestedUser.followers?.length || 0} followers
                </div>
              </div>
            </Link>
            <button
              onClick={() => handleFollow(suggestedUser._id)}
              className="text-primary-500 text-xs font-semibold hover:text-primary-600"
            >
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="pt-4 text-xs text-gray-400 dark:text-gray-500">
        <p>
          About • Help • Press • API • Jobs • Privacy • Terms • Locations •
          Language
        </p>
        <p className="mt-4">© 2024 Instagram Clone</p>
      </div>
    </div>
  );
};

export default SuggestedUsers;
