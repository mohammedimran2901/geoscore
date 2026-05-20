export const metadata = {
  title: 'GEOscore - AI Search Visibility Tracker',
  description: 'Track your brand visibility across ChatGPT, Perplexity, and Google AI Overviews',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}