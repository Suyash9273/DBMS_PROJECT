import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header/>
      <main className='flex-grow py-6'>
        <div className='container mx-auto'>
          <h1 className='text-3xl font-bold'>
            Welcome to the railway reservation system
          </h1>
        </div>
      </main>
    </div>
  )
}

export default App;

