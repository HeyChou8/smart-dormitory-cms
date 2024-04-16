import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Button, Col, Form, Input, Row,Select } from 'antd';
import {SearchOutlined,SyncOutlined} from '@ant-design/icons'
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';

const UserSearch = memo((props) => {
  const [form] = useForm()
  // 查询按钮
  const handleSearchClick = (values) => {
    props.onSearchClick(values)
  }
  // 重置按钮
  const handleResetClick = () => {
    form.resetFields()
    props.onResetClick()
  }
  return (
    
      <div className="repair_search">
    <Form name='search' onFinish={handleSearchClick} form={form} autoComplete='off'>
     <div className="row">
     <Row gutter={60}>
        <Col>
          <FormItem label='宿舍号' name='dormitory_number' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的宿舍号'></Input>
          </FormItem>
        </Col>
        <Col>
          <FormItem label='联系人' name='contact_person' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的联系人'></Input>
          </FormItem>
        </Col>
        <Col>
          <FormItem label='联系电话' name='cellphone' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的联系电话'></Input>
          </FormItem>
        </Col>
        <Col>
          <FormItem label='维修状态' name='repair_status' style={{width: '14.3229vw'}}>
          <Select placeholder='请选择状态' options={[{value: '未处理'},{value: '已处理'}]}>
              </Select>
          </FormItem>
        </Col>
      </Row>
     </div>
            <div className='search_btn' style={{textAlign:'right'}}>
            <Button icon={<SyncOutlined />} style={{marginRight: '0.9766vw'}} onClick={handleResetClick}>重置</Button>
              
              <Button icon={<SearchOutlined/>} type='primary' htmlType="submit">
                查询</Button>
              </div>
    </Form>
  </div>
    
  )
})

UserSearch.propTypes = {
  onSearchClick:PropTypes.func
}

export default UserSearch