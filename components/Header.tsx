'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, HelpCircle, User, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState('User');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  // Persisted read state for notifications
  const getReadIds = (): Set<string> => {
    try {
      const raw = localStorage.getItem('readNotificationIds');
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  };

  const saveReadIds = (ids: Set<string>) => {
    try {
      localStorage.setItem('readNotificationIds', JSON.stringify(Array.from(ids)));
    } catch {}
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'User');
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    
    // Load notifications
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      const readIds = getReadIds();
      const list = (data.notifications || []).map((n: any) => ({
        ...n,
        unread: !!n.unread && !readIds.has(String(n.id)),
      }));
      setNotifications(list);
      setUnreadCount(list.filter((n: any) => n.unread).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (notification.unread) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notification.id, action: 'markRead' }),
        });
        // Update local read state and UI immediately
        const readIds = getReadIds();
        readIds.add(String(notification.id));
        saveReadIds(readIds);
        setNotifications((prev) => prev.map((n) => n.id === notification.id ? { ...n, unread: false } : n));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Navigate to the link
    if (notification.link) {
      setShowNotifications(false);
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      // Persist all current IDs as read and update UI immediately
      const ids = new Set<string>(notifications.map((n) => String(n.id)));
      const readIds = getReadIds();
      ids.forEach((id) => readIds.add(id));
      saveReadIds(readIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-48 z-10 flex items-center justify-end px-6">
      {/* Right section only */}
      <div className="flex items-center gap-4 h-full">
        {/* Help/About Button */}
        <button 
          onClick={() => router.push('/about')}
          className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
          title="About"
        >
          <HelpCircle size={20} />
        </button>

        {/* Notifications Button */}
        <div className="relative flex items-center">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="text-gray-600 hover:text-gray-800 relative transition-colors flex items-center"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  )}
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${notification.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    router.push('/logs');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu Button */}
        <div className="relative flex items-center">
          <button 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
            title="User Menu"
          >
            <User size={20} />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 mt-1">Welcome back!</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Settings
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    router.push('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
