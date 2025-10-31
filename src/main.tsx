import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@radix-ui/themes/styles.css';
import { ScrollArea, Theme } from '@radix-ui/themes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme panelBackground="translucent" appearance="light" accentColor="violet" radius="small" className='h-full font-roboto' >
      <ScrollArea type="scroll" scrollbars="vertical" size="2" radius='none' className='w-full max-sm:hidden' >
        <App />
      </ScrollArea>
    </Theme>
  </React.StrictMode>,
)
