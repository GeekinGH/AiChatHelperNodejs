class Qwen {
  constructor(requestModel, requestAuthorization, requestMessages) {
      this.model = requestModel;
      this.authorization = requestAuthorization;
      this.url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
      this.formatHeaders();
      this.formatBody(requestMessages);
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

          let formattedMessages = [];
          requestMessages.forEach((item, index) => {
              if (index === 0 && item.role === 'system') {
                  let itemContent = item.content.trim();
                  if (itemContent === "") {
                      itemContent = '你是通义千问';
                  }
                  formattedMessages.push({
                      'role': 'system',
                      'content': itemContent,
                  });
              } else if (index === 1 && item.role === 'assistant') {
                  // 忽略掉第二条消息
              } else {
                  formattedMessages.push({
                      'role': item.role,
                      'content': item.content,
                  });
              }
          });

          this.messages = formattedMessages;

          // 将格式化后的 messages 转换为自己格式的 body
          this.body = {
              'model': this.model,
              'input': {
                  'messages': this.messages,
              },
              'parameters': {},
          };
      } catch (error) {
          console.error('Error formatting messages:', error);
          throw error;
      }
  }

  handleResponse(responseData) {
      // 判断是否有错误信息
      if (responseData.code) {
          // 处理错误逻辑
          const errorCode = responseData.code;
          const errorMessage = responseData.message || '未知错误';
          return `${this.model}: ${errorCode} - ${errorMessage}`;
      }
      if (responseData.errorType) {
          // 处理错误逻辑
          const errorType = responseData.errorType;
          const errorMessage2 = responseData.errorMessage || '未知错误';
          return `${this.model}: ${errorType} - ${errorMessage2}`;
      }

      // 检查是否存在 responseData.output.text
      if (responseData.output && responseData.output.text) {
          // 返回 Qwen API 的响应
          return responseData.output.text;
      } else {
          // 返回错误信息，指示无法获取有效的响应文本
          return `${this.model}: 无法获取有效的响应文本`;
      }
  }
}

module.exports = Qwen;