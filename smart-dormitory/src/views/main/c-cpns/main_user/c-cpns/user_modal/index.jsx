import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Modal,Form, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import UseMainStore from '../../../../../../store/main';
const { Option } = Select;
const UserModal = (props) => {
  const [open, setOpen] = useState(false);
  const [showErrorMessage,setShowErrorMessage] = useState('')
  const [form] = useForm()
  const {newUserAction} = UseMainStore()
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
  const showModal = () => {
    setOpen(true);
  };
//   点击取消
  const handleCancel = () => {
    setOpen(false);
    form.resetFields()
    setShowErrorMessage('')
  };
//   点击确定
  const handleFinish = async(values) => {
    // 数据处理
    let userInfo = values
    userInfo.dormitory_number = `${userInfo.building}栋${userInfo.dormitory_number}`
    delete userInfo.building
    const res =  await newUserAction(userInfo)
    if(res.code===0){
      setOpen(false);
      setShowErrorMessage('')
      form.resetFields()
    }else {
      // 如果账号已存在显示错误信息
      setShowErrorMessage(res.errorMessage)
    }
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        注册用户
      </Button>
      <Modal
        title={<h2 style={{textAlign: 'center',marginBottom: '1.3021vw'}}>注册用户</h2>}
        open={open}
        width='29.2969vw'
        footer={null}
        closeIcon={null}
      >
        <Form 
        name='new' form={form} autoComplete='off'
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
            rules={[{required:true,message:'请输入账号'},{pattern: /^[a-zA-Z0-9]+$/
            , message: '账号只能包含数字和字母'}]}>
                <Input placeholder='请输入账号'></Input>
            </FormItem>
            <FormItem name='password' label='密码' 
            rules={[{required:true,message:'请输入密码'},{min:8,message:'密码不能少于八位'}]}>
                <Input placeholder='请输入密码'></Input>
            </FormItem>
            <FormItem name='dormitory_number' label='宿舍号' 
            rules={[{required:true,message:'请输入宿舍号'}]}>
                <Input placeholder='宿舍号' addonBefore={selectBefore}></Input>
            </FormItem>
            <FormItem name='bed_number' label='床位号' 
            rules={[{required:true,message:'请选择床位号'}]}>
                <Select placeholder='请选择床位' 
              options={[{value: '1'},{value: '2'},{value: '3'},{value: '4'},{value: '5'},{value: '6'}]}>
              </Select>
            </FormItem>
            <FormItem name='role' label='角色'rules={[{required:true,message:'请选择角色'}]}>
              <Select placeholder='请选择角色' options={[{value: '管理员'},{value: '学生'}]}>
              </Select>
            </FormItem>
            <p style={{color:'red',marginLeft:'9.1146vw',marginBottom:'1.3021vw'}}>{showErrorMessage}</p>
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
UserModal.propTypes = {
    onClick: PropTypes.func
}
export default UserModal