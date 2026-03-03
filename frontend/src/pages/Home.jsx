import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Badge, Tag, Carousel, Button, Modal, Image, Space } from 'antd';
import { CalendarOutlined, HeartFilled, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
    const [animals, setAnimals] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalsRes, newsRes] = await Promise.all([
                    api.get('/animals/?status=looking_for_home'),
                    api.get('/public/news')
                ]);
                setAnimals(animalsRes.data);
                setNews(newsRes.data);
            } catch (err) {
                console.error("Failed to fetch home data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <div>
            <section style={{ marginBottom: 40, background: 'linear-gradient(90deg, #1677ff 0%, #002140 100%)', padding: '40px', borderRadius: 16, color: '#fff' }}>
                <Title level={1} style={{ color: '#fff', margin: 0 }}>Find Your New Best Friend</Title>
                <Paragraph style={{ color: '#fff', fontSize: '1.2rem', marginTop: 10 }}>Give a loving home to a pet in need today.</Paragraph>
            </section>

            {news.length > 0 && (
                <section style={{ marginBottom: 50 }}>
                    <Title level={2}>Latest Booths & News</Title>
                    <Carousel autoplay effect="fade" style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        {news.map(n => (
                            <div key={n.id}>
                                <div style={{
                                    height: 300,
                                    background: n.image_url ? `url(${import.meta.env.VITE_API_URL}${n.image_url}) center/cover` : '#364d79',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: 30,
                                    position: 'relative'
                                }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}></div>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <Title level={3} style={{ color: '#fff', margin: 0 }}>{n.title}</Title>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: 5 }}>
                                            <Text style={{ color: '#eee' }}>{n.date_posted ? new Date(n.date_posted).toLocaleDateString() : 'No date'}</Text>
                                            {n.event_period && (
                                                <Tag color="orange" style={{
                                                    borderRadius: 15,
                                                    padding: '5px 15px',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold',
                                                    border: '2px solid #fff',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                }}>
                                                    📅 {n.event_period}
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </section>
            )}

            <section>
                <Title level={2}><HeartFilled style={{ color: '#1677ff', marginRight: 10 }} />Pets Looking for Homes</Title>
                <Row gutter={[24, 24]}>
                    {animals.map((pet) => (
                        <Col xs={24} sm={12} md={6} lg={4} xl={4} key={pet.id}>
                            <Badge.Ribbon text="Adopt Me" color="red">
                                <Card
                                    hoverable
                                    onClick={() => {
                                        setSelectedPet(pet);
                                        setPreviewVisible(true);
                                    }}
                                    style={{ borderRadius: 12, overflow: 'hidden' }}
                                    cover={
                                        <div style={{ position: 'relative', height: 350, overflow: 'hidden' }}>
                                            <img
                                                alt={pet.name}
                                                src={pet.image_url ? `${import.meta.env.VITE_API_URL}${pet.image_url}` : 'https://placehold.co/400x300?text=No+Image'}
                                                style={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        title={pet.name}
                                        description={
                                            <div>
                                                <div><Tag color="blue">{pet.breed || 'Mixed'}</Tag> <Tag>{pet.gender || 'Unknown'}</Tag></div>
                                                <div style={{ marginTop: 10, fontSize: '0.9rem', color: '#666' }}>
                                                    <CalendarOutlined /> Born: {pet.birth_date && !isNaN(new Date(pet.birth_date).getTime()) ? new Date(pet.birth_date).toLocaleDateString() : 'Unknown'}
                                                </div>
                                                <div style={{ marginTop: 15 }}>
                                                    <Button
                                                        type="primary"
                                                        ghost
                                                        size="small"
                                                        icon={<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 5 }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
                                                        }}
                                                    >
                                                        Share on Facebook
                                                    </Button>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    ))}
                    {animals.length === 0 && <Col span={24}><Text type="secondary">No pets looking for homes right now.</Text></Col>}
                </Row>
            </section>

            <Modal
                title={null}
                open={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                width={800}
                centered
                bodyStyle={{ padding: 0, borderRadius: '16px', overflow: 'hidden' }}
                closeIcon={<div style={{ background: '#fff', borderRadius: '50%', padding: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>✖</div>}
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
                                    src={selectedPet.image_url ? `${import.meta.env.VITE_API_URL}${selectedPet.image_url}` : 'https://placehold.co/400x400?text=No+Photo'}
                                    style={{ height: '450px', width: '100%', objectFit: 'cover' }}
                                    preview={true}
                                />
                            )}
                        </Col>
                        <Col xs={24} md={12} style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Title level={2} style={{ margin: 0 }}>{selectedPet.name}</Title>
                                <Tag color="blue" style={{ borderRadius: '20px' }}>Looking for Home ❤️</Tag>
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
                                {selectedPet.description || "This sweet pet is looking for a loving forever home. Contact us to learn more about their personality and if they'd be a good match for your family!"}
                            </Paragraph>

                            <Button
                                type="primary"
                                size="large"
                                block
                                style={{ height: '50px', borderRadius: '25px', fontSize: '1.2rem', fontWeight: 'bold' }}
                                onClick={() => {
                                    window.open('https://line.me/ti/p/~', '_blank'); // Replace with actual LINE link
                                }}
                            >
                                Contact to Adopt
                            </Button>
                        </Col>
                    </Row>
                )}
            </Modal>
        </div>
    );
};

export default Home;
