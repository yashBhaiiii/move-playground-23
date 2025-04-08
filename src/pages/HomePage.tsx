
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Code, FileText, Users, PenTool } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <section className="flex flex-col items-center">
            <div className="flex max-w-xl flex-col items-center pb-16 pt-8 text-center sm:pb-24 lg:pt-16">
              <h1 className="mb-8 text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl">
                Smart Contract Builder
              </h1>

              <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 xl:text-lg">
                Build, visualize, and deploy smart contracts with our intuitive drag-and-drop interface. No coding experience required.
              </p>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Link to="/smart-contract-builder">
                  <Button className="bg-purple-600 hover:bg-purple-700 inline-block rounded-lg px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-gray-800 focus-visible:ring md:text-base">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button variant="outline" className="inline-block rounded-lg px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:text-gray-800 focus-visible:ring md:text-base">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="max-w-5xl px-4 md:px-8">
              <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Smart Contract Builder Preview" 
                  className="h-auto w-full object-cover object-center opacity-90"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              Our platform makes it easy to create complex smart contracts without writing a single line of code.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:gap-12 xl:grid-cols-4">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white shadow-lg md:h-14 md:w-14 md:rounded-xl">
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">Visual Editor</h3>
              <p className="mb-2 text-center text-gray-500">Drag and drop components to design your smart contract flow</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white shadow-lg md:h-14 md:w-14 md:rounded-xl">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">Multi-Language Support</h3>
              <p className="mb-2 text-center text-gray-500">Generate code in Solidity, Move, Rust, and other languages</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white shadow-lg md:h-14 md:w-14 md:rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">Templates</h3>
              <p className="mb-2 text-center text-gray-500">Start from pre-built templates for common contract types</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white shadow-lg md:h-14 md:w-14 md:rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">Community</h3>
              <p className="mb-2 text-center text-gray-500">Share and collaborate with other contract builders</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-gray-100 p-8 md:flex-row lg:p-12">
            <div>
              <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                Ready to build your smart contract?
              </h2>
              <p className="mt-2 text-gray-500">
                Start building with our drag-and-drop interface now.
              </p>
            </div>
            <Link to="/smart-contract-builder">
              <Button className="bg-purple-600 hover:bg-purple-700 inline-block rounded-lg px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-gray-800 focus-visible:ring md:text-base">
                Start Building
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
