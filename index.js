const express = require('express');
const axios = require('axios');

const Gemini = require('./classes/Gemini');
const ChatGPT = require('./classes/ChatGPT');
const Qwen = require('./classes/Qwen');
const Kimi = require('./classes/Kimi');
const Claude3 = require('./classes/Claude3');

// 授权的微信ID
const WXID_ARRAY = [];

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

// 使用 app.use() 代替 app.post()
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
            return res.json({
                choices: [{
                    message: {
                        role: 'assistant',
                        content: '我是狗，偷接口，偷了接口当小丑～',
                    },
                }],
            });
        }

        let response;
        if (requestModel === 'gpt-3.5-turbo' || requestModel === 'gpt-4') {
            const chatGPT = new ChatGPT(requestModel, requestAuthorization, requestBody.messages);
            response = await chatGPT.handleResponse(await getResponse(chatGPT.url, 'POST', chatGPT.headers, chatGPT.body));
        } else if (requestModel === 'gemini-pro' || requestModel === 'gemini') {
            const gemini = new Gemini(requestModel, requestAuthorization, requestBody.messages);
            response = await gemini.handleResponse(await getResponse(gemini.url, 'POST', gemini.headers, gemini.body));
        } else if (requestModel === 'qwen-turbo' || requestModel === 'qwen-max') {
            const qwen = new Qwen(requestModel, requestAuthorization, requestBody.messages);
            response = await qwen.handleResponse(await getResponse(qwen.url, 'POST', qwen.headers, qwen.body));
        } else if (requestModel === 'moonshot-v1-8k' || requestModel === 'moonshot-v1-32k') {
            const kimi = new Kimi(requestModel, requestAuthorization, requestBody.messages);
            response = await kimi.handleResponse(await getResponse(kimi.url, 'POST', kimi.headers, kimi.body));
        } else if (requestModel === 'claude-3-opus-20240229') {
            const claude3 = new Claude3(requestModel, requestAuthorization, requestBody.messages);
            response = await claude3.handleResponse(await getResponse(claude3.url, 'POST', claude3.headers, claude3.body));
        } else {
            return res.json({
                choices: [{
                    message: {
                        role: 'assistant',
                        content: '不支持的 chat_model 类型',
                    },
                }],
            });
        }

        return res.json({
            choices: [{
                message: {
                    role: 'assistant',
                    content: response,
                },
            }],
        });
    } catch (error) {
        console.error('Error:', error); // 记录错误信息
        return res.json({
            choices: [{
                message: {
                    role: 'assistant',
                    content: `出错了: ${error.toString()}`,
                },
            }],
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
