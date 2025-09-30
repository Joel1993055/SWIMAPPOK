'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClubsStore } from '@/core/stores/clubs-store';
import { Building2, Plus, Trash2, User } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';

export const ClubsTab = memo(function ClubsTab() {
  const { clubs, teams, addClub, removeClub, addTeam, removeTeam } = useClubsStore();
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [clubForm, setClubForm] = useState({ name: '', location: '' });
  const [teamForm, setTeamForm] = useState({ name: '', category: '' });

  const handleCreateClub = useCallback(async () => {
    if (!clubForm.name.trim() || !clubForm.location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newClub = {
        id: Date.now().toString(),
        name: clubForm.name,
        location: clubForm.location,
        createdAt: new Date().toISOString()
      };
      
      addClub(newClub);
      setClubForm({ name: '', location: '' });
      setIsClubModalOpen(false);
      toast.success('Club created successfully');
    } catch (error) {
      toast.error('Failed to create club');
    }
  }, [addClub]);

  const handleDeleteClub = useCallback(async (clubId: string) => {
    if (!confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(clubId);
      removeClub(clubId);
      toast.success('Club deleted successfully');
    } catch (error) {
      toast.error('Failed to delete club');
    } finally {
      setIsDeleting(null);
    }
  }, [removeClub]);

  const handleCreateTeam = useCallback(async () => {
    if (!teamForm.name.trim() || !teamForm.category.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newTeam = {
        id: Date.now().toString(),
        name: teamForm.name,
        category: teamForm.category,
        clubId: clubs[0]?.id || 'default',
        createdAt: new Date().toISOString()
      };
      
      addTeam(newTeam);
      setTeamForm({ name: '', category: '' });
      setIsTeamModalOpen(false);
      toast.success('Team created successfully');
    } catch (error) {
      toast.error('Failed to create team');
    }
  }, [addTeam, clubs]);

  const handleDeleteTeam = useCallback(async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(teamId);
      removeTeam(teamId);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
    } finally {
      setIsDeleting(null);
    }
  }, [removeTeam]);

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
            <Button size="sm" className="gap-2" onClick={() => setIsClubModalOpen(true)}>
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
                    disabled={isDeleting === club.id}
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
            <Button size="sm" className="gap-2" onClick={() => setIsTeamModalOpen(true)}>
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
                    disabled={isDeleting === team.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Club Creation Modal */}
      <Dialog open={isClubModalOpen} onOpenChange={setIsClubModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Club</DialogTitle>
            <DialogDescription>
              Add a new swimming club to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="club-name">Club Name</Label>
              <Input
                id="club-name"
                placeholder="Enter club name"
                value={clubForm.name}
                onChange={e => setClubForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-location">Location</Label>
              <Input
                id="club-location"
                placeholder="Enter club location"
                value={clubForm.location}
                onChange={e => setClubForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsClubModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClub}>
                Create Club
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Team Creation Modal */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Add a new team to your club
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="Enter team name"
                value={teamForm.name}
                onChange={e => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-category">Category</Label>
              <Input
                id="team-category"
                placeholder="Enter team category (e.g., Senior, Junior)"
                value={teamForm.category}
                onChange={e => setTeamForm(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTeamModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam}>
                Create Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
