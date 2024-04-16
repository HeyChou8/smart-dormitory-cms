import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { PanelWrapper } from './style'
import { Button, Checkbox, Form, Input } from 'antd'
import UseLoginStore from '../../../../../store/login'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { localCache } from '../../../../../utils/cache.ts'
const Panel = memo((props) => {
  const [errorMessage,setErrorMessage] = useState('') 
  const [rememberMe, setRememberMe] = useState(false);
  // const [account, setAccount] = useState('');
  // const [password, setPassword] = useState('');
  const loginAccountAction = UseLoginStore((state) => state.loginAccountAction)
  const message  = UseLoginStore(state => state.errorMessage)
  const isTokenValidAction = UseLoginStore(state => state.isTokenValidAction)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  useEffect(() => {
    // 记住密码
    // const savedAccount = localCache.getCache('account')
    // const savedPassword = localCache.getCache('password')
    
    // if(savedAccount && savedPassword ){
    //   setAccount(savedAccount)
    //   setPassword(savedPassword)
    //   setRememberMe(true)
    // }
    const rememberMeData  = localCache.getCache('rememberMeData')
    if(rememberMeData){
      // 坑：传对象进去要用setFieldsValue，有个s
      form.setFieldsValue(rememberMeData)
      setRememberMe(true)
    }
    setErrorMessage(message)
  },[form])
    const handleLogin = async(values) => {
      
      // 拿到账号密码
      // const accountP = { account,password }
      const  {account,password} = values
      const accountP = { account,password }
      
      // 执行登录逻辑
      await loginAccountAction(accountP)
      isTokenValidAction()
      navigate('/main')

      // 执行记住密码的逻辑
      // if(rememberMe){
      //   localCache.setCache('account',account)
      //   localCache.setCache('password',password)
      // }else{
      //   localCache.removeCache('account')
      //   localCache.removeCache('password')
      // }
      if(rememberMe) {
        localCache.setCache('rememberMeData',values)
      }else {
        localCache.removeCache('rememberMeData')
      }
      
    }
      

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
  return (
    <PanelWrapper>
        <div className='panel'>
        <Form
        form={form}
    name="login"
    initialValues={{remember: false}}
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    onFinish={handleLogin}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="账号"
      name="account"
      rules={[
        {
          required: true,
          message: '请输入您的账号!',
        },
        {
          pattern: /^[a-zA-Z0-9]+$/
          , message: '账号只能包含数字和字母'
        }
      ]}
    >
      {/* <Input value={account} onChange={(e) => setAccount(e.target.value)} /> */}
      <Input />
    </Form.Item>

    <Form.Item
      label="密码"
      name="password"
      rules={[
        {
          required: true,
          message: '请输入您的密码!',
        },
        {
          min: 8, message: '密码长度不能少于8位'
        },
      ]}
    >
      {/* <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} /> */}
      <Input.Password/>
    </Form.Item>
      <p className='errorMessage'>{errorMessage}</p>
    <Form.Item
      name="remember"
      valuePropName= 'checked'
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      {/* <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>记住密码</Checkbox> */}
      <Checkbox  onChange={(e) => setRememberMe(e.target.checked)}>记住密码</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit" block >
        登录
      </Button>
    </Form.Item>
  </Form>
        </div>
    </PanelWrapper>
  )
})

Panel.propTypes = {}

export default Panel