/* eslint-disable @typescript-eslint/ban-ts-comment */
import { nanoid } from 'nanoid'

import { AuthenticationClient, User } from 'authing-js-sdk'
import type { AuthenticationClientOptions } from 'authing-js-sdk'

import { WebStorageSync } from '../util/storage'

export type TokenSet = {
  scope: string
  id_token: string
  token_type: string
  access_token: string
  expires_in: number
  expires_at: number
}

// Todo 返回 token 过期时间
export type OidcUser = { profile: User } & TokenSet

export type AppState = {
  targetUrl?: string | null
}

const defaults: Partial<AuthenticationClientOptions> = {
  tokenEndPointAuthMethod: 'none'
}

export class UserManager extends AuthenticationClient {
  userStore: WebStorageSync

  constructor(options: AuthenticationClientOptions & { userStore?: WebStorageSync }) {
    super(Object.assign(defaults, options))
    this.userStore = options.userStore || new WebStorageSync({ prefix: 'oidc.' })
  }

  async prepare(): Promise<{ user: OidcUser; appState?: AppState }> {
    const url = window.location.href
    const redirectUri = this.options.redirectUri as string

    if (url.indexOf(redirectUri) > -1) {
      return this.callback()
    }

    const user = await this.authorize()
    return { user }
  }

  async authorize(): Promise<OidcUser> {
    const user = await this.getUser()
    return user == null ? this.login() : user
  }

  async callback(): Promise<{ user: OidcUser; appState?: AppState }> {
    const storage = this.userStore

    const parsed = new URL(location.href)
    const searchParams = parsed.searchParams

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    // TODO 简单粗暴
    if (code == null) {
      throw new Error('无效的 code')
    }

    const codeChallenge = storage.get<string>(`state.${state}`)
    const targetUrl = storage.get<string>(`redirect.${state}`)

    // 清理本地状态
    this.unstable__clearStaleState()

    // TODO 简单粗暴
    if (codeChallenge == null) {
      throw new Error(`未匹配到授权状态`)
    }

    const tokenSet: TokenSet = await this.getAccessTokenByCode(code, { codeVerifier: codeChallenge })
    const profile = await this.getUserInfoByAccessToken(tokenSet['access_token'])

    const user: OidcUser = { profile, ...tokenSet }

    tokenSet.expires_at = Date.now() + tokenSet.expires_in
    storage.set(`tokenset`, tokenSet)

    return { user, appState: { targetUrl } }
  }

  login(): Promise<never> {
    const state = nanoid()
    const storage = this.userStore

    const codeChallenge = this.generateCodeChallenge()
    const codeChallengeDigest = this.getCodeChallengeDigest({ codeChallenge, method: 'S256' })
    const url = this.buildAuthorizeUrl({
      state,
      codeChallenge: codeChallengeDigest,
      codeChallengeMethod: 'S256'
    })

    storage.set(`state.${state}`, codeChallenge)
    storage.set(`redirect.${state}`, window.location.href)

    window.location.href = url

    return new Promise(() => void 0)
  }

  // TODO 用户数据用 getCurrentUser
  async getUser(): Promise<OidcUser | null> {
    const notLoggedOn = await this.isUnAuthenticated()
    if (notLoggedOn) return null

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const profile = await this.getCurrentUser()
    if (profile == null) return null

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokenSet = this.unstable__getTokenSet()!
    return { ...tokenSet, profile }
  }

  async isUnAuthenticated() {
    const isLoggedIn = await this.isAuthenticated()
    return isLoggedIn === false
  }

  // TODO 快过期是自动刷新?
  async isAuthenticated() {
    const tokenSet = this.unstable__getTokenSet()
    if (tokenSet === null) return false

    const session = await this.checkLoginStatus(tokenSet.id_token)

    // 如果登录更新过期时间
    if (session.code === 200) {
      tokenSet.expires_at = session.exp as number
      this.userStore.set('tokenset', tokenSet)
      return true
    }

    // 移除本地数据
    this.userStore.remove('tokenset')

    return false
  }

  protected unstable__clearStaleState() {
    const storage = this.userStore
    storage.forEach(key => storage.remove(key))
  }

  protected unstable__getTokenSet(): TokenSet | null {
    return this.userStore.get('tokenset')
  }
}
