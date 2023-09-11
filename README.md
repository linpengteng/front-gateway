# Front-Gateway

> 基于 Service Worker 拦截全站 Resource、API 等 NetWork 请求的前端类网关   
> 由于 Service Worker 安全策略，仅支持 localhost/127.0.0.1 和 https 协议的 Web 服务

<br/>
<br/>

# 流程示意图

<p align="center">
  <img 
    style="width: 98%; margin: 0 auto;" 
    src="https://linpengteng.github.io/resource/front-gateway/flow.jpg" 
    alt="Front-Gateway"
  >
</p>

> 示例中 Demo 位于本项目 web 目录中, 需通过 VSCode LiveServer 插件启动  
> 本项目 仅实现 service worker 功能，APISIX 服务端部分不在此配置实现


<br/>
<br/>

## 2. 使用方式

- a. 拷贝如下文件，添加到项目根目录中
  - `net-gateway-caller.js`
  - `net-gateway-config.js`
  - `net-gateway-window.js`
  - `net-gateway-worker.js`
  
  <br/>

- b. 在主应用 index.html 中引用 `caller` 和 `window`

  ```html
    <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="/index.css" />
          <link rel="icon" href="/logo.svg" />
          <title>Net Gateway 主应用</title>
        </head>

        <body>
          <div id="app"></div>
        </body>

        <!-- 配置如下 -->
        <script type="module" src="/net-gateway-caller.js"></script>
        <script type="module" src="/net-gateway-window.js"></script>
      </html>
  ```

  <br/>

- c. 根据需求，修改配置文件 `net-gateway-config.js`

  ```js
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
      /^http:\/\/localhost:5179\/favicon\.ico(\?[\s\S]+)?/i
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
    const NetDebug = false


    /**
     * 是否开启Ping
     */
    const NetPing = false
  ```

  <br/>

- d. 根据业务逻辑调用 API
  
  ```js
    // clearCerter
    NetCaller().clearCerter({})

    // resetCerter
    NetCaller().resetCerter({ 'jwt-key': 'jwt-secret' })

    // updateCerter
    NetCaller().updateCerter({ 'jwt-key': 'jwt-secret' })

    // removeCerter
    NetCaller().removeCerter({ 'jwt-key': 'jwt-secret' })

  ```

  <br/>

- > 如果是类似 Vue 项目，则使用方式中 `a` 和 `b` 两步可尝试替换如下

  ```bash
    # 下载
    pnpm add front-gateway
  ```

  ```js
    // in main.ts 
    import 'front-gateway/net-gateway-caller'
    import 'front-gateway/net-gateway-window'
  ```

<br/>

## 3. API 列表
- clearCerter 清空 Service Worker Secret Headers

- resetCerter 重置 Service Worker Secret Headers

- updateCerter 更新 Service Worker Secret Headers

- removeCerter 移除 Service Worker Secret Headers

- broadcastMessage 广播信息给其他客户端(游览器标签页)

- registerListener 注册 Service Worker 消息监听事件

- removeListener 移除 Service Worker 消息监听事件

- clearListener 清空 Service Worker 消息监听事件

<br/>

> broadcastMessage / registerListener / removeListener / clearListener 需配置  
> 
> 需重写 `net-gateway-window.js`  
>   NetCaller("/net-gateway-worker.js", { broadcastMessage: true })  
>   NetCaller("/net-gateway-worker.js", { registerListener: true })  
>   NetCaller("/net-gateway-worker.js", { removeListener: true })  
>   NetCaller("/net-gateway-worker.js", { clearListener: true })  


<br/>
<br/>


# 许可证
> MIT

