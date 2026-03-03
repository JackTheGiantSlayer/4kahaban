import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const onFinish = async (values) => {
        if (!token) {
            message.error('Invalid or missing reset token.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { password: values.new_password, token });
            message.success('Password reset successfully! Please login.');
            navigate('/login');
        } catch (err) {
            message.error('Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <Card style={{ borderRadius: 16, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <Title level={2}>Reset Password</Title>
                    <Text type="secondary">Enter your new password below.</Text>
                </div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="new_password"
                        label="New Password"
                        rules={[{ required: true, min: 6 }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['new_password']}
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
