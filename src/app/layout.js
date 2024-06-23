import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Inter } from 'next/font/google'
import './globals.css'
import { DebugProvider } from '@/components/context/debug-context'
import DebugLog from '@/components/debug/debug-log'
import { DoctorProvider } from '@/components/context/doctor-context'
import { CarePlanProvider } from '@/components/context/care-plan-context'
import { FamilyProvider } from '@/components/context/family-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dr. All',
  description: 'Dr. All Generative Doc and Care Plan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <DebugProvider>
            <DoctorProvider>
              <FamilyProvider>
                <CarePlanProvider>
                  <main className="container mx-auto p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Left column with mobile app ratio'd viewport */}
                      <div className="w-full md:w-1/2">
                        <div
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                          style={{
                            minHeight: '600px',
                            height: '100vh',
                            maxHeight: '100vh',
                            aspectRatio: '9/16',
                            backgroundImage: 'url(/background3.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div
                            className="h-full overflow-y-auto p-4"
                            style={{
                              position: 'relative',
                            }}
                          >
                            {children}
                          </div>
                        </div>
                      </div>

                      {/* Right column */}

                      <div className="w-full md:w-1/2">
                        <h2
                          className="text-xl font-semibold mb-4"
                          style={{ color: '#FFF' }}
                        >
                          Debug
                        </h2>
                        <div className="bg-white rounded-lg shadow-md p-4">
                          <DebugLog />
                        </div>
                      </div>
                    </div>
                  </main>
                </CarePlanProvider>
              </FamilyProvider>
            </DoctorProvider>
          </DebugProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
