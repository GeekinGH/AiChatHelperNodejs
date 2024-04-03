# 搭建AI反向代理
only for 微信助手<br>
欢迎来到微信助手 ChatGPT 反向代理项目！<br>
这个仓库帮助你部署 ChatGPT / Gemini-pro / 通义千问 / Kimi / Claude3 反向代理，使其能够与懒猫的微信助手插件的 ChatGPT 功能协同工作。

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
screen -S ach
node index.js
```
按下 Ctrl + A，然后按下 D 键来分离 screen 会话。这将使程序在后台运行。
当您想再次查看 screen 会话时，可以运行以下命令：
```bash
screen -r ach
```

4. 如果需要进行微信ID鉴权：
index.js文件中，找到 const WXID_ARRAY = [];<br>
在中括号中填入你需要授权的微信ID，支持多个微信ID，不同的ID用英文逗号隔开，最后一个ID后面不用加逗号。<br>
---如果你的微信ID是wxid_abcdefg,你就填写wxid_abcdefg,别删掉了'wxid_';<br>
---如果你的微信ID是lambous就填写lambous、开头别加‘wxid’！<br>
比如 const WXID_ARRAY = [wxid_abcdefg,lambous,yourxxx,abdcedf];<br>
$\color{red}{每次修改文件必须重新运行才能生效：}$ <br>
$\color{red}{进入对应screen会话，通过按下 Ctrl + C（在大多数情况下）来停止运行中的 Node.js 应用程序，}$<br>
$\color{red}{然后再次运行:}$
```bash
node index.js
```
## 使用方法
以下操作都是在“微信助手”ChatGPT中操作：
1. 将你的代理地址填写到“代理地址”栏。（http&#58;&#47;&#47;你的ip:3000）
2. 如果使用的是ChatGPT API，请在 “APIKey”中填写ChatGPT(Openai)的API Key，在“模型”中选择对应的<B>gpt-4</B>或者<B>gpt-3.5-turbo</B>。
3. 如果使用的是Gemini-pro API，请在 “APIKey”中填写Gemini-pro的API Key，在“模型”中选择 手动输入 ，填写：<B>Gemini-pro</B>或者<B>gemini-1.5-pro-latest</B>。
4. 如果使用的是通义千问 API，请在 “APIKey”中填写Qwen的API Key，在“模型”中选择 手动输入 ，填写：<B>qwen-turbo</B>或<B>qwen-max</B>。
5. 如果使用的是Moonshot Kimi API，请在 “APIKey”中填写Kimi的API Key，在“模型”中选择 手动输入 ，填写：<B>moonshot-v1-8k</B>或<B>moonshot-v1-32k</B>（微信文本应该不支持moonshot-v1-128k的长度，所以没写进去）。【Kimi的API申请https://login.moonshot.cn/】
6. 如果使用的是Claude3 API，请在 “APIKey”中填写Claude3的API Key，在“模型”中选择 手动输入 ，填写：<B>claude-3-opus-20240229</B>

## 其他事项
- 部分代码参考了懒猫提供的Gemini.zip，[懒猫插件交流](https://t.me/maogroup)
- 有关微信助手ChatGPT相关功能使用，请查看微信助手中的详细使用说明，或者在交流群里交流。


