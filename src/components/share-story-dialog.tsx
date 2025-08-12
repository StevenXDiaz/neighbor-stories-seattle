"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Sparkles, Send, Coffee, Mail, Phone, MapPin, X, BookOpen, Utensils, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TranslationKey = keyof typeof import("@/lib/translations/en").default;
type ResidencyStatus = 'current' | 'former' | 'visitor';

interface ShareStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationPrompts?: {
    name: string;
    prompts: Array<{
      title: string;
      description: string;
    }>;
  } | null;
}

const defaultStoryPrompts = [
  {
    icon: BookOpen,
    title: "rainierValleyMemoryTitle",
    description: "rainierValleyMemoryDescription",
    color: "text-blue-500 bg-blue-50"
  },
  {
    icon: Utensils,
    title: "neighborhoodFoodTitle",
    description: "neighborhoodFoodDescription",
    color: "text-orange-500 bg-orange-50"
  },
  {
    icon: Star,
    title: "neighborhoodDreamTitle",
    description: "neighborhoodDreamDescription",
    color: "text-purple-500 bg-purple-50"
  }
];

const wordBank = [
  "Light rail", "Property taxes", "Neighbors", "A passing Moment", 
  "Grandmothers Garden", "Hope", "New Developers", "Gratitude", 
  "Languages Lost", "Wildlife Sighting", "Rent Doubled", "Friendly Moment", 
  "Then and Now", "Kubota Garden", "Seward Park", "Rainier Avenue"
];

const predefinedEmotions: TranslationKey[] = ["Loneliness", "Pride", "Resilience", "Joy", "Shock", "Gratitude"];

