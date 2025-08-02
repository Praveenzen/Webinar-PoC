import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Calendar, Zap, Globe } from 'lucide-react'
import dashboardImg from '../assets/dashboard.jpg'
import explorerImg from '../assets/explorer.jpg'


export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Join or host engaging
            <span className="text-blue-600 block">webinars easily</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The modern platform for hosting professional webinars and connecting with your audience. 
            Create, manage, and attend webinars with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Log In</span>
            </Link>
          </div>

          {/* Feature Preview */}
          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">For Contributors</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Scheduling</h3>
                    <p className="text-gray-600">Schedule webinars with flexible timing and duration settings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Audience Management</h3>
                    <p className="text-gray-600">Control access with public and paid-only webinar options</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="h-48 overflow-hidden rounded-lg shadow">
  <img
    src={dashboardImg}
    alt="Webinar Dashboard Preview"
    className="object-cover w-full h-full"
  />
</div>

            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-xl order-2 md:order-1">
              <div className="h-48 overflow-hidden rounded-lg shadow">
  <img
    src={explorerImg}
    alt="Webinar Explorer Preview"
    className="object-cover w-full h-full"
  />
</div>

            </div>

            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900">For Attendees</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Globe className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Discover Webinars</h3>
                    <p className="text-gray-600">Browse and filter through upcoming and past webinars</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Access</h3>
                    <p className="text-gray-600">Join webinars instantly with embedded video streaming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}