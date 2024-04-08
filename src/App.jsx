import { useState } from 'react'
import reactlogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = API_KEY_PLACEHOLDER

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
  {
    message: "Hello, I am Banking Bytes' Risk Assessment Tool, what can I help you with today? ", 
    sender: "ChatGPT",
    direction: "incoming"
  }
])

const handleSend = async (message) => {
  const newMessage = {
    message: message,
    sender: "user",
    direction: "outgoing", //determines that user messages appear on the right side
  }
  const newMessages = [... messages, newMessage];


  setMessages(newMessages);

  setTyping(true);

  await processMessageToChatGPT(newMessages);

}

async function processMessageToChatGPT(chatMessages) {

let apiMessages = chatMessages.map((messageObject) => {
  let role = ""; 
  if(messageObject.sender === "ChatGPT") {
    role="assistant"
    } else {
      role = "user"
      
    }
    return {role: role, content: messageObject.message }
});

const systemMessage = {
  role: "system", 
  content: "" //gpt language model role, put prompt here to to match what the tool needs to do within the " ""
}

const apiRequestBody = {
  "model": "gpt-3.5-turbo",
  "messages": [
    systemMessage, 
    ...apiMessages
  ]
}

await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST", 
  headers: {
    "Authorization": "Bearer " + API_KEY, 
    "Content-Type": "application/json"
  }, 
  body: JSON.stringify(apiRequestBody)
}).then((data) => {
  return data.json(); 
}).then ((data) => {
  console.log(data);
  console.log(data.choices[0].message.content);
  setMessages(
    [...chatMessages, {
      message: data.choices[0].message.content, 
      sender: "ChatGPT",
      direction: "incoming" //determines messages from gpt api come in on the left side
    }]
  );
  setTyping(false);
});
}

  return (
    <div className="App">
      <div style={{position: "relative", height: "1920px:", width: "1080px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            scrollBehavior='smooth'
              TypingIndicator={typing ? <typingIndicator content ="Analyzing your text..." /> :null}
              >
              {messages.map((message, index) => {
                return <Message key = {index} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder ='Type your question here.' onSend={handleSend}/>  
          </ChatContainer> 
        </MainContainer>
      </div>
    </div>
  )
}

export default App