import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, Clock, User, Link as LinkIcon, Globe, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { supabase, Webinar } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function EditWebinarPage() {
  const [webinar, setWebinar] = useState<Webinar | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 60,
    speaker_name: '',
    embed_url: '',
    access_type: 'public' as 'public' | 'paid_only'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

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
        .eq('created_by', user?.id)
        .single()

      if (error) throw error
      
      setWebinar(data)
      const scheduledDate = new Date(data.scheduled_date)
      setFormData({
        title: data.title,
        description: data.description,
        scheduled_date: format(scheduledDate, 'yyyy-MM-dd'),
        scheduled_time: format(scheduledDate, 'HH:mm'),
        duration_minutes: data.duration_minutes,
        speaker_name: data.speaker_name,
        embed_url: data.embed_url || '',
        access_type: data.access_type
      })
    } catch (error) {
      console.error('Error fetching webinar:', error)
      navigate('/dashboard')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`)
      
      const { error } = await supabase
        .from('webinars')
        .update({
          title: formData.title,
          description: formData.description,
          scheduled_date: scheduledDateTime.toISOString(),
          duration_minutes: formData.duration_minutes,
          speaker_name: formData.speaker_name,
          embed_url: formData.embed_url,
          access_type: formData.access_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to update webinar')
    } finally {
      setLoading(false)
    }
  }

  if (!webinar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Webinar</h1>
            <p className="text-gray-600 mt-2">Update your webinar details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Webinar Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter webinar title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your webinar content and objectives"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  id="scheduled_date"
                  type="date"
                  required
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Time
                </label>
                <input
                  id="scheduled_time"
                  type="time"
                  required
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                id="duration_minutes"
                type="number"
                min="15"
                max="480"
                required
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="speaker_name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Speaker Name(s)
              </label>
              <input
                id="speaker_name"
                type="text"
                required
                value={formData.speaker_name}
                onChange={(e) => setFormData({ ...formData, speaker_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter speaker name(s)"
              />
            </div>

            <div>
              <label htmlFor="embed_url" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="h-4 w-4 inline mr-1" />
                Embed URL (Optional)
              </label>
              <input
                id="embed_url"
                type="url"
                value={formData.embed_url}
                onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://zoom.us/j/... or YouTube/Vimeo embed URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Access Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, access_type: 'public' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.access_type === 'public'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Globe className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Public</div>
                  <div className="text-xs text-gray-500 mt-1">Anyone can join</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, access_type: 'paid_only' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.access_type === 'paid_only'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Lock className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Paid Only</div>
                  <div className="text-xs text-gray-500 mt-1">Requires payment</div>
                </button>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Webinar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}