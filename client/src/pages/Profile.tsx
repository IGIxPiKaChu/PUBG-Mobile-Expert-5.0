import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import WeaponChart from "@/components/WeaponChart";
import { User, Sword, MapPin, Target, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    id: localStorage.getItem("profileId") || "",
    currentSeason: "Season 31",
    playstyle: "Aggressive",
    favoriteWeapons: ["M416", "Kar98k", "UMP45"],
    preferredMaps: ["Erangel", "Miramar"],
    currentChallenges: ["Close combat", "Late game positioning"],
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profileId = localStorage.getItem("profileId");
      if (!profileId) return;

      try {
        const response = await fetch(`/api/profile?id=${profileId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            id: data.id,
            currentSeason: data.currentSeason,
            playstyle: data.playstyle,
            favoriteWeapons: data.favoriteWeapons,
            preferredMaps: data.preferredMaps,
            currentChallenges: data.currentChallenges,
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    loadProfile();
  }, []);

  const playstyles = ["Aggressive", "Passive", "Balanced"];
  const weapons = ["M416", "AKM", "Kar98k", "AWM", "UMP45", "Vector", "M762"];
  const maps = ["Erangel", "Miramar", "Sanhok", "Vikendi", "Livik"];
  const challenges = [
    "Close combat",
    "Long range",
    "Late game positioning",
    "Hot drops",
    "Vehicle combat",
  ];

  const handleSave = async () => {
    setEditing(false);
    
    try {
      const method = profile.id ? "PATCH" : "POST";
      const url = profile.id ? `/api/profile?id=${profile.id}` : "/api/profile";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentSeason: profile.currentSeason,
          playstyle: profile.playstyle,
          favoriteWeapons: profile.favoriteWeapons,
          preferredMaps: profile.preferredMaps,
          currentChallenges: profile.currentChallenges,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const result = await response.json();
      if (result.id && !profile.id) {
        localStorage.setItem("profileId", result.id);
        setProfile({ ...profile, id: result.id });
      }

      toast({
        title: "Profile updated",
        description: "Your preferences have been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  //TODO: Remove mock functionality - replace with real weapon stats
  const weaponEvolution = [
    { version: "2.0", damage: 41, recoil: 35, fireRate: 75 },
    { version: "2.1", damage: 43, recoil: 38, fireRate: 75 },
    { version: "2.2", damage: 43, recoil: 32, fireRate: 78 },
    { version: "2.3", damage: 45, recoil: 30, fireRate: 78 },
    { version: "2.4", damage: 45, recoil: 28, fireRate: 80 },
  ];

  const toggleSelection = (category: keyof typeof profile, item: string) => {
    if (!editing) return;
    const current = profile[category];
    if (Array.isArray(current)) {
      const newValue = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      setProfile({ ...profile, [category]: newValue });
    }
  };

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-heading font-bold">Your Profile</h1>
          <div className="flex items-center gap-2">
            {editing ? (
              <Button size="sm" onClick={handleSave} data-testid="button-save-profile">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                data-testid="button-edit-profile"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Player Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Current Season</Label>
              <p className="font-medium" data-testid="text-current-season">
                {profile.currentSeason}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Play Style</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {playstyles.map((style) => (
                  <Badge
                    key={style}
                    variant={profile.playstyle === style ? "default" : "outline"}
                    className={editing ? "cursor-pointer" : ""}
                    onClick={() =>
                      editing && setProfile({ ...profile, playstyle: style })
                    }
                    data-testid={`badge-playstyle-${style.toLowerCase()}`}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Weapons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Favorite Weapons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {weapons.map((weapon) => (
                <Badge
                  key={weapon}
                  variant={
                    profile.favoriteWeapons.includes(weapon) ? "default" : "outline"
                  }
                  className={editing ? "cursor-pointer" : ""}
                  onClick={() => toggleSelection("favoriteWeapons", weapon)}
                  data-testid={`badge-weapon-${weapon.toLowerCase()}`}
                >
                  {weapon}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferred Maps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Preferred Maps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {maps.map((map) => (
                <Badge
                  key={map}
                  variant={profile.preferredMaps.includes(map) ? "default" : "outline"}
                  className={editing ? "cursor-pointer" : ""}
                  onClick={() => toggleSelection("preferredMaps", map)}
                  data-testid={`badge-map-${map.toLowerCase()}`}
                >
                  {map}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {challenges.map((challenge) => (
                <Badge
                  key={challenge}
                  variant={
                    profile.currentChallenges.includes(challenge)
                      ? "default"
                      : "outline"
                  }
                  className={editing ? "cursor-pointer" : ""}
                  onClick={() => toggleSelection("currentChallenges", challenge)}
                  data-testid={`badge-challenge-${challenge.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {challenge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weapon Stats */}
        <WeaponChart
          weaponName="M416"
          data={weaponEvolution}
          testId="weapon-chart-m416"
        />
      </div>
    </div>
  );
}
