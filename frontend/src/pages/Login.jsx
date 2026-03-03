import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', values.email);
            formData.append('password', values.password);

            const res = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            localStorage.setItem('token', res.data.access_token);
            message.success('Login successful!');
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                message.error('Incorrect email or password');
            } else {
                message.error('Login failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="/logo_4kahaban_Transparent.png" alt="4kahaban Logo" style={{ height: 220, marginBottom: 16 }} />
                    <Title level={2} style={{ color: '#1677ff', margin: 0 }}>Welcome Back</Title>
                    <Text type="secondary">Login to 4kahaban</Text>
                </div>
                <Form name="login" onFinish={onFinish} layout="vertical">
                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Valid email required' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>
                    <div style={{ marginBottom: 24, textAlign: 'right' }}>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Sign In
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Don't have an account? <Link to="/register">Register now</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
