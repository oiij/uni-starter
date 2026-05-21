const { envVersion } = uni.getAccountInfoSync().miniProgram
function getUrl(release: string, develop: string) {
  return envVersion === 'release' ? release : develop
}
export const BASE_URL = getUrl('release', 'develop')
