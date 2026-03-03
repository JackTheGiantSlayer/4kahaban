import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Tag, Button, Empty, Modal, Image, Space, Carousel } from 'antd';
import { HeartOutlined, ShareAltOutlined, InfoCircleOutlined, CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

const AdoptionGallery = () => {

    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch only animals with status 'looking_for_home'
                const res = await api.get('/animals?status=looking_for_home');
                setAnimals(res.data);
            } catch (err) {
                console.error("Failed to fetch adoption data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Loading adorable pets..." /></div>;

    return (
        <div style={{ width: '100%', padding: '0 40px', margin: '0 auto' }}>
            <div style={{
                textAlign: 'center',
                marginBottom: 60,
                padding: '40px 20px',
                background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%)',
                borderRadius: '24px'
            }}>
                <Title level={1} style={{ color: '#003a8c', marginBottom: 16 }}>Find Your Perfect Match 🐾</Title>
                <Paragraph style={{ fontSize: '1.2rem', color: '#434343', maxWidth: 700, margin: '0 auto' }}>
                    Browse through our lovable companions waiting for a place to call home.
                    Every pet here is looking for a family to love.
                </Paragraph>
            </div>

            {animals.length > 0 ? (
                <Row gutter={[40, 40]}>
                    {animals.map((pet) => (
                        <Col xs={24} sm={12} md={6} lg={4} xl={4} key={pet.id}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                cover={
                                    <div
                                        style={{ position: 'relative', height: 350, overflow: 'hidden', cursor: 'pointer' }}
                                        onClick={() => {
                                            setSelectedPet(pet);
                                            setPreviewVisible(true);
                                        }}
                                    >
                                        <img
                                            alt={pet.name}
                                            src={pet.image_url ? `${import.meta.env.VITE_API_URL}${pet.image_url}` : 'https://placehold.co/400x400?text=Waiting+for+Photo'}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'rgba(0,0,0,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.3s'
                                        }}
                                            className="hover-overlay"
                                            onMouseOver={e => e.currentTarget.style.opacity = 1}
                                            onMouseOut={e => e.currentTarget.style.opacity = 0}
                                        >
                                            <Button type="primary" shape="round" icon={<PlusCircleOutlined />}>View Details</Button>
                                        </div>
                                        <div style={{ position: 'absolute', top: 16, left: 16 }}>
                                            <Tag color="#1677ff" style={{ borderRadius: '12px', padding: '4px 12px', border: 'none', fontWeight: 'bold' }}>
                                                NEW FRIEND
                                            </Tag>
                                        </div>
                                    </div>
                                }
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <Title level={3} style={{ margin: 0 }}>{pet.name}</Title>
                                        <Tag color={pet.gender === 'Male' ? 'blue' : 'magenta'} style={{ borderRadius: '10px' }}>
                                            {pet.gender || 'Unknown'}
                                        </Tag>
                                    </div>

                                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 16 }}>
                                        {pet.description || "A friendly pet looking for a warm home and a loving family."}
                                    </Paragraph>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 20 }}>
                                        <Tag icon={<InfoCircleOutlined />} color="cyan">{pet.breed || 'Mixed Breed'}</Tag>
                                        <Tag icon={<CalendarOutlined />} color="orange">
                                            {pet.birth_date && !isNaN(new Date(pet.birth_date).getTime())
                                                ? new Date(pet.birth_date).toLocaleDateString()
                                                : 'Age Unknown'}
                                        </Tag>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                    <Button
                                        type="primary"
                                        block
                                        icon={<HeartOutlined />}
                                        size="large"
                                        style={{ borderRadius: '12px', fontWeight: 'bold' }}
                                        onClick={() => window.location.href = `/profile`} // Or adoption form
                                    >
                                        Adopt Me
                                    </Button>
                                    <Button
                                        icon={<ShareAltOutlined />}
                                        size="large"
                                        style={{ borderRadius: '12px' }}
                                        onClick={() => {
                                            const url = window.location.origin + '/adoption';
                                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                        }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    ))
                    }
                </Row >
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span style={{ color: '#999', fontSize: '1.1rem' }}>
                            All our furry friends have found homes! Check back soon.
                        </span>
                    }
                    style={{ marginTop: 80 }}
                />
            )}
            {/* Animal Detail Modal */}
            <Modal
                title={null}
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={800}
                centered
                destroyOnClose
                bodyStyle={{ padding: 0, overflow: 'hidden', borderRadius: '24px' }}
            >
                {selectedPet && (
                    <Row>
                        <Col xs={24} md={12}>
                            {selectedPet.images && selectedPet.images.length > 0 ? (
                                <Image.PreviewGroup>
                                    <Carousel autoplay arrows dots={true}>
                                        {selectedPet.images.map((img, idx) => (
                                            <div key={idx}>
                                                <Image
                                                    alt={`${selectedPet.name}-${idx}`}
                                                    src={`${import.meta.env.VITE_API_URL}${img.image_url}`}
                                                    style={{
                                                        height: '400px',
                                                        width: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    preview={true}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </Image.PreviewGroup>
                            ) : (
                                <Image
                                    alt={selectedPet.name}
                                    src={selectedPet.image_url ? `${import.meta.env.VITE_API_URL}${selectedPet.image_url}` : 'https://placehold.co/400x400?text=Waiting+for+Photo'}
                                    style={{
                                        height: '400px',
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                    preview={true}
                                />
                            )}
                        </Col>
                        <Col xs={24} md={12} style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Title level={2} style={{ margin: 0 }}>{selectedPet.name}</Title>
                                <Tag color={selectedPet.gender === 'Male' ? 'blue' : 'magenta'} style={{ borderRadius: '8px' }}>
                                    {selectedPet.gender}
                                </Tag>
                            </div>

                            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                                <div>
                                    <Text type="secondary">Breed</Text><br />
                                    <Tag color="cyan" icon={<InfoCircleOutlined />}>{selectedPet.breed || 'Mixed Breed'}</Tag>
                                </div>
                                <div>
                                    <Text type="secondary">Birth Date</Text><br />
                                    <Tag color="orange" icon={<CalendarOutlined />}>
                                        {selectedPet.birth_date ? new Date(selectedPet.birth_date).toLocaleDateString() : 'Unknown'}
                                    </Tag>
                                </div>
                            </Space>

                            <Title level={4}>About {selectedPet.name}</Title>
                            <Paragraph style={{ fontSize: '1rem', color: '#595959', lineHeight: '1.6', height: '150px', overflowY: 'auto' }}>
                                {selectedPet.description || "No detailed description available. But we can tell you that this little friend is full of love and waiting for a perfect home!"}
                            </Paragraph>

                            <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                                <Button
                                    type="primary"
                                    block
                                    icon={<HeartOutlined />}
                                    size="large"
                                    style={{ borderRadius: '12px', fontWeight: 'bold', height: 48 }}
                                    onClick={() => window.location.href = `/profile`}
                                >
                                    Start Adoption Process
                                </Button>
                            </div>
                        </Col>
                    </Row>
                )}
            </Modal>
        </div >
    );
};

export default AdoptionGallery;
