import React from 'react'
import Hero from '../../components/Hero'
import About from '../../components/About'
import ProductSection from '../../components/Product'
import ContactSection from '../../components/Contact'

const Home = () => {
  return (
    <div>
        <Hero />
        <About />
        <ProductSection/>
        <ContactSection/>
    </div>
  )
}

export default Home