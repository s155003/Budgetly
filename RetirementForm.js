import { useEffect, useState } from 'react'
import { postRetirementPlan, getRecommendedArticles } from '../lib/api'

export default function RetirementForm(){
  const [age,setAge]=useState(30)
  const [income,setIncome]=useState(60000)
  const [savings,setSavings]=useState(15000)
  const [risk,setRisk]=useState('medium')
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState(null)
  const [articles,setArticles]=useState([])

  useEffect(()=>{ (async()=>{
      try{ const res=await getRecommendedArticles(Number(age)); setArticles(res.items||[]) }
      catch{ setArticles([]) }
  })() },[age])

  async function calc(){
    setLoading(true); setResult(null)
    try{
      const data=await postRetirementPlan({ age:Number(age), income:Number(income), savings:Number(savings), risk_level:risk })
      setResult(data.projected_savings)
    }catch{ setResult(null) }finally{ setLoading(false) }
  }

  return (
    <div className="card">
      <h2>🧠 Retirement Calculator</h2>
      <div className="row">
        <div><label>Age</label><input type="number" value={age} onChange={e=>setAge(e.target.value)}/></div>
        <div><label>Income (annual)</label><input type="number" value={income} onChange={e=>setIncome(e.target.value)}/></div>
        <div><label>Current Savings</label><input type="number" value={savings} onChange={e=>setSavings(e.target.value)}/></div>
        <div><label>Risk Tolerance</label>
          <select value={risk} onChange={e=>setRisk(e.target.value)}>
            <option value="low">Low (4%)</option>
            <option value="medium">Medium (6%)</option>
            <option value="high">High (8%)</option>
          </select>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={calc} disabled={loading}>{loading?'Calculating…':'Calculate Retirement Projection'}</button>
      </div>
      {result!==null && <p style={{marginTop:12}}>Projected savings at 65: <span className="badge">${result.toLocaleString()}</span></p>}
      <h3 style={{marginTop:16}}>📚 Recommended Articles</h3>
      <div className="list">
        {articles.map((a,i)=>(<a key={i} href={a.url} target="_blank" rel="noreferrer" className="badge">{a.title}</a>))}
        {articles.length===0 && <div className="badge">No recommendations yet.</div>}
      </div>
    </div>
  )
}
