"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Users, Plus, Coffee, BookOpen, Mountain, Filter, ChevronDown, Leaf } from "lucide-react";
import { ShareStoryDialog } from "@/components/share-story-dialog";
import { StoryCard } from "@/components/story-card";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/language-toggle";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { communityLocations, CommunityLocation } from "@/lib/locations";
import { SuggestSpaceDialog } from "@/components/suggest-space-dialog";

// Sample stories data with Southeast Seattle neighborhoods
const featuredStories = [
  {
    id: 1,
    title: "The Community Garden That Bridges Languages",
    excerpt: "When I started the garden behind the Othello Light Rail station, neighbors from Somalia, Vietnam, and Mexico began sharing seeds and stories. Now we have a little UN of vegetables growing together...",
    author: "Amina H.",
    neighborhood: "Othello",
    tags: ["Community", "Gardening", "Light Rail", "Languages"],
    emotionTags: ["Joy", "Gratitude", "Resilience"],
    likes: 24,
    responses: 8,
    interested: 2,
    hasPhotos: true
  },
  {
    id: 2,
    title: "From Refugee to Restaurant Owner",
    excerpt: "Arriving from Eritrea with nothing, I worked three jobs while learning English at South Seattle College. Now my restaurant on Rainier Avenue serves injera to neighbors who've become family...",
    author: "Tekle M.",
    neighborhood: "Columbia City",
    tags: ["Immigration", "Business", "Food", "Community"],
    emotionTags: ["Pride", "Resilience"],
    likes: 31,
    responses: 12,
    interested: 5,
    hasPhotos: true
  },
  {
    id: 3,
    title: "Finding Home in Seward Park",
    excerpt: "After my divorce, walking the loop at Seward Park became my therapy. Then I met other solo walkers, and we formed an informal support group that meets every Saturday morning by the lake...",
    author: "Jennifer L.",
    neighborhood: "Seward Park",
    tags: ["Mental Health", "Nature", "Support", "Walking"],
    emotionTags: ["Loneliness", "Joy"],
    likes: 18,
    responses: 6,
    interested: 1,
    hasPhotos: false
  },
  {
    id: 4,
    title: "The Mosque That Opened Its Doors",
    excerpt: "When our mosque started hosting interfaith dinners, I was nervous. But watching my Christian neighbor help serve halal food while my kids played with theirs—that's when I knew we were building something beautiful...",
    author: "Fatima A.",
    neighborhood: "Rainier Beach",
    tags: ["Faith", "Community", "Interfaith", "Children"],
    emotionTags: ["Gratitude", "Joy", "Pride"],
    likes: 42,
    responses: 15,
    interested: 7,
    hasPhotos: true
  }
];

export default function Home() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSuggestSpaceDialog, setShowSuggestSpaceDialog] = useState(false);
  const [locationPrompts, setLocationPrompts] = useState<any>(null);
  const { t } = useLanguage();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const getLocationData = (locationSlug: string) => {
    const location = communityLocations.find(loc => loc.slug === locationSlug);
    if (location) {
      // For now, only Seward Park has specific prompts defined in the prompt.
      // In a real app, this would be more dynamic based on location.
      if (location.slug === 'seward-park') {
        return {
          name: location.name,
          prompts: [
            {
              title: 'locationMemoryTitle',
              description: 'locationMemoryDescription',
            },
            {
              title: 'someoneWhoLeftTitle',
              description: 'someoneWhoLeftDescription',
            },
            {
              title: 'newcomersKnewTitle',
              description: 'newcomersKnewDescription',
            },
          ],
        };
      }
      return { name: location.name, prompts: [] }; // Default empty prompts for other locations
    }
    return null;
  };

  // Check for location-specific prompts from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    if (location) {
      setLocationPrompts(getLocationData(location));
    } else {
      setLocationPrompts(null); // Clear location prompts if no location in URL
    }
  }, []);

  const allEmotionTags = [...new Set(featuredStories.flatMap(story => story.emotionTags || []))];

  const handleFilterToggle = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const storiesToDisplay = useMemo(() => {
    let stories = [...featuredStories];
    
    // Sort by location if a location is active
    if (locationPrompts) {
      const locationName = locationPrompts.name;
      const locationStories = stories.filter(s => s.neighborhood === locationName);
      const otherStories = stories.filter(s => s.neighborhood !== locationName);
      stories = [...locationStories, ...otherStories];
    }

    // Filter by emotion tags
    if (activeFilters.length > 0) {
      return stories.filter(story => 
        story.emotionTags?.some(tag => activeFilters.includes(tag))
      );
    }

    return stories;
  }, [locationPrompts, activeFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{t('headerTitle')}</h1>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate">
                  <Mountain className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{t('tagline')}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <LanguageToggle />
              <Button 
                onClick={() => setShowShareDialog(true)}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 flex-shrink-0"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('shareYourStory')}</span>
                <span className="sm:hidden">{t('share')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {locationPrompts && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {t('storiesFrom')} {locationPrompts.name}
            </h3>
            <p className="text-sm text-gray-700">
              {t('locationBannerText')}
            </p>
          </div>
        )}

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            {t('welcomeTitle')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('welcomeSubtitle')}
          </p>
        </div>

        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Stories
            </h3>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 self-start sm:self-auto">
              {t('location')}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-gray-700 mb-6">
                <Filter className="w-4 h-4 mr-2 text-rose-600" />
                {t('filterByEmotion')}
                {activeFilters.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    ({activeFilters.length} selected)
                  </span>
                )}
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-56 p-2">
              <DropdownMenuLabel>{t('emotionTagsTitle')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-wrap gap-2 p-1">
                {allEmotionTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={activeFilters.includes(tag) ? 'default' : 'outline'}
                    onClick={() => handleFilterToggle(tag)}
                    className={`cursor-pointer ${activeFilters.includes(tag) ? 'bg-rose-500 text-white' : 'bg-white hover:bg-rose-100 border-rose-200 text-rose-800'}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {storiesToDisplay.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">89</div>
              <div className="text-xs sm:text-sm text-gray-600">{t('seattleNeighborsConnected')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">67</div>
              <div className="text-xs sm:text-sm text-gray-600">{t('storiesShared')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-slate-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">18</div>
              <div className="text-xs sm:text-sm text-gray-600">{t('communityMeetups')}</div>
              <div className="text-xs text-gray-500 mt-1">{t('meetupLocations')}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-200 mt-8 sm:mt-12">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('readyToShareTitle')}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
              {t('readyToShareSubtitle')}
            </p>
            <div className="mb-4 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 rounded-full mb-2">
                <Coffee className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm text-green-700 font-medium">
                  {t('shareAnonymously')}
                </span>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={() => setShowShareDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('shareYourStory')}
            </Button>
          </CardContent>
        </Card>

        <section className="mt-8 sm:mt-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {t('weGatherToListen')}
            </h2>
          </div>

          <div className="mb-8">
            <ul className="space-y-2 text-lg text-gray-700 max-w-md mx-auto">
              {communityLocations.map((location) => (
                <li key={location.slug} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{location.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setShowSuggestSpaceDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('suggestSpaceTitle')}
            </Button>
          </div>
        </section>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-800 text-center leading-relaxed">
            <strong>{t('safeConnections')}</strong> {t('safeConnectionsDetails')}
          </p>
        </div>
      </main>

      <ShareStoryDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog}
        locationPrompts={locationPrompts}
      />

      <SuggestSpaceDialog
        open={showSuggestSpaceDialog}
        onOpenChange={setShowSuggestSpaceDialog}
      />
    </div>
  );
}