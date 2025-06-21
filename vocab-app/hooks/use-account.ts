import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/services/api"
import authService from "@/services/auth-service"
import { UserDetail } from "@/types/user-detail"
import { USER_PROFILE } from "@/constants/api-endpoints"


// Initialize with empty/null values instead of default data
const emptyUser: UserDetail = {
  name: "",
  email: "",
  avatar: "",
  phone: "",
  birthday: "",
  address: "",
  bio: "",
  language: "",
  joinedDate: "",
  level: "",
  streak: 0,
  completedLessons: 0,
  totalLessons: 0,
  completedTopics: 0,
  totalTopics: 0,
  learningTime: "",
  subscription: "",
  subscriptionExpiry: "",
  paymentMethod: "",
}

export function useAccount() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<UserDetail>(emptyUser)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(true)
  
  // Function to fetch user details from API
  const fetchUserDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Call the API endpoint to get user details
      const response = await api.get<UserDetail>(USER_PROFILE.GET_PROFILE);
      
      // Check if response data is empty
      if (!response.data) {
        console.warn("Empty user data received from API.");
        setIsProfileComplete(false);
        setUser(emptyUser);
        setIsLoading(false);
        return;
      }

      // Extract data directly from response without fallbacks
      const userData: UserDetail = {
        name: response.data.name ?? "",
        email: response.data.email ?? "",
        avatar: response.data.avatar ?? "",
        phone: response.data.phone ?? "",
        birthday: response.data.birthday ?? "",
        address: response.data.address ?? "",
        bio: response.data.bio ?? "",
        language: response.data.language ?? "",
        joinedDate: response.data.joinedDate ?? "",
        level: response.data.level ?? "",
        streak: response.data.streak ?? 0,
        completedLessons: response.data.completedLessons ?? 0,
        totalLessons: response.data.totalLessons ?? 0,
        completedTopics: response.data.completedTopics ?? 0,
        totalTopics: response.data.totalTopics ?? 0,
        learningTime: response.data.learningTime ?? "",
        subscription: response.data.subscription ?? "",
        subscriptionExpiry: response.data.subscriptionExpiry ?? "",
        paymentMethod: response.data.paymentMethod ?? "",
      };
      
      // Check if essential profile fields are filled
      const essentialFields = [userData.name, userData.email];
      const isComplete = essentialFields.every(field => field && field.trim() !== "");
      setIsProfileComplete(isComplete);
      
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch user details");
      setIsProfileComplete(false);
      setUser(emptyUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user details
  const updateUserDetails = async (updatedData: Partial<UserDetail>) => {
    try {
      setError(null);
      
      // Convert our frontend User type to backend expected format
      const apiData = {
        name: updatedData.name,
        email: updatedData.email,
        avatar: updatedData.avatar,
        phone: updatedData.phone,
        birthday: updatedData.birthday,
        address: updatedData.address,
        bio: updatedData.bio,
        language: updatedData.language,
        // Add other fields as needed based on what your API accepts
      };
      
      // Call API to update user details
      await api.put(USER_PROFILE.UPDATE_PROFILE, apiData);
      
      // Update local state with new data
      setUser(prev => ({ ...prev, ...updatedData }));
      
      // Check if profile is now complete
      const updatedUser = { ...user, ...updatedData };
      const essentialFields = [updatedUser.name, updatedUser.email];
      const isComplete = essentialFields.every(field => field && field.trim() !== "");
      setIsProfileComplete(isComplete);
      
      return true;
    } catch (err) {
      console.error("Error updating user details:", err);
      setError(err instanceof Error ? err.message : "Failed to update user details");
      return false;
    }
  };

  // Handle saving profile information
  const handleSaveProfile = async (formData: Partial<User>) => {
    const success = await updateUserDetails(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(emptyUser);
      router.replace("/auth");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return {
    user,
    isEditing,
    activeTab,
    isLoading,
    error,
    isProfileComplete,
    setIsEditing,
    setActiveTab,
    handleSaveProfile,
    handleLogout,
    fetchUserDetails,
  };
}
