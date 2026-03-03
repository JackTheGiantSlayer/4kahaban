import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await api.post('/auth/register', {
                email: values.email,
                password: values.password,
                full_name: values.full_name,
                phone: values.phone,
                address: values.address
            });
            message.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                message.error(err.response.data.detail || 'Email already registered');
            } else {
                message.error('Registration failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Card style={{ width: 450, borderRadius: 12, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="/logo_4kahaban_Transparent.png" alt="4kahaban Logo" style={{ height: 220, marginBottom: 16 }} />
                    <Title level={2} style={{ color: '#1677ff', margin: 0 }}>Create Account</Title>
                    <Text type="secondary">Join 4kahaban today</Text>
                </div>
                <Form name="register" onFinish={onFinish} layout="vertical">
                    <Form.Item name="email" rules={[{ required: true, message: 'Please input email!' }, { type: 'email', message: 'Valid email required' }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email address" size="large" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input password!' }, { min: 6, message: 'Password must be at least 6 characters' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>
                    <Form.Item name="full_name">
                        <Input prefix={<UserOutlined />} placeholder="Full Name (optional)" size="large" />
                    </Form.Item>
                    <Form.Item name="phone">
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number (optional)" size="large" />
                    </Form.Item>
                    <Form.Item name="address">
                        <Input.TextArea prefix={<HomeOutlined />} placeholder="Address (optional)" size="large" rows={2} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Sign Up
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
