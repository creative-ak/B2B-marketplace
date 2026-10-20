import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Bell, Check, ExternalLink, X, Info } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView,
    setSelectedProductId
  } = useMarketplace();

  if (!isOpen) return null;

  // Filter notifications for current user or admin
  const userNotifs = notifications.filter(
    n => n.recipientId === currentUser.id || currentUser.role === 'admin'
  );

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    onClose();
    if (notif.linkType === 'product' && notif.linkId) {
      setSelectedProductId(notif.linkId);
      setCurrentView('product-detail');
    } else {
      // Go to dashboard to handle enquiry or quotation
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Notifications & Alerts</h3>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
              {userNotifs.filter(n => !n.isRead).length} unread
            </span>
          </div>
          <div className="flex items-center gap-2">
            {userNotifs.length > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {userNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No notifications right now.</p>
              <p className="text-xs text-slate-400 mt-1">Updates on RFQs, quotes, and approvals appear here.</p>
            </div>
          ) : (
            userNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                  notif.isRead ? 'opacity-70 bg-white' : 'bg-teal-50/40 border-l-2 border-teal-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium mt-2">
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
