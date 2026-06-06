// js/aiassistant.js
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');

let isRecording = false;

function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.classList.add('msg', isUser ? 'msg-user' : 'msg-ai');
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text, true);
        chatInput.value = '';
        // Simulate AI thinking and replying
        setTimeout(() => {
            addMessage("I'm processing that information. As an AI, I'll generate a comprehensive response shortly.", false);
        }, 1000);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

voiceBtn.addEventListener('click', () => {
    isRecording = !isRecording;
    if (isRecording) {
        voiceBtn.classList.add('recording');
        chatInput.placeholder = "Listening... Click mic to stop.";
    } else {
        voiceBtn.classList.remove('recording');
        chatInput.placeholder = "Type your message or use voice...";
        chatInput.value = "Audio captured. Please process this request.";
    }
});
