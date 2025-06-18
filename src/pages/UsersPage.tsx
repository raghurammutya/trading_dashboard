import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Typography,
  Row,
  Col,
  message,
  Popconfirm,
  Avatar,
  Badge,
  Dropdown,
  Menu,
  Tooltip,
  Switch,
  DatePicker,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  MoreOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'TRADER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  last_login?: string;
  created_at: string;
  updated_at: string;
  mfa_enabled: boolean;
  avatar_url?: string;
  organization_id: string;
  permissions: string[];
  login_count: number;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Mock data - replace with API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@tradinghub.com',
        phone_number: '+1-555-0123',
        role: 'TRADER',
        status: 'ACTIVE',
        last_login: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        mfa_enabled: true,
        organization_id: 'org1',
        permissions: ['READ_PORTFOLIO', 'EXECUTE_TRADES'],
        login_count: 156,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      {
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@tradinghub.com',
        phone_number: '+1-555-0124',
        role: 'ADMIN',
        status: 'ACTIVE',
        last_login: '2024-01-15T14:20:00Z',
        created_at: '2023-12-01T00:00:00Z',
        updated_at: '2024-01-15T14:20:00Z',
        mfa_enabled: true,
        organization_id: 'org1',
        permissions: ['*'],
        login_count: 342,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      },
      {
        id: '3',
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.johnson@tradinghub.com',
        role: 'VIEWER',
        status: 'INACTIVE',
        last_login: '2024-01-10T09:15:00Z',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-10T09:15:00Z',
        mfa_enabled: false,
        organization_id: 'org1',
        permissions: ['READ_PORTFOLIO'],
        login_count: 23
      },
      {
        id: '4',
        first_name: 'Alice',
        last_name: 'Williams',
        email: 'alice.williams@tradinghub.com',
        phone_number: '+1-555-0125',
        role: 'EDITOR',
        status: 'PENDING',
        created_at: '2024-01-14T00:00:00Z',
        updated_at: '2024-01-14T00:00:00Z',
        mfa_enabled: false,
        organization_id: 'org1',
        permissions: ['READ_PORTFOLIO', 'MANAGE_USERS'],
        login_count: 0
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      status: user.status,
      mfa_enabled: user.mfa_enabled
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Integrate with user_service API
      console.log('User operation:', isEditing ? 'update' : 'create', values);
      
      if (isEditing && selectedUser) {
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                ...values,
                updated_at: new Date().toISOString()
              }
            : user
        );
        setUsers(updatedUsers);
        message.success('User updated successfully!');
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization_id: currentUser?.organization_id || 'org1',
          permissions: [],
          login_count: 0,
          ...values
        };
        setUsers([...users, newUser]);
        message.success('User created successfully!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      // TODO: Integrate with user_service API
      console.log('Deleting user:', userId);
      setUsers(users.filter(user => user.id !== userId));
      message.success('User deleted successfully!');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // TODO: Integrate with user_service API
      console.log('Changing user status:', userId, newStatus);
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus as any, updated_at: new Date().toISOString() }
          : user
      );
      setUsers(updatedUsers);
      message.success(`User ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'INACTIVE': return 'orange';
      case 'SUSPENDED': return 'red';
      case 'PENDING': return 'blue';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'EDITOR': return 'orange';
      case 'TRADER': return 'blue';
      case 'VIEWER': return 'green';
      default: return 'default';
    }
  };

  const getUserActions = (record: User) => (
    <Menu>
      <Menu.Item 
        key="edit" 
        icon={<EditOutlined />}
        onClick={() => handleEdit(record)}
      >
        Edit User
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="activate" 
        icon={<UnlockOutlined />}
        onClick={() => handleStatusChange(record.id, 'ACTIVE')}
        disabled={record.status === 'ACTIVE'}
      >
        Activate
      </Menu.Item>
      <Menu.Item 
        key="suspend" 
        icon={<LockOutlined />}
        onClick={() => handleStatusChange(record.id, 'SUSPENDED')}
        disabled={record.status === 'SUSPENDED'}
      >
        Suspend
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="delete" 
        icon={<DeleteOutlined />}
        danger
        onClick={() => {
          Modal.confirm({
            title: 'Delete User',
            content: `Are you sure you want to delete ${record.first_name} ${record.last_name}?`,
            onOk: () => handleDelete(record.id)
          });
        }}
      >
        Delete User
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (record: User) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40}
            src={record.avatar_url}
            icon={<UserOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <Text strong>{record.first_name} {record.last_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (record: User) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Text style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
          {record.phone_number && (
            <div>
              <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <Text style={{ fontSize: 12 }}>{record.phone_number}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Security',
      key: 'security',
      render: (record: User) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Badge 
              status={record.mfa_enabled ? 'success' : 'warning'} 
              text={record.mfa_enabled ? 'MFA Enabled' : 'MFA Disabled'}
            />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.login_count} logins
          </Text>
        </div>
      ),
    },
    {
      title: 'Last Activity',
      key: 'activity',
      render: (record: User) => (
        <div>
          {record.last_login ? (
            <>
              <Text style={{ fontSize: 12 }}>
                {moment(record.last_login).format('MMM DD, YYYY')}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {moment(record.last_login).fromNow()}
              </Text>
            </>
          ) : (
            <Text type="secondary">Never logged in</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Dropdown 
          overlay={getUserActions(record)} 
          trigger={['click']}
          placement="bottomRight"
        >
          <Button 
            type="text" 
            icon={<MoreOutlined />}
            style={{ transform: 'rotate(90deg)' }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>User Management</Title>
        <Space>
          <Button icon={<DownloadOutlined />}>
            Export
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add User
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="ALL">All Status</Option>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
              <Option value="SUSPENDED">Suspended</Option>
              <Option value="PENDING">Pending</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%' }}
            >
              <Option value="ALL">All Roles</Option>
              <Option value="ADMIN">Admin</Option>
              <Option value="EDITOR">Editor</Option>
              <Option value="TRADER">Trader</Option>
              <Option value="VIEWER">Viewer</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Text type="secondary">
                Showing {filteredUsers.length} of {users.length} users
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} users`
          }}
        />
      </Card>

      <Modal
        title={isEditing ? 'Edit User' : 'Create New User'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="Enter email address"
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Select role">
                  <Option value="ADMIN">Administrator</Option>
                  <Option value="EDITOR">Editor</Option>
                  <Option value="TRADER">Trader</Option>
                  <Option value="VIEWER">Viewer</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
                initialValue="ACTIVE"
              >
                <Select>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="INACTIVE">Inactive</Option>
                  <Option value="SUSPENDED">Suspended</Option>
                  <Option value="PENDING">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="mfa_enabled"
            label="Multi-Factor Authentication"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Update' : 'Create'} User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}