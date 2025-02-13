export const APP_ACCESS_TOKEN = 'BRF-ACCESS-TOKEN';

/**
 * 获取登录用户的token
 * @returns {string | null} 
 */
export const getSessionToken = () => {
  const tokenStr = localStorage.getItem(APP_ACCESS_TOKEN);

  if (tokenStr) {
    return tokenStr;
  }
  return null;
}

export const setSessionToken = (token) => {
  localStorage.setItem(APP_ACCESS_TOKEN, token);
}

/**
 * 退出登录
 */
export const removeSessionAndLogoutUser = () => {
  localStorage.removeItem(APP_USER_STORAGE);
  localStorage.removeItem(APP_ACCESS_TOKEN);
  localStorage.removeItem(APP_REFRESH_TOKEN);
  window.location.href = '/auth/login';
};