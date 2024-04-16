import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Modal,Form, Input,message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import UseMainStore from '../../../../../../store/main';
import { localCache } from '../../../../../../utils/cache.ts';
const NoticeModal = (props) => {
  const [open, setOpen] = useState(false);
  const [form] = useForm()
  const { TextArea } = Input;
  const {newNoticeAction} = UseMainStore()
  const role = localCache.getCache('copyRole')
  const showModal = () => {
    if(role === '学生'){
      message.error('您没有操作权限')
    }else {
    setOpen(true)
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
    newNoticeAction(noticeInfo)
    setOpen(false);
    form.resetFields()
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        新建公告
      </Button>
      <Modal
        title={<h2 style={{textAlign: 'center',marginBottom: '1.3021vw'}}>新建公告</h2>}
        open={open}
        width='26.0417vw'
        footer={null}
        closeIcon={null}
      >
        <Form 
        name='new' form={form} autoComplete="off"
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
    
            <FormItem name='title' label='标题' 
            rules={[{required:true,message:'请输入标题'}]}>
                <Input placeholder='请输入标题'></Input>
            </FormItem>
            <FormItem name='notice_content' label='内容'rules={[{required:true,message:'请输入内容'}]}>
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
NoticeModal.propTypes = {
    onClick: PropTypes.func
}
export default NoticeModal;