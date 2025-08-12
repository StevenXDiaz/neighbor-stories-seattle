"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Mail, Phone, Users, Trees } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface InterestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyTitle: string;
  storyAuthor: string;
  onInterestSubmitted: () => void;
}

export function InterestDialog({ 
  open, 
  onOpenChange, 
  storyTitle, 
  storyAuthor,
  onInterestSubmitted 
}: InterestDialogProps) {
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Interest submitted:", {
      storyTitle,
      storyAuthor,
      contactMethod,
      email: contactMethod === 'email' ? email : '',
      phone: contactMethod === 'phone' ? phone : '',
      name
    });

    onInterestSubmitted();
    onOpenChange(false);
    
    setEmail("");
    setPhone("");
    setName("");
  };

  const isValid = name.trim() && (
    (contactMethod === 'email' && email.trim()) ||
    (contactMethod === 'phone' && phone.trim())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-3 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            {t('joinTheStoryCircle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base leading-tight">"{storyTitle}"</h4>
              <p className="text-xs sm:text-sm text-gray-600">{t('byAuthor', { author: storyAuthor })}</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
              <Users className="w-4 h-4 text-emerald-600" />
              {t('howStoryCirclesWork')}
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-medium text-emerald-700 mt-0.5 flex-shrink-0">1</div>
                <span className="leading-relaxed">{t('storyCircleStep1', { author: storyAuthor })}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-medium text-emerald-700 mt-0.5 flex-shrink-0">2</div>
                <span className="leading-relaxed">{t('storyCircleStep2', { author: storyAuthor })}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-medium text-emerald-700 mt-0.5 flex-shrink-0">3</div>
                <span className="leading-relaxed">{t('storyCircleStep3')}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs sm:text-sm">{t('yourFirstName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('yourFirstNamePlaceholder')}
                className="mt-1 text-sm sm:text-base"
              />
            </div>

            <div>
              <Label className="text-xs sm:text-sm">{t('howToNotify')}</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={contactMethod === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContactMethod('email')}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {t('email')}
                </Button>
                <Button
                  type="button"
                  variant={contactMethod === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContactMethod('phone')}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {t('text')}
                </Button>
              </div>
            </div>

            {contactMethod === 'email' ? (
              <div>
                <Label htmlFor="email" className="text-xs sm:text-sm">{t('emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="phone" className="text-xs sm:text-sm">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
            )}

            <div className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2 mb-2">
                <Trees className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-800 font-medium">{t('meetingSpots')}</p>
              </div>
              <p className="text-xs text-green-700 leading-relaxed ml-6">
                {t('meetingSpotsExamples')}
              </p>
            </div>

            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>{t('privacyFirst')}</strong> {t('privacyFirstDetails', { author: storyAuthor, name })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="submit"
                disabled={!isValid}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-sm sm:text-base"
              >
                {t('expressInterest')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="sm:w-auto text-sm sm:text-base"
              >
                {t('cancel')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}