
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function MoodTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [moodName, setMoodName] = useState('');
  const [moodValue, setMoodValue] = useState(5);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: moods, isLoading } = useQuery({
    queryKey: ['moods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addMood = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('moods')
        .insert({
          user_id: user.id,
          mood_name: moodName,
          mood_value: moodValue,
          notes: notes || null,
          recorded_at: selectedDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
      setMoodName('');
      setMoodValue(5);
      setNotes('');
      toast.success('Mood logged successfully!');
    },
    onError: (error) => {
      toast.error(`Error logging mood: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodName.trim()) {
      toast.error('Please enter a mood');
      return;
    }
    addMood.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mood">Mood</Label>
                  <Input
                    id="mood"
                    value={moodName}
                    onChange={(e) => setMoodName(e.target.value)}
                    placeholder="e.g., Happy, Anxious, Calm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating (1-10)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="10"
                    value={moodValue}
                    onChange={(e) => setMoodValue(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes about your mood..."
                  />
                </div>

                <Button type="submit" disabled={addMood.isPending}>
                  {addMood.isPending ? 'Logging...' : 'Log Mood'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Moods</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading moods...</p>
          ) : moods && moods.length > 0 ? (
            <div className="space-y-4">
              {moods.slice(0, 10).map((mood) => (
                <div key={mood.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{mood.mood_name}</h4>
                      <p className="text-sm text-gray-600">
                        Rating: {mood.mood_value}/10
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(mood.recorded_at), 'PPp')}
                      </p>
                      {mood.notes && (
                        <p className="text-sm mt-2">{mood.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No moods logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
