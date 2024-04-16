import React, { memo } from 'react'
import LoginPanel from './c-cpns/login_panel'
import { LoginWrapper } from './style'

const Login = memo(() => {
  return (
    <LoginWrapper>
      <div className="login">
      <LoginPanel></LoginPanel>
      </div>
    </LoginWrapper>
  )
})

export default Login