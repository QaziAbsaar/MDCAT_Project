import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Input, Statistic, Row, Col, Modal, message, Divider, Alert } from 'antd';
import { ClockCircleOutlined, PlayCircleOutlined, PauseCircleOutlined, SaveOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const StudySessionTracker = () => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState('');
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [notes, setNotes] = useState('');
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [topicsBySubject, setTopicsBySubject] = useState({});

  // Mock topics by subject - in a real app, these would come from an API
  useEffect(() => {
    // This would be fetched from the backend in a real implementation
    const mockTopics = {
      biology: [
        'Cell Biology',
        'Genetics',
        'Human Physiology',
        'Evolution',
        'Ecology'
      ],
      chemistry: [
        'Organic Chemistry',
        'Inorganic Chemistry',
        'Physical Chemistry',
        'Biochemistry',
        'Analytical Chemistry'
      ],
      physics: [
        'Mechanics',
        'Thermodynamics',
        'Electromagnetism',
        'Optics',
        'Modern Physics'
      ],
      english: [
        'Grammar',
        'Vocabulary',
        'Reading Comprehension',
        'Writing Skills',
        'Critical Analysis'
      ]
    };
    
    setTopicsBySubject(mockTopics);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isActive && elapsedTime !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, elapsedTime]);

  const handleStart = () => {
    if (!subject) {
      message.error('Please select a subject before starting the session');
      return;
    }
    
    setIsActive(true);
    setSessionStarted(true);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  const handleFinish = () => {
    setIsActive(false);
    setSaveModalVisible(true);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Cancel Session',
      content: 'Are you sure you want to cancel this study session? All progress will be lost.',
      onOk: () => {
        resetSession();
      },
      okText: 'Yes, Cancel Session',
      cancelText: 'No, Continue Studying',
    });
  };

  const resetSession = () => {
    setIsActive(false);
    setSessionStarted(false);
    setElapsedTime(0);
    setStartTime(null);
    setQuestionsAttempted(0);
    setQuestionsCorrect(0);
    setNotes('');
    form.resetFields();
  };

  const handleSaveSession = async () => {
    setSaving(true);
    try {
      const endTime = new Date();
      const durationMinutes = Math.floor(elapsedTime / 60);
      const score = questionsAttempted > 0 
        ? (questionsCorrect / questionsAttempted) * 100 
        : 0;
      
      const sessionData = {
        subject,
        topic: topic || undefined,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
        questions_attempted: questionsAttempted,
        questions_correct: questionsCorrect,
        score,
        notes: notes || undefined
      };
      
      // Save the session to the backend
      await axios.post(`${import.meta.env.VITE_API_URL}/progress/sessions`, sessionData);
      
      message.success('Study session saved successfully!');
      setSaveModalVisible(false);
      resetSession();
    } catch (error) {
      console.error('Error saving study session:', error);
      message.error('Failed to save study session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="study-session-tracker">
      <Card title="Study Session Tracker" className="tracker-card">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Subject" 
                name="subject"
                rules={[{ required: true, message: 'Please select a subject' }]}
              >
                <Select 
                  placeholder="Select a subject" 
                  disabled={sessionStarted}
                  onChange={(value) => setSubject(value)}
                >
                  <Option value="biology">Biology</Option>
                  <Option value="chemistry">Chemistry</Option>
                  <Option value="physics">Physics</Option>
                  <Option value="english">English</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Topic (Optional)" 
                name="topic"
              >
                <Select 
                  placeholder="Select a topic" 
                  disabled={!subject || sessionStarted}
                  onChange={(value) => setTopic(value)}
                  allowClear
                >
                  {subject && topicsBySubject[subject]?.map(topic => (
                    <Option key={topic} value={topic}>{topic}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider />
          
          <div className="timer-display" style={{ textAlign: 'center', margin: '20px 0' }}>
            <Statistic 
              value={formatTime(elapsedTime)} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ fontSize: '48px', color: isActive ? '#1890ff' : '#000000' }}
            />
            <p>Study Time</p>
          </div>
          
          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={24} style={{ textAlign: 'center' }}>
              {!sessionStarted ? (
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlayCircleOutlined />} 
                  onClick={handleStart}
                  disabled={!subject}
                >
                  Start Session
                </Button>
              ) : (
                <>
                  {isActive ? (
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<PauseCircleOutlined />} 
                      onClick={handlePause}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<PlayCircleOutlined />} 
                      onClick={handleResume}
                    >
                      Resume
                    </Button>
                  )}
                  <Button 
                    type="default" 
                    size="large" 
                    style={{ marginLeft: '10px' }} 
                    onClick={handleFinish}
                  >
                    Finish Session
                  </Button>
                  <Button 
                    danger 
                    size="large" 
                    style={{ marginLeft: '10px' }} 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Form>
        
        {sessionStarted && (
          <Alert
            message="Session in Progress"
            description="Your study time is being tracked. Remember to finish your session to save your progress."
            type="info"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}
      </Card>
      
      <Modal
        title="Save Study Session"
        visible={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setSaveModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={saving} 
            onClick={handleSaveSession}
            icon={<SaveOutlined />}
          >
            Save Session
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Questions Attempted">
            <Input
              type="number"
              min={0}
              value={questionsAttempted}
              onChange={(e) => setQuestionsAttempted(parseInt(e.target.value) || 0)}
              prefix={<QuestionCircleOutlined />}
            />
          </Form.Item>
          
          <Form.Item label="Questions Answered Correctly">
            <Input
              type="number"
              min={0}
              max={questionsAttempted}
              value={questionsCorrect}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setQuestionsCorrect(Math.min(value, questionsAttempted));
              }}
              prefix={<QuestionCircleOutlined />}
            />
          </Form.Item>
          
          <Form.Item label="Session Notes">
            <TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about what you studied or learned in this session"
            />
          </Form.Item>
          
          <div style={{ marginTop: '10px' }}>
            <p><strong>Session Summary:</strong></p>
            <p>Subject: {subject}</p>
            {topic && <p>Topic: {topic}</p>}
            <p>Duration: {formatTime(elapsedTime)} ({Math.floor(elapsedTime / 60)} minutes)</p>
            <p>Score: {questionsAttempted > 0 ? Math.round((questionsCorrect / questionsAttempted) * 100) : 0}%</p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudySessionTracker;