const express = require('express');
const axios = require('axios');
//引用AI类
const Gemini = require('./classes/Gemini');
const ChatGPT = require('./classes/ChatGPT');
const Qwen = require('./classes/Qwen');
const Kimi = require('./classes/Kimi');
const Claude3 = require('./classes/Claude3');
const GPT360 = require('./classes/GPT360');

//需要对特定微信鉴权的，请在[]中填写对应微信ID
//类似：const WXID_ARRAY = ['wxid_abcdefg','lambous','yourxxx','abdcedf']
//[]内不添加微信ID则表示不进行鉴权
const WXID_ARRAY = [];

//360 API Key
const APIKEY360 = "";

// 全局范围定义 supportedModels（支持的模型），格式：'模型名称':对应的AI类
const supportedModels = {
    'gpt-3.5-turbo': ChatGPT,
    'gpt-4': ChatGPT,
    'gemini-pro': Gemini,
    'gemini': Gemini,
    'gemini-1.5-pro-latest': Gemini,
    'qwen-turbo': Qwen,
    'qwen-max': Qwen,
    'moonshot-v1-8k': Kimi,
    'moonshot-v1-32k': Kimi,
    'claude-3-opus-20240229': Claude3,
    '360gpt-pro': GPT360
};

const app = express();
const PORT = 3000; //端口可以按需修改

app.use(express.json());

// 获取AI官方响应
async function getResponse(url, method, headers, body) {
    try {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: body
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching response: ${error}`);
    }
}

//把回应给WeChat Assistant信息格式化为微信助手可以识别的Json
function respondJsonMessage(message) {
    return {
        choices: [{
            message: {
                role: 'assistant',
                content: message,
            },
        }],
    };
}

app.use('/', async (req, res) => {
    try {

        //if (req) {
        //    console.log(req.headers);
        //    console.log(req.body);
        //} else {
        //    console.log("req 未定义");
        //}
        //Only for WeChat Assistant
        const wxid = req.headers.wxid;
        if (!wxid) {
            throw new Error('未提供 wxid 头部信息');
        }
        //WeChat ID authorization
        if (WXID_ARRAY.length > 0 && !WXID_ARRAY.includes(wxid)) {
            return res.json(respondJsonMessage('我是狗，偷接口，偷了接口当小丑～'));
        }
        
        let requestAuthorization = req.headers.authorization;
        if (!requestAuthorization) {
            throw new Error('未提供 API Key');
        }
        
        const requestBody = req.body;
        let requestModel = requestBody.model.toLowerCase().trim();
        // 获取最后一条消息
        const requestMessages = requestBody.messages;
        const lastMessage = requestMessages[requestMessages.length - 1].content.trim();
        
         // 判断是否需要文生图模式
        if (APIKEY360 !== "" && lastMessage.startsWith("画")) {
        requestModel = "360gpt-pro";
        requestAuthorization = APIKEY360;
        }
        
        let response;
        const ModelClass = supportedModels[requestModel];
        
        if (ModelClass) {
            const modelInstance = new ModelClass(requestModel, requestAuthorization, requestMessages);
            response = await modelInstance.handleResponse(await getResponse(modelInstance.url, 'POST', modelInstance.headers, modelInstance.body));
            
            return res.json(respondJsonMessage(response));
        } else {
            return res.json(respondJsonMessage('不支持的 chat_model 类型'));
        }
    } catch (error) {
        console.error('Error:', error.toString()); // 记录错误信息
        return res.json(respondJsonMessage(`出错了: ${error.toString()}`));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
