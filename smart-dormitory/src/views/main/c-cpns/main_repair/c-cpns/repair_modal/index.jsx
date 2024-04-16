import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Modal,Form, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import UseMainStore from '../../../../../../store/main';
const RepairModal = (props) => {
  const [open, setOpen] = useState(false);
  const [form] = useForm()
  const {newRepairAction} = UseMainStore()
  const { TextArea } = Input;
  const showModal = () => {
    setOpen(true);
  };
//   点击取消
  const handleCancel = () => {
    setOpen(false);
    form.resetFields()

  };
//   点击确定
  const handleFinish = (values) => {
    newRepairAction(values)
    setOpen(false);
    form.resetFields()
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        提交维修
      </Button>
      <Modal
        title={<h2 style={{textAlign: 'center',marginBottom: '1.3021vw'}}>提交维修</h2>}
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
    
            <FormItem name='dormitory_number' label='宿舍号' 
            rules={[{required:true,message:'请输入宿舍号'}]}>
                <Input placeholder='请输入宿舍号'></Input>
            </FormItem>
            <FormItem name='contact_person' label='联系人' 
            rules={[{required:true,message:'请输入联系人'}]}>
                <Input placeholder='请输入联系人'></Input>
            </FormItem>
            <FormItem name='cellphone' label='联系电话' 
            rules={[{required:true,message:'请输入联系电话'},
            {pattern:/^1[3456789]\d{9}$/,message: '请输入正确的11位号码'
          }]}>
                <Input placeholder='请输入联系电话'></Input>
            </FormItem>
            <FormItem name='repair_content' label='维修说明' 
            rules={[{required:true,message:'请输入维修说明'}]}>
                <TextArea placeholder='请输入维修说明' rows={2} maxLength={20}></TextArea>
            </FormItem>
            <FormItem name='repair_status' label='维修状态' initialValue='未处理'>
              <Input disabled></Input>
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
RepairModal.propTypes = {
    onClick: PropTypes.func
}
export default RepairModal;