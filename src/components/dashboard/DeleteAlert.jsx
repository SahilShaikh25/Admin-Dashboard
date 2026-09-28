import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DeleteAlert({ open, onConfirm, onCancel, isError=false, errorMessage="" }) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isError ? "Error" : "Delete Product"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isError ? errorMessage : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end">
          {!isError && <AlertDialogCancel>Cancel</AlertDialogCancel>}
          <AlertDialogAction onClick={onConfirm} className={isError ? "bg-black hover:bg-gray-600" : "bg-red-600"}>
            {isError ? "OK" : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}