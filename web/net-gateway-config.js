// @ts-nocheck
/* eslint-disable */

/**
 * 配置需要拦截的请求
 */
const NetProxys = [
  /^http:\/\/localhost:5179(\/[\s\S]*)?$/i
]


/**
 * 配置无需拦截的请求 - (过滤 NetProxys 选项)
 */
const NetWhites = [
  /^http:\/\/localhost:5179\/net-gateway-config\.js(\?[\s\S]+)?/i,
  /^http:\/\/localhost:5179\/net-gateway-caller\.js(\?[\s\S]+)?/i,
  /^http:\/\/localhost:5179\/net-gateway-worker\.js(\?[\s\S]+)?/i,
  /^http:\/\/localhost:5179\/net-gateway-window\.js(\?[\s\S]+)?/i,
  /^http:\/\/localhost:5179\/favicon\.ico(\?[\s\S]+)?/i,
  /^http:\/\/localhost:5179\/logo\.svg(\?[\s\S]+)?/i,
]


/**
 * 配置需要注入的脚本 - (仅在HTML页面导航访问,且NetPing开启时有效)
 */
const NetScripts = [
  '<script type="text/javascript" src="/net-gateway-caller.js"><\/script>',
  '<script type="text/javascript" src="/net-gateway-window.js"><\/script>'
]


/**
 * 配置子应用的请求
 * 
 *   eg. 子应用 http://localhost:5179/_app_/child1/index.html 请求，则相当于 child1 应用的 base 为 /_app_/child1
 *       那么在 child1 应用发起 http://localhost:5179/ant.png 请求, 会转换成 http://localhost:5179/_app_/child1/ant.png 请求
 *       
 *   eg. 子应用 http://localhost:5179/_app_/child2/index.html 请求，则相当于 child2 应用的 base 为 /_app_/child2
 *       那么在 child2 应用发起 http://localhost:5179/home.png 请求, 会转换成 http://localhost:5179/_app_/child2/home.png 请求
 * 
 */
const NetSubRoute = /^http:\/\/localhost:5179(\/_app_\/[^\/]+\/)[\s\S]*/i
const NetSubRewirte = /^(http:\/\/localhost:5179)\//i


/**
 * 重定向处理 follow | error | manual | default
 */
const NetRedirect = 'default'


/**
 * 是否开启网关
 */
const NetGateway = true


/**
 * 是否开启日志
 */
const NetDebug = true


/**
 * 是否开启Ping
 */
const NetPing = true
