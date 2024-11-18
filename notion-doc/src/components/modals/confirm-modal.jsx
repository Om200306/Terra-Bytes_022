import { AlertDialog ,
    AlertDialogAction,AlertDialogCancel
  ,AlertDialogContent,AlertDialogDescription
  ,AlertDialogFooter,AlertDialogHeader,
AlertDialogTitle,AlertDialogTrigger

} from "../ui/alert-dialog"

import React from "react"

export function ConfirmModal({ children, onConfirm }){

    const handleConfirm = (e) => {
        e.stopPropagation();
        onConfirm();  // Calls the onConfirm handler passed as a prop
      };

      const handleCancel = (e) => {
        e.stopPropagation(); // Stops event propagation for Cancel button click
      };
    
      return (
        <AlertDialog>
          <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
            {children}  {/* The button or element that triggers the modal */}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
}