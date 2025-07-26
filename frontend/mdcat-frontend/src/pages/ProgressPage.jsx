import React, { useState } from 'react';
import { Tabs, Button, Drawer, Space } from 'antd';
import { PlusOutlined, FieldTimeOutlined } from '@ant-design/icons';
import ProgressDashboard from '../components/progress/ProgressDashboard';
import StudyPlanForm from '../components/progress/StudyPlanForm';
import StudySessionTracker from '../components/progress/StudySessionTracker';

const { TabPane } = Tabs;

const ProgressPage = () => {
  const [planDrawerVisible, setPlanDrawerVisible] = useState(false);
  const [sessionDrawerVisible, setSessionDrawerVisible] = useState(false);

  const showPlanDrawer = () => {
    setPlanDrawerVisible(true);
  };

  const closePlanDrawer = () => {
    setPlanDrawerVisible(false);
  };

  const showSessionDrawer = () => {
    setSessionDrawerVisible(true);
  };

  const closeSessionDrawer = () => {
    setSessionDrawerVisible(false);
  };

  const handlePlanSuccess = () => {
    // Close the drawer and refresh the dashboard
    setPlanDrawerVisible(false);
    // In a real app, we would refresh the data here
  };

  return (
    <div className="progress-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Progress Tracking</h1>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showPlanDrawer}
          >
            Create Study Plan
          </Button>
          <Button 
            type="default" 
            icon={<FieldTimeOutlined />} 
            onClick={showSessionDrawer}
          >
            Track Study Session
          </Button>
        </Space>
      </div>

      <ProgressDashboard />

      {/* Drawer for creating a new study plan */}
      <Drawer
        title="Create New Study Plan"
        width={600}
        onClose={closePlanDrawer}
        visible={planDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <StudyPlanForm onSuccess={handlePlanSuccess} />
      </Drawer>

      {/* Drawer for tracking a study session */}
      <Drawer
        title="Track Study Session"
        width={600}
        onClose={closeSessionDrawer}
        visible={sessionDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <StudySessionTracker />
      </Drawer>
    </div>
  );
};

export default ProgressPage;