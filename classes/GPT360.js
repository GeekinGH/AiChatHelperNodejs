class GPT360 {
  constructor(requestModel, requestAuthorization, requestMessages) {
    this.model = requestModel;
    this.authorization = requestAuthorization;
    this.url = 'https://api.360.cn/v1/chat/completions';
    this.text2img = false;
    this.formatHeaders();
    try {
      // 获取最后一条消息
      const lastMessage = requestMessages.messages[requestMessages.messages.length - 1].content;
      // 判断是否需要文生图模式
      if (lastMessage.startsWith('画')) {
        this.url = 'https://api.360.cn/v1/images/text2img';
        this.model = '360CV_S0_V5';
        this.text2img = true;
        this.formatBody_txt2img(lastMessage);
      } else {
        this.formatBody(requestMessages);
      }
    } catch (error) {
      console.error('Error formatting body:', error);
      throw error;
    }
  }

  formatHeaders() {
    // 检查是否已经存在 headers，如果存在则不重新初始化
    if (!this.headers) {
      this.headers = {
        'Content-Type': 'application/json',
        'Authorization': this.authorization,
      };
    }
  }

  formatBody(requestMessages) {
    try {
      // 确保this.body是对象类型，否则进行初始化
      if (typeof this.body !== 'object' || this.body === null) {
        this.body = {};
      }

      // 将格式化后的 messages 转换为自己格式的 body
      this.body = {
        'model': this.model,
        'messages': requestMessages,
        'stream': false
      };
    } catch (error) {
      console.error('Error formatting messages:', error);
      throw error;
    }
  }

  formatBody_txt2img(lastMessage) {
    try {
      // 将提取的 lastMessage 转换为文生图格式的 body
      this.body = {
        "model": "360CV_S0_V5",
        "style": "realistic",
        "prompt": lastMessage,
        "negative_prompt": "",
        "guidance_scale": 7.5,
        "height": 512,
        "width": 512,
        "num_inference_steps": 25,
        "samples": 1,
        "seed": 49022,
        "enhance_prompt": false
      };
    } catch (error) {
      console.error('Error formatting messages:', error);
      throw error;
    }
  }

  handleResponse(responseData) {
    // 判断是否有错误信息
    if (responseData.error) {
      // 处理错误逻辑
      const errorMessage = responseData.error.message || '未知错误';
      return `${this.model}: ${errorMessage}`;
    }

    if (!this.text2img) {
      // 文本聊天模式
      if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message && responseData.choices[0].message.content) {
        return responseData.choices[0].message.content;
      } else {
        return `${this.model}: 无法解析响应数据`;
      }
    } else {
      // 文生图模式
      if (responseData.status === 'success' && responseData.output && responseData.output.length > 0) {
        return responseData.output[0];
      } else {
        return `${this.model}: 无法解析响应数据`;
      }
    }
  }
}

module.exports = GPT360;
