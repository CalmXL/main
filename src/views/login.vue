<template>
  <div class="login" :class="{ 'is-mobile': isMobile }">
    <div v-if="!isMobile" class="left-info">
      <div class="bg">
        <div class="info">
          <img class="logo-icon" src="@/assets/images/login_logo.svg" alt="" />
          <img class="title-text" src="@/assets/images/login_title.svg" alt="" />
          <!-- <h1>智元AI中枢，管理新变革</h1> -->
          <span>推动企业走向更智能的未来</span>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="login-form-box">
        <h2 class="login-text">登录</h2>
        <span class="login-type">账号登录</span>
        <el-form ref="account" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" size="large" clearable auto-complete="off" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              show-password
              auto-complete="off"
              placeholder="请输入密码 "
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item v-if="captchaEnabled" prop="code">
            <el-input
              v-model="loginForm.code"
              size="large"
              auto-complete="off"
              placeholder="验证码"
              clearable
              style="width: 63%"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
              </template>
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" class="login-code-img" @click="getCode" />
            </div>
          </el-form-item>

          <el-form-item style="width: 100%">
            <el-button :loading="loading" size="large" type="primary" style="width: 100%; margin-top: 40px" @click.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
          <!-- <div class="register">
            <span>
              还没有账号？立即
              <router-link class="register-link" :to="'/register'">注册</router-link>
            </span>
            <span>忘记密码？</span>
          </div>
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">15天内自动登录</el-checkbox> -->
        </el-form>
        <!-- <el-tabs v-if="!qrcodeLogin" v-model="active" class="login-tabs">
          <el-tab-pane label="账号登录" name="account">
            <el-form ref="account" :model="loginForm" :rules="loginRules" class="login-form">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" size="large" clearable auto-complete="off" placeholder="请输入账号" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  size="large"
                  show-password
                  auto-complete="off"
                  placeholder="请输入密码 "
                  @keyup.enter="handleLogin"
                />
              </el-form-item>
              <el-form-item v-if="captchaEnabled" prop="code">
                <el-input
                  v-model="loginForm.code"
                  size="large"
                  auto-complete="off"
                  placeholder="验证码"
                  clearable
                  style="width: 63%"
                  @keyup.enter="handleLogin"
                >
                  <template #prefix>
                    <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
                  </template>
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" class="login-code-img" @click="getCode" />
                </div>
              </el-form-item>

              <el-form-item style="width: 100%">
                <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
              <div class="register">
                <span>
                  还没有账号？立即
                  <router-link class="register-link" :to="'/register'">注册</router-link>
                </span>
                <span>忘记密码？</span>
              </div>
              <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">15天内自动登录</el-checkbox>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phone">
            <el-form ref="phone" :model="loginForm" :rules="loginRules" class="login-form">
              <el-form-item prop="phone">
                <el-input v-model="loginForm.phone" type="text" size="large" clearable auto-complete="off" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="loginForm.code"
                  size="large"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  clearable
                  style="flex: 1"
                  @keyup.enter="handleLogin"
                />
                <div class="login-code">
                  <el-button size="large">获取验证码</el-button>
                </div>
              </el-form-item>

              <el-form-item style="width: 100%">
                <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
              <div class="register">
                <span>
                  还没有账号？立即
                  <router-link class="register-link" :to="'/register'">注册</router-link>
                </span>
                <span>忘记密码？</span>
              </div>
              <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">15天内自动登录</el-checkbox>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="OA账号登录" name="oa">
            <el-form ref="oa" :model="loginForm" :rules="loginRules" class="login-form">
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.oaUsername"
                  type="text"
                  size="large"
                  clearable
                  auto-complete="off"
                  placeholder="请输入OA账号"
                />
              </el-form-item>
              <el-form-item prop="oaPassword">
                <el-input
                  v-model="loginForm.oaPassword"
                  type="password"
                  size="large"
                  show-password
                  auto-complete="off"
                  placeholder="请输入OA密码"
                  @keyup.enter="handleLogin"
                />
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
              <div class="register">
                <span>
                  还没有账号？立即
                  <router-link class="register-link" :to="'/register'">注册</router-link>
                </span>
                <span>忘记密码？</span>
              </div>
              <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">15天内自动登录</el-checkbox>
            </el-form>
          </el-tab-pane>
        </el-tabs> -->

        <!-- <div v-else class="qrcode">
          <div class="qrcode-title">
            <img class="qecode-icon" src="@/assets/images/qrcode_icon.svg" alt="" />
            <span>OA扫描登录</span>
          </div>
          <img class="qrcode-img" src="@/assets/images/login_qrcode.jpg" alt="" />

          <span class="qr-tips">使用OA扫描登录</span>
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 20px 0px 25px 0px">15天内自动登录</el-checkbox>
        </div> -->

        <!-- <img v-if="qrcodeLogin" class="qr-code-icon" src="@/assets/images/account_login_icon.svg" alt="" @click="qrcodeLogin = false" />
        <img v-else class="qr-code-icon" src="@/assets/images/qr_code_icon.svg" alt="" @click="qrcodeLogin = true" /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import qs from 'qs'
