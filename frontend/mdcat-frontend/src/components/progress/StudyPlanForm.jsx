import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button, message, Card } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const StudyPlanForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Subjects available for MDCAT
  const subjects = [
    { value: 'biology', label: 'Biology' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'physics', label: 'Physics' },
    { value: 'english', label: 'English' },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Format the dates
      const payload = {
        ...values,
        start_date: values.date_range[0].toISOString(),
        end_date: values.date_range[1].toISOString(),
      };
      
      // Remove the date_range field as we've extracted the values
      delete payload.date_range;
      
      // Send the request to create a new study plan
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/progress/plans`, payload);
      
      message.success('Study plan created successfully!');
      form.resetFields();
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error creating study plan:', error);
      message.error('Failed to create study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create New Study Plan" className="study-plan-form-card">
      <Form
        form={form}
        name="study_plan"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          daily_goal_minutes: 60,
          weekly_goal_minutes: 420,
        }}
      >
        <Form.Item
          name="name"
          label="Plan Name"
          rules={[{ required: true, message: 'Please enter a name for your study plan' }]}
        >
          <Input placeholder="e.g., MDCAT Biology Intensive" prefix={<PlusOutlined />} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea 
            placeholder="Describe your study plan goals and focus areas"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="date_range"
          label="Plan Duration"
          rules={[{ required: true, message: 'Please select the start and end dates' }]}
        >
          <RangePicker 
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="subjects"
          label="Subjects to Study"
          rules={[{ required: true, message: 'Please select at least one subject' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select subjects"
            style={{ width: '100%' }}
          >
            {subjects.map(subject => (
              <Option key={subject.value} value={subject.value}>{subject.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="daily_goal_minutes"
          label="Daily Study Goal (minutes)"
          rules={[{ required: true, message: 'Please set a daily goal' }]}
        >
          <InputNumber min={15} max={720} step={15} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="weekly_goal_minutes"
          label="Weekly Study Goal (minutes)"
          rules={[{ required: true, message: 'Please set a weekly goal' }]}
        >
          <InputNumber min={60} max={5040} step={60} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SaveOutlined />}
            block
          >
            Create Study Plan
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StudyPlanForm;