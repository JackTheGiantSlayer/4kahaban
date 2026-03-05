import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, List, Avatar, Grid } from 'antd';
import { MedicineBoxFilled, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

const Hospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/public/hospitals');
                setHospitals(res.data);
            } catch (err) {
                console.error("Failed to fetch hospitals data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <div style={{ padding: isMobile ? '0' : '0 20px' }}>
            <div style={{
                textAlign: 'center',
                marginBottom: isMobile ? 32 : 40,
                background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                padding: isMobile ? '32px 16px' : 40,
                borderRadius: 16
            }}>
                <Title level={isMobile ? 2 : 1} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.1)', margin: 0 }}>
                    <MedicineBoxFilled style={{ marginRight: isMobile ? 8 : 15 }} />
                    Hospitals
                </Title>
                <Text style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#fff' }}>Find trusted care for your little ones</Text>
            </div>

            <Row gutter={[24, 24]}>
                {hospitals.map((hosp) => (
                    <Col xs={24} lg={12} key={hosp.id}>
                        <Card title={<span style={{ fontSize: '1.2rem' }}>{hosp.name}</span>} style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Paragraph>
                                <EnvironmentOutlined style={{ color: '#1677ff', marginRight: 8 }} /> {hosp.address || 'Address not provided'}
                            </Paragraph>
                            <Paragraph>
                                <PhoneOutlined style={{ color: '#52c41a', marginRight: 8 }} /> {hosp.contact_info || 'No contact info'}
                            </Paragraph>
                            <Paragraph type="secondary">{hosp.description}</Paragraph>

                            <Title level={5} style={{ marginTop: 24, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>Specialist Doctors</Title>
                            <List
                                itemLayout="horizontal"
                                dataSource={hosp.doctors || []}
                                renderItem={doc => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>Dr</Avatar>}
                                            title={doc.name}
                                            description={`Specialty: ${doc.specialty} `}
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: "No specific doctors listed" }}
                            />
                        </Card>
                    </Col>
                ))}
                {hospitals.length === 0 && <Col span={24} style={{ textAlign: 'center' }}><Text type="secondary">No hospitals added yet.</Text></Col>}
            </Row>
        </div>
    );
};

export default Hospitals;
