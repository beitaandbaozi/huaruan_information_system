const webpack = require('webpack')

module.exports = {
    devServer: {
        proxy: {
            '/users': {
                target: 'http://127.0.0.1:3000/',
                ws: true,        //要代理 websockets，配置这个参数
                secure: false,  // https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
            },
            '/students': {
                target: 'http://127.0.0.1:3000/',
                ws: true,        //要代理 websockets，配置这个参数
                secure: false,  // https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
            },
            '/class': {
                target: 'http://127.0.0.1:3000/',
                ws: true,        //要代理 websockets，配置这个参数
                secure: false,  // https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
            },
            '/teachers': {
                target: 'http://127.0.0.1:3000/',
                ws: true,        //要代理 websockets，配置这个参数
                secure: false,  // https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
            },
            '/messages': {
                target: 'http://127.0.0.1:3000/',
                ws: true,        //要代理 websockets，配置这个参数
                secure: false,  // https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
            },


        }
    },
}