import { withBase } from '../supports/helpers/withBase'
import { UserManager } from '../supports/vendors/authing'

const mgr = new UserManager({
  appId: process.env.VUE_APP_OIDC_CLIENT_ID as string,
  appHost: process.env.VUE_APP_OIDC_AUTHORITY,
  redirectUri: new URL(withBase(process.env.VUE_APP_OIDC_CALLBACK_URL as string), location.origin).toString()
})

export default mgr
