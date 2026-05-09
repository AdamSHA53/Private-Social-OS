import { supabase } from './supabase'

export const storageService = {
  async uploadMedia(file: File, bucket: string, userId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Math.random()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  },

  async deleteMedia(url: string, bucket: string) {
    const path = url.split(`${bucket}/`)[1]
    if (path) {
      const { error } = await supabase.storage.from(bucket).remove([path])
      if (error) throw error
    }
  }
}
