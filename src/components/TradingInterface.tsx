// src/components/TradingInterface.tsx
import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    Tabs,
    Space,
    message,
    InputNumber,
    Switch,
    Divider,
    Alert,
    Modal,
    Tooltip
} from 'antd';
import {
    ShoppingCartOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import { usePlaceOrder, useCancelOrder } from '../hooks/useTradeData';

const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface TradingInterfaceProps {
    organizationId: string;
    accounts: any[];
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ organizationId, accounts }) => {
    const [activeTab, setActiveTab] = useState('regular');
    const [regularForm] = Form.useForm();
    const [coverForm] = Form.useForm();
    const [bracketForm] = Form.useForm();
    const [advancedForm] = Form.useForm();

    const placeOrderMutation = usePlaceOrder();
    const cancelOrderMutation = useCancelOrder();

    // Enum values (should match your backend enums)
    const exchanges = ['NSE', 'BSE', 'MCX', 'NFO', 'BFO'];
    const tradeTypes = ['BUY', 'SELL'];
    const orderTypes = ['MARKET', 'LIMIT', 'SL', 'SL-M'];
    const productTypes = ['CNC', 'NRML', 'MIS', 'MTF'];
    const varieties = ['regular', 'co', 'amo', 'iceberg', 'auction'];
    const validities = ['DAY', 'IOC', 'TTL'];

    const handlePlaceOrder = async (orderType: string, values: any) => {
        try {
            const orderData = {
                type: orderType,
                data: {
                    ...values,
                    organization_id: organizationId,
                },
                organizationId,
            };

            await placeOrderMutation.mutateAsync(orderData);
            message.success(`${orderType} order placed successfully!`);

            // Reset form
            switch (orderType) {
                case 'regular':
                    regularForm.resetFields();
                    break;
                case 'cover':
                    coverForm.resetFields();
                    break;
                case 'bracket':
                    bracketForm.resetFields();
                    break;
                case 'advanced':
                    advancedForm.resetFields();
                    break;
            }
        } catch (error: any) {
            message.error(`Failed to place order: ${error.response?.data?.detail || error.message}`);
        }
    };

    const handleCancelAllOrders = (pseudoAccount: string) => {
        confirm({
            title: 'Cancel All Orders',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to cancel ALL orders for ${pseudoAccount}? This action cannot be undone.`,
            okType: 'danger',
            onOk: async () => {
                try {
                    // Using the cancel all orders endpoint
                    const response = await fetch(`/api/v1/trade/cancel_all_orders?pseudo_account=${pseudoAccount}&organization_id=${organizationId}`, {
                        method: 'POST',
                    });

                    if (response.ok) {
                        message.success('All orders cancelled successfully');
                    } else {
                        throw new Error('Failed to cancel orders');
                    }
                } catch (error) {
                    message.error('Failed to cancel all orders');
                }
            },
        });
    };

    const handleSquareOffPortfolio = (pseudoAccount: string, positionCategory: string) => {
        confirm({
            title: 'Square Off Portfolio',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to square off all ${positionCategory} positions for ${pseudoAccount}?`,
            okType: 'danger',
            onOk: async () => {
                try {
                    const response = await fetch(`/api/v1/trade/square_off_portfolio?pseudo_account=${pseudoAccount}&position_category=${positionCategory}&organization_id=${organizationId}`, {
                        method: 'POST',
                    });

                    if (response.ok) {
                        message.success('Portfolio squared off successfully');
                    } else {
                        throw new Error('Failed to square off portfolio');
                    }
                } catch (error) {
                    message.error('Failed to square off portfolio');
                }
            },
        });
    };

    return (
        <div>
            {/* Quick Actions Panel */}
            <Card title="Quick Actions" style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card type="inner" title="Emergency Actions" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Select
                                    placeholder="Select Account"
                                    style={{ width: '100%' }}
                                    onChange={(pseudoAccount) => {
                                        // Store selected account for quick actions
                                        (window as any).selectedAccount = pseudoAccount;
                                    }}
                                >
                                    {accounts.map(account => (
                                        <Option key={account.pseudo_account} value={account.pseudo_account}>
                                            {account.pseudo_account}
                                        </Option>
                                    ))}
                                </Select>

                                <Space style={{ width: '100%' }}>
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            const account = (window as any).selectedAccount;
                                            if (account) {
                                                handleCancelAllOrders(account);
                                            } else {
                                                message.warning('Please select an account first');
                                            }
                                        }}
                                    >
                                        Cancel All Orders
                                    </Button>

                                    <Button
                                        danger
                                        icon={<StopOutlined />}
                                        onClick={() => {
                                            const account = (window as any).selectedAccount;
                                            if (account) {
                                                handleSquareOffPortfolio(account, 'MIS');
                                            } else {
                                                message.warning('Please select an account first');
                                            }
                                        }}
                                    >
                                        Square Off MIS
                                    </Button>
                                </Space>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Alert
                            message="Trading Safety"
                            description="Use emergency actions carefully. These operations affect all orders/positions for the selected account."
                            type="warning"
                            showIcon
                        />
                    </Col>
                </Row>
            </Card>

            {/* Order Placement Forms */}
            <Card title="Place Orders">
                <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                    {/* Regular Order */}
                    <TabPane tab="Regular Order" key="regular">
                        <Form
                            form={regularForm}
                            layout="vertical"
                            onFinish={(values) => handlePlaceOrder('regular', values)}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="pseudo_account"
                                        label="Account"
                                        rules={[{ required: true, message: 'Please select account' }]}
                                    >
                                        <Select placeholder="Select Account">
                                            {accounts.map(account => (
                                                <Option key={account.pseudo_account} value={account.pseudo_account}>
                                                    {account.pseudo_account}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="exchange"
                                        label="Exchange"
                                        rules={[{ required: true, message: 'Please select exchange' }]}
                                    >
                                        <Select placeholder="Select Exchange">
                                            {exchanges.map(exchange => (
                                                <Option key={exchange} value={exchange}>{exchange}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="symbol"
                                        label="Symbol"
                                        rules={[{ required: true, message: 'Please enter symbol' }]}
                                    >
                                        <Input placeholder="e.g., RELIANCE" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="tradeType"
                                        label="Trade Type"
                                        rules={[{ required: true, message: 'Please select trade type' }]}
                                    >
                                        <Select placeholder="Buy/Sell">
                                            {tradeTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="orderType"
                                        label="Order Type"
                                        rules={[{ required: true, message: 'Please select order type' }]}
                                    >
                                        <Select placeholder="Order Type">
                                            {orderTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="productType"
                                        label="Product Type"
                                        rules={[{ required: true, message: 'Please select product type' }]}
                                    >
                                        <Select placeholder="Product Type">
                                            {productTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="quantity"
                                        label="Quantity"
                                        rules={[{ required: true, message: 'Please enter quantity' }]}
                                    >
                                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Quantity" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="price"
                                        label="Price"
                                        rules={[{ required: true, message: 'Please enter price' }]}
                                    >
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="Price" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="triggerPrice"
                                        label="Trigger Price"
                                    >
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="Trigger Price (Optional)" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="strategy_id"
                                        label="Strategy"
                                    >
                                        <Input placeholder="Strategy ID (Optional)" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<ShoppingCartOutlined />}
                                            loading={placeOrderMutation.isLoading}
                                            size="large"
                                        >
                                            Place Regular Order
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>

                    {/* Cover Order */}
                    <TabPane tab="Cover Order" key="cover">
                        <Form
                            form={coverForm}
                            layout="vertical"
                            onFinish={(values) => handlePlaceOrder('cover', values)}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="pseudo_account"
                                        label="Account"
                                        rules={[{ required: true }]}
                                    >
                                        <Select placeholder="Select Account">
                                            {accounts.map(account => (
                                                <Option key={account.pseudo_account} value={account.pseudo_account}>
                                                    {account.pseudo_account}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="exchange" label="Exchange" rules={[{ required: true }]}>
                                        <Select placeholder="Select Exchange">
                                            {exchanges.map(exchange => (
                                                <Option key={exchange} value={exchange}>{exchange}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
                                        <Input placeholder="Symbol" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="tradeType" label="Trade Type" rules={[{ required: true }]}>
                                        <Select placeholder="Buy/Sell">
                                            {tradeTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="orderType" label="Order Type" rules={[{ required: true }]}>
                                        <Select placeholder="Order Type">
                                            {orderTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                        <InputNumber min={1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="triggerPrice" label="Trigger Price" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={placeOrderMutation.isLoading}
                                            size="large"
                                        >
                                            Place Cover Order
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>

                    {/* Bracket Order */}
                    <TabPane tab="Bracket Order" key="bracket">
                        <Form
                            form={bracketForm}
                            layout="vertical"
                            onFinish={(values) => handlePlaceOrder('bracket', values)}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={6}>
                                    <Form.Item name="pseudo_account" label="Account" rules={[{ required: true }]}>
                                        <Select placeholder="Select Account">
                                            {accounts.map(account => (
                                                <Option key={account.pseudo_account} value={account.pseudo_account}>
                                                    {account.pseudo_account}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="exchange" label="Exchange" rules={[{ required: true }]}>
                                        <Select placeholder="Select Exchange">
                                            {exchanges.map(exchange => (
                                                <Option key={exchange} value={exchange}>{exchange}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
                                        <Input placeholder="Symbol" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="tradeType" label="Trade Type" rules={[{ required: true }]}>
                                        <Select placeholder="Buy/Sell">
                                            {tradeTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="orderType" label="Order Type" rules={[{ required: true }]}>
                                        <Select placeholder="Order Type">
                                            {orderTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                        <InputNumber min={1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="triggerPrice" label="Trigger Price" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="target" label="Target" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="stoploss" label="Stop Loss" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="trailingStoploss" label="Trailing Stop Loss">
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="Optional" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={placeOrderMutation.isLoading}
                                            size="large"
                                        >
                                            Place Bracket Order
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>

                    {/* Advanced Order */}
                    <TabPane tab="Advanced Order" key="advanced">
                        <Alert
                            message="Advanced Order Features"
                            description="Configure all available order parameters including variety, validity, and advanced options."
                            type="info"
                            style={{ marginBottom: '16px' }}
                        />

                        <Form
                            form={advancedForm}
                            layout="vertical"
                            onFinish={(values) => handlePlaceOrder('advanced', values)}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={6}>
                                    <Form.Item name="pseudo_account" label="Account" rules={[{ required: true }]}>
                                        <Select placeholder="Select Account">
                                            {accounts.map(account => (
                                                <Option key={account.pseudo_account} value={account.pseudo_account}>
                                                    {account.pseudo_account}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="variety" label="Variety" rules={[{ required: true }]}>
                                        <Select placeholder="Select Variety">
                                            {varieties.map(variety => (
                                                <Option key={variety} value={variety}>{variety.toUpperCase()}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="exchange" label="Exchange" rules={[{ required: true }]}>
                                        <Select placeholder="Select Exchange">
                                            {exchanges.map(exchange => (
                                                <Option key={exchange} value={exchange}>{exchange}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
                                        <Input placeholder="Symbol" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="tradeType" label="Trade Type" rules={[{ required: true }]}>
                                        <Select placeholder="Buy/Sell">
                                            {tradeTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="orderType" label="Order Type" rules={[{ required: true }]}>
                                        <Select placeholder="Order Type">
                                            {orderTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="productType" label="Product Type" rules={[{ required: true }]}>
                                        <Select placeholder="Product Type">
                                            {productTypes.map(type => (
                                                <Option key={type} value={type}>{type}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="validity" label="Validity" rules={[{ required: true }]}>
                                        <Select placeholder="Validity">
                                            {validities.map(validity => (
                                                <Option key={validity} value={validity}>{validity}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                        <InputNumber min={1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="triggerPrice" label="Trigger Price">
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="target" label="Target">
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="stoploss" label="Stop Loss">
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Form.Item name="trailingStoploss" label="Trailing SL">
                                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="disclosedQuantity" label="Disclosed Quantity">
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="strategyId" label="Strategy ID">
                                        <Input placeholder="Strategy ID" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="comments" label="Comments">
                                        <Input placeholder="Order comments" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="publisherId" label="Publisher ID">
                                        <Input placeholder="Publisher ID" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item name="amo" label="After Market Order" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Divider />
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<ThunderboltOutlined />}
                                            loading={placeOrderMutation.isLoading}
                                            size="large"
                                        >
                                            Place Advanced Order
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default TradingInterface;