// Configuration - Update this with your proxy URL
const PROXY_URL = 'https://your-proxy-service.vercel.app/api/chat';

class SharedChat {
  constructor() {
    this.messages = [];
    this.userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    this.initChat();
    this.addWelcomeMessage();
  }

  initChat() {
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'flex flex-col h-[500px]';
    
    // Header with user ID
    this.header = document.createElement('div');
    this.header.className = 'bg-blue-500 text-white p-4 flex justify-between items-center';
    this.header.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="bot" class="w-5 h-5"></i>
        <span class="font-bold">Shared ChatGPT</span>
      </div>
      <span class="text-sm">User: ${this.userId.slice(0, 8)}</span>
    `;
    this.chatContainer.appendChild(this.header);
    
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'flex-1 overflow-y-auto p-4 space-y-4';
    this.chatContainer.appendChild(this.messagesContainer);
    
    this.inputContainer = document.createElement('div');
    this.inputContainer.className = 'border-t p-4 bg-gray-50';
    
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Type your message...';
    this.input.className = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    
    this.button = document.createElement('button');
    this.button.className = 'ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500';
    this.button.innerHTML = '<i data-lucide="send"></i>';
    
    const inputGroup = document.createElement('div');
    inputGroup.className = 'flex';
    inputGroup.appendChild(this.input);
    inputGroup.appendChild(this.button);
    
    this.inputContainer.appendChild(inputGroup);
    this.chatContainer.appendChild(this.inputContainer);
    
    document.getElementById('chat-app').appendChild(this.chatContainer);
    
    // Event listeners
    this.button.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  addWelcomeMessage() {
    this.addMessage({
      id: '1',
      content: 'Welcome to our shared ChatGPT platform! Ask me anything about programming or technology.',
      role: 'assistant'
    });
  }

  async sendMessage() {
    const content = this.input.value.trim();
    if (!content) return;
    
    // Add user message
    this.addMessage({
      id: Date.now().toString(),
      content,
      role: 'user'
    });
    
    this.input.value = '';
    this.showLoading();
    
    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId: this.userId,
          conversationId: 'shared-conversation'
        })
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      this.addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant'
      });
    } catch (error) {
      console.error('Error:', error);
      this.addMessage({
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        role: 'assistant'
      });
    } finally {
      this.hideLoading();
    }
  }

  addMessage(message) {
    this.messages.push(message);
    this.renderMessages();
    this.scrollToBottom();
  }

  renderMessages() {
    this.messagesContainer.innerHTML = '';
    
    this.messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = `max-w-[80%] rounded-lg px-4 py-2 flex items-start gap-2 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`;
      
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', msg.role === 'user' ? 'user' : 'bot');
      
      contentDiv.appendChild(icon);
      contentDiv.appendChild(document.createTextNode(msg.content));
      messageDiv.appendChild(contentDiv);
      this.messagesContainer.appendChild(messageDiv);
    });
    
    lucide.createIcons();
  }

  showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'flex justify-start';
    loadingDiv.id = 'loading-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-[80%] flex items-center gap-2';
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', 'bot');
    
    const dots = document.createElement('div');
    dots.className = 'flex space-x-2';
    dots.innerHTML = `
      <div class="bounce-dot w-2 h-2 rounded-full bg-gray-400"></div>
      <div class="bounce-dot w-2 h-2 rounded-full bg-gray-400" style="animation-delay:0.2s"></div>
      <div class="bounce-dot w-2 h-2 rounded-full bg-gray-400" style="animation-delay:0.4s"></div>
    `;
    
    contentDiv.appendChild(icon);
    contentDiv.appendChild(dots);
    loadingDiv.appendChild(contentDiv);
    this.messagesContainer.appendChild(loadingDiv);
    this.scrollToBottom();
    
    lucide.createIcons();
  }

  hideLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) loading.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new SharedChat();
});
3. styles.css
/* Base styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Loading animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.bounce-dot {
  animation: bounce 0.6s infinite alternate;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  #chat-app {
    height: 80vh;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
