import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import GlobalStyles from "./styles/global-styles";
import StyledComponentsRegistry from "./lib/registry";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spritey Web',
  description: 'A too for creating sprite sheets.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark bg-gray-900" lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body>
         <StyledComponentsRegistry>
          {/* <GlobalStyles /> */}
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
