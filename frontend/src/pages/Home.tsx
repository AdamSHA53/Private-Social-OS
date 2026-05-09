import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Smile, Heart, Bookmark, Trash2, Ghost, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow } from 'date-fns'
import { useToastStore } from '@/store/useToastStore'

interface Post {
  id: string
  content: string
  image_url?: string
  created_at: string
  mood_tag?: string
}

import { storageService } from '@/services/storage'

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'text-yellow-500' },
  { emoji: '🧘', label: 'Calm', color: 'text-blue-500' },
  { emoji: '💭', label: 'Pensive', color: 'text-indigo-500' },
  { emoji: '🔋', label: 'Energized', color: 'text-emerald-500' },
  { emoji: '🌙', label: 'Quiet', color: 'text-slate-500' },
]

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [moodTag, setMoodTag] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()
  const { addToast } = useToastStore()

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setPosts(data)
  }, [])

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: `user_id=eq.${user?.id}` },
        () => fetchPosts()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchPosts])

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return
    setLoading(true)

    try {
      let image_url = ''
      if (imageFile && user) {
        image_url = await storageService.uploadMedia(imageFile, 'posts', user.id)
      }

      const { error } = await supabase.from('posts').insert([
        { 
          content, 
          user_id: user?.id, 
          mood_tag: moodTag,
          image_url: image_url || null
        }
      ])

      if (error) throw error
      
      setContent('')
      setMoodTag('')
      setImageFile(null)
      addToast('Thought captured', 'success')
      fetchPosts()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to capture thought', 'error')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      addToast('Thought removed', 'info')
      fetchPosts()
    } else {
      addToast('Failed to remove thought', 'error')
    }
  }

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Thought Feed</h1>
        <div className="text-sm text-slate-500 font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Private Sanctuary
        </div>
      </div>

      {/* Composer */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 backdrop-blur-xl">
        <textarea
          placeholder="What's on your mind? This is for your eyes only."
          className="w-full bg-transparent border-none resize-none text-lg text-slate-200 placeholder:text-slate-600 focus:ring-0 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Selected Image Preview */}
        {imageFile && (
          <div className="relative w-24 h-24 mb-4 group">
            <img 
              src={URL.createObjectURL(imageFile)} 
              className="w-full h-full object-cover rounded-2xl border border-slate-700" 
              alt="Preview" 
            />
            <button 
              onClick={() => setImageFile(null)}
              className="absolute -top-2 -right-2 p-1 bg-rose-600 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() => setMoodTag(moodTag === m.label ? '' : m.label)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border",
                moodTag === m.label 
                  ? "bg-slate-800 border-blue-500/50 text-blue-400" 
                  : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
              )}
            >
              <span>{m.emoji}</span>
              <span className={cn(moodTag === m.label ? "opacity-100" : "opacity-0 w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all")}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <button className={cn(
                "p-2 rounded-xl transition-all",
                imageFile ? "text-blue-500 bg-blue-500/10" : "text-slate-500 hover:text-blue-500 hover:bg-blue-500/10"
              )}>
                <Image className="w-5 h-5" />
              </button>
            </div>
            <button className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <Button 
            size="sm" 
            onClick={handlePost} 
            disabled={loading || (!content.trim() && !imageFile)}
            className="rounded-xl px-5"
          >
            {loading ? 'Posting...' : 'Post Thought'}
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6 hover:bg-slate-900/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-200">Me</p>
                      {post.mood_tag && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-500/20">
                          {post.mood_tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {post.image_url && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800">
                  <img src={post.image_url} className="w-full h-auto max-h-96 object-cover" alt="" />
                </div>
              )}

              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-6">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-800/30">
                <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-medium">Like</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-xs font-medium">Archive</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <Ghost className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-slate-500 font-medium italic">Your sanctuary is quiet...</p>
          </div>
        )}
      </div>
    </div>
  )
}
