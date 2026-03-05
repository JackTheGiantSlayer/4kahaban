import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, PictureOutlined, MedicineBoxOutlined, UserOutlined, LogoutOutlined, SettingOutlined, HeartOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Drawer, Grid, Space } from 'antd';
import api from '../services/api';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    React.useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setIsAdmin(false);
        }
    }, [token, location.pathname]);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setIsAdmin(res.data.is_admin);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAdmin(false);
        navigate('/login');
    };

    const navItems = [
        { key: '/', icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
        { key: '/gallery', icon: <PictureOutlined />, label: <Link to="/gallery">Gallery</Link> },
        { key: '/adopted', icon: <PictureOutlined />, label: <Link to="/adopted">Adopted</Link> },
        { key: '/adoption', icon: <HeartOutlined />, label: <Link to="/adoption">Adoption</Link> },
        { key: '/hospitals', icon: <MedicineBoxOutlined />, label: <Link to="/hospitals">Hospitals</Link> },
        { key: '/terms', icon: <SettingOutlined />, label: <Link to="/terms">Terms & Conditions</Link> },
    ];

    if (isAdmin) {
        navItems.push({
            key: '/admin',
            icon: <SettingOutlined />,
            label: <Link to="/admin">Admin Management</Link>
        });
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                padding: isMobile ? '0 20px' : '0 50px',
                height: isMobile ? '70px' : '100px',
                boxShadow: '0 2px 8px rgba(0, 82, 204, 0.1)',
                zIndex: 100,
                position: 'sticky',
                top: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <img
                            src="/logo_4kahaban_Transparent.png"
                            alt="4kahaban Logo"
                            style={{
                                height: isMobile ? '60px' : '90px',
                                width: 'auto',
                                objectFit: 'contain',
                                transition: 'transform 0.3s'
                            }}
                        />
                    </Link>
                </div>

                {!isMobile ? (
                    <>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            items={navItems}
                            style={{ flex: 1, borderBottom: 'none', lineHeight: isMobile ? '70px' : '100px', fontSize: '18px', marginLeft: isMobile ? '20px' : '50px' }}
                        />
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {token ? (
                                <>
                                    <Button type="text" size="large" icon={<UserOutlined />} onClick={() => navigate('/profile')}>Profile</Button>
                                    <Button type="primary" size="large" danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Button type="text" size="large" onClick={() => navigate('/login')}>Login</Button>
                                    <Button type="primary" size="large" onClick={() => navigate('/register')}>Register</Button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '24px' }} />}
                        onClick={() => setDrawerVisible(true)}
                    />
                )}

                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width={280}
                >
                    <Menu
                        mode="vertical"
                        selectedKeys={[location.pathname]}
                        items={navItems}
                        onClick={() => setDrawerVisible(false)}
                        style={{ borderRight: 'none' }}
                    />
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {token ? (
                            <>
                                <Button block icon={<UserOutlined />} onClick={() => { navigate('/profile'); setDrawerVisible(false); }}>Profile</Button>
                                <Button block type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button block onClick={() => { navigate('/login'); setDrawerVisible(false); }}>Login</Button>
                                <Button block type="primary" onClick={() => { navigate('/register'); setDrawerVisible(false); }}>Register</Button>
                            </>
                        )}
                    </div>
                </Drawer>
            </Header>
            <Content style={{ padding: isMobile ? '16px' : '40px 50px', background: '#fafafa' }}>
                <div style={{ background: '#fff', padding: isMobile ? '16px' : '24px', minHeight: 380, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Pet Management System ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};

export default MainLayout;
