import React from 'react';

interface TabPanelProps {
  value: number;
  index: number;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ value, index, children }) => {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <div>{children}</div>}
    </div>
  );
};

export default TabPanel;
