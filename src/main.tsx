import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme panelBackground="translucent" appearance="light" accentColor="violet" radius="small" className='h-full font-roboto' >
      <App />
    </Theme>
  </React.StrictMode>,
)
