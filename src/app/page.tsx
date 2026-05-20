import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">GEOscore</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">
          Does AI recommend your business — or your competitor's?
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          GEOscore tracks your brand's visibility across ChatGPT, Perplexity, and Google AI Overviews. 
          Get your score in minutes.
        </p>
        <Link href="/signup" className="inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700">
          Get Your Free AI Visibility Score
        </Link>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How it works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h4 className="font-semibold mb-2">Connect your domain</h4>
              <p className="text-slate-600">Add your domain and describe your business (30 seconds)</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h4 className="font-semibold mb-2">We probe AI daily</h4>
              <p className="text-slate-600">We ask 200+ questions your customers are asking AI assistants</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h4 className="font-semibold mb-2">Get weekly scores</h4>
              <p className="text-slate-600">Receive specific content fixes to improve your visibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Pricing</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border">
              <h4 className="text-xl font-bold">Starter</h4>
              <p className="text-3xl font-bold mt-2">$99<span className="text-lg font-normal text-slate-500">/mo</span></p>
              <ul className="mt-6 space-y-2 text-slate-600">
                <li>1 domain</li>
                <li>50 queries/day</li>
                <li>ChatGPT + Perplexity</li>
                <li>Weekly reports</li>
              </ul>
              <Link href="/signup" className="block mt-6 text-center py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                Get started
              </Link>
            </div>
            <div className="bg-blue-600 p-8 rounded-xl text-white">
              <h4 className="text-xl font-bold">Growth</h4>
              <p className="text-3xl font-bold mt-2">$249<span className="text-lg font-normal text-blue-200">/mo</span></p>
              <ul className="mt-6 space-y-2 text-blue-100">
                <li>3 domains</li>
                <li>200 queries/day</li>
                <li>All 4 AI engines</li>
                <li>Real-time alerts</li>
                <li>Competitor tracking</li>
              </ul>
              <Link href="/signup" className="block mt-6 text-center py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50">
                Get started
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl border">
              <h4 className="text-xl font-bold">Agency</h4>
              <p className="text-3xl font-bold mt-2">$599<span className="text-lg font-normal text-slate-500">/mo</span></p>
              <ul className="mt-6 space-y-2 text-slate-600">
                <li>15 domains</li>
                <li>1,000 queries/day</li>
                <li>White-label reports</li>
                <li>API access</li>
              </ul>
              <Link href="/signup" className="block mt-6 text-center py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}