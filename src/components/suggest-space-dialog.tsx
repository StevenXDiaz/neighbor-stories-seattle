"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface SuggestSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuggestSpaceDialog({ open, onOpenChange }: SuggestSpaceDialogProps) {
  const [spaceSuggestion, setSpaceSuggestion] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      console.log("Space suggestion submitted:", { spaceSuggestion, email });
      toast.success(t('suggestionSuccess'));
      setSpaceSuggestion("");
      setEmail("");
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error("Failed to submit space suggestion:", error);
      toast.error(t('suggestionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('suggestSpaceTitle')}</DialogTitle>
          <DialogDescription>
            {t('suggestSpaceDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <label htmlFor="spaceSuggestion" className="block font-semibold text-gray-900 mb-2 text-sm">
              {t('spaceSuggestionLabel')}
            </label>
            <Textarea
              id="spaceSuggestion"
              placeholder={t('spaceSuggestionPlaceholder')}
              value={spaceSuggestion}
              onChange={(e) => setSpaceSuggestion(e.target.value)}
              required
              className="min-h-[100px] resize-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-900 mb-2 text-sm">
              {t('optionalEmailLabel')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('optionalEmailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !spaceSuggestion.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? t('submitting') : t('submitSuggestion')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}