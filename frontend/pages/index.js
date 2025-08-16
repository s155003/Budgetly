import Head from 'next/head'
import RetirementForm from '../components/RetirementForm'
import AdvisorChat from '../components/AdvisorChat'

export default function Home(){
  return (
    <div className="container">
      <Head>
        <title>Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="card">
        <h1>Budgetly <span className="badge">Plan Smarter</span></h1>
        <div className="footer">AI-powered planning • Simple tools • Actionable advice</div>
      </div>
      <RetirementForm />
      <AdvisorChat />
    </div>
  )
}
