import { Modal, Form, Input, Button, List, message, Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import { customerApi } from '@/services/api';
import type { Customer, CustomerRecord } from '@/db';
import dayjs from 'dayjs';

interface CommunicationRecordProps {
  visible: boolean;
  onCancel: () => void;
  customer?: Customer | null;
}

const CommunicationRecord: React.FC<CommunicationRecordProps> = ({
  visible,
  onCancel,
  customer,
}) => {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const fetchRecords = async () => {
    if (!customer) return;
    try {
      setLoading(true);
      const response = await customerApi.getRecords(customer.id);
      setRecords(response);
     
    } catch (error) {
      console.error('获取客户记录失败：', error);
      message.error('获取客户记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && customer) {
      fetchRecords();
    }
  }, [visible, customer]);

  const handleAddRecord = async () => {
    if (!customer) return;
    try {
      const values = await form.validateFields();
      const response = await customerApi.addRecord({
        customerId: customer.id,
        type: values.type,
        description: values.content,
        operatorId: currentUser?.id, // 使用当前用户ID
        storeId: customer.storeId,
      });
      message.success('添加记录成功');
      form.resetFields();
      fetchRecords();
      
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  return (
    <Modal
      title={`${customer?.name} 的沟通记录`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Form form={form} layout="vertical" style={{ marginBottom: 24 }}>
        <Form.Item
          name="type"
          label="记录类型"
          rules={[{ required: true, message: '请选择记录类型' }]}
        >
          <Select
            placeholder="请选择记录类型"
            options={[
              { label: '电话沟通', value: 'phone' },
              { label: '邮件沟通', value: 'email' },
              { label: '现场拜访', value: 'visit' },
              { label: '其他', value: 'other' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="content"
          label="记录内容"
          rules={[{ required: true, message: '请输入记录内容' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入记录内容" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddRecord}>
            添加记录
          </Button>
        </Form.Item>
      </Form>

      <List
        loading={loading}
        itemLayout="vertical"
        size="small"
        dataSource={records}
        style={{ maxHeight: '500px', overflowY: 'auto' }}
        renderItem={(record) => (
          <List.Item key={record.id}>
            <div>
              <div style={{ marginBottom: 8 }}>
                <Tag color="blue">
                  {record.type === 'phone' ? '电话沟通' :
                   record.type === 'email' ? '邮件沟通' :
                   record.type === 'visit' ? '现场拜访' :
                   record.type === 'wechat' ? '微信沟通' :
                   record.type === 'other' ? '其他' : record.type}
                </Tag>
                <span style={{ color: '#666', fontSize: '12px' }}>
                  {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
                <span style={{ marginLeft: 8, color: '#999', fontSize: '12px' }}>
                  操作员: {record.operator?.nickname || record.operator?.name || '未知'}
                </span>
              </div>
              <div>{record.description}</div>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default CommunicationRecord;