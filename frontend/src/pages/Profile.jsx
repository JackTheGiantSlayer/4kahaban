import React, { useEffect, useState } from 'react';
import { Typography, Form, Input, Button, message, Card, Tabs, Upload } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setUser(res.data);
            // Fetch pets owned by this user
            // Note: We might need an endpoint for /animals/my-pets or we filter by owner_id if API supports it.
            // Assuming GET /animals?owner_id=X or we just rely on /users/me expanding pets if backend supports it.
            // For now, let's keep it simple.
        } catch (err) {
            console.error(err);
            message.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const onUpdateProfile = async (values) => {
        setSaving(true);
        try {
            await api.put('/users/me', values);
            message.success('Profile updated successfully');
            fetchProfile();
        } catch (err) {
            message.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Title level={2}>My Profile</Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Personal Details" key="1">
                    <Card style={{ maxWidth: 600 }}>
                        <Form layout="vertical" initialValues={user} onFinish={onUpdateProfile}>
                            <Form.Item label="Email" name="email">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="Full Name" name="full_name">
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item label="Phone" name="phone">
                                <Input prefix={<PhoneOutlined />} />
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input.TextArea prefix={<HomeOutlined />} rows={3} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={saving}>Save Changes</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>
                <TabPane tab="My Adopted Pets" key="2">
                    {/* List of pets belonging to user here. They can upload photos for their pets. */}
                    <Card>
                        <Typography.Text type="secondary">Pets assigned to your account will appear here.</Typography.Text>
                        {/* Example upload button for an adopted pet's new photo */}
                        {/* <Upload><Button icon={<UploadOutlined />}>Upload New Photo</Button></Upload> */}
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Profile;
