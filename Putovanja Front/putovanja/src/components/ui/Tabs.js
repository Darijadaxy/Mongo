import { useState } from 'react';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div>
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`py-2 px-4 font-semibold transition duration-200 ${
              activeTab === tab.label
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.label === activeTab)?.content}</div>
    </div>
  );
};

export default Tabs;
