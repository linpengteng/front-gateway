/* eslint-disable no-undef */


/**
 * 初始请求头
 */
NetCaller().resetCerter({ 'jwt-key': 'jwt-secret' })


/**
 * 重置请求头
 */
document.querySelector('.container > .headers > .options').addEventListener('input', event => {
  const headers = {}

  for (const element of document.querySelectorAll('.container > .headers > .options > .item')) {
    const key = element.querySelector('.key-input').value
    const value = element.querySelector('.value-input').value
    key.trim() && value.trim() && (headers[key.trim()] = value.trim())
  }

  NetCaller().resetCerter(headers)
})


/**
 * 访问子应用
 */
document.querySelector('.container > .visits > .options').addEventListener('click', event => {
  const target = event.target.closest('.visit-app')
  const router = target.getAttribute('visit-page')
  window.open(router)
})
