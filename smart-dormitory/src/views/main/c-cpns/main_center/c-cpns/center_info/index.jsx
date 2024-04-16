import { localCache } from '../../../../../../utils/cache.ts'
import { Form,Input,Radio,Row,Col,Button,ConfigProvider} from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { useForm } from 'antd/lib/form/Form'
import React, { memo } from 'react'
import { useState } from 'react'
import { CenterInfoWrapper } from './style'
import UseMainStore from '../../../../../../store/main'
import { useEffect } from 'react'

const centerInfo = memo(() => {
  const [gender, setGender] = useState('男')
  const [border,setBorder] = useState(true)
  const [labelColor,setLabelColor] = useState('rgba(0, 0, 0, 0.88)')
  const [form] = useForm()
  const {saveProfileAction,postProfileAction,deleteProfileAction} = UseMainStore()
  const user_id = localCache.getCache('user_id')
  useEffect(() => {
    fetchProfileData()
  },[])
  // 在用户登录时从 localStorage 中读取该用户保存的状态,刷新和退出系统时控制边框和label颜色
  useEffect(() => {
    const savedBorder = localCache.getCache(`border_${user_id}`);
    const savedLabelColor = localCache.getCache(`labelColor_${user_id}`)
    if (savedBorder) {
      setBorder(savedBorder === 'true');
    }
    if(savedLabelColor){
      setLabelColor(savedLabelColor === 'rgba(0, 0, 0, 0.88)' ? 'rgba(0, 0, 0, 0.88)' : '#4096ff')
    }
  },[user_id])
  const onGenderChange = (e) => {
    setGender(e.target.value);
  };
  // 保存
  const handleFinish = async(values) => {
    const saveResult =  await saveProfileAction(user_id,values)
    const saveMessage = saveResult?.message
    const { default: message } = await import('antd/es/message');
    // 显示保存成功消息
    message.success(saveMessage);

    // 设置定时器，在一秒后隐藏消息
    setTimeout(() => {
      message.destroy(); // 隐藏消息
    }, 1000);
   if(saveMessage){
    setBorder(false)
    setLabelColor('#4096ff')
    localCache.setCache(`border_${user_id}`,'false')
    localCache.setCache(`labelColor_${user_id}`,'#4096ff')
   }
  }
  // 重置
  const handleResetClick = async() => {
    const resetResult = await deleteProfileAction(user_id)
    const resetMessage = resetResult?.message
    const { default: message } = await import('antd/es/message');
    // 显示保存成功消息
    message.success(resetMessage);

    // 设置定时器，在一秒后隐藏消息
    setTimeout(() => {
      message.destroy(); // 隐藏消息
    }, 1000);
    if(resetMessage){
      form.resetFields()
    setBorder(true)
    setLabelColor('rgba(0, 0, 0, 0.88)')
    localCache.setCache(`border_${user_id}`,'true')
    localCache.setCache(`labelColor_${user_id}`,'rgba(0, 0, 0, 0.88)')
    }
  }
 async function fetchProfileData(){
    // 请求数据
    const profileInfo =  await postProfileAction(user_id)
    // 填充数据
    form.setFieldsValue(profileInfo)
  }
  return (
    <CenterInfoWrapper>
      <div className='center_info'>
       <ConfigProvider
       theme={{
        components:{
          Form: {
            labelColor: labelColor
          }
        }
       }}>
       <Form name='info'
        labelCol={{ span:7}} 
        autoComplete='off'
        onFinish={handleFinish}
        form={form}>
          <Row gutter={16}>
            <Col span={12}>
            <FormItem name='username' label='姓名'>
            <Input style={{border: !border && 'none'}}>
            </Input>
             </FormItem>
            </Col>
            <Col span={12}>
            <FormItem name='gender' label='性别'>
          <Radio.Group onChange={onGenderChange} value={gender}>
            <Radio value='男'>男</Radio>
            <Radio value='女' style={{marginLeft:'2.6042vw'}}>女</Radio>
          </Radio.Group>
          </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <FormItem name='department' label='院系'>
            <Input style={{border: !border && 'none'}}></Input>
          </FormItem>
            </Col>
            <Col span={12}>
            <FormItem name='major' label='专业'>
            <Input style={{border: !border && 'none'}}></Input>
          </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <FormItem name='dormitory' label='宿舍'>
            <Input style={{border: !border && 'none'}}></Input>
          </FormItem>
            </Col>
            <Col span={12}>
            <FormItem name='cellphone' label='手机' rules={[{pattern:/^1[3456789]\d{9}$/,message: '请输入11位手机号码'
          }]}>
            <Input style={{border: !border && 'none'}}></Input>
          </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <FormItem name='start_year' label='入学年份'>
            <Input style={{border: !border && 'none' }} placeholder=""></Input>
          </FormItem>
            
            </Col>
            <Col span={12}>
            <FormItem name='mail' label='邮箱'>
            <Input style={{border: !border && 'none'}}></Input>
          </FormItem>
            </Col>
          </Row>
          
            <FormItem style={{textAlign:'right'}}>
            <Button style={{marginRight: '0.9766vw'}} onClick={handleResetClick}>重置</Button>
            <Button type='primary' htmlType='submit'>保存</Button>
            </FormItem>
        </Form>
       </ConfigProvider>
      </div>
    </CenterInfoWrapper>
  )
})

export default centerInfo