
import { Layout } from "@/components/layout/Layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        {!user ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border">
            <p className="mb-4">Please log in to view your profile</p>
            <button 
              onClick={() => navigate("/auth")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <ProfileForm />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
