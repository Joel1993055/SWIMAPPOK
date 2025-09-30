'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClubsStore } from '@/core/stores/clubs-store';
import { Building2, Plus, Trash2, User } from 'lucide-react';

export function ClubsTab() {
  const { clubs, teams } = useClubsStore();

  const handleCreateClub = () => {
    // TODO: Implement club creation modal
    console.log('Create club requested');
  };

  const handleDeleteClub = (clubId: string) => {
    // TODO: Implement club deletion with confirmation
    console.log('Delete club requested:', clubId);
  };

  const handleCreateTeam = () => {
    // TODO: Implement team creation modal
    console.log('Create team requested');
  };

  const handleDeleteTeam = (teamId: string) => {
    // TODO: Implement team deletion with confirmation
    console.log('Delete team requested:', teamId);
  };

  return (
    <div className="space-y-6">
      {/* Clubs */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Clubs
          </CardTitle>
          <CardDescription>Manage swimming clubs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registered Clubs</h3>
            <Button size="sm" className="gap-2" onClick={handleCreateClub}>
              <Plus className="h-4 w-4" />
              New Club
            </Button>
          </div>

          <div className="space-y-3">
            {clubs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No clubs registered</p>
                <p className="text-sm">Create your first club to start</p>
              </div>
            ) : (
              clubs.map(club => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{club.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {club.location}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClub(club.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Teams
          </CardTitle>
          <CardDescription>Manage teams for each club</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registered Teams</h3>
            <Button size="sm" className="gap-2" onClick={handleCreateTeam}>
              <Plus className="h-4 w-4" />
              New Team
            </Button>
          </div>

          <div className="space-y-3">
            {teams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No teams registered</p>
                <p className="text-sm">
                  Create teams to organize swimmers
                </p>
              </div>
            ) : (
              teams.map(team => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {team.category}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
