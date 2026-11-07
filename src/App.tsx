import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import axios from 'axios'
import Button from '@/component/Button'
import './styles/test.css'
import styles from './styles/test.module.css'
import img from './assets/111.png'

function App() {
  console.log('img:', img)

  return (
    <>
      <div className='test-box'>
        Vite CSS Test
      </div>
      <div className={styles.title}>
        Css module
      </div>
      <img src={img} sizes='12' height={100} />
      <Button />
    </>
  )
}

export default App
