
const API_BASE = "http://127.0.0.1:8000/api/tasks/";

document.addEventListener("DOMContentLoaded", () => {
    injectChatWidget();
    initChatLogic();
});

function injectChatWidget() {
    const widget = document.createElement('div');
    widget.className = 'ai-chat-widget';
    widget.innerHTML = `
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <h3>Nova Assistant ✨</h3>
                <button class="ai-chat-btn" id="closeChat">✖</button>
            </div>
            <div class="ai-chat-messages" id="aiChatMessages">
                <div class="message ai">Hi! I'm Nova. How can I help you today? Try saying "Add task Buy Milk" or "Show my tasks".</div>
            </div>
            <div class="ai-chat-input-area">
                <button class="ai-chat-btn voice-btn" id="voiceBtn" title="Voice Command">🎤</button>
                <input type="text" class="ai-chat-input" id="chatInput" placeholder="Ask Nova anything...">
                <button class="ai-chat-btn" id="sendBtn">➤</button>
            </div>
        </div>
        <div class="ai-chat-bubble" id="aiChatBubble">✨</div>
    `;
    document.body.appendChild(widget);
}

function initChatLogic() {
    const bubble = document.getElementById('aiChatBubble');
    const window = document.getElementById('aiChatWindow');
    const close = document.getElementById('closeChat');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('sendBtn');
    const voice = document.getElementById('voiceBtn');
    const messages = document.getElementById('aiChatMessages');

    bubble.onclick = () => window.classList.toggle('active');
    close.onclick = () => window.classList.remove('active');

    const handleSend = () => {
        const text = input.value.trim();
        if (text) {
            addMessage(text, 'user');
            processCommand(text);
            input.value = '';
        }
    };

    send.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

    // Voice Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        voice.onclick = () => {
            voice.classList.add('active');
            recognition.start();
        };

        recognition.onresult = (event) => {
            voice.classList.remove('active');
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            handleSend();
        };

        recognition.onerror = () => voice.classList.remove('active');
        recognition.onend = () => voice.classList.remove('active');
    } else {
        voice.style.display = 'none';
    }
}

function addMessage(text, type) {
    const messages = document.getElementById('aiChatMessages');
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

async function processCommand(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("add task")) {
        const taskTitle = text.replace(/add task/i, "").trim();
        if (taskTitle) {
            addMessage(`Adding task: "${taskTitle}"...`, 'ai');
            await createTask(taskTitle);
        } else {
            addMessage("Please specify a task name. For example: 'Add task Meeting at 5'", 'ai');
        }
    }
    else if (lowerText.includes("show") && lowerText.includes("task")) {
        addMessage("Taking you to your task list...", 'ai');
        setTimeout(() => window.location.href = "tasks.html", 1000);
    }
    else if (lowerText.includes("analytic") || lowerText.includes("progress")) {
        addMessage("Opening your analytics dashboard...", 'ai');
        setTimeout(() => window.location.href = "analytics.html", 1000);
    }
    else if (lowerText.includes("help") || lowerText.includes("what can you do")) {
        addMessage("I can help you add tasks, navigate the app, and track your progress. Try voice commands too!", 'ai');
    }
    else {
        addMessage("I'm not sure how to do that yet, but I'm learning! Try saying 'Add task ...'", 'ai');
    }
}

async function createTask(title) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                date: new Date().toISOString().split('T')[0],
                priority: "Medium",
                status: "Pending"
            })
        });

        if (response.ok) {
            addMessage(`✅ Task "${title}" added successfully!`, 'ai');
            if (window.location.pathname.includes("tasks.html") || window.location.pathname.includes("dashboard.html")) {
                // Refresh if on relevant pages (assuming loadTasks is global or we can trigger it)
                window.location.reload();
            }
        } else {
            addMessage("❌ Failed to add task. Please try again.", 'ai');
        }
    } catch (error) {
        addMessage("❌ Error connecting to backend.", 'ai');
    }
}
