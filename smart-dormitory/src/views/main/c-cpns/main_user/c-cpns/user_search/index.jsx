import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Button, Col, Form, Input, Row,Select } from 'antd';
import {SearchOutlined,SyncOutlined} from '@ant-design/icons'
import FormItem from 'antd/es/form/FormItem';
import { UserSearchWrapper } from './style';
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
    <UserSearchWrapper>
      <div className="user-search">
    <Form name='search' onFinish={handleSearchClick} form={form} autoComplete='off'>
     <div className="row">
     <Row gutter={60}>
        <Col>
          <FormItem label='账号' name='account' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的账号'></Input>
          </FormItem>
        </Col>
        <Col>
          <FormItem label='宿舍号' name='dormitory_number' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的宿舍号'></Input>
          </FormItem>
        </Col>
        <Col>
          <FormItem label='床位号' name='bed_number' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的床位号'></Input>
          </FormItem>
        </Col>
        <Col>
          <FormItem label='角色' name='role' style={{width: '14.3229vw'}}>
          <Select placeholder='请选择角色' options={[{value: '管理员'},{value: '学生'}]}>
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
    </UserSearchWrapper>
  )
})

UserSearch.propTypes = {
  onSearchClick:PropTypes.func
}

export default UserSearch