import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tree, 
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
  Alert,
  message,
  Popconfirm,
  Tabs,
  Checkbox,
  Divider,
  Transfer,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  UnlockOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  scope: 'USER' | 'GROUP' | 'ORGANIZATION';
  description: string;
  granted_by: string;
  granted_at: string;
  expires_at: string | null;
  is_inherited: boolean;
  can_delegate: boolean;
}

interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  members: string[];
  created_at: string;
}

export default function PermissionsPage() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'permission' | 'group'>('permission');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Permission | PermissionGroup | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my-permissions');

  // Mock data
  useEffect(() => {
    const mockPermissions: Permission[] = [
      {
        id: '1',
        name: 'Portfolio Read Access',
        resource: 'portfolio',
        action: 'read',
        scope: 'USER',
        description: 'Can view portfolio positions and balances',
        granted_by: 'system',
        granted_at: '2024-01-01T00:00:00Z',
        expires_at: null,
        is_inherited: false,
        can_delegate: true
      },
      {
        id: '2',
        name: 'Trade Execution',
        resource: 'trades',
        action: 'execute',
        scope: 'USER',
        description: 'Can place and manage trading orders',
        granted_by: 'admin@tradinghub.com',
        granted_at: '2024-01-01T00:00:00Z',
        expires_at: '2024-12-31T23:59:59Z',
        is_inherited: false,
        can_delegate: false
      },
      {
        id: '3',
        name: 'Market Data Access',
        resource: 'market_data',
        action: 'read',
        scope: 'GROUP',
        description: 'Access to real-time and historical market data',
        granted_by: 'Trading Team',
        granted_at: '2024-01-01T00:00:00Z',
        expires_at: null,
        is_inherited: true,
        can_delegate: true
      },
      {
        id: '4',
        name: 'User Management',
        resource: 'users',
        action: 'manage',
        scope: 'ORGANIZATION',
        description: 'Can create, edit, and manage user accounts',
        granted_by: 'system',
        granted_at: '2024-01-01T00:00:00Z',
        expires_at: null,
        is_inherited: false,
        can_delegate: true
      }
    ];

    const mockGroups: PermissionGroup[] = [
      {
        id: '1',
        name: 'Traders',
        description: 'Standard trading permissions for active traders',
        permissions: ['portfolio.read', 'trades.execute', 'market_data.read'],
        members: ['user1', 'user2', 'user3'],
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Analysts',
        description: 'Read-only access for market analysis',
        permissions: ['portfolio.read', 'market_data.read', 'analytics.read'],
        members: ['analyst1', 'analyst2'],
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Administrators',
        description: 'Full administrative access',
        permissions: ['*'],
        members: ['admin1'],
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    setPermissions(mockPermissions);
    setPermissionGroups(mockGroups);
  }, []);

  const resourceActions = {
    portfolio: ['read', 'write', 'delete'],
    trades: ['read', 'execute', 'cancel', 'modify'],
    market_data: ['read'],
    analytics: ['read', 'export'],
    users: ['read', 'create', 'update', 'delete', 'manage'],
    api_keys: ['read', 'create', 'update', 'delete'],
    permissions: ['read', 'grant', 'revoke']
  };

  const handleCreatePermission = () => {
    setModalType('permission');
    setIsEditing(false);
    setSelectedItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateGroup = () => {
    setModalType('group');
    setIsEditing(false);
    setSelectedItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: Permission | PermissionGroup, type: 'permission' | 'group') => {
    setModalType(type);
    setIsEditing(true);
    setSelectedItem(item);
    
    if (type === 'permission') {
      const permission = item as Permission;
      form.setFieldsValue({
        name: permission.name,
        resource: permission.resource,
        action: permission.action,
        scope: permission.scope,
        description: permission.description,
        can_delegate: permission.can_delegate,
        expires_at: permission.expires_at
      });
    } else {
      const group = item as PermissionGroup;
      form.setFieldsValue({
        name: group.name,
        description: group.description,
        permissions: group.permissions
      });
    }
    
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Integrate with user_service API
      console.log('Permission operation:', modalType, isEditing ? 'update' : 'create', values);
      
      if (modalType === 'permission') {
        if (isEditing && selectedItem) {
          const updatedPermissions = permissions.map(perm => 
            perm.id === selectedItem.id 
              ? { ...perm, ...values }
              : perm
          );
          setPermissions(updatedPermissions);
          message.success('Permission updated successfully!');
        } else {
          const newPermission: Permission = {
            id: Date.now().toString(),
            granted_by: user?.email || 'current_user',
            granted_at: new Date().toISOString(),
            is_inherited: false,
            ...values
          };
          setPermissions([...permissions, newPermission]);
          message.success('Permission created successfully!');
        }
      } else {
        if (isEditing && selectedItem) {
          const updatedGroups = permissionGroups.map(group => 
            group.id === selectedItem.id 
              ? { ...group, ...values }
              : group
          );
          setPermissionGroups(updatedGroups);
          message.success('Permission group updated successfully!');
        } else {
          const newGroup: PermissionGroup = {
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            members: [],
            ...values
          };
          setPermissionGroups([...permissionGroups, newGroup]);
          message.success('Permission group created successfully!');
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'permission' | 'group') => {
    try {
      // TODO: Integrate with user_service API
      console.log('Deleting:', type, id);
      
      if (type === 'permission') {
        setPermissions(permissions.filter(perm => perm.id !== id));
        message.success('Permission deleted successfully!');
      } else {
        setPermissionGroups(permissionGroups.filter(group => group.id !== id));
        message.success('Permission group deleted successfully!');
      }
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  const permissionColumns = [
    {
      title: 'Permission',
      key: 'permission',
      render: (record: Permission) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Resource.Action',
      key: 'resource_action',
      render: (record: Permission) => (
        <Text code>{record.resource}.{record.action}</Text>
      ),
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope',
      render: (scope: string) => (
        <Tag color={scope === 'USER' ? 'blue' : scope === 'GROUP' ? 'green' : 'purple'}>
          {scope}
        </Tag>
      ),
    },
    {
      title: 'Source',
      key: 'source',
      render: (record: Permission) => (
        <div>
          <Text>{record.granted_by}</Text>
          {record.is_inherited && <Tag color="orange" style={{ marginLeft: 8 }}>Inherited</Tag>}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Permission) => (
        <div>
          <Tag color="green">Active</Tag>
          {record.expires_at && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Expires: {new Date(record.expires_at).toLocaleDateString()}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Permission) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, 'permission')}
            disabled={record.is_inherited}
          />
          <Popconfirm
            title="Revoke Permission"
            description="Are you sure you want to revoke this permission?"
            onConfirm={() => handleDelete(record.id, 'permission')}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.is_inherited}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const groupColumns = [
    {
      title: 'Group Name',
      key: 'name',
      render: (record: PermissionGroup) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: string[]) => (
        <div>
          <Text>{members.length} members</Text>
          <br />
          {members.slice(0, 3).map(member => (
            <Tag key={member} style={{ marginTop: 4 }}>
              {member}
            </Tag>
          ))}
          {members.length > 3 && <Tag>+{members.length - 3} more</Tag>}
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Text>{permissions.length} permissions</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: PermissionGroup) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, 'group')}
          />
          <Popconfirm
            title="Delete Group"
            description="Are you sure you want to delete this permission group?"
            onConfirm={() => handleDelete(record.id, 'group')}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Permissions Management</Title>
        <Space>
          <Button 
            type="default" 
            icon={<TeamOutlined />}
            onClick={handleCreateGroup}
          >
            Create Group
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreatePermission}
          >
            Grant Permission
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            message="Permission System"
            description={
              <div>
                <p>• <strong>USER</strong> permissions apply only to the specific user</p>
                <p>• <strong>GROUP</strong> permissions are inherited by all group members</p>
                <p>• <strong>ORGANIZATION</strong> permissions apply to all users in the organization</p>
                <p>• Inherited permissions cannot be directly modified</p>
              </div>
            }
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
          />
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="My Permissions" key="my-permissions">
          <Card>
            <Table
              columns={permissionColumns}
              dataSource={permissions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} permissions`
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Permission Groups" key="groups">
          <Card>
            <Table
              columns={groupColumns}
              dataSource={permissionGroups}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} groups`
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={
          modalType === 'permission'
            ? (isEditing ? 'Edit Permission' : 'Grant New Permission')
            : (isEditing ? 'Edit Permission Group' : 'Create Permission Group')
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {modalType === 'permission' ? (
            <>
              <Form.Item
                name="name"
                label="Permission Name"
                rules={[{ required: true, message: 'Please enter a permission name' }]}
              >
                <Input placeholder="e.g., Portfolio Read Access" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="resource"
                    label="Resource"
                    rules={[{ required: true, message: 'Please select a resource' }]}
                  >
                    <Select placeholder="Select resource">
                      {Object.keys(resourceActions).map(resource => (
                        <Option key={resource} value={resource}>
                          {resource.replace('_', ' ').toUpperCase()}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="action"
                    label="Action"
                    rules={[{ required: true, message: 'Please select an action' }]}
                  >
                    <Select placeholder="Select action">
                      <Option value="read">READ</Option>
                      <Option value="write">WRITE</Option>
                      <Option value="execute">EXECUTE</Option>
                      <Option value="delete">DELETE</Option>
                      <Option value="manage">MANAGE</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="scope"
                label="Scope"
                rules={[{ required: true, message: 'Please select a scope' }]}
                initialValue="USER"
              >
                <Select>
                  <Option value="USER">User Level</Option>
                  <Option value="GROUP">Group Level</Option>
                  <Option value="ORGANIZATION">Organization Level</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Describe what this permission allows the user to do"
                />
              </Form.Item>

              <Form.Item
                name="can_delegate"
                label="Can Delegate"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="name"
                label="Group Name"
                rules={[{ required: true, message: 'Please enter a group name' }]}
              >
                <Input placeholder="e.g., Traders, Analysts, Administrators" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Describe the purpose and scope of this permission group"
                />
              </Form.Item>

              <Form.Item
                name="permissions"
                label="Permissions"
                rules={[{ required: true, message: 'Please select at least one permission' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select permissions to include in this group"
                >
                  <Option value="portfolio.read">Portfolio Read</Option>
                  <Option value="portfolio.write">Portfolio Write</Option>
                  <Option value="trades.execute">Execute Trades</Option>
                  <Option value="trades.read">Read Trades</Option>
                  <Option value="market_data.read">Market Data Read</Option>
                  <Option value="analytics.read">Analytics Read</Option>
                  <Option value="users.manage">Manage Users</Option>
                  <Option value="*">All Permissions (Admin)</Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Update' : modalType === 'permission' ? 'Grant' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}