
import { useState, useEffect } from 'react';
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./ImageUpload";
import { NeighborhoodSelect } from "./NeighborhoodSelect";

export function ProfileForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    neighborhood: '',
    avatarUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, bio, neighborhood, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          toast.error('Failed to fetch profile');
          return;
        }

        if (data) {
          setProfile({
            displayName: data.display_name || '',
            bio: data.bio || '',
            neighborhood: data.neighborhood || '',
            avatarUrl: data.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if avatar_url column exists
      const { data: checkData, error: checkError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .limit(1);

      // If there's an error indicating avatar_url doesn't exist, update without it
      if (checkError && checkError.message.includes('avatar_url')) {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: profile.displayName,
            bio: profile.bio,
            neighborhood: profile.neighborhood
          })
          .eq('id', user.id);

        if (error) throw error;
      } else {
        // If avatar_url exists, include it in the update
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: profile.displayName,
            bio: profile.bio,
            neighborhood: profile.neighborhood,
            avatar_url: profile.avatarUrl
          })
          .eq('id', user.id);

        if (error) throw error;
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border">
      <div className="flex justify-center">
        <ImageUpload
          value={profile.avatarUrl}
          onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </label>
        <Input
          id="displayName"
          value={profile.displayName}
          onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
          placeholder="Enter your display name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Tell us about yourself"
          className="min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Neighborhood
        </label>
        <NeighborhoodSelect
          value={profile.neighborhood}
          onChange={(value) => setProfile({ ...profile, neighborhood: value })}
        />
      </div>

      <Button 
        onClick={handleSave}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </div>
  );
}
