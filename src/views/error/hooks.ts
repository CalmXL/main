import { ElMessageBox } from 'element-plus'
import { LoginUrl } from '@/config'
import useUserStore from '@/store/modules/user'

export function useLogout() {
  const router = useRouter()
  const userStore = useUserStore()
  function logout() {
    ElMessageBox.confirm('确定退登系统吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
      userStore.logOut().then(() => {
        window.location.href = LoginUrl
      })
    })
  }

  function goHome() {
    router.replace('/index')
  }

  return { logout, goHome }
}
