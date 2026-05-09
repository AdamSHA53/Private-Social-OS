import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { Button } from '@/components/ui/Button'
import { storageService } from '@/services/storage'
import { useToastStore } from '@/store/useToastStore'

interface Story {
  id: string
  media_url: string
  caption?: string
  created_at: string
}

export const Stories = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const { addToast } = useToastStore()

  const fetchStories = useCallback(async () => {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
    
    if (data) setStories(data)
  }, [])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const publicUrl = await storageService.uploadMedia(file, 'stories', user.id)
      
      const { error } = await supabase.from('stories').insert([
        { media_url: publicUrl, user_id: user.id }
      ])

      if (error) throw error
      
      addToast('Story shared to your sanctuary', 'success')
      fetchStories()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to upload story', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Stories</h1>
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleStoryUpload}
            disabled={uploading}
          />
          <Button size="sm" variant="secondary" className="rounded-full gap-2 px-4" disabled={uploading}>
            <Plus className="w-4 h-4" />
            {uploading ? 'Sharing...' : 'Add Story'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStoryIndex(index)}
            className="aspect-[9/16] relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 shadow-xl group"
          >
            <img 
              src={story.media_url} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs text-slate-200 line-clamp-2">{story.caption}</p>
            </div>
          </motion.div>
        ))}

        {/* Add Story Button Placeholder */}
        <button className="aspect-[9/16] relative rounded-3xl overflow-hidden cursor-pointer border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 transition-all bg-slate-900/20">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-500">Add Story</span>
        </button>
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <button 
              onClick={() => setActiveStoryIndex(null)}
              className="absolute top-6 right-6 z-[110] p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full max-w-lg aspect-[9/16]">
              {/* Progress Bars */}
              <div className="absolute top-6 left-6 right-6 z-[110] flex gap-1.5">
                {stories.map((_, i) => (
                  <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i === activeStoryIndex ? '100%' : i < activeStoryIndex ? '100%' : '0%' }}
                      transition={{ duration: i === activeStoryIndex ? 5 : 0, ease: 'linear' }}
                      className="h-full bg-white"
                    />
                  </div>
                ))}
              </div>

              <img 
                src={stories[activeStoryIndex].media_url} 
                className="w-full h-full object-cover"
                alt=""
              />
              
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-lg text-white font-medium text-center">
                  {stories[activeStoryIndex].caption}
                </p>
              </div>

              {/* Navigation Buttons */}
              {activeStoryIndex > 0 && (
                <button 
                  onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {activeStoryIndex < stories.length - 1 && (
                <button 
                  onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
