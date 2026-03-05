import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Tag, Button, Modal, Image, Space, Carousel, Empty, message, Grid } from 'antd';
import { CheckCircleFilled, HeartFilled, PlusCircleOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import api, { API_BASE_URL } from '../services/api';

const { Title, Text, Paragraph } = Typography;

const Adopted = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/animals/gallery');
                setAnimals(res.data);
            } catch (err) {
                console.error("Failed to fetch gallery data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <div style={{ width: '100%', padding: '0 40px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
                <Title level={isMobile ? 2 : 1}>Adopted Forever <CheckCircleFilled style={{ color: '#52c41a' }} /></Title>
                <Text type="secondary" style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>Check out our alumni who found their forever homes!</Text>
            </div>

            <Row gutter={[24, 24]}>
                {animals.map((pet) => (
                    <Col xs={24} sm={12} md={6} lg={4} xl={4} key={pet.id}>
                        <Card
                            hoverable
                            style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #f0f0f0', minHeight: 520 }}
                            cover={
                                <div
                                    style={{ position: 'relative', cursor: 'pointer', height: 350, overflow: 'hidden' }}
                                    onClick={() => {
                                        setSelectedPet(pet);
                                        setPreviewVisible(true);
                                    }}
                                >
                                    <img
                                        alt={pet.name}
                                        src={pet.image_url ? `${API_BASE_URL}${pet.image_url}` : 'https://placehold.co/400x300?text=No+Image'}
                                        style={{ height: isMobile ? '250px' : '350px', objectFit: 'cover', width: '100%', filter: 'brightness(0.95)', transition: 'transform 0.3s' }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.3s'
                                    }}
                                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                                        onMouseOut={e => e.currentTarget.style.opacity = 0}
                                    >
                                        <Button type="primary" shape="round" icon={<PlusCircleOutlined />}>View Story</Button>
                                    </div>
                                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                        <Tag color="success" style={{ padding: '4px 10px', fontSize: '14px', borderRadius: '20px' }}>
                                            ADOPTED
                                        </Tag>
                                    </div>
                                </div>
                            }
                        >
                            <Card.Meta
                                title={pet.name}
                                description={
                                    <div>
                                        <Text type="secondary">Adopted by our wonderful community!</Text>
                                        <div style={{ marginTop: 10 }}>
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<HeartFilled style={{ color: '#eb2f96' }} />}
                                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/adopted')}`, '_blank')}
                                            >
                                                Share Joy
                                            </Button>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
                {animals.length === 0 && <Col span={24} style={{ textAlign: 'center' }}><Text type="secondary">The gallery is empty right now, but soon we'll have happy tails!</Text></Col>}
            </Row>

            {/* Success Story Modal */}
            <Modal
                title={null}
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={isMobile ? '95%' : 850}
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
                                                    src={`${API_BASE_URL}${img.image_url}`}
                                                    style={{ height: '450px', width: '100%', objectFit: 'cover' }}
                                                    preview={true}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </Image.PreviewGroup>
                            ) : (
                                <Image
                                    alt={selectedPet.name}
                                    src={selectedPet.image_url ? `${API_BASE_URL}${selectedPet.image_url}` : 'https://placehold.co/400x400?text=No+Photo'}
                                    style={{ height: '450px', width: '100%', objectFit: 'cover' }}
                                    preview={true}
                                />
                            )}
                        </Col>
                        <Col xs={24} md={12} style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Title level={2} style={{ margin: 0 }}>{selectedPet.name}</Title>
                                <Tag color="success" style={{ borderRadius: '20px' }}>ADOPTED ❤️</Tag>
                            </div>

                            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Breed & Gender</Text><br />
                                    <Space>
                                        <Tag color="cyan" icon={<InfoCircleOutlined />}>{selectedPet.breed || 'Mixed'}</Tag>
                                        <Tag color={selectedPet.gender === 'Male' ? 'blue' : 'magenta'}>{selectedPet.gender}</Tag>
                                    </Space>
                                </div>
                            </Space>

                            <Title level={4}>Their Story</Title>
                            <Paragraph style={{ fontSize: '1rem', color: '#595959', lineHeight: '1.6', flex: 1, overflowY: 'auto', marginBottom: 24 }}>
                                {selectedPet.description || "This adorable friend has found their forever home and is living a life full of love and happiness with their new family!"}
                            </Paragraph>

                            <Button
                                type="primary"
                                block
                                size="large"
                                icon={<HeartFilled />}
                                style={{ borderRadius: '12px', height: 48, background: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => message.success("Thank you for sharing the joy!")}
                            >
                                Congratulate {selectedPet.name}
                            </Button>
                        </Col>
                    </Row>
                )}
            </Modal>
        </div>
    );
};

export default Adopted;