export function ShareStoryDialog({ open, onOpenChange, locationPrompts }: ShareStoryDialogProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [story, setStory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [wantsMeetupNotifications, setWantsMeetupNotifications] = useState(false);
  const [residencyStatus, setResidencyStatus] = useState<ResidencyStatus>('current'); // Changed to ResidencyStatus
  const [currentLocation, setCurrentLocation] = useState("");
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { t } = useLanguage();

  const handleWordBankClick = (word: string) => {
    setStory(prev => prev ? `${prev} ${word}` : word);
  };

  const handleEmotionTagToggle = (tag: string) => {
    setEmotionTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !emotionTags.includes(customTag.trim())) {
      setEmotionTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEmotionTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleSubmit = () => {
    console.log("Story submitted:", { 
      selectedPrompt, 
      story, 
      authorName, 
      isAnonymous,
      wantsMeetupNotifications,
      residencyStatus, // Updated
      currentLocation: residencyStatus !== 'current' ? currentLocation : null, // Updated
      emotionTags,
      contactMethod: wantsMeetupNotifications ? contactMethod : null,
      email: wantsMeetupNotifications && contactMethod === 'email' ? email : '',
      phone: wantsMeetupNotifications && contactMethod === 'phone' ? phone : '',
      locationPrompts: locationPrompts?.name || null
    });
    onOpenChange(false);
    // Reset form
    setSelectedPrompt(null);
    setStory("");
    setAuthorName("");
    setIsAnonymous(false);
    setWantsMeetupNotifications(false);
    setResidencyStatus('current'); // Reset to default
    setCurrentLocation("");
    setEmail("");
    setPhone("");
    setEmotionTags([]);
    setCustomTag("");
    setContactMethod("email"); // Reset contact method
  };

  const isValid = story.trim() && (
    !wantsMeetupNotifications || 
    (contactMethod === 'email' && email.trim()) ||
    (contactMethod === 'phone' && phone.trim())
  ) && (
    residencyStatus === 'current' || currentLocation.trim() // Updated validation
  );

  const basePrompts = defaultStoryPrompts.map((p) => ({
    ...p,
    title: t(p.title as TranslationKey),
    description: t(p.description as TranslationKey),
  }));

  const prompts = locationPrompts
    ? [
        ...locationPrompts.prompts.map((prompt) => ({
          icon: MapPin,
          title: t(prompt.title as TranslationKey),
          description: t(prompt.description as TranslationKey),
          color: "text-emerald-500 bg-emerald-50",
        })),
        ...basePrompts,
      ]
    : basePrompts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-3 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            {t('shareStoryDialogTitle')}
            {locationPrompts && (
              <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 text-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {locationPrompts.name}
              </Badge>
            )}
          </DialogTitle>
          <p className="text-sm sm:text-base text-gray-600">
            {locationPrompts 
              ? t('shareStoryDialogLocationPrompt', { locationName: locationPrompts.name })
              : t('shareStoryDialogDefaultPrompt')
            }
          </p>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
              {locationPrompts ? t('storyPromptsTitleLocation', { locationName: locationPrompts.name }) : t('storyPromptsTitle')}
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {prompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPrompt === index 
                        ? 'ring-2 ring-emerald-400 bg-emerald-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPrompt(selectedPrompt === index ? null : index)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${prompt.color} flex-shrink-0`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                            {prompt.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {prompt.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              {t('yourStoryLabel')}
            </label>
            <Textarea
              placeholder={t('yourStoryPlaceholder')}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
            />
          </div>

          <div className="p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
              {t('wordBankTitle')}
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {wordBank.map((word) => (
                <Badge 
                  key={word} 
                  variant="outline" 
                  className="cursor-pointer bg-white hover:bg-blue-100 border-blue-200 text-blue-800"
                  onClick={() => handleWordBankClick(word)}
                >
                  {word}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-rose-50/50 rounded-lg border border-rose-200">
            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              {t('emotionTagsTitle')}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
              {t('emotionTagsDescription')}
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {predefinedEmotions.map((emotion) => (
                <Badge
                  key={emotion}
                  variant={emotionTags.includes(t(emotion)) ? 'default' : 'outline'}
                  onClick={() => handleEmotionTagToggle(t(emotion))}
                  className={`cursor-pointer ${emotionTags.includes(t(emotion)) ? 'bg-rose-500 text-white' : 'bg-white hover:bg-rose-100 border-rose-200 text-rose-800'}`}
                >
                  {t(emotion)}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
              {emotionTags.filter(tag => !predefinedEmotions.map(e => t(e)).includes(tag)).map(tag => (
                <Badge key={tag} className="bg-rose-500 text-white">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 rounded-full hover:bg-black/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Input
                placeholder={t('addYourOwn')}
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomTag(); }}}
                className="text-sm sm:text-base"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCustomTag}>{t('addTag')}</Button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {t('howToBeKnown')}
              </label>
              <Input
                placeholder={t('howToBeKnownPlaceholder')}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 mt-0.5 flex-shrink-0"
              />
              <label htmlFor="anonymous" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {t('shareAnonymouslyCheckbox')}
              </label>
            </div>
          </div>

          {/* Updated: Lives in neighborhood question with radio buttons */}
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
              {t('livesInNeighborhoodQuestion')}
            </h4>
            <RadioGroup
              value={residencyStatus}
              onValueChange={(value: ResidencyStatus) => setResidencyStatus(value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="residency-current" />
                <Label htmlFor="residency-current" className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  {t('residencyCurrent')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="former" id="residency-former" />
                <Label htmlFor="residency-former" className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  {t('residencyFormer')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="visitor" id="residency-visitor" />
                <Label htmlFor="residency-visitor" className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  {t('residencyVisitor')}
                </Label>
              </div>
            </RadioGroup>

            {(residencyStatus === 'former' || residencyStatus === 'visitor') && (
              <div className="mt-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t('whereDoYouLiveNowQuestion')}
                </label>
                <Input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder={t('whereDoYouLiveNowPlaceholder')}
                  className="text-sm sm:text-base"
                />
              </div>
            )}
          </div>

          {!isAnonymous && (
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2 sm:gap-3">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                    {t('wantToMeet')}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                    {t('wantToMeetDescription')}
                  </p>
                  
                  <div className="flex items-start gap-2 mb-3 sm:mb-4">
                    <input
                      type="checkbox"
                      id="meetup-notifications"
                      checked={wantsMeetupNotifications}
                      onChange={(e) => setWantsMeetupNotifications(e.target.checked)}
                      className="rounded border-gray-300 text-green-500 focus:ring-green-400 mt-0.5 flex-shrink-0"
                    />
                    <label htmlFor="meetup-notifications" className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                      {t('notifyMeCheckbox')}
                    </label>
                  </div>

                  {wantsMeetupNotifications && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          {t('howShouldWeNotifyYou')}
                        </label>
                        <div className="flex gap-2">
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
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            {t('emailAddress')}
                          </label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('emailPlaceholder')}
                            className="text-sm sm:text-base"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            {t('phoneNumber')}
                          </label>
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('phonePlaceholder')}
                            className="text-sm sm:text-base"
                          />
                        </div>
                      )}

                      <p className="text-xs text-green-700 leading-relaxed">
                        {t('notificationHint')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <strong>{t('yourSafetyMatters')}</strong> {t('yourSafetyMattersDetails')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-sm sm:text-base"
            >
              <Send className="w-4 h-4 mr-2" />
              {t('shareMyStory')}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:w-auto text-sm sm:text-base"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}