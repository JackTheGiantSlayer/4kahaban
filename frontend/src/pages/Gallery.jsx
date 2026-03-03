import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Modal, Form, Input, Upload, message, Popconfirm, Empty, Space, Select, Tabs, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();
    const [albumForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchGallery();
        fetchAlbums();
        if (token) fetchProfile();
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setIsAdmin(res.data.is_admin);
        } catch (err) {
            console.error("Profile fetch error", err);
        }
    };

    const fetchGallery = async (albumId = null) => {
        setLoading(true);
        try {
            const res = await api.get('/public/gallery', { params: { album_id: albumId } });
            setItems(res.data);
        } catch (err) {
            message.error("Failed to load gallery");
        } finally {
            setLoading(false);
        }
    };

    const fetchAlbums = async () => {
        try {
            const res = await api.get('/public/albums');
            setAlbums(res.data);
        } catch (err) {
            console.error("Failed to fetch albums", err);
        }
    };

    const handleUpload = async (values) => {
        if (fileList.length === 0) {
            message.error("Please select at least one image");
            return;
        }

        const formData = new FormData();
        formData.append('caption', values.caption || '');
        if (values.album_id) formData.append('album_id', values.album_id);

        fileList.forEach(file => {
            formData.append('images', file.originFileObj || file);
        });

        setUploading(true);
        try {
            await api.post('/public/gallery', formData);
            message.success("Photos uploaded successfully");
            setIsPhotoModalOpen(false);
            form.resetFields();
            setFileList([]);
            fetchGallery(activeTab !== 'all' ? activeTab : null);
        } catch (err) {
            message.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleCreateAlbum = async (values) => {
        try {
            await api.post('/public/albums', values);
            message.success("Album created");
            setIsAlbumModalOpen(false);
            albumForm.resetFields();
            fetchAlbums();
        } catch (err) {
            message.error("Failed to create album");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/public/gallery/${id}`);
            message.success("Image deleted");
            fetchGallery();
        } catch (err) {
            message.error("Delete failed");
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
                background: '#fff',
                padding: '24px 32px',
                borderRadius: '20px',
                marginBottom: 40,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>Memory Gallery 📸</Title>
                        <Text type="secondary" style={{ fontSize: '1rem' }}>Capturing beautiful moments of our furry friends.</Text>
                    </div>
                    {isAdmin && (
                        <Space size="middle">
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => setIsAlbumModalOpen(true)}
                                style={{ borderRadius: '8px' }}
                            >
                                New Album
                            </Button>
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                onClick={() => setIsPhotoModalOpen(true)}
                                style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)' }}
                            >
                                Upload Photos
                            </Button>
                        </Space>
                    )}
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        fetchGallery(key === 'all' ? null : key);
                    }}
                    items={[
                        { key: 'all', label: 'All Photos' },
                        ...albums.map(a => ({ key: a.id.toString(), label: a.title }))
                    ]}
                    style={{ marginBottom: 0 }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
            ) : items.length > 0 ? (
                <Image.PreviewGroup>
                    <Row gutter={[24, 24]}>
                        {items.map((item) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                <Card
                                    hoverable
                                    style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                    cover={
                                        <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
                                            <Image
                                                alt={item.caption}
                                                src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
                                                style={{ width: '100%', height: 280, objectFit: 'cover' }}
                                                wrapperStyle={{ width: '100%' }}
                                            />
                                            {isAdmin && (
                                                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                                                    <Popconfirm title="Delete this photo?" onConfirm={() => handleDelete(item.id)}>
                                                        <Button
                                                            type="primary"
                                                            danger
                                                            shape="circle"
                                                            icon={<DeleteOutlined />}
                                                            size="small"
                                                        />
                                                    </Popconfirm>
                                                </div>
                                            )}
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        description={
                                            <div style={{ textAlign: 'center' }}>
                                                <Text strong>{item.caption || "Beautiful Moment"}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Image.PreviewGroup>
            ) : (
                <Empty description="No photos here yet." style={{ marginTop: 100 }} />
            )}

            {/* Photo Upload Modal */}
            <Modal
                title="Upload Photos"
                open={isPhotoModalOpen}
                onCancel={() => setIsPhotoModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleUpload}>
                    <Form.Item label="Album (Optional)" name="album_id">
                        <Input.Group compact>
                            <Form.Item name="album_id" noStyle>
                                <Select style={{ width: '100%' }} placeholder="Select an album">
                                    <Select.Option value={null}>None</Select.Option>
                                    {albums.map(a => (
                                        <Select.Option key={a.id} value={a.id}>{a.title}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="Caption (Optional)" name="caption">
                        <Input placeholder="Enter a caption for these photos..." />
                    </Form.Item>
                    <Form.Item label="Photos" required>
                        <Upload
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            multiple
                            listType="picture-card"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Select</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsPhotoModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={uploading}>
                                Upload
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Album Create Modal */}
            <Modal
                title="Create New Album"
                open={isAlbumModalOpen}
                onCancel={() => setIsAlbumModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={albumForm} layout="vertical" onFinish={handleCreateAlbum}>
                    <Form.Item label="Album Title" name="title" rules={[{ required: true, message: 'Please enter title' }]}>
                        <Input placeholder="e.g. Summer Outing 2024" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea placeholder="A short description of this album..." />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsAlbumModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Gallery;
