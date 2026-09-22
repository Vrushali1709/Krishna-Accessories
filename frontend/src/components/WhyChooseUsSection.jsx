// src/components/WhyChooseUsSection.jsx
import React from 'react';
import { Reveal } from './useScrollReveal';
import { ShieldCheckIcon, TruckIcon, RefreshIcon, HeadphonesIcon } from './Icons';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    icon: ShieldCheckIcon,
    title: 'Quality & Premium Products',
    text: 'Every timepiece, leather good, and device is curated with verified product details and reliable manufacturer warranty.'
  },
  {
    number: '02',
    icon: TruckIcon,
    title: 'Insured Express Logistics',
    text: 'Dispatched securely via premium couriers (BlueDart & Delhivery) with real-time end-to-end SMS & WhatsApp tracking.'
  },
  {
    number: '03',
    icon: RefreshIcon,
    title: '7-Day Peace-of-Mind',
    text: 'Enjoy straightforward 7-day replacements and zero-hassle returns should you need any size, color, or model adjustment.'
  },
  {
    number: '04',
    icon: HeadphonesIcon,
    title: 'Dedicated Mumbai Concierge',
    text: 'Our specialized luxury consultants at Heera Panna, Haji Ali are available 24/7 for styling advice and order assistance.'
  }
];

export default function WhyChooseUsSection({ items = DIFFERENCE_ITEMS }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:pt-10 pb-4 sm:pb-6 lg:px-8">
      {/* Header */}
      <Reveal direction="up" delay={50}>
        <div className="mb-7 sm:mb-9 text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-neutral-400">
            THE KRISHNA PROMISE
          </span>
          <h2 className="mt-1.5 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950">
            Why Shop With Us?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
            We hold ourselves to the highest standards of luxury curation, trusted product quality, and client satisfaction.
          </p>
        </div>
      </Reveal>

      {/* 4-Column Feature Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = item.icon || ShieldCheckIcon;
          return (
            <Reveal key={item.number} direction="up" delay={idx * 80} duration={650}>
              <div className="group relative h-full rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-[0_14px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-amber-300 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-neutral-300 group-hover:text-amber-600 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base sm:text-[17px] font-bold text-gray-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-gray-500">
                    {item.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider group-hover:text-black transition-colors">
                    Guaranteed
                  </span>
                  <div className="h-1.5 w-8 rounded-full bg-neutral-200 transition-all duration-300 group-hover:w-14 group-hover:bg-amber-400" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#C5A880] group-hover:text-[#8C6734] transition-colors">
                      {item.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-[#8C6734] flex items-center justify-center shadow-2xs group-hover:bg-neutral-950 group-hover:text-[#C5A880] group-hover:border-neutral-950 transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-4.5 h-4.5 transition-transform duration-300" />
                    </div>
                  </div>

                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8C6734]">
                    {item.pillar}
                  </p>

                  <h3 className="text-[15px] sm:text-base font-bold text-neutral-950 mt-1 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-medium text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                    <span className="text-[10.5px] group-hover:text-neutral-900 transition-colors">{item.badge}</span>
                  </div>
                  <div className="h-1 w-5 rounded-full bg-neutral-200 group-hover:w-8 group-hover:bg-[#8C6734] transition-all duration-300" />
                </div>

              </div >
            </Reveal >
          );
        })}
      </div >

{/* ============================================================
          3. MUMBAI FLAGSHIP SANCTUARY & BOUTIQUE SHOWCASE BANNER
      ============================================================ */}
  < Reveal direction = "up" delay = { 100} >
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden border border-neutral-200/90 shadow-md bg-white">

      {/* Left Visual: Store Interior with Cinematic Hover */}
      <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[300px] lg:min-h-full group overflow-hidden bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop"
          alt="Krishna Accessories Mumbai Boutique at Heera Panna"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#C5A880] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded border border-[#C5A880]/30 mb-1">
            Mumbai Flagship
          </span>
          <p className="font-serif text-lg font-medium text-white">Heera Panna Shopping Center</p>
          <p className="text-[11px] text-neutral-300">Haji Ali, Mumbai 400026</p>
        </div>
      </div>

      {/* Right Information Panel */}
      <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-between space-y-6 text-left">

        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-[1.5px] bg-[#8C6734]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
              VISIT OUR FLAGSHIP
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight leading-tight">
            Experience Krishna Accessories in person.
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-2 font-normal font-sans">
            Visit our premier boutique in South Mumbai to try on Swiss timepieces, inspect full-grain leather finishes, test high-fidelity acoustics, and consult with our personal luxury advisors.
          </p>
        </div>

        {/* Location & Hours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <MapPin className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
              <span>Store Location</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
              Shop No. 64, Heera Panna Shopping Center,<br />
              Haji Ali, Mumbai 400026
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <Clock className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
              <span>Opening Hours</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
              Mon – Sat: 10:30 AM – 08:30 PM<br />
              <span className="text-[#8C6734] font-semibold">Sunday by Appointment</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <Phone className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
              <span>Private Desk</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
              +91 93213 22761 / shantilal6186@gmail.com
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
              <span>In-Store Services</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
              Complimentary Sizing &bull; Battery Swap &bull; Luxury Gift Wrap
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-[#8C6734] text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 group active:scale-95 cursor-pointer"
          >
            <span>Schedule a Private Viewing</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-neutral-300 text-neutral-800 hover:text-neutral-950 hover:border-neutral-900 text-xs font-semibold tracking-[0.14em] uppercase rounded-full transition-all duration-300 hover:bg-neutral-50 active:scale-95 cursor-pointer"
          >
            <span>Read Our Full Story</span>
          </Link>
        </div>

      </div>

    </div>
      </Reveal >

    </section >
  );
}
