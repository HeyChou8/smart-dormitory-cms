import React, { useState } from 'react';
import { Modal, Form, Input, message,Button } from 'antd';
import { changePwd } from '../../service/main/main';
import { localCache } from '../../utils/cache.ts';
import styled from 'styled-components';

// 使用styled-components定义模态框的样式
const StyledModal = styled(Modal)`
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .ant-modal-title {
    font-size: 1.5625vw; /* 调整为所需的字体大小 */
    margin-bottom: 0.9766vw;
  }
`;

// 使用styled-components定义输入框的样式
const StyledInputPassword = styled(Input.Password)`
  width: 13.0208vw; // 根据需要调整宽度
`;

const ChangePasswordModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userId = localCache.getCache('user_id')
  // 显示模态框
  const showModal = () => {
    setIsModalVisible(true);
  };
  // 处理模态框的“确认”操作
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error('新密码和确认密码不匹配');
        return;
      }
      // 调用后端API修改密码
      const pwdInfo = {currentPassword:values.currentPassword,newPassword:values.newPassword}
      const result =  await changePwd(userId,pwdInfo)
      console.log(result)
      if(result.success){
        message.success(result.message);
        setIsModalVisible(false); // 关闭模态框
        form.resetFields()
      }else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('密码修改失败');
      console.error('密码修改错误:', error);
    }
  };
  // 处理模态框的“取消”操作
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  };

  return (
    <>
    <span onClick={showModal}>
    修改密码
    </span>
    
    <StyledModal
    title="修改密码"
    visible={isModalVisible}
    onOk={handleSubmit}
    onCancel={handleCancel}
    okText="确认"
    cancelText="取消"
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="currentPassword"
        label="当前密码"
        rules={[{ required: true, message: '请输入当前密码' },{min:8,message:"密码最少为八位数"}]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[{ required: true, message: '请输入新密码' },{min:8,message:"密码最少为八位数"}]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="确认密码"
        rules={[{ required: true, message: '请确认新密码' },{min:8,message:"密码最少为八位数"}]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  </StyledModal>
    
  </>
    
  );
};

export default ChangePasswordModal;

