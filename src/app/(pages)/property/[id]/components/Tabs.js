"use client";
export default function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex gap-2 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`px-4 py-2 rounded ${activeTab === tab.value ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
