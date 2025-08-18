"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { profileService } from "@/lib/supabase"
import { toast } from "sonner"

interface ProfileData {
  name: string
  pronouns: string
  email: string
  phone: string
  bio: string
  profileImage: string
}

export function ProfileForm() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    pronouns: "",
    email: "",
    phone: "",
    bio: "",
    profileImage: "",
  })

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        console.log('No session or user ID available')
        return
      }
      
      console.log('Loading profile for session:', session.user)
      setIsLoadingProfile(true)
      
      try {
        const profile = await profileService.getProfile(session.user.id)
        console.log('Profile loaded from DB:', profile)
        
        // Set profile data with defaults from session
        setProfileData({
          name: session.user.name || "",
          pronouns: profile?.pronouns || "",
          email: session.user.email || "",
          phone: profile?.phone || "",
          bio: profile?.bio || "",
          profileImage: profile?.profile_image || session.user.image || "",
        })
        
        console.log('Profile image URL from DB:', profile?.profile_image)
        console.log('Profile loaded successfully:', profile ? 'existing profile' : 'new profile')
      } catch (error) {
        console.error("Error loading profile:", error)
        // Don't show toast error for debugging - just log
        
        // Even if there's an error, set basic data from session
        setProfileData({
          name: session.user.name || "",
          pronouns: "",
          email: session.user.email || "",
          phone: "",
          bio: "",
          profileImage: session.user.image || "",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [session])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && session?.user?.id) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, or WebP)")
        return
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB")
        return
      }
      
      setIsLoading(true)
      try {
        // Create FormData for the API request
        const formData = new FormData()
        formData.append('file', file)
        
        console.log('Uploading file via API:', file.name, 'Size:', file.size)
        
        // Upload via API route
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Upload failed')
        }
        
        console.log('Upload successful:', result)
        
        setProfileData(prev => ({
          ...prev,
          profileImage: result.url
        }))
        
        toast.success("Image uploaded successfully!")
        
        // Automatically save the profile with the new image
        try {
          const saveResult = await profileService.upsertProfile(session.user.id, {
            pronouns: profileData.pronouns,
            phone: profileData.phone,
            bio: profileData.bio,
            profile_image: result.url,
          })
          
          if (saveResult) {
            console.log('Profile automatically saved with new image')
            toast.success("Profile updated with new image!")
          } else {
            toast.error("Image uploaded but failed to save to profile")
          }
        } catch (saveError) {
          console.error('Error auto-saving profile:', saveError)
          toast.error("Image uploaded but failed to save to profile")
        }
      } catch (err) {
        console.error('Image upload error:', err)
        toast.error(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSave = async () => {
    if (!session?.user?.id) return
    
    setIsLoading(true)
    try {
      console.log('Saving profile with data:', {
        pronouns: profileData.pronouns,
        phone: profileData.phone,
        bio: profileData.bio,
        profile_image: profileData.profileImage,
      })
      
      const result = await profileService.upsertProfile(session.user.id, {
        pronouns: profileData.pronouns,
        phone: profileData.phone,
        bio: profileData.bio,
        profile_image: profileData.profileImage,
      })
      
      console.log('Save result:', result)
      
      if (result) {
        toast.success("Profile updated successfully!")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-green" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your profile information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profileData.profileImage} alt={profileData.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(profileData.name || "U")}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-custom-green text-white rounded-full p-2 cursor-pointer hover:bg-custom-green/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Click the camera icon to upload a new profile picture<br />
            <span className="text-xs">Supports JPEG, PNG, WebP • Max 5MB</span>
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="bg-gray-50 cursor-not-allowed"
              readOnly
              required
            />
            <p className="text-xs text-gray-500">Name is automatically synced from your Google account</p>
          </div>

          {/* Pronouns */}
          <div className="space-y-2">
            <Label htmlFor="pronouns">Pronouns</Label>
            <Input
              id="pronouns"
              type="text"
              placeholder="e.g., she/her, he/him, they/them"
              value={profileData.pronouns}
              onChange={(e) => handleInputChange("pronouns", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
            />
            <p className="text-xs text-muted-foreground">
              Your email from Google sign-in is used by default
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
            />
            <p className="text-xs text-muted-foreground">
              Used for action coordination and updates
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us a bit about yourself and your interests in climate action..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Share your background, interests, or what motivates your climate action
            </p>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !profileData.name.trim()}
          className="w-full bg-custom-green hover:bg-custom-green/90"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
