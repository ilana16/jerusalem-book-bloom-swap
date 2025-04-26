
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "lucide-react";
import { NeighborhoodCombobox } from "@/components/NeighborhoodCombobox";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    neighborhood: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, bio, neighborhood')
        .eq('id', user.id)
        .single();

      if (error) {
        toast.error('Failed to fetch profile');
        console.error(error);
        return;
      }

      if (data) {
        setProfile({
          displayName: data.display_name || '',
          bio: data.bio || '',
          neighborhood: data.neighborhood || ''
        });
      }
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.displayName,
        bio: profile.bio,
        neighborhood: profile.neighborhood
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } else {
      toast.success('Profile updated successfully');
    }

    setIsLoading(false);
  };

  if (!user) {
    return <Layout>Please log in to view your profile</Layout>;
  }

  return (
    <Layout>
      <div className="page-container max-w-2xl">
        <h1 className="section-heading mb-8">My Profile</h1>
        
        <div className="bg-white border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <Input 
                placeholder="Display Name" 
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Textarea 
              placeholder="Bio" 
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="min-h-[120px]"
            />
            
            <NeighborhoodCombobox
              value={profile.neighborhood}
              onChange={(value) => setProfile({...profile, neighborhood: value})}
            />
          </div>
          
          <Button 
            onClick={handleSaveProfile} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
