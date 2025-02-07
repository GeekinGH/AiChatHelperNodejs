# 搭建各类 AI 的微信助手反向代理
only for 微信助手<br>
欢迎来到微信助手 ChatGPT 反向代理项目！<br>

# 有三个相同功能的不同部署环境的项目：
1、部署到Netlify的。目前Netlify注册有难度，已经有Netlify账户的可以尝试它.请移步到[AiChatHelper](https://github.com/GeekinGH/AiChatHelper)；<br>
2、部署到自己的服务器或者任何可以搭建NodeJs环境的服务器的，就是本仓库.<br>
3、部署到CloudFlare的，目前有新的办法可以解决Gemini区域限制和域名问题，目前来看是最省钱最简单的实现方法，请移步到[AiChatHelperCFW](https://github.com/GeekinGH/AiChatHelperCFW)；<br>


## 部署
1. 部署到安装了nodejs环境的服务器即可
2. 使用 PPA 安装 NodeJS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update -y
sudo apt install nodejs -y
node -v
npm -v
```

3. clone并运行
```bash
sudo apt install git -y
git clone https://github.com/GeekinGH/AiChatHelperNodejs.git
cd AiChatHelperNodejs
npm install
sudo apt install screen -y
screen -S aihelper
node index.js(或者 npm start)
```
按下 Ctrl + A，然后按下 D 键来分离 screen 会话。这将使程序在后台运行。
当您想再次查看 screen 会话时，可以运行以下命令：
```bash
screen -r aihelper
```

4. 如果需要进行微信ID鉴权：
index.js文件中，找到 const WXID_ARRAY = [];<br>
在中括号中填入你需要授权的微信ID，支持多个微信ID，用英文引号包括，不同的ID用英文逗号隔开，最后一个ID后面不用加逗号。<br>
---如果你的微信ID是wxid_abcdefg,你就填写wxid_abcdefg,别删掉了'wxid_';<br>
---如果你的微信ID是lambous就填写lambous、开头别加‘wxid’！<br>
比如 const WXID_ARRAY = ['wxid_abcdefg','lambous','yourxxx','abdcedf'];<br>
$\color{red}{每次修改文件必须重新运行才能生效：}$ <br>
$\color{red}{进入对应会话screen -r aihelper，通过按下 Ctrl + C（在大多数情况下）来停止运行中的 Node.js 应用程序，}$<br>
$\color{red}{然后再次运行:}$
```bash
node index.js
```
## 使用方法
以下操作都是在“微信助手”ChatGPT中操作：
1. 将你的代理地址填写到“代理地址”栏。（http&#58;&#47;&#47;你的ip:3000）
2. “APIKey”中填写对应的API Key，在“模型”中按下表选择或填写。

| AI       | APIKey      | 模型            |
|-----------|-------------|-----------------|
| ChatGPT 3.5  | ChatGPT 3.5 API Key | 选择：gpt-3.5-turbo |
| ChatGPT plus  | ChatGPT 4 API Key | 选择：gpt-4 |
| GPT-4o  | GPT-4o API Key | 手动输入，填写：GPT-4o |
| Gemini-pro 1.0 | Gemini 1.0 API Key | 手动输入，填写：Gemini-pro |
| Gemini-pro 1.5 | Gemini 1.5 API Key | 手动输入，填写：gemini-1.5-pro-latest |
| Gemini | Gemini 1.5 API Key | 手动输入，填写：gemini-1.5-flash |
| Gemini | Gemini 2.0 API Key | 手动输入，填写：gemini-2.0-flash-exp |
| 通义千问   | Qwen API Key | 手动输入，填写：qwen-turbo(弃用) 或 qwen-max |
| Moonshot Kimi | Kimi API Key  | 手动输入，填写：moonshot-v1-8k 或 moonshot-v1-32k |
| Claude3   | Claude3 API Key | 手动输入，填写：claude-3-opus-20240229 | 
| 360智脑   | 360 API Key | 手动输入，填写：360gpt-pro |
| DeepSeek   | DeepSeek-V3 | 手动输入，填写：deepseek-chat |
| DeepSeek   | DeepSeek-R1 | 手动输入，填写：deepseek-reasoner |
3. 360AI支持文生图功能，在聊天中，话术为：画xxxxxxxx，AI则会返回一个图片链接。比如：画一个蓝天白云的图片
4. DeepSeek-R1 因为WeChat的字数限制，删除了推理过程，直接输出结果。DeepSeek 可以不用反代，直接输入 API 地址 https://api.deepseek.com

## 其他事项
- 部分代码参考了懒猫提供的Gemini.zip，[懒猫插件交流](https://t.me/maogroup)
- 有关微信助手ChatGPT相关功能使用，请查看微信助手中的详细使用说明，或者在交流群里交流。


