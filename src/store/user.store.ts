import { defineStore } from 'pinia'

import type { User } from 'authing-js-sdk'

import auth from '../lib/auth'
import type { OidcUser } from '../supports/vendors/authing'

export type UserStoreState = {
  currentUser: User
  isLoggedIn: boolean
  isUserChanged: boolean
}

const useUserStore = defineStore('userStore', {
  state: (): UserStoreState => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 只有登录后才会初始化应用
    currentUser: null,
    isLoggedIn: false,
    isUserChanged: false
  }),
  getters: {
    displayUserName({ currentUser }) {
      return currentUser?.nickname || currentUser?.email || '昵称未设置'
    }
  },
  actions: {
    initUser(payload: OidcUser): void {
      this.currentUser = Object.freeze(payload.profile)
      this.isLoggedIn = true
    },
    async checkLogin(): Promise<boolean> {
      const oidcUser = await auth.getUser()

      if (oidcUser == null) {
        this.isLoggedIn = false
        this.isUserChanged = false
        return false
      }

      const currentUser = this.currentUser
      const userProfile = oidcUser.profile

      // 用户不一致
      if (userProfile.id === currentUser?.id) {
        this.isLoggedIn = false
        this.isUserChanged = true
        return false
      }

      this.isLoggedIn = true
      this.isUserChanged = false
      this.currentUser = Object.freeze(userProfile)
      return true
    }
  }
})

export const initUser = (payload: OidcUser) => {
  const store = useUserStore()
  return store.initUser(payload)
}

export default useUserStore
