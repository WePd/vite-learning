import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Button from '@/component/Button'
import './styles/test.css'
import styles from './styles/test.module.css'
import img from './assets/111.png'
// import config from 'virtual:my-config'

function App() {
  console.log('img:', img)
  // console.log('虚拟模块配置：', config)


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

      {/* <div>
        <h1>{config.name}</h1>
        <p>Version: {config.version}</p>
        <p>Author: {config.author}</p>
      </div> */}
    </>
  )
}

export default App
