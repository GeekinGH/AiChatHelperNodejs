const express = require('express');
const axios = require('axios');

const Gemini = require('./classes/Gemini');
const ChatGPT = require('./classes/ChatGPT');
const Qwen = require('./classes/Qwen');
const Kimi = require('./classes/Kimi');
const Claude3 = require('./classes/Claude3');

// 需要对特定微信鉴权的，请在[]中填写对应微信ID
//类似：['wxid_abcdefg','lambous','yourxxx','abdcedf']
//不添加微信ID则表示不进行鉴权
const WXID_ARRAY = [];

// 全局范围定义 supportedModels（支持的模型） 对象：'模型名称':对应的AI类
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
    'claude-3-opus-20240229': Claude3
};

const app = express();
const PORT = 3000;

app.use(express.json());

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
        const wxid = req.headers.wxid;
        if (!wxid) {
            throw new Error('未提供 wxid 头部信息');
        }
        const requestAuthorization = req.headers.authorization;
        const requestBody = req.body;
        const requestModel = requestBody.model.toLowerCase().trim();

        if (WXID_ARRAY.length > 0 && !WXID_ARRAY.includes(wxid)) {
            return res.json(respondJsonMessage('我是狗，偷接口，偷了接口当小丑～'));
        }

        let response;
        const ModelClass = supportedModels[requestModel];
        if (ModelClass) {
            const modelInstance = new ModelClass(requestModel, requestAuthorization, requestBody.messages);
            response = await modelInstance.handleResponse(await getResponse(modelInstance.url, 'POST', modelInstance.headers, modelInstance.body));
        } else {
            return res.json(respondJsonMessage('不支持的 chat_model 类型'));
        }
        return res.json(respondJsonMessage(response));
    } catch (error) {
        console.error('Error:', error.toString()); // 记录错误信息
        return res.json(respondJsonMessage(`出错了: ${error.toString()}`));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
