// src/components/WhyChooseUsSection.jsx
import React from 'react';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    title: 'Curated Selection',
    text: 'A carefully selected collection across fashion, technology and lifestyle.'
  },
  {
    number: '02',
    title: 'Quality First',
    text: 'Products are selected with quality, design and everyday usability in mind.'
  },
  {
    number: '03',
    title: 'Secure Shopping',
    text: 'A clean checkout experience designed to keep your shopping safe.'
  },
  {
    number: '04',
    title: 'Customer Support',
    text: 'We are here to help before, during and after your purchase.'
  }
];

export default function WhyChooseUsSection({ items = DIFFERENCE_ITEMS }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400">
          The Difference
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Why Shop With Us?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
          We keep the shopping experience simple, secure and focused on products you can trust.
        </p>
      </div>

      {/* 4-Column Feature Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.number}
            className="group rounded-[22px] border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300">
              {item.number}
            </span>

            <h3 className="mt-6 text-base font-bold text-gray-950">
              {item.title}
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              {item.text}
            </p>

            <div className="mt-6 h-px w-8 bg-gray-900 transition-all duration-300 group-hover:w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}
