import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Button, Col, Form, Input, Row,Select } from 'antd';
import {SearchOutlined,SyncOutlined} from '@ant-design/icons'
import FormItem from 'antd/es/form/FormItem';
import { UserSearchWrapper } from './style';
import { useForm } from 'antd/lib/form/Form';

const NoticeSearch = memo((props) => {
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
      <div className="notice_search">
    <Form name='search' onFinish={handleSearchClick} form={form} autoComplete='off'>
     <div className="row">
     <Row gutter={60}>
        <Col>
          <FormItem label='标题' name='title' style={{width: '14.3229vw'}}>
            <Input placeholder='请输入您的标题'></Input>
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

NoticeSearch.propTypes = {
  onSearchClick:PropTypes.func
}

export default NoticeSearch