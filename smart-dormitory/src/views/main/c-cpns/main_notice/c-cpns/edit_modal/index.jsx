import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Modal,Form, Input,Typography,message} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import UseMainStore from '../../../../../../store/main';
import { localCache } from '../../../../../../utils/cache.ts';
const EditModal = (props) => {
  const [open, setOpen] = useState(false);
  const [form] = useForm()
  const {editNoticeAction} = UseMainStore()
  const {id,title,notice_content} = props.data
  const { TextArea } = Input;
  const role = localCache.getCache('copyRole')
//  点击编辑事件
  const handleEditClick = () => {
    if(role==="学生"){
      message.error('您没有操作权限')
    }else {
      const formData = {title,notice_content}
      form.setFieldsValue(formData)
      setOpen(true);
    }
  };
//   点击取消
  const handleCancel = () => {
    setOpen(false);
    form.resetFields()

  };
//   点击确定
  const handleFinish = (values) => {
    const noticeInfo = {...values,role}
    // 发送编辑的网络请求
    editNoticeAction(id,noticeInfo)
    props.onFetchNoticeList()
    setOpen(false);
    form.resetFields()
  }
  return (
    <>
      <Typography.Link style={{marginRight: '0.9766vw'}} onClick={handleEditClick}>
                编辑
        </Typography.Link>
      <Modal
        title={<h2 style={{textAlign: 'center',marginBottom: '1.3021vw'}}>编辑公告</h2>}
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
    
            <FormItem name='title' label='标题' >
                <Input placeholder='请输入账号'></Input>
            </FormItem>
            <FormItem name='notice_content' label='内容' >
            <TextArea placeholder='请输入内容' rows={8} maxLength={200}></TextArea>
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