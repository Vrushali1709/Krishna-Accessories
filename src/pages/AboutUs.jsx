// src/pages/AboutUs.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon } from '../components/Icons';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-[#ded9cf] bg-[#fbfaf7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a07d43]">
              <span className="h-px w-10 bg-[#b89758]" />
              Heritage & Mission
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#17202b] sm:text-6xl lg:text-7xl">
              Objects made to be <span className="font-serif font-normal italic text-[#9a7b4f]">kept.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-[#62615e] sm:text-base">
              Krishna Accessories brings together authentic timepieces, leather goods, and everyday essentials chosen for their craft, character, and staying power.
            </p>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-3 border-y border-[#ded9cf] py-5 text-center sm:mt-16 sm:text-left">
            <div className="border-r border-[#ded9cf] px-2 sm:px-6"><strong className="block text-xl font-semibold text-[#17202b] sm:text-2xl">100%</strong><span className="text-[9px] uppercase tracking-[0.16em] text-[#817d75]">Authentic</span></div>
            <div className="border-r border-[#ded9cf] px-2 sm:px-6"><strong className="block text-xl font-semibold text-[#17202b] sm:text-2xl">2014</strong><span className="text-[9px] uppercase tracking-[0.16em] text-[#817d75]">Established</span></div>
            <div className="px-2 sm:px-6"><strong className="block text-xl font-semibold text-[#17202b] sm:text-2xl">Gujarat</strong><span className="text-[9px] uppercase tracking-[0.16em] text-[#817d75]">Our home</span></div>
          </div>
        </div>
      </section>

      {/* Brand Pillars & Values */}
      <main className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:space-y-24 sm:px-8 sm:py-20 lg:px-10">

        {/* Story Grid */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="order-2 space-y-5 lg:order-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a07d43]">01 / Our Foundation</span>
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#17202b] sm:text-4xl">A legacy of uncompromising standards.</h2>
            <p className="max-w-lg text-sm leading-7 text-[#62615e]">
              At Krishna Accessories, every timepiece and lifestyle good in our catalog is sourced directly from brand-authorized manufacturers and certified distributors. We reject replicas, parallel imports, and compromised craftsmanship.
            </p>
            <p className="max-w-lg text-sm leading-7 text-[#62615e]">
              Whether you are acquiring an automatic mechanical caliber from Titan, a solar chronograph from Casio, or tailored leather goods from Hidesign, each parcel arrives with stamped warranty paperwork and official authentication seals.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 border-b border-[#17202b] pb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#17202b] transition hover:border-[#b89758] hover:text-[#a07d43]"
              >
                <span>Browse the collection</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="order-1 aspect-4/3 overflow-hidden border border-[#ded9cf] bg-[#f1eee7] p-5 sm:p-8 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900"
              alt="Curated timepieces"
              className="h-full w-full object-contain mix-blend-multiply drop-shadow-md"
            />
          </div>
        </div>

        {/* 3 Core Principles */}
        <div className="border-y border-[#ded9cf]">
          <div className="grid sm:grid-cols-3">
          <div className="space-y-3 border-b border-[#ded9cf] py-7 sm:border-b-0 sm:border-r sm:pr-8">
            <div className="text-[#a07d43]"><ShieldCheckIcon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17202b]">100% Genuine Guarantee</h3>
            <p className="text-xs leading-6 text-[#62615e]">
              Direct factory distribution with valid brand warranty cards serviceable at all official brand service centers nationwide.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#ded9cf] py-7 sm:border-b-0 sm:border-r sm:px-8">
            <div className="text-[#a07d43]"><TruckIcon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17202b]">Insured Air Logistics</h3>
            <p className="text-xs leading-6 text-[#62615e]">
              Every parcel is protected with transit insurance and dispatched via premier partners like BlueDart Express and Delhivery.
            </p>
          </div>

          <div className="space-y-3 py-7 sm:pl-8">
            <div className="text-[#a07d43]"><StarIcon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17202b]">Dedicated Concierge</h3>
            <p className="text-xs leading-6 text-[#62615e]">
              Personalized client advisors based out of our Ahmedabad flagship boutique assisting with bespoke sizing, gifting, and corporate orders.
            </p>
          </div>
          </div>
        </div>

        {/* Flagship Boutique Info */}
        <div className="bg-[#17202b] px-6 py-9 text-white sm:px-10 sm:py-11">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b978]">02 / Physical Sanctuary</span>
              <h3 className="mt-2 text-2xl font-serif font-normal text-white sm:text-3xl">Visit our Ahmedabad flagship.</h3>
              <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                Experience our curated timepieces and leather accessories in person. Our private viewing suites offer bespoke bracelet fitting, movement diagnostics, and luxury hospitality.
              </p>
              <div className="mt-5 space-y-2 text-xs text-gray-300">
                <p><strong className="font-semibold text-white">Location</strong> &nbsp; Bodakdev, SG Highway, Ahmedabad, Gujarat 380054</p>
                <p><strong className="font-semibold text-white">Hours</strong> &nbsp; Mon - Sat, 10:30 AM - 08:30 PM</p>
                <p><strong className="font-semibold text-white">Private Desk</strong> &nbsp; +91 (079) 4000-5500</p>
              </div>
            </div>
            <div className="text-center lg:text-right pt-2 lg:pt-0">
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center gap-3 border border-white/30 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white hover:text-[#17202b] sm:w-auto"
              >
                Schedule private viewing <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}