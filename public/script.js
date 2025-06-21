function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value;
  if (!message) return;

  showMessage('You: ' + message);
  input.value = '';

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  .then(res => res.json())
  .then(data => {
    showMessage('AI: ' + (data.reply || 'No response'));
  })
  .catch(err => {
    console.error('Error:', err);
    showMessage('AI: Error getting response');
  });
}

function showMessage(text) {
  const log = document.getElementById('chat-log');
  log.innerHTML += `<p>${text}</p>`;
}
