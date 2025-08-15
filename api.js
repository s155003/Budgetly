import axios from 'axios'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
export const api = axios.create({ baseURL: API_BASE, timeout: 20000 })
export async function postRetirementPlan(payload){ const {data}=await api.post('/retirement-plan',payload); return data }
export async function postAskAdvisor(prompt){ const {data}=await api.post('/ask-advisor',{prompt}); return data }
export async function getRecommendedArticles(age){ const {data}=await api.get('/recommended-articles',{ params:{ age } }); return data }
