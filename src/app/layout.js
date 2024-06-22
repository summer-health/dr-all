import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dr. All',
  description: 'Dr. All Generative Doc and Care Plan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left column with mobile app ratio'd viewport */}
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl font-bold mb-4">Dr. All</h1>
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden"
                style={{ aspectRatio: '9/16' }}
              >
                <div className="h-full overflow-y-auto p-4">{children}</div>
              </div>
            </div>

            {/* Right column */}

            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Debug</h2>
              <div className="bg-white rounded-lg shadow-md p-4">
                <p>
                  This is the right column where you can add more information or
                  controls.
                </p>
                {/* Add more content here */}
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
