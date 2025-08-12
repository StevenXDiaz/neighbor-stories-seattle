"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Coffee } from "lucide-react"; // Removed Camera
import { useState } from "react";
import { InterestDialog } from "@/components/interest-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface Story {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  neighborhood: string; // Still in data, but not displayed on card
  tags: string[];
  likes: number;
  responses: number;
  interested?: number;
  // Removed hasPhotos?: boolean;
  emotionTags?: string[];
}

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [interestedCount, setInterestedCount] = useState(story.interested || 0);
  const { t } = useLanguage();

  const handleInterestSubmitted = () => {
    setInterestedCount(prev => prev + 1);
  };

  // Southeast Seattle neighborhood colors - function kept as it might be used elsewhere or for future features
  const getNeighborhoodColor = (neighborhood: string) => {
    const colors: { [key: string]: string } = {
      "Othello": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Columbia City": "bg-blue-100 text-blue-700 border-blue-200",
      "Seward Park": "bg-green-100 text-green-700 border-green-200",
      "Rainier Beach": "bg-teal-100 text-teal-700 border-teal-200",
      "Beacon Hill": "bg-slate-100 text-slate-700 border-slate-200",
      "Mount Baker": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Rainier Valley": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Georgetown": "bg-gray-100 text-gray-700 border-gray-200"
    };
    return colors[neighborhood] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h4 className="font-semibold text-gray-900 leading-tight flex-1">{story.title}</h4>
                {/* Removed hasPhotos badge from header */}
              </div>
              {/* Removed location tags from header */}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            {story.excerpt}
          </p>
          {/* Removed hasPhotos conditional rendering */}
          
          <div className="flex flex-wrap gap-1 mb-4">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                {tag}
              </Badge>
            ))}
          </div>

          {story.emotionTags && story.emotionTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {story.emotionTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {t('byAuthor', { author: story.author })}
            </div>
          </div>

          {/* Interest Section */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Removed interested count and Users icon */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInterestDialog(true)}
                className="text-xs h-8 px-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto"
              >
                <Coffee className="w-3 h-3 mr-1" />
                {t('iWantToHearMore')}
              </Button>
            </div>
            
            {interestedCount >= 3 && (
              <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
                <p className="text-xs text-green-700 font-medium">
                  {t('meetupThresholdReached')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <InterestDialog
        open={showInterestDialog}
        onOpenChange={setShowInterestDialog}
        storyTitle={story.title}
        storyAuthor={story.author}
        onInterestSubmitted={handleInterestSubmitted}
      />
    </>
  );
}