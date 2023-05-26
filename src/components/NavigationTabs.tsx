import React, { useState, ChangeEvent } from 'react';
import { Tabs, Tab, Typography } from '@mui/material';
import TabPanel from './TabPanel';
import BookList from './BookList';

const NavigationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (event: ChangeEvent<{}>, newTab: number) => {
    setActiveTab(newTab);
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary">
        <Tab label="Books" />
        <Tab label="Others" />
        <Tab label="Another" />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <BookList />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h3">Others Tab Here !</Typography>
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
      <Typography variant="h3">Another Tab Here !</Typography>
      </TabPanel>
    </div>
  );
};

export default NavigationTabs;
