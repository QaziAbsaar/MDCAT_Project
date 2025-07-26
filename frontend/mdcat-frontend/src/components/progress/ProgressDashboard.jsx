import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Tabs, Statistic, Alert, Spin, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

const ProgressDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [studySessions, setStudySessions] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user progress
        const progressResponse = await axios.get(`${import.meta.env.VITE_API_URL}/progress/user`);
        setUserProgress(progressResponse.data);

        // Fetch study sessions
        const sessionsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/progress/sessions`);
        setStudySessions(sessionsResponse.data);

        // Fetch study plans
        const plansResponse = await axios.get(`${import.meta.env.VITE_API_URL}/progress/plans`);
        setStudyPlans(plansResponse.data);

        // Fetch performance metrics
        const metricsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/progress/metrics`);
        setPerformanceMetrics(metricsResponse.data);

        setError(null);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format performance metrics for chart display
  const formatMetricsForChart = () => {
    if (!performanceMetrics.length) return [];

    // Filter by selected metric type and subject
    const filteredMetrics = performanceMetrics.filter(metric => {
      return metric.metric_type === selectedMetric && 
             (!selectedSubject || metric.subject === selectedSubject);
    });

    // Group by date
    const groupedByDate = {};
    filteredMetrics.forEach(metric => {
      const date = new Date(metric.timestamp).toLocaleDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          value: 0,
          count: 0
        };
      }
      groupedByDate[date].value += metric.value;
      groupedByDate[date].count += 1;
    });

    // Calculate average for each date
    return Object.values(groupedByDate)
      .map(item => ({
        date: item.date,
        value: item.value / item.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = formatMetricsForChart();

  // Get color based on performance level
  const getPerformanceColor = (level) => {
    switch (level) {
      case 'excellent': return '#52c41a';
      case 'good': return '#1890ff';
      case 'satisfactory': return '#faad14';
      case 'needs_improvement': return '#f5222d';
      default: return '#1890ff';
    }
  };

  // Get progress percentage for a subject
  const getSubjectProgress = (subject) => {
    if (!userProgress || !userProgress.subjects[subject]) return 0;
    return userProgress.subjects[subject].overall_score;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading your progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="progress-dashboard">
      <h1>Your Learning Progress</h1>
      
      {userProgress && (
        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Overall Score"
                value={userProgress.overall_score}
                suffix="%"
                precision={1}
                valueStyle={{ color: getPerformanceColor(userProgress.performance_level) }}
                prefix={<CheckCircleOutlined />}
              />
              <Progress 
                percent={userProgress.overall_score} 
                status="active" 
                strokeColor={getPerformanceColor(userProgress.performance_level)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Questions Attempted"
                value={userProgress.questions_attempted}
                valueStyle={{ color: '#1890ff' }}
              />
              <p>{userProgress.questions_correct} correct ({Math.round(userProgress.questions_correct / userProgress.questions_attempted * 100)}%)</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Study Time"
                value={Math.round(userProgress.total_study_time_minutes / 60)}
                suffix="hours"
                valueStyle={{ color: '#1890ff' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Day Streak"
                value={userProgress.streak_days}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<FireOutlined />}
              />
              <p>Last activity: {new Date(userProgress.last_activity).toLocaleDateString()}</p>
            </Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey="1" className="progress-tabs">
        <TabPane tab="Subject Progress" key="1">
          {userProgress && (
            <Row gutter={[16, 16]}>
              {Object.entries(userProgress.subjects).map(([subjectKey, subject]) => (
                <Col xs={24} sm={12} md={8} key={subjectKey}>
                  <Card title={subject.subject.charAt(0).toUpperCase() + subject.subject.slice(1)}>
                    <Progress 
                      type="circle" 
                      percent={Math.round(subject.overall_score)} 
                      strokeColor={getPerformanceColor(subject.performance_level)}
                    />
                    <div style={{ marginTop: '15px' }}>
                      <p>Questions: {subject.questions_correct}/{subject.questions_attempted}</p>
                      <p>Study time: {Math.round(subject.study_time_minutes / 60)} hours</p>
                      <p>Status: {subject.status.replace('_', ' ')}</p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </TabPane>

        <TabPane tab="Performance Trends" key="2">
          <div className="chart-controls" style={{ marginBottom: '20px' }}>
            <Select 
              style={{ width: 200, marginRight: '10px' }} 
              placeholder="Select metric"
              value={selectedMetric}
              onChange={setSelectedMetric}
            >
              <Option value="accuracy">Accuracy</Option>
              <Option value="speed">Speed</Option>
              <Option value="consistency">Consistency</Option>
            </Select>
            
            <Select
              style={{ width: 200 }}
              placeholder="All subjects"
              allowClear
              value={selectedSubject}
              onChange={setSelectedSubject}
            >
              {userProgress && Object.entries(userProgress.subjects).map(([key, subject]) => (
                <Option key={key} value={subject.subject}>{subject.subject.charAt(0).toUpperCase() + subject.subject.slice(1)}</Option>
              ))}
            </Select>
          </div>

          <div className="performance-chart" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabPane>

        <TabPane tab="Study Sessions" key="3">
          {studySessions.length > 0 ? (
            <div className="session-list">
              {studySessions.map(session => (
                <Card 
                  key={session.id} 
                  style={{ marginBottom: '10px' }}
                  title={
                    <span>
                      <CalendarOutlined /> {new Date(session.start_time).toLocaleDateString()}
                    </span>
                  }
                >
                  <p><strong>Subject:</strong> {session.subject.charAt(0).toUpperCase() + session.subject.slice(1)}</p>
                  {session.topic && <p><strong>Topic:</strong> {session.topic}</p>}
                  <p><strong>Duration:</strong> {session.duration_minutes} minutes</p>
                  <p><strong>Score:</strong> {session.score}% ({session.questions_correct}/{session.questions_attempted})</p>
                  {session.notes && <p><strong>Notes:</strong> {session.notes}</p>}
                </Card>
              ))}
            </div>
          ) : (
            <Alert
              message="No study sessions yet"
              description="Start a study session to track your progress!"
              type="info"
              showIcon
            />
          )}
        </TabPane>

        <TabPane tab="Study Plans" key="4">
          {studyPlans.length > 0 ? (
            <Row gutter={[16, 16]}>
              {studyPlans.map(plan => (
                <Col xs={24} sm={12} key={plan.id}>
                  <Card 
                    title={plan.name}
                    extra={<span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: plan.status === 'in_progress' ? '#e6f7ff' : 
                                      plan.status === 'completed' ? '#f6ffed' : '#fff7e6',
                      color: plan.status === 'in_progress' ? '#1890ff' : 
                             plan.status === 'completed' ? '#52c41a' : '#faad14',
                    }}>
                      {plan.status.replace('_', ' ')}
                    </span>}
                  >
                    <p>{plan.description}</p>
                    <p><strong>Period:</strong> {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</p>
                    <p><strong>Subjects:</strong> {plan.subjects.join(', ')}</p>
                    <p><strong>Daily goal:</strong> {plan.daily_goal_minutes} minutes</p>
                    <p><strong>Weekly goal:</strong> {plan.weekly_goal_minutes} minutes</p>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert
              message="No study plans yet"
              description="Create a study plan to organize your preparation!"
              type="info"
              showIcon
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;