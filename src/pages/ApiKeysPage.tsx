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
  Tooltip, 
  Typography,
  Row,
  Col,
  Alert,
  message,
  Popconfirm,
  DatePicker,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  CopyOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  KeyOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rate_limit: number;
  expires_at: string | null;
  is_active: boolean;
  last_used: string | null;
  created_at: string;
  usage_count: number;
}

export default function ApiKeysPage() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Mock data - replace with API call
  useEffect(() => {
    const mockApiKeys: ApiKey[] = [
      {
        id: '1',
        name: 'Production Trading Bot',
        key: 'tk_live_1234567890abcdef1234567890abcdef',
        permissions: ['READ_PORTFOLIO', 'EXECUTE_TRADES', 'READ_MARKET_DATA'],
        rate_limit: 1000,
        expires_at: '2024-12-31T23:59:59Z',
        is_active: true,
        last_used: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        usage_count: 15420
      },
      {
        id: '2',
        name: 'Development API',
        key: 'tk_test_abcdef1234567890abcdef1234567890',
        permissions: ['READ_PORTFOLIO', 'READ_MARKET_DATA'],
        rate_limit: 100,
        expires_at: null,
        is_active: true,
        last_used: '2024-01-14T16:45:00Z',
        created_at: '2023-12-15T00:00:00Z',
        usage_count: 2341
      },
      {
        id: '3',
        name: 'Analytics Dashboard',
        key: 'tk_live_fedcba0987654321fedcba0987654321',
        permissions: ['READ_PORTFOLIO', 'READ_ANALYTICS'],
        rate_limit: 500,
        expires_at: '2024-06-30T23:59:59Z',
        is_active: false,
        last_used: '2024-01-10T12:00:00Z',
        created_at: '2023-11-01T00:00:00Z',
        usage_count: 8932
      }
    ];
    setApiKeys(mockApiKeys);
  }, []);

  const availablePermissions = [
    { value: 'READ_PORTFOLIO', label: 'Read Portfolio', description: 'View portfolio positions and balances' },
    { value: 'READ_MARKET_DATA', label: 'Read Market Data', description: 'Access real-time and historical market data' },
    { value: 'EXECUTE_TRADES', label: 'Execute Trades', description: 'Place and manage trading orders' },
    { value: 'READ_ANALYTICS', label: 'Read Analytics', description: 'Access trading analytics and reports' },
    { value: 'MANAGE_USERS', label: 'Manage Users', description: 'Admin-only: User management operations' },
    { value: 'MANAGE_API_KEYS', label: 'Manage API Keys', description: 'Create and manage API keys for other users' }
  ];

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedKey(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (key: ApiKey) => {
    setIsEditing(true);
    setSelectedKey(key);
    form.setFieldsValue({
      name: key.name,
      permissions: key.permissions,
      rate_limit: key.rate_limit,
      expires_at: key.expires_at ? moment(key.expires_at) : null,
      is_active: key.is_active
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Integrate with user_service API
      console.log('API Key operation:', isEditing ? 'update' : 'create', values);
      
      if (isEditing && selectedKey) {
        // Update existing key
        const updatedKeys = apiKeys.map(key => 
          key.id === selectedKey.id 
            ? { 
                ...key, 
                ...values,
                expires_at: values.expires_at ? values.expires_at.toISOString() : null
              }
            : key
        );
        setApiKeys(updatedKeys);
        message.success('API key updated successfully!');
      } else {
        // Create new key
        const newKey: ApiKey = {
          id: Date.now().toString(),
          key: `tk_${Math.random().toString(36).substr(2, 32)}`,
          created_at: new Date().toISOString(),
          last_used: null,
          usage_count: 0,
          expires_at: values.expires_at ? values.expires_at.toISOString() : null,
          ...values
        };
        setApiKeys([...apiKeys, newKey]);
        message.success('API key created successfully!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (keyId: string) => {
    try {
      // TODO: Integrate with user_service API
      console.log('Deleting API key:', keyId);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      message.success('API key deleted successfully!');
    } catch (error) {
      message.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('API key copied to clipboard!');
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}${'•'.repeat(24)}${key.substring(key.length - 8)}`;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ApiKey) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Created {moment(record.created_at).fromNow()}
          </Text>
        </div>
      ),
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string, record: ApiKey) => (
        <div style={{ fontFamily: 'monospace' }}>
          <Space>
            <Text code style={{ fontSize: 12 }}>
              {visibleKeys.has(record.id) ? key : maskApiKey(key)}
            </Text>
            <Tooltip title={visibleKeys.has(record.id) ? 'Hide key' : 'Show key'}>
              <Button 
                type="text" 
                size="small"
                icon={visibleKeys.has(record.id) ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => toggleKeyVisibility(record.id)}
              />
            </Tooltip>
            <Tooltip title="Copy to clipboard">
              <Button 
                type="text" 
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(key)}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <div>
          {permissions.slice(0, 2).map(permission => (
            <Tag key={permission} color="blue" style={{ marginBottom: 4 }}>
              {permission.replace('_', ' ')}
            </Tag>
          ))}
          {permissions.length > 2 && (
            <Tag color="default">+{permissions.length - 2} more</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (record: ApiKey) => (
        <div>
          <Text>{record.usage_count.toLocaleString()} calls</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Limit: {record.rate_limit}/hour
          </Text>
          <br />
          {record.last_used && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Last used: {moment(record.last_used).fromNow()}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: ApiKey) => (
        <div>
          <Tag color={record.is_active ? 'green' : 'red'}>
            {record.is_active ? 'Active' : 'Inactive'}
          </Tag>
          <br />
          {record.expires_at && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Expires: {moment(record.expires_at).format('MMM DD, YYYY')}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ApiKey) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete API Key"
            description="Are you sure you want to delete this API key? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>API Keys</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Create API Key
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            message="API Key Security"
            description={
              <div>
                <p>• Never share your API keys or commit them to version control</p>
                <p>• Use the minimum required permissions for each key</p>
                <p>• Regularly rotate your API keys and monitor their usage</p>
                <p>• Set expiration dates for temporary integrations</p>
              </div>
            }
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
          />
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={apiKeys}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} API keys`
          }}
        />
      </Card>

      <Modal
        title={isEditing ? 'Edit API Key' : 'Create New API Key'}
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
          <Form.Item
            name="name"
            label="API Key Name"
            rules={[{ required: true, message: 'Please enter a name for this API key' }]}
          >
            <Input placeholder="e.g., Production Trading Bot" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              optionLabelProp="label"
            >
              {availablePermissions.map(permission => (
                <Option 
                  key={permission.value} 
                  value={permission.value} 
                  label={permission.label}
                >
                  <div>
                    <Text strong>{permission.label}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {permission.description}
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rate_limit"
                label="Rate Limit (per hour)"
                rules={[{ required: true, message: 'Please enter rate limit' }]}
                initialValue={100}
              >
                <Input type="number" min={1} max={10000} addonAfter="requests/hour" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expires_at"
                label="Expiration Date (Optional)"
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="Select expiration date"
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="is_active"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          {!isEditing && (
            <Alert
              message="Important"
              description="Make sure to copy your API key after creation. You won't be able to see it again for security reasons."
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Update' : 'Create'} API Key
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}