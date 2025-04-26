
import { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/components/AuthProvider";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Layout>Please log in to view your profile</Layout>;
  }

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ProfileForm />
      </div>
    </Layout>
  );
};

export default Profile;