import Cookies from 'js-cookie'
import { ElMessage, FormInstance } from 'element-plus'
import { ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { getCodeImg } from '@/api/login'
import { isMobile } from '@/config'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loginForm = ref<any>({
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
  phone: [{ required: true, trigger: 'change', message: '请输入手机号' }],
  oaPassword: [{ required: true, trigger: 'blur', message: '请输入OA密码' }],
  oa: [{ required: true, trigger: 'change', message: '请输入OA账号' }]
}

const codeUrl = ref('')
const loading = ref(false)
// 验证码开关
const captchaEnabled = ref(false)
// 注册开关
// const register = ref(false)
const account = ref<FormInstance>()
const phone = ref<FormInstance>()
const oa = ref<FormInstance>()
const active = ref('account')

const loginRef = computed(() => {
  switch (active.value) {
    case 'account':
      return account.value
    case 'phone':
      return phone.value
    case 'oa':
    default:
      return oa.value
  }
})

const qrcodeLogin = ref(false)

function handleLogin() {
  loginRef.value?.validate(valid => {
    if (['phone', 'oa'].includes(active.value)) {
      ElMessage.warning('功能能开发中，请使用账号密码登录')
      return
    }

    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('username', loginForm.value.username, { expires: 30 })
        const enPwd = encrypt(loginForm.value.password)
        if (enPwd) {
          Cookies.set('password', enPwd, { expires: 30 })
        }
        if (loginForm.value.rememberMe) {
          Cookies.set('rememberMe', String(loginForm.value.rememberMe), { expires: 30 })
        }
      } else {
        // 否则移除
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          const redirect = route.query.redirect as string | undefined

          let path = '/'
          let query = {}
          if (redirect) {
            const { pathname, search } = new URL(`https://xxx.xx${decodeURIComponent(redirect)}`)
            path = pathname
            query = qs.parse(search.substring(1))
          }

          // 调用 停止上次任务功能
          userStore.stopTask()
          router.replace({ path, query })
        })
        .catch(() => {
          loading.value = false
          // 重新获取验证码
          if (captchaEnabled.value) {
            getCode()
          }
        })
    }
  })
}

function getCode() {
  getCodeImg().then((res: any) => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = `data:image/gif;base64,${res.img}`
      loginForm.value.uuid = res.uuid
    }
  })
}

function getCookie() {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password) || '',
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}

getCode()
getCookie()
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  // justify-content: flex-end;
  background-size: cover;
  background-image: url('../assets/images/login_bg.jpg');
  background-repeat: no-repeat;

  .left-info {
    width: 50%;
    height: 100%;

    .info {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .bg {
      width: 100%;
      height: 100%;
      color: white;
      padding: 0 0 64px 240px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .logo-icon {
        color: red;
        width: 77.44px;
        height: 76.04px;
      }

      .title-text {
        margin-top: 56px;
      }

      // h1 {
      //   color: #333;
      //   font-size: 36px;
      //   font-weight: 600;
      // }

      span {
        margin-top: 28px;
        line-height: 28px;
        font-size: 28.19px;
        font-weight: 600;
      }
    }
  }

  .right {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: rgba($color: #fff, $alpha: 1);

    :deep(.el-tabs__nav-wrap) {
      &::after {
        background-color: transparent;
      }
    }

    .login-form-box {
      width: 504px;
      height: 539px;
      padding: 60px;
      border-radius: 16px;
      position: relative;
      background-color: white;

      .qr-code-icon {
        top: 0;
        right: 0;
        cursor: pointer;
        position: absolute;
      }

      .login-tabs {
        margin-top: 20px;
      }

      .login-text {
        color: #333;
        font-size: 30px;
        font-weight: 600;
      }

      .login-type {
        display: block;
        margin-top: 40px;
      }

      :deep(.el-form-item) {
        margin-bottom: 26px;
      }
    }

    .login-form {
      width: 100%;
      padding-top: 16px;
      .el-input {
        height: 40px;
        input {
          height: 40px;
        }
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 0px;
      }
    }

    .qrcode {
      padding: 30px 60px 60px 60px;
      display: flex;
      align-items: center;
      flex-direction: column;

      .qrcode-title {
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 14px;
          height: 14px;
          margin-right: 6px;
        }

        span {
          font-size: 16px;
          font-weight: 500;
        }
      }

      .qrcode-img {
        width: 226px;
        height: auto;
      }

      .qr-tips {
        color: #999;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }

  .register {
    color: var(--el-color-info);
    display: flex;
    font-size: 14px;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;

    .register-link {
      color: var(--el-color-primary);
    }
  }

  @media screen and (max-width: 1630px) {
    .left-info {
      // width: 100%;
      .bg {
        padding-left: 10vw;
      }
    }

    .right {
      padding-left: 10vw;
    }
  }

  @media screen and (max-width: 1400px) {
    .left-info {
      .bg {
        padding-left: 5vw;
      }
    }

    .right {
      padding-left: 5vw;
    }
  }

  @media screen and (max-width: 1300px) {
    .left-info {
      .bg {
        padding-left: 0;
      }
    }

    .right {
      padding-left: 0;
    }
  }

  &.is-mobile {
    background-image: none;
    background-color: #f5f7fa;
    display: block;
    overflow-y: auto;

    .right {
      width: 100%;
      height: auto;
      min-height: 100%;
      padding: 40px 20px;
      align-items: flex-start;

      .login-form-box {
        width: 100%;
        height: auto;
        padding: 40px 24px;
        box-shadow: none;
        border-radius: 12px;
      }
    }
  }
}
.logo {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 28px;
  padding: 20px 0;
  margin-left: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 390px;
  box-sizing: border-box;
  img {
    width: 140px;
    height: auto;
  }
  s {
    width: 1px;
    height: 38px;
    background: rgba(39, 39, 39, 0.2);
  }
}
.title {
  color: #707070;
  margin: 0px auto 30px auto;
  text-align: left;
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  height: 100%;
  margin-left: 20px;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
