import { useEffect, useState } from 'react'
import { FaRegPaperPlane, FaCheck } from 'react-icons/fa6'
import './App.css'
import io from 'socket.io-client'
import { Chat } from './models/chat-model'

const socketUrl = import.meta.env.VITE_SOCKET_URL
const socket = io(socketUrl || '')

function App() {
	const [message, setMessage] = useState<string>('')
	const [chat, setChat] = useState<Chat>({ newMessage: '', oldMessage: '' })
	const [sent, setSent] = useState<boolean>(false);
	const sendMessage = () => {
		socket.emit('message', message)
		setSent(true)
		setTimeout(() => {
			setSent(false)
		}, 1500)
	}

	useEffect(() => {
		socket.on('received', (message) => {
			chat.oldMessage = chat.newMessage
			chat.newMessage = message
			setChat({ ...chat })
		})
	}, [socket])
	return (
		<>
			<div className={sent ? 'notification active' : 'notification inactive'}>
				<div className="notification-box">
					<FaCheck></FaCheck>
					<p>Message sent</p>
				</div>
			</div>
			<div className="chat-window">
				{chat.oldMessage && (<div className='message'>{chat.oldMessage}</div>)}
				{chat.newMessage && (<div className='message'>{chat.newMessage}</div>)}
				<div className="text-input">
					<input type="text" onChange={(e) => setMessage(e.target.value)} />
					<button onClick={sendMessage}><FaRegPaperPlane className="icon"></FaRegPaperPlane></button>
				</div>
			</div>
		</>
	)
}

export default App
