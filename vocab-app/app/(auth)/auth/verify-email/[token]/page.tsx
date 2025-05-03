"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH } from "@/constants/api-endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PageProps {
  params: {
    token: string;
  };
}

export default function VerifyEmailPage({ params }: PageProps) {
  const { token } = params;
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(AUTH.VERIFY_EMAIL(token), {
          method: "GET",
        });

        if (response.ok) {
          setSuccess(true);
          // Redirect to login after 3 seconds on success
          setTimeout(() => {
            router.push("/auth");
          }, 2000);
        } else {
          const data = await response.json();
          setError(data.message || "Email verification failed. Please try again.");
        }
      } catch (error) {
        setError("An error occurred during verification. Please try again later.");
        console.error("Verification error:", error);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center from-background to-muted px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-lg overflow-hidden">
          <div className="absolute inset-0 from-primary/5 to-secondary/5 pointer-events-none" />

          <CardHeader className="text-center border-b pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Email Verification
            </h1>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            {verifying ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
                <p className="text-lg font-medium">
                  Verifying your email address...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This may take a moment
                </p>
              </motion.div>
            ) : success ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full blur-md"
                  />
                  <CheckCircle className="h-16 w-16 text-green-500 relative z-10" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-green-600 dark:text-green-400">
                  Email Verified Successfully!
                </h2>
                <p className="text-muted-foreground max-w-xs">
                  Your email has been verified. You will be redirected to the login
                  page shortly.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full blur-md"
                  />
                  <AlertCircle className="h-16 w-16 text-destructive relative z-10" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-destructive">
                  Verification Failed
                </h2>
                <p className="text-muted-foreground max-w-xs">{error}</p>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center p-6 pt-2 border-t">
            {!verifying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <Button
                  onClick={() => router.push(success ? "/auth" : "/")}
                  className={`w-full font-medium ${
                    success
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  }`}
                  size="lg"
                >
                  {success ? "Go to Login" : "Return to Homepage"}
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
