"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-gray-800 transition-colors px-2 -mx-2 rounded"
      >
        <span className="font-medium text-gray-900 dark:text-gray-900 dark:text-white">{question}</span>
        <span className="text-2xl text-violet-600 ml-4">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-600 dark:text-gray-600 dark:text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider mb-4">
            Welcome to
          </p>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-gray-900 dark:text-white tracking-tight mb-6">
            Accord Registry
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The transparent blockchain-based carbon credit registry. Register, verify,
            and trade carbon credits aligned with Paris Agreement Article 6.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-8 py-3.5 bg-violet-600 text-gray-900 dark:text-white rounded-full font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              View all projects
              <span>→</span>
            </Link>
            <Link
              href="/guide"
              className="text-violet-600 hover:underline font-medium"
            >
              Learn how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Strip */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="lg:max-w-xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
              Ready to offset your carbon footprint?
            </h2>
            <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-6">
              Browse verified carbon credit projects from around the world.
              Each credit is traceable, transparent, and blockchain-verified.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex px-6 py-3 bg-violet-600 text-gray-900 dark:text-white rounded-full font-medium hover:bg-violet-700 transition-colors"
            >
              Explore Marketplace
            </Link>
          </div>
          <div className="w-72 h-48 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
            <span className="text-6xl">🌿</span>
          </div>
        </div>
      </section>

      {/* About / Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-12 text-center">
            About Accord Registry
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Blockchain Verified",
                description: "Every carbon credit is registered on-chain using Solana, ensuring complete transparency and immutability.",
              },
              {
                num: "02",
                title: "ICM Compliant",
                description: "Fully aligned with Paris Agreement Article 6 and India's Carbon Market regulations for cross-border credit transfers.",
              },
              {
                num: "03",
                title: "DePIN Integration",
                description: "Satellite imagery, IoT sensors, and real-time ecosystem data feed into our verification process.",
              },
              {
                num: "04",
                title: "Instant Settlement",
                description: "Trade credits on our built-in DEX with instant on-chain settlement and no intermediaries.",
              },
            ].map((feature) => (
              <div
                key={feature.num}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <span className="text-violet-600 font-bold text-lg">{feature.num}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-3 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-8">
            Trusted by project developers and organizations worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-16">
            {[
              { value: "45+", label: "Projects" },
              { value: "125K", label: "Credits Issued" },
              { value: "5", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-12 text-center">
            How to Use Accord
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                num: "01",
                title: "Connect Wallet",
                description: "Link your Solana wallet to access the platform and manage your carbon credits.",
              },
              {
                num: "02",
                title: "Register Project",
                description: "Submit your carbon project with location data and supporting documentation.",
              },
              {
                num: "03",
                title: "Get Verified",
                description: "Accredited validators review your project using DePIN and satellite data.",
              },
              {
                num: "04",
                title: "Trade Credits",
                description: "Once verified, mint tokens and trade on the marketplace or DEX.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <span className="text-violet-600 font-bold text-2xl">{step.num}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-violet-600 text-gray-900 dark:text-white rounded-full font-medium hover:bg-violet-700 transition-colors"
            >
              Start Exploring
            </Link>
            <Link
              href="/guide"
              className="px-8 py-3 border border-gray-300 dark:border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="bg-white dark:bg-gray-950 rounded-2xl p-8">
            <FAQItem
              question="What is a carbon credit?"
              answer="A carbon credit represents one tonne of CO2 equivalent that has been removed or prevented from entering the atmosphere. Credits can be traded and retired to offset emissions."
            />
            <FAQItem
              question="How does blockchain verification work?"
              answer="Each project and credit is registered on Solana blockchain, creating an immutable record. Verification data from satellites and IoT sensors is stored on-chain for transparency."
            />
            <FAQItem
              question="What project types are supported?"
              answer="We support blue carbon (mangroves, seagrass), forestry, renewable energy, waste management, agriculture, and industrial emission reduction projects."
            />
            <FAQItem
              question="How do I become a validator?"
              answer="Validators must apply through the platform and demonstrate relevant credentials. Government bodies and accredited institutions receive priority verification."
            />
            <FAQItem
              question="What is Article 6 compliance?"
              answer="Article 6 of the Paris Agreement governs international carbon credit transfers. Our platform ensures proper corresponding adjustments for cross-border transactions."
            />
          </div>
        </div>
      </section>

      {/* Learning Resources Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-12 text-center">
            Learning Resources
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Documentation", description: "Complete technical guides for developers and project owners." },
              { num: "02", title: "API Reference", description: "Integrate with our on-chain program using the Anchor SDK." },
              { num: "03", title: "Video Tutorials", description: "Step-by-step video walkthroughs for every feature." },
              { num: "04", title: "Case Studies", description: "Real-world examples of successful carbon projects." },
              { num: "05", title: "Whitepaper", description: "Deep dive into our tokenomics and protocol design." },
              { num: "06", title: "Community Forum", description: "Connect with other project developers and validators." },
            ].map((resource) => (
              <div
                key={resource.num}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <span className="text-violet-600 font-bold">{resource.num}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-3 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {resource.description}
                </p>
                <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-12 text-center">
            Recent Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Sundarbans Mangrove", tag: "Blue Carbon", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
              { title: "Western Ghats Forest", tag: "Forestry", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
              { title: "Gujarat Solar Park", tag: "Renewable", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" },
              { title: "Mumbai Waste-to-Energy", tag: "Industrial", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
            ].map((project, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <span className="text-4xl opacity-50 group-hover:scale-110 transition-transform">
                    {project.tag === "Blue Carbon" ? "🌊" :
                      project.tag === "Forestry" ? "🌲" :
                        project.tag === "Renewable" ? "☀️" : "🏭"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-2">{project.title}</h3>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full ${project.color}`}>
                    {project.tag}
                  </span>
                  <Link
                    href="/explore"
                    className="block mt-4 text-violet-600 text-sm hover:underline"
                  >
                    View project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
