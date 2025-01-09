import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setProfile } from "@/lib/redux/features/chinniMain/chinniMainSlice";

interface ProfileCardProps {
  initialProfileData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

export function ProfileCard({ initialProfileData }: ProfileCardProps) {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const { isLoggedIn, authToken } = useSelector(
    (state: RootState) => state.chinniMain
  );

  useEffect(() => {
    setHasChanges(JSON.stringify(profileData) !== JSON.stringify(initialProfileData));
  }, [profileData, initialProfileData]);

  const handleChange = (field: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges || !isLoggedIn) return;

    setLoading(true);

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/update-profile`, profileData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Profile saved successfully",
        });
        setHasChanges(false);
        setIsEditing(false);
        dispatch(
          setProfile({
            firstName: profileData?.firstName || "",
            lastName: profileData?.lastName || "",
            email: profileData?.email || "",
            username: profileData?.username || "",
            image: "",
          })
        );
      } else if (response.data.status === 400) {
        toast({
          title: "Error",
          description: response.data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile2",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(initialProfileData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 border rounded-lg shadow-md bg-card/50 backdrop-blur-sm"
    >
      <div className="space-y-2">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-500">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={profileData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          className="min-h-[40px] w-full px-3 py-2 border-2 focus:ring-2 focus:ring-primary/50 rounded-sm"
          disabled={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-500">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={profileData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          className="min-h-[40px] w-full px-3 py-2 border-2 focus:ring-2 focus:ring-primary/50 rounded-sm"
          disabled={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-500">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={profileData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="min-h-[40px] w-full px-3 py-2 border-2 focus:ring-2 focus:ring-primary/50 rounded-sm"
          disabled={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-500">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={profileData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          className="min-h-[40px] w-full px-3 py-2 border-2 focus:ring-2 focus:ring-primary/50 rounded-sm"
          disabled={!isEditing}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              className="relative group overflow-hidden"
              disabled={loading}
            >
              <span className="relative">Cancel</span>
            </Button>
            <Button
              onClick={handleSave}
              className="relative group overflow-hidden"
              disabled={!hasChanges || loading}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 group-hover:opacity-100 opacity-0 transition-opacity"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="relative">Save Changes</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="relative group overflow-hidden"
          >
            <span className="relative">Edit</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}