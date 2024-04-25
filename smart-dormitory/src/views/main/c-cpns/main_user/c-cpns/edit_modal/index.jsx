import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Modal,Form, Input,Typography,Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import UseMainStore from '../../../../../../store/main';
const {Option} = Select
const EditModal = (props) => {
  const [open, setOpen] = useState(false);
  const [form] = useForm()
  const {editUserByIdAction} = UseMainStore()
  const {id,account,dormitory_number,bed_number,role} = props.data
  
  // 将宿舍号的选择器结合到输入框
  const selectBefore = (
    <FormItem name='building' noStyle>
      <Select placeholder='栋' style={{ width: '4.5573vw' }}>
      <Option value="A"></Option>
      <Option value="B"></Option>
      <Option value="C"></Option>
      <Option value="D"></Option>
      <Option value="E"></Option>
      <Option value="F"></Option>
    </Select>
  </FormItem>
  )
//  点击编辑事件
  const handleEditClick = () => {
    let formData = {account,dormitory_number,bed_number,role}
    // 提取数字部分和第一个字符
    let extractedNumber = formData.dormitory_number.match(/\d+/)[0]
    let firstCharacter = formData.dormitory_number.charAt(0)
    // 更新 dormitory_number 并添加 building
    formData.dormitory_number = extractedNumber
    formData.building = firstCharacter
    form.setFieldsValue(formData)
    setOpen(true);
  };
//   点击取消
  const handleCancel = () => {
    setOpen(false);
    form.resetFields()

  };
//   点击确定
  const handleFinish = (values) => {
    // 数据处理
    let userInfo = values
    userInfo.dormitory_number = `${userInfo.building}栋${userInfo.dormitory_number}`
    delete userInfo.building
    // 发送编辑的网络请求
    editUserByIdAction(id,userInfo)
    props.onFetchUserList()
    setOpen(false);
    form.resetFields()
  }
  return (
    <>
      <Typography.Link style={{marginRight: '0.9766vw'}} onClick={handleEditClick}>
                编辑
        </Typography.Link>
      <Modal
        title={<h2 style={{textAlign: 'center',marginBottom: '1.3021vw'}}>编辑用户</h2>}
        open={open}
        width='26.0417vw'
        footer={null}
        closeIcon={null}
      >
        <Form 
        name='edit' form={form} 
        labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 10  ,
    }}
    style={{
      maxWidth: '39.0625vw',
    }} 
    onFinish={handleFinish}>
    
            <FormItem name='account' label='账号' 
            rules={[{pattern: /^[a-zA-Z0-9]+$/
            , message: '账号只能包含数字和字母'}]}>
                <Input placeholder='请输入账号'></Input>
            </FormItem>
            <FormItem name='dormitory_number' label='宿舍号' >
            <Input placeholder='宿舍号' addonBefore={selectBefore}></Input>
            </FormItem>
            <FormItem name='bed_number' label='床位号' >
            <Select placeholder='请选择床位' 
              options={[{value: '1'},{value: '2'},{value: '3'},{value: '4'},{value: '5'},{value: '6'}]}>
              </Select>
            </FormItem>
            <FormItem name='role' label='角色'>
              <Select placeholder='请选择角色' options={[{value: '管理员'},{value: '学生'}]}>
              </Select>
            </FormItem>
            <FormItem wrapperCol={{ offset: 8, span: 16 }}>
            <div style={{display:'flex'}}>
        <div onClick={handleCancel} style={{marginRight: '0.651vw'}}>
            <Button key="cancel">取消</Button></div>
        <Button htmlType="submit" type="primary" onClick={props.onClick}>
          确定
        </Button></div>
            </FormItem>
        </Form>
      </Modal>
    </>
  );
};
EditModal.propTypes = {
    
}
export default EditModal;