// src/components/UserDashboard.tsx
import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Space, Button, Modal, Form, Input, Select, message, Statistic, Row, Col, Tooltip, Progress } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    RiseOutlined,
    FallOutlined,
    CloseOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { usePositions, useHoldings, useOrders, useMargins, useCancelOrder, useModifyOrder } from '../hooks/useTradeData';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

interface UserDashboardProps {
    pseudoAccount: string;
    organizationId: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ pseudoAccount, organizationId }) => {
    const [modifyModalVisible, setModifyModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [form] = Form.useForm();

    // Get user_id from pseudo_account (assuming they match for now)
    const userId = pseudoAccount;

    const { data: positions, isLoading: positionsLoading, refetch: refetchPositions } = usePositions(organizationId, userId);
    const { data: holdings, isLoading: holdingsLoading, refetch: refetchHoldings } = useHoldings(organizationId, userId);
    const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useOrders(organizationId, userId);
    const { data: margins, isLoading: marginsLoading, refetch: refetchMargins } = useMargins(organizationId, userId);

    const cancelOrderMutation = useCancelOrder();
    const modifyOrderMutation = useModifyOrder();

    // Calculate summary statistics
    const positionPnL = positions?.reduce((sum: number, pos: any) => sum + (pos.pnl || 0), 0) || 0;
    const holdingPnL = holdings?.reduce((sum: number, pos: any) => sum + (pos.pnl || 0), 0) || 0;
    const totalPnL = positionPnL + holdingPnL;
    const availableMargin = margins?.reduce((sum: number, margin: any) => sum + (margin.available || 0), 0) || 0;
    const usedMargin = margins?.reduce((sum: number, margin: any) => sum + (margin.used || 0), 0) || 0;
    const totalMargin = availableMargin + usedMargin;

    // Handle order cancellation
    const handleCancelOrder = (order: any) => {
        confirm({
            title: 'Cancel Order',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to cancel order for ${order.symbol}?`,
            onOk: async () => {
                try {
                    await cancelOrderMutation.mutateAsync({
                        pseudoAccount,
                        platformId: order.platform_id,
                        organizationId
                    });
                    message.success('Order cancelled successfully');
                    refetchOrders();
                } catch (error) {
                    message.error('Failed to cancel order');
                }
            },
        });
    };

    // Handle order modification
    const handleModifyOrder = (order: any) => {
        setSelectedOrder(order);
        form.setFieldsValue({
            order_type: order.order_type,
            quantity: order.quantity,
            price: order.price,
            trigger_price: order.trigger_price,
        });
        setModifyModalVisible(true);
    };

    const handleModifySubmit = async (values: any) => {
        try {
            await modifyOrderMutation.mutateAsync({
                platformId: selectedOrder.platform_id,
                orderData: {
                    pseudo_account: pseudoAccount,
                    ...values,
                },
                organizationId,
            });
            message.success('Order modified successfully');
            setModifyModalVisible(false);
            refetchOrders();
        } catch (error) {
            message.error('Failed to modify order');
        }
    };

    const refreshAllData = () => {
        refetchPositions();
        refetchHoldings();
        refetchOrders();
        refetchMargins();
    };

    // Table columns
    const positionColumns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string, record: any) => (
                <Space>
                    <strong>{text}</strong>
                    <Tag>{record.exchange}</Tag>
                </Space>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value: number) => value.toLocaleString(),
        },
        {
            title: 'Avg Price',
            dataIndex: 'avg_price',
            key: 'avg_price',
            render: (value: number) => `₹${value.toFixed(2)}`,
        },
        {
            title: 'LTP',
            dataIndex: 'ltp',
            key: 'ltp',
            render: (value: number) => `₹${value.toFixed(2)}`,
        },
        {
            title: 'P&L',
            dataIndex: 'pnl',
            key: 'pnl',
            render: (value: number) => (
                <Statistic
                    value={value}
                    precision={2}
                    valueStyle={{
                        color: value >= 0 ? '#3f8600' : '#cf1322',
                        fontSize: '14px'
                    }}
                    prefix={value >= 0 ? <RiseOutlined /> : <FallOutlined />}
                />
            ),
            sorter: (a: any, b: any) => a.pnl - b.pnl,
        },
        {
            title: 'Strategy',
            dataIndex: 'strategy_name',
            key: 'strategy',
            render: (text: string) => text ? <Tag color="blue">{text}</Tag> : <Tag color="default">No Strategy</Tag>,
        },
    ];

    const holdingColumns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string, record: any) => (
                <Space>
                    <strong>{text}</strong>
                    <Tag>{record.exchange}</Tag>
                </Space>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value: number) => value.toLocaleString(),
        },
        {
            title: 'Avg Price',
            dataIndex: 'avg_price',
            key: 'avg_price',
            render: (value: number) => `₹${value.toFixed(2)}`,
        },
        {
            title: 'LTP',
            dataIndex: 'ltp',
            key: 'ltp',
            render: (value: number) => `₹${value.toFixed(2)}`,
        },
        {
            title: 'P&L',
            dataIndex: 'pnl',
            key: 'pnl',
            render: (value: number) => (
                <Statistic
                    value={value}
                    precision={2}
                    valueStyle={{
                        color: value >= 0 ? '#3f8600' : '#cf1322',
                        fontSize: '14px'
                    }}
                    prefix={value >= 0 ? <RiseOutlined /> : <FallOutlined />}
                />
            ),
            sorter: (a: any, b: any) => a.pnl - b.pnl,
        },
        {
            title: 'Strategy',
            dataIndex: 'strategy_name',
            key: 'strategy',
            render: (text: string) => text ? <Tag color="blue">{text}</Tag> : <Tag color="default">No Strategy</Tag>,
        },
    ];

    const orderColumns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string, record: any) => (
                <Space>
                    <strong>{text}</strong>
                    <Tag>{record.exchange}</Tag>
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'transaction_type',
            key: 'transaction_type',
            render: (text: string) => (
                <Tag color={text === 'BUY' ? 'green' : 'red'}>{text}</Tag>
            ),
        },
        {
            title: 'Order Type',
            dataIndex: 'order_type',
            key: 'order_type',
            render: (text: string) => <Tag>{text}</Tag>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value: number) => value.toLocaleString(),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (value: number) => `₹${value.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => {
                const color = text === 'COMPLETE' ? 'green' :
                    text === 'OPEN' ? 'blue' :
                        text === 'CANCELLED' ? 'red' : 'orange';
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Time',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: string) => dayjs(text).format('DD/MM HH:mm'),
        },
        {
            title: 'Strategy',
            dataIndex: 'strategy_name',
            key: 'strategy',
            render: (text: string) => text ? <Tag color="blue">{text}</Tag> : <Tag color="default">No Strategy</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: any) => (
                <Space>
                    {(record.status === 'OPEN' || record.status === 'PENDING') && (
                        <>
                            <Tooltip title="Modify Order">
                                <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    size="small"
                                    onClick={() => handleModifyOrder(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Cancel Order">
                                <Button
                                    type="link"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    danger
                                    onClick={() => handleCancelOrder(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const marginColumns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Available',
            dataIndex: 'available',
            key: 'available',
            render: (value: number) => (
                <Statistic
                    value={value}
                    precision={0}
                    valueStyle={{ color: '#3f8600', fontSize: '14px' }}
                    prefix="₹"
                />
            ),
        },
        {
            title: 'Used',
            dataIndex: 'used',
            key: 'used',
            render: (value: number) => (
                <Statistic
                    value={value}
                    precision={0}
                    valueStyle={{ color: '#cf1322', fontSize: '14px' }}
                    prefix="₹"
                />
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (value: number) => (
                <Statistic
                    value={value}
                    precision={0}
                    valueStyle={{ fontSize: '14px' }}
                    prefix="₹"
                />
            ),
        },
        {
            title: 'Usage',
            key: 'usage',
            render: (record: any) => {
                const percent = record.total > 0 ? (record.used / record.total) * 100 : 0;
                return (
                    <Progress
                        percent={percent}
                        size="small"
                        status={percent > 80 ? 'exception' : percent > 60 ? 'normal' : 'success'}
                        format={() => `${percent.toFixed(1)}%`}
                    />
                );
            },
        },
    ];

    return (
        <div>
            {/* Account Summary */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Total P&L"
                            value={totalPnL}
                            precision={2}
                            valueStyle={{
                                color: totalPnL >= 0 ? '#3f8600' : '#cf1322',
                                fontSize: '20px'
                            }}
                            prefix={totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
                            suffix="₹"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Available Margin"
                            value={availableMargin}
                            precision={0}
                            valueStyle={{ fontSize: '20px' }}
                            prefix="₹"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                type="primary"
                                icon={<SyncOutlined />}
                                onClick={refreshAllData}
                                style={{ width: '100%' }}
                            >
                                Refresh All Data
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Data Tabs */}
            <Tabs defaultActiveKey="positions" type="card">
                <TabPane tab={`Positions (${positions?.length || 0})`} key="positions">
                    <Table
                        columns={positionColumns}
                        dataSource={positions}
                        rowKey="id"
                        loading={positionsLoading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                        summary={(pageData) => {
                            const totalPnL = pageData.reduce((sum, record) => sum + (record.pnl || 0), 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4}>
                                        <strong>Total P&L:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Statistic
                                            value={totalPnL}
                                            precision={2}
                                            valueStyle={{
                                                color: totalPnL >= 0 ? '#3f8600' : '#cf1322',
                                                fontSize: '14px'
                                            }}
                                            prefix={totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                        />
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} />
                                </Table.Summary.Row>
                            );
                        }}
                    />
                </TabPane>

                <TabPane tab={`Holdings (${holdings?.length || 0})`} key="holdings">
                    <Table
                        columns={holdingColumns}
                        dataSource={holdings}
                        rowKey="id"
                        loading={holdingsLoading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                        summary={(pageData) => {
                            const totalPnL = pageData.reduce((sum, record) => sum + (record.pnl || 0), 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4}>
                                        <strong>Total P&L:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Statistic
                                            value={totalPnL}
                                            precision={2}
                                            valueStyle={{
                                                color: totalPnL >= 0 ? '#3f8600' : '#cf1322',
                                                fontSize: '14px'
                                            }}
                                            prefix={totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                        />
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} />
                                </Table.Summary.Row>
                            );
                        }}
                    />
                </TabPane>

                <TabPane tab={`Orders (${orders?.length || 0})`} key="orders">
                    <Table
                        columns={orderColumns}
                        dataSource={orders}
                        rowKey="id"
                        loading={ordersLoading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                    />
                </TabPane>

                <TabPane tab={`Margins (${margins?.length || 0})`} key="margins">
                    <Table
                        columns={marginColumns}
                        dataSource={margins}
                        rowKey="id"
                        loading={marginsLoading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 600 }}
                    />
                </TabPane>
            </Tabs>

            {/* Modify Order Modal */}
            <Modal
                title="Modify Order"
                visible={modifyModalVisible}
                onCancel={() => setModifyModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={modifyOrderMutation.isLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModifySubmit}
                >
                    <Form.Item
                        name="order_type"
                        label="Order Type"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Option value="MARKET">MARKET</Option>
                            <Option value="LIMIT">LIMIT</Option>
                            <Option value="SL">STOP LOSS</Option>
                            <Option value="SL-M">STOP LOSS MARKET</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" step="0.01" />
                    </Form.Item>

                    <Form.Item
                        name="trigger_price"
                        label="Trigger Price"
                    >
                        <Input type="number" step="0.01" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserDashboard;