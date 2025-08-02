import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, Search, Filter, Eye, Lock } from 'lucide-react'
import { format, isFuture, isPast } from 'date-fns'
import { supabase, Webinar } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function ExplorePage() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [filteredWebinars, setFilteredWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchWebinars()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [webinars, searchTerm, filter])

  const fetchWebinars = async () => {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('scheduled_date', { ascending: true })

      if (error) throw error
      setWebinars(data || [])
    } catch (error) {
      console.error('Error fetching webinars:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = webinars

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(webinar =>
        webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.speaker_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply time filter
    if (filter === 'upcoming') {
      filtered = filtered.filter(webinar => isFuture(new Date(webinar.scheduled_date)))
    } else if (filter === 'past') {
      filtered = filtered.filter(webinar => isPast(new Date(webinar.scheduled_date)))
    }

    setFilteredWebinars(filtered)
  }

  const canAccessWebinar = (webinar: Webinar) => {
    return webinar.access_type === 'public' || user
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Webinars</h1>
          <p className="text-gray-600">Discover and join engaging webinars from expert speakers</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search webinars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Webinars</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {filteredWebinars.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No webinars found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWebinars.map((webinar) => {
              const isUpcoming = isFuture(new Date(webinar.scheduled_date))
              const hasAccess = canAccessWebinar(webinar)
              
              return (
                <div
                  key={webinar.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {webinar.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {webinar.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        webinar.access_type === 'public' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {webinar.access_type === 'public' ? 'Public' : 'Paid Only'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isUpcoming
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(webinar.scheduled_date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(new Date(webinar.scheduled_date), 'h:mm a')} ({webinar.duration_minutes} min)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {webinar.speaker_name}
                    </div>
                  </div>

                  {hasAccess ? (
                    <Link
                      to={`/webinar/${webinar.id}`}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Webinar</span>
                    </Link>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed">
                      <Lock className="h-4 w-4" />
                      <span>Access Restricted - Paid Access Required</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}