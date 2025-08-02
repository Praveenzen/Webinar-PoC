import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Users, ArrowLeft, Lock, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { supabase, Webinar } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function WebinarDetailPage() {
  const [webinar, setWebinar] = useState<Webinar | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      fetchWebinar()
    }
  }, [id])

  const fetchWebinar = async () => {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setWebinar(data)
    } catch (error) {
      console.error('Error fetching webinar:', error)
    } finally {
      setLoading(false)
    }
  }

  const canAccessWebinar = () => {
    if (!webinar) return false
    return webinar.access_type === 'public' || user
  }

  const getEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Convert Vimeo URLs to embed format
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!webinar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Webinar not found</h2>
          <p className="text-gray-600 mb-4">The webinar you're looking for doesn't exist.</p>
          <Link
            to="/explore"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    )
  }

  const hasAccess = canAccessWebinar()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/explore"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{webinar.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                webinar.access_type === 'public' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {webinar.access_type === 'public' ? (
                  <>
                    <Globe className="h-4 w-4 inline mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 inline mr-1" />
                    Paid Only
                  </>
                )}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">
                    {format(new Date(webinar.scheduled_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm">{format(new Date(webinar.scheduled_date), 'h:mm a')}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{webinar.duration_minutes} minutes</div>
                  <div className="text-sm">Duration</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{webinar.speaker_name}</div>
                  <div className="text-sm">Speaker(s)</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {webinar.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Video Content */}
          <div className="p-8">
            {hasAccess ? (
              <>
                {webinar.embed_url ? (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={getEmbedUrl(webinar.embed_url)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={webinar.title}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Users className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">No video URL provided</p>
                      <p className="text-sm">The webinar host hasn't added a video link yet.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <Lock className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
                  <p className="text-lg mb-4">This webinar requires paid access</p>
                  {!user ? (
                    <div>
                      <p className="text-sm mb-4">Please sign in to check your access permissions</p>
                      <Link
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm">Contact the webinar host for access information</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}