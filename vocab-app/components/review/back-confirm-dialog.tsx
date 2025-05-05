"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type BackConfirmDialogProps = {
    onBack?: () => void;
};

export function BackConfirmDialog({ onBack }: BackConfirmDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const handleBack = () => {
        setDialogOpen(true);
    };

    const handleConfirm = () => {
        if (onBack) {
            onBack();
            router.push("/review");
        }
        setDialogOpen(false);
    };

    return (
        <>
            <button
                onClick={handleBack}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xác nhận thoát</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn quay lại? Tiến trình ôn tập hiện tại sẽ bị mất.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm}>
                            Xác nhận thoát
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
