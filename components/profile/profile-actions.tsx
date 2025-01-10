"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";
import { chinniMainSliceReset } from "@/lib/redux/features/chinniMain/chinniMainSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import axios from "axios";

export function ProfileActions() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoggedIn, authToken } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const handleLogout = () => {
    dispatch(chinniMainSliceReset());
    // Add logout logic here
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/delete-account`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response?.status === 200) {
        router.push("/");
        setTimeout(() => {
          dispatch(chinniMainSliceReset());
        }, 500);
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("An error occurred while deleting the account", error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4"
    >
      <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">Account Actions</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full group hover:bg-secondary/50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
            Logout
          </Button>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full group hover:bg-destructive/90"
              >
                <Trash2 className="mr-2 h-4 w-4 group-hover:text-destructive-foreground transition-colors" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
