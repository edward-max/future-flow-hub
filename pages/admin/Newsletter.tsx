import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, Mail, Download } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { subscribers, removeSubscriber } = useApp();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this subscriber?")) {
      removeSubscriber(id);
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Date Subscribed'];
    const rows = subscribers.map(s => [s.email, s.created_at]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Mail className="text-blue-900" /> Newsletter Subscribers
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Total Subscribers: {subscribers.length}</h2>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 transition-all shadow-sm active:scale-95"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
        
        {subscribers.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-500 text-sm">Email Address</th>
                <th className="p-4 font-medium text-gray-500 text-sm">Date Subscribed</th>
                <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium">{sub.email}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(sub.id)} 
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove Subscriber"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Mail size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No subscribers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};