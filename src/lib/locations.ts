export interface CommunityLocation {
  name: string;
  slug: string;
  type: 'Youth Center' | 'Park' | 'Coffee Shop';
  description: string;
}

export const communityLocations: CommunityLocation[] = [
  {
    name: "Urban Family",
    slug: "urban-family",
    type: "Youth Center",
    description: "Fosters leadership and healing for youth."
  },
  {
    name: "El Centro de la Raza",
    slug: "el-centro-de-la-raza",
    type: "Youth Center",
    description: "Fosters leadership and healing for youth."
  },
  {
    name: "SouthEast Youth & Family Services",
    slug: "southeast-youth-family-services",
    type: "Youth Center",
    description: "Fosters leadership and healing for youth."
  },
  {
    name: "RYBO (Rainier Beach: A Beautiful Safe Place for Youth)",
    slug: "rybo",
    type: "Youth Center",
    description: "Fosters leadership and healing for youth."
  },
  {
    name: "Seward Park",
    slug: "seward-park",
    type: "Park",
    description: "Not just a green space—it's a site for picnics, soccer games, multiracial events/gatherings/celebrations, martial arts lessons, and outdoor prayer circles."
  },
  {
    name: "Jefferson Park",
    slug: "jefferson-park",
    type: "Park",
    description: "Not just a green space—it's a site for picnics, soccer games, multiracial events/gatherings/celebrations, martial arts lessons, and outdoor prayer circles."
  },
  {
    name: "Othello Playground",
    slug: "othello-playground",
    type: "Park",
    description: "Not just a green space—it's a site for picnics, soccer games, multiracial events/gatherings/celebrations, martial arts lessons, and outdoor prayer circles."
  },
  {
    name: "Kubota Garden",
    slug: "kubota-garden",
    type: "Park",
    description: "Not just a green space—it's a site for picnics, soccer games, multiracial events/gatherings/celebrations, martial arts lessons, and outdoor prayer circles."
  },
  {
    name: "The Station Columbia City",
    slug: "the-station-columbia-city",
    type: "Coffee Shop",
    description: "A local coffee shop."
  },
  {
    name: "Empire Roasters & Records",
    slug: "empire-roasters-records",
    type: "Coffee Shop",
    description: "A local coffee shop."
  },
  {
    name: "Olympia Coffee Roasting",
    slug: "olympia-coffee-roasting",
    type: "Coffee Shop",
    description: "A local coffee shop."
  }
];