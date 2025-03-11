import React from 'react'
import Main from '../components/about/main'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarDealerLeadForm from '../components/CarLeadForm'
import TestimonialCarousel from '../components/TestimonialCarousel'
export default function About() {
  return (
    <>
    <Header/>
   <main>
    <section className='container m-auto'>
    <CarDealerLeadForm />
    <TestimonialCarousel />
    </section>
   </main>
    <Footer/>
    </>
  )
}
