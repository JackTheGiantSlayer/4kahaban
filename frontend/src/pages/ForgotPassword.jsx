import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', values);
            message.success('Password reset link sent to your email!');
        } catch (err) {
            message.error('Failed to send reset link. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <Card style={{ borderRadius: 16, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <Title level={2}>Forgot Password</Title>
                    <Text type="secondary">Enter your email and we'll send you a link to reset your password.</Text>
                </div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Send Reset Link
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <a href="/login">Back to Login</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
