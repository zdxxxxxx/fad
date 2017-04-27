//parser es7
import polyfill from 'babel-polyfill'

//第三方模块
import dva from 'dva';
//ant样式
import antdStyle from 'antd/dist/antd.min.css'
//路由
import router from './router.jsx'
//models
import models from './models/index.js'
const app = dva();

const initialModels = (m) => {
    Object.keys(m).map((i) => {
        app.model(m[i]);
    })
}

initialModels(models);
app.router(router);
app.start('#rootApp');

