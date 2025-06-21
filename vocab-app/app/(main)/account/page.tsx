"use client"

import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, CreditCard, BookOpen } from 'lucide-react'

import { useAccount } from "../../../hooks/use-account"
import { UserSidebar } from "./components/user-sidebar"
import { UserProfile } from "./components/user-profile"
import { SecuritySettings } from "./components/security-settings"
import { NotificationSettings } from "./components/notification-settings"
import { BillingInfo } from "./components/billing-info"
import { LearningProgress } from "./components/learning-progress"

// Animations
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function AccountPage() {
  const {
    user,
    isEditing,
    activeTab,
    setIsEditing,
    setActiveTab,
    handleSaveProfile,
    handleLogout
  } = useAccount()

  return (
    <motion.div
      className="container py-6 px-3 md:px-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        variants={cardAnimation}
      >
        Tài khoản của tôi
      </motion.h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <motion.div
          className="col-span-12 md:col-span-4 lg:col-span-3"
          variants={cardAnimation}
        >
          <UserSidebar user={user} handleLogout={handleLogout} />
        </motion.div>

        {/* Main content */}
        <motion.div
          className="col-span-12 md:col-span-8 lg:col-span-9"
          variants={cardAnimation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs
            defaultValue="profile"
            className="w-full"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="w-full grid grid-cols-5 mb-6">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <TabsTrigger value="profile" className="w-full px-2.5 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">Thông tin cá nhân</span>
                  <span className="hidden sm:inline xl:hidden">Cá nhân</span>
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <TabsTrigger value="security" className=" w-full px-2.5 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">Bảo mật</span>
                  <span className="hidden sm:inline xl:hidden">Bảo mật</span>
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <TabsTrigger value="notifications" className=" w-full px-2.5 flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">Thông báo</span>
                  <span className="hidden sm:inline xl:hidden">Thông báo</span>
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <TabsTrigger value="billing" className="w-full px-2.5 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">Thanh toán</span>
                  <span className="hidden sm:inline xl:hidden">Thanh toán</span>
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <TabsTrigger value="progress" className="w-full px-2.5 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">Tiến độ học tập</span>
                  <span className="hidden sm:inline xl:hidden">Tiến độ</span>
                </TabsTrigger>
              </motion.div>
            </TabsList>

            <AnimatePresence mode="wait">
              {/* Thông tin cá nhân */}
              <TabsContent value="profile">
                <UserProfile
                  user={user}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleSaveProfile={(formData: Partial<User>) => handleSaveProfile(formData)}
                />
              </TabsContent>

              {/* Bảo mật */}
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>

              {/* Thông báo */}
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>

              {/* Thanh toán */}
              <TabsContent value="billing">
                <BillingInfo user={user} />
              </TabsContent>

              {/* Tiến độ học tập */}
              <TabsContent value="progress">
                <LearningProgress user={user} />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}
