import type React from "react";
import { AlertCircle, Check} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type StatusType = "success" | "error";

interface StatusDialogProps {
  type?: StatusType;
  title: string;
  description: string;
  buttonText: string;
  onAction?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const statusConfig = {
  success: {
    icon: Check,
    className: "bg-[#518168]",
    lightClassName: "bg-[#518168]/10",
    buttonClassName: "bg-[#518168] hover:bg-[#518168]/90",
  },
  error: {
    icon: AlertCircle,
    className: "bg-[#F87171]",
    lightClassName: "bg-[#F87171]/10",
    buttonClassName: "bg-[#F87171] hover:bg-[#F87171]/90",
  },
};

const StatusDialog: React.FC<StatusDialogProps> = ({
  type = "success",
  title,
  description,
  buttonText,
  onAction,
  open,
  onOpenChange,
  trigger,
}) => {
  const {
    icon: Icon,
    className,
    lightClassName,
    buttonClassName,
  } = statusConfig[type];

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <div className="flex justify-center py-6">
        <div className={`rounded-full ${lightClassName} p-6`}>
          <div className={`rounded-full ${className} p-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        <DialogDescription className="text-center">
          {description}
        </DialogDescription>
      </DialogHeader>
      <DialogClose>
        <div className="mt-6">
          <Button
            className={`w-full h-auto rounded-lg !py-3 text-white ${buttonClassName}`}
            onClick={onAction}
          >
            {buttonText}
          </Button>
        </div>
      </DialogClose>
    </DialogContent>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || <button>Open Dialog</button>}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default StatusDialog;
