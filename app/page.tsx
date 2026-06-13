import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Stats } from '@/components/stats'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Showcase } from '@/components/showcase'
import { Testimonials } from '@/components/testimonials'
import { Pricing } from '@/components/pricing'
import { FinalCta } from '@/components/final-cta'
import { Footer } from '@/components/footer'
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Showcase />
        <Testimonials />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
