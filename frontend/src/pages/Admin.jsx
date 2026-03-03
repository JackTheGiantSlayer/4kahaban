import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Table, Button, Modal, Form, Input, DatePicker, Select, Upload, message, Space, Popconfirm, Row, Col, Image, Tag, Card } from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, MedicineBoxOutlined, UserAddOutlined, StarOutlined, HeartFilled } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Admin = () => {
    const [animals, setAnimals] = useState([]);
    const [users, setUsers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [news, setNews] = useState([]);
    const [upcomingVaccines, setUpcomingVaccines] = useState([]);

    // Shared Modal State
    const [modalConfig, setModalConfig] = useState({ visible: false, type: null, record: null });
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchData();
        fetchHospitals();
    }, []);

    const fetchData = async () => {
        // Fetch Animals
        try {
            const res = await api.get('/animals');
            setAnimals(res.data);
        } catch (err) {
            console.error("Animals fetch failed", err);
        }

        // Fetch Users
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Users fetch failed", err);
        }

        // Fetch News
        try {
            const res = await api.get('/public/news');
            setNews(res.data);
        } catch (err) {
            console.error("News fetch failed", err);
        }

        // Fetch Vaccinations
        try {
            const res = await api.get('/public/vaccinations/upcoming');
            setUpcomingVaccines(res.data);
        } catch (err) {
            console.error("Vaccinations fetch failed", err);
        }
    };

    const fetchHospitals = async () => {
        try {
            const res = await api.get('/public/hospitals');
            setHospitals(res.data);
        } catch (err) {
            message.error("Failed to fetch hospitals");
        }
    };

    const handleModalOpen = (type, record = null) => {
        setModalConfig({ visible: true, type, record });
        if (record) {
            form.setFieldsValue({
                ...record,
                birth_date: record.birth_date ? dayjs(record.birth_date) : null,
                last_vaccination_date: record.last_vaccination_date ? dayjs(record.last_vaccination_date) : null
            });
        } else {
            form.resetFields();
        }
    };

    const handleModalClose = () => {
        setModalConfig({ visible: false, type: null, record: null });
        form.resetFields();
        setFileList([]);
    };

    const onSubmit = async (values) => {
        try {
            const { type, record } = modalConfig;
            if (type === 'animal') {
                const formData = new FormData();
                Object.keys(values).forEach(key => {
                    const value = values[key];
                    if (value !== undefined && value !== null && value !== '') {
                        if ((key === 'birth_date' || key === 'last_vaccination_date') && dayjs.isDayjs(value)) {
                            formData.append(key, value.format('YYYY-MM-DD'));
                        } else {
                            formData.append(key, value);
                        }
                    }
                });

                if (fileList.length > 0) {
                    fileList.forEach(file => {
                        const fileObj = file.originFileObj || file;
                        if (fileObj) formData.append('images', fileObj);
                    });
                }

                if (record) await api.put(`/animals/${record.id}`, formData);
                else await api.post('/animals', formData);
                message.success('Animal saved');
            } else if (type === 'user') {
                const payload = {
                    full_name: values.full_name,
                    phone: values.phone,
                    address: values.address,
                    is_admin: values.is_admin,
                    password: values.password
                };
                if (record) await api.put(`/users/${record.id}`, payload);
                else await api.post('/users', { ...payload, email: values.email });
                message.success('User saved');
            } else if (type === 'hospital') {
                const payload = {
                    name: values.name,
                    address: values.address,
                    contact_info: values.contact_info,
                    description: values.description
                };
                if (record) await api.put(`/public/hospitals/${record.id}`, payload);
                else await api.post('/public/hospitals', payload);
                message.success('Hospital saved');
            } else if (type === 'news') {
                const formData = new FormData();
                formData.append('title', values.title || '');
                formData.append('content', values.content || '');
                formData.append('event_period', values.event_period || '');
                if (fileList.length > 0) {
                    const file = fileList[0].originFileObj || fileList[0];
                    if (file) formData.append('image', file);
                }

                if (record) await api.put(`/public/news/${record.id}`, formData);
                else await api.post('/public/news', formData);
                message.success('News saved');
            } else if (type === 'doctor') {
                const payload = {
                    name: values.name,
                    specialty: values.specialty,
                    hospital_id: record.hospital_id || record.id
                };
                await api.post('/public/doctors', payload);
                message.success('Specialist saved');
            }

            handleModalClose();
            fetchData();
            fetchHospitals();
        } catch (err) {
            console.error("Save error:", err);
            const detail = err.response?.data?.detail;
            const errorMsg = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail[0]?.msg : err.message);
            message.error(`Failed to save data: ${errorMsg}`);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await api.delete(`/animals/images/${imageId}`);
            message.success('Image deleted');
            // Refresh record in modal
            const res = await api.get(`/animals`);
            const updatedAnimal = res.data.find(a => a.id === modalConfig.record.id);
            setModalConfig({ ...modalConfig, record: updatedAnimal });
            setAnimals(res.data);
        } catch (err) {
            message.error('Failed to delete image');
        }
    };

    const handleSetPrimary = async (imageId) => {
        try {
            await api.post(`/animals/${modalConfig.record.id}/set_primary_image/${imageId}`);
            message.success('Primary image updated');
            // Refresh record in modal
            const res = await api.get(`/animals`);
            const updatedAnimal = res.data.find(a => a.id === modalConfig.record.id);
            setModalConfig({ ...modalConfig, record: updatedAnimal });
            setAnimals(res.data);
        } catch (err) {
            message.error('Failed to set primary image');
        }
    };

    const deleteItem = async (type, id) => {
        try {
            if (type === 'user') await api.delete(`/users/${id}`);
            if (type === 'animal') await api.delete(`/animals/${id}`);
            if (type === 'hospital') await api.delete(`/public/hospitals/${id}`);
            if (type === 'doctor') await api.delete(`/public/doctors/${id}`);
            if (type === 'news') await api.delete(`/public/news/${id}`);
            message.success('Deleted successfully');
            fetchData();
            fetchHospitals();
        } catch (err) {
            message.error('Delete failed');
        }
    };

    const animalColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Breed', dataIndex: 'breed', key: 'breed' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleModalOpen('animal', record)}>Edit</Button>
                    <Popconfirm title="Delete this animal?" onConfirm={() => deleteItem('animal', record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const userColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Name', dataIndex: 'full_name', key: 'name' },
        { title: 'Admin', dataIndex: 'is_admin', key: 'is_admin', render: val => val ? 'Yes' : 'No' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleModalOpen('user', record)}>Edit</Button>
                    <Popconfirm title="Delete this user?" onConfirm={() => deleteItem('user', record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const hospitalColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Address', dataIndex: 'address', key: 'address', ellipsis: true },
        {
            title: 'Specialists',
            dataIndex: 'doctors',
            key: 'doctors',
            render: docs => docs?.map(d => d.name).join(', ') || 'None'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleModalOpen('hospital', record)}>Edit</Button>
                    <Button type="link" icon={<PlusOutlined />} onClick={() => handleModalOpen('doctor', record)}>Add Dr.</Button>
                    <Popconfirm title="Delete hospital?" onConfirm={() => deleteItem('hospital', record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const newsColumns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Event Period', dataIndex: 'event_period', key: 'event', render: p => p || '-' },
        { title: 'Date', dataIndex: 'date_posted', key: 'date', render: d => d && !isNaN(new Date(d).getTime()) ? new Date(d).toLocaleDateString() : 'No date' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleModalOpen('news', record)}>Edit</Button>
                    <Popconfirm title="Delete news?" onConfirm={() => deleteItem('news', record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const vaccineColumns = [
        { title: 'Animal', dataIndex: 'animal_name', key: 'animal' },
        { title: 'Vaccine', dataIndex: 'vaccine_name', key: 'vaccine' },
        { title: 'Due Date', dataIndex: 'due_date', key: 'due', render: d => <Text type="danger">{d ? dayjs(d).format('DD MMM YYYY') : '-'}</Text> },
        { title: 'Owner/Adopter', dataIndex: 'owner_info', key: 'owner' },
        { title: 'Source', dataIndex: 'source', key: 'source', render: s => <Tag color={s === 'Schedule' ? 'blue' : 'orange'}>{s}</Tag> }
    ];

    const allAnimalVaccineColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Animal Name', dataIndex: 'name', key: 'name' },
        { title: 'Last Vaccine Recorded', dataIndex: 'last_vaccination_name', key: 'last_vaccine', render: v => v || '-' },
        { title: 'Date Given/Scheduled', dataIndex: 'last_vaccination_date', key: 'last_date', render: d => d ? dayjs(d).format('DD MMM YYYY') : '-' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 'adopted' ? 'green' : 'blue'}>{s?.replace('_', ' ')}</Tag> },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleModalOpen('animal', record)}>Edit</Button>
            )
        }
    ];

    const getAdoptionData = () => {
        const adopted = animals.filter(a => a.status === 'adopted').length;
        const looking = animals.filter(a => a.status === 'looking_for_home').length;
        return [
            { name: 'Adopted', value: adopted },
            { name: 'Looking for Home', value: looking }
        ];
    };

    const getBreedData = () => {
        const breedMap = {};
        animals.forEach(a => {
            const b = a.breed || 'Mixed';
            breedMap[b] = (breedMap[b] || 0) + 1;
        });
        return Object.keys(breedMap).map(k => ({ name: k, count: breedMap[k] }));
    };

    const getGenderData = () => {
        const genderMap = {};
        animals.forEach(a => {
            const g = a.gender || 'Unknown';
            genderMap[g] = (genderMap[g] || 0) + 1;
        });
        return Object.keys(genderMap).map(k => ({ name: k, count: genderMap[k] }));
    };

    const getAgeData = () => {
        const ageMap = {
            'Under 1 year': 0,
            '1-3 years': 0,
            '4-7 years': 0,
            '8+ years': 0,
            'Unknown': 0
        };

        animals.forEach(a => {
            if (!a.birth_date) {
                ageMap['Unknown']++;
                return;
            }
            const birthDate = dayjs(a.birth_date);
            if (!birthDate.isValid()) {
                ageMap['Unknown']++;
                return;
            }

            const ageInYears = dayjs().diff(birthDate, 'year');
            const ageInMonths = dayjs().diff(birthDate, 'month');

            if (ageInMonths < 12) {
                ageMap['Under 1 year']++;
            } else if (ageInYears >= 1 && ageInYears <= 3) {
                ageMap['1-3 years']++;
            } else if (ageInYears >= 4 && ageInYears <= 7) {
                ageMap['4-7 years']++;
            } else {
                ageMap['8+ years']++;
            }
        });

        return Object.keys(ageMap).map(k => ({ name: k, count: ageMap[k] })).filter(d => d.count > 0);
    };


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const tabItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            children: (
                <div style={{ paddingBottom: '24px' }}>
                    <Title level={4}>Analytics Dashboard</Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card title="Adoption Status" bordered={false} style={{ height: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={getAdoptionData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {getAdoptionData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Breed Distribution" bordered={false} style={{ height: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={getBreedData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Gender Distribution" bordered={false} style={{ height: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={getGenderData()} cx="50%" cy="50%" outerRadius={80} dataKey="count" label>
                                            {getGenderData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Age Distribution" bordered={false} style={{ height: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={getAgeData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Bar dataKey="count" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        },
        {
            key: '1',
            label: 'Manage Animals',
            children: (
                <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModalOpen('animal')}>Register Animal</Button>
                    </div>
                    <Table dataSource={animals} columns={animalColumns} rowKey="id" />
                </>
            ),
        },
        {
            key: '2',
            label: 'Manage Users',
            children: (
                <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon={<UserAddOutlined />} onClick={() => handleModalOpen('user')}>Add New User</Button>
                    </div>
                    <Table dataSource={users} columns={userColumns} rowKey="id" />
                </>
            ),
        },
        {
            key: '3',
            label: 'Hospitals & Specialists',
            children: (
                <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon={<MedicineBoxOutlined />} onClick={() => handleModalOpen('hospital')}>Add Hospital</Button>
                    </div>
                    <Table dataSource={hospitals} columns={hospitalColumns} rowKey="id" />
                </>
            ),
        },
        {
            key: '4',
            label: 'Booths & News',
            children: (
                <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModalOpen('news')}>Post News</Button>
                    </div>
                    <Table dataSource={news} columns={newsColumns} rowKey="id" />
                </>
            ),
        },
        {
            key: '5',
            label: 'Vaccination Schedules',
            children: (
                <>
                    <Title level={4}>Upcoming Vaccinations & Schedules</Title>
                    <Table dataSource={upcomingVaccines} columns={vaccineColumns} rowKey="id" pagination={{ pageSize: 5 }} />

                    <Title level={4} style={{ marginTop: '40px' }} type="danger">Overdue Vaccinations</Title>
                    <Table
                        dataSource={animals.filter(a => a.last_vaccination_date && dayjs(a.last_vaccination_date).isBefore(dayjs(), 'day'))}
                        columns={allAnimalVaccineColumns}
                        rowKey="id"
                        pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '25', '50'] }}
                    />

                    <Title level={4} style={{ marginTop: '40px' }}>All Animals Vaccination Status</Title>
                    <Table dataSource={animals} columns={allAnimalVaccineColumns} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50', '100'] }} />
                </>
            ),
        },
        {
            key: '6',
            label: 'System Settings',
            children: (
                <div style={{ maxWidth: 600 }}>
                    <Title level={4}>Email Configuration (SMTP)</Title>
                    <Form layout="vertical" initialValues={{ smtp_server: 'smtp.gmail.com', smtp_port: 587 }}>
                        <Form.Item name="smtp_server" label="SMTP Server"><Input /></Form.Item>
                        <Form.Item name="smtp_port" label="SMTP Port"><Input /></Form.Item>
                        <Form.Item name="smtp_user" label="SMTP User"><Input /></Form.Item>
                        <Form.Item name="smtp_pass" label="SMTP Password"><Input.Password /></Form.Item>
                        <Button type="primary">Save Configuration</Button>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>4kahaban Admin Management</Title>

            <Tabs defaultActiveKey="1" items={tabItems} />

            <Modal
                title={`${modalConfig.record ? 'Edit' : 'Add'} ${modalConfig.type ? modalConfig.type.charAt(0).toUpperCase() + modalConfig.type.slice(1) : ''}`}
                open={modalConfig.visible}
                onCancel={handleModalClose}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    {modalConfig.type === 'animal' && (
                        <>
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="gender" label="Gender"><Select><Option value="Male">Male</Option><Option value="Female">Female</Option></Select></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="breed" label="Breed"><Input /></Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="color" label="Color"><Input /></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="birth_date" label="Birth Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="microchip" label="Microchip No."><Input /></Form.Item>
                            <Form.Item name="status" label="Status">
                                <Select>
                                    <Option value="looking_for_home">Looking for Home</Option>
                                    <Option value="adopted">Adopted</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>

                            <Title level={5} style={{ marginTop: 20 }}>Vaccination Info</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="last_vaccination_date" label="Last Vaccination Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="last_vaccination_name" label="Vaccine Name"><Input placeholder="e.g. Rabies, DHPP" /></Form.Item>
                                </Col>
                            </Row>

                            <Title level={5} style={{ marginTop: 20 }}>Adopter Info (If Adopted)</Title>
                            <Form.Item name="adopter_name" label="Adopter Full Name"><Input /></Form.Item>
                            <Form.Item name="adopter_phone" label="Adopter Phone"><Input /></Form.Item>
                            <Form.Item name="adopter_address" label="Adopter Address"><Input.TextArea rows={2} /></Form.Item>
                            <Form.Item label="Photos (Multiple)">
                                <Upload
                                    multiple
                                    beforeUpload={f => { setFileList(prev => [...prev, f]); return false; }}
                                    fileList={fileList}
                                    onRemove={file => {
                                        setFileList(prev => {
                                            const index = prev.indexOf(file);
                                            const newFileList = prev.slice();
                                            newFileList.splice(index, 1);
                                            return newFileList;
                                        });
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Select Photos</Button>
                                </Upload>
                            </Form.Item>

                            {modalConfig.record?.images?.length > 0 && (
                                <Form.Item label="Existing Photos (Click ⭐ to set as cover, 🗑️ to delete)">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {modalConfig.record.images.map((img) => (
                                            <div key={img.id} style={{ position: 'relative', border: '1px solid #d9d9d9', borderRadius: '4px', padding: '4px' }}>
                                                <Image
                                                    src={`${import.meta.env.VITE_API_URL}${img.image_url}`}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'cover', borderRadius: '2px' }}
                                                />
                                                <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.7)', padding: '2px' }}>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={modalConfig.record.image_url === img.image_url ? <HeartFilled style={{ color: '#eb2f96' }} /> : <StarOutlined />}
                                                        onClick={() => handleSetPrimary(img.id)}
                                                        title="Set as cover"
                                                    />
                                                    <Popconfirm title="Delete this image?" onConfirm={() => handleDeleteImage(img.id)}>
                                                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Item>
                            )}
                        </>
                    )}

                    {modalConfig.type === 'news' && (
                        <>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="event_period" label="Event Duration (e.g. 10 - 15 March 2024)"><Input placeholder="Optional - for events and booths" /></Form.Item>
                            <Form.Item name="content" label="Content" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
                            <Form.Item label="Image">
                                <Upload beforeUpload={f => { setFileList([f]); return false; }} fileList={fileList} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Select Banner</Button>
                                </Upload>
                            </Form.Item>
                        </>
                    )}

                    {modalConfig.type === 'user' && (
                        <>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input disabled={!!modalConfig.record} /></Form.Item>
                            <Form.Item name="full_name" label="Full Name"><Input /></Form.Item>
                            {!modalConfig.record && <Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password /></Form.Item>}
                            <Form.Item name="is_admin" label="Admin Role" valuePropName="checked">
                                <Select>
                                    <Option value={false}>User</Option>
                                    <Option value={true}>Admin</Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    {modalConfig.type === 'hospital' && (
                        <>
                            <Form.Item name="name" label="Hospital Name" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="address" label="Address"><Input.TextArea /></Form.Item>
                            <Form.Item name="contact_info" label="Contact Info"><Input /></Form.Item>
                            <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>
                        </>
                    )}

                    {modalConfig.type === 'doctor' && (
                        <>
                            <Form.Item name="name" label="Doctor Name" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="specialty" label="Specialty" rules={[{ required: true }]}><Input /></Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default Admin;
