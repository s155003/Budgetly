import { useState } from 'react'
import { postAskAdvisor } from '../lib/api'

export default function AdvisorChat(){
  const [history,setHistory]=useState([])
  const [input,setInput]=useState('')
  const [sending,setSending]=useState(false)

  async function send(){
    const text=input.trim(); if(!text) return
    setSending(true); setInput(''); setHistory(h=>[...h,{role:'user',content:text}])
    try{ const res=await postAskAdvisor(text); setHistory(h=>[...h,{role:'assistant',content:res.response}]) }
    catch{ setHistory(h=>[...h,{role:'assistant',content:'(Advisor temporarily unavailable.)'}]) }
    finally{ setSending(false) }
  }

  return (
    <div className="card">
      <h2>🤖 Chat with Retirement Advisor</h2>
      <div className="chat">
        {history.map((m,i)=>(
          <div key={i} className={m.role==='user'?'msg-user':'msg-ai'}>
            <div className="badge">{m.role==='user'?'You':'Advisor'}</div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,marginTop:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
               placeholder="Ask about 401(k)s, Roth vs Traditional, asset allocation..."
               onKeyDown={e=>{ if(e.key==='Enter') send() }} />
        <button onClick={send} disabled={sending}>{sending?'Sending…':'Send'}</button>
      </div>
      <div className="footer" style={{marginTop:6}}>
        (Uses /ask-advisor API; if no OpenAI key on backend, you’ll see a helpful fallback answer.)
      </div>
    </div>
  )
}
