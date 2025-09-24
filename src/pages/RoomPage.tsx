import React from 'react';

const RoomPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">Drawing Room</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Room: ABC123</span>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm">
                Share Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md bg-primary-100 text-primary-700">
                Pen Tool
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
                Eraser
              </button>
            </div>

            <h3 className="text-sm font-medium text-gray-900 mt-6 mb-3">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              {['bg-black', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} border-2 border-gray-300 hover:border-gray-400`}
                />
              ))}
            </div>

            <h3 className="text-sm font-medium text-gray-900 mt-6 mb-3">Connected Users</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>You</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm h-[600px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-3 3 3 7-7v3m0-3h-3m3 0l-4-4-4 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Canvas Ready</h3>
              <p className="mt-1 text-sm text-gray-500">Start drawing to collaborate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;