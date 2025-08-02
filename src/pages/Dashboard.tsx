import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Calendar, Clock, Users, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { supabase, Webinar } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function Dashboard() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchWebinars()
  }, [])

  const fetchWebinars = async () => {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .eq('created_by', user?.id)
        .order('scheduled_date', { ascending: true })

      if (error) throw error
      setWebinars(data || [])
    } catch (error) {
      console.error('Error fetching webinars:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteWebinar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webinar?')) return

    try {
      const { error } = await supabase
        .from('webinars')
        .delete()
        .eq('id', id)

      if (error) throw error
      setWebinars(webinars.filter(w => w.id !== id))
    } catch (error) {
      console.error('Error deleting webinar:', error)
    }
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Webinars</h1>
            <p className="text-gray-600 mt-1">Manage your webinar content and schedule</p>
          </div>
          <Link
            to="/create-webinar"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Webinar</span>
          </Link>
        </div>

        {webinars.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No webinars yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first webinar</p>
            <Link
              to="/create-webinar"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Webinar</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    webinar.access_type === 'public' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {webinar.access_type === 'public' ? 'Public' : 'Paid Only'}
                  </span>
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

                <div className="flex space-x-2">
                  <Link
                    to={`/webinar/${webinar.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  <Link
                    to={`/edit-webinar/${webinar.id}`}
                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => deleteWebinar(webinar.id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}