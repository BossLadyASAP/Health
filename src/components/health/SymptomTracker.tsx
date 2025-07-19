
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

export function SymptomTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: symptoms, isLoading } = useQuery({
    queryKey: ['symptoms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addSymptom = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('symptoms')
        .insert({
          user_id: user.id,
          symptom_name: symptomName,
          severity,
          notes: notes || null,
          recorded_at: selectedDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['symptoms'] });
      setSymptomName('');
      setSeverity(5);
      setNotes('');
      toast.success('Symptom logged successfully!');
    },
    onError: (error) => {
      toast.error(`Error logging symptom: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomName.trim()) {
      toast.error('Please enter a symptom');
      return;
    }
    addSymptom.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Symptoms</CardTitle>
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
                  <Label htmlFor="symptom">Symptom</Label>
                  <Input
                    id="symptom"
                    value={symptomName}
                    onChange={(e) => setSymptomName(e.target.value)}
                    placeholder="e.g., Headache, Nausea, Fatigue"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="severity">Severity (1-10)</Label>
                  <Input
                    id="severity"
                    type="number"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional details about the symptom..."
                  />
                </div>

                <Button type="submit" disabled={addSymptom.isPending}>
                  {addSymptom.isPending ? 'Logging...' : 'Log Symptom'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading symptoms...</p>
          ) : symptoms && symptoms.length > 0 ? (
            <div className="space-y-4">
              {symptoms.slice(0, 10).map((symptom) => (
                <div key={symptom.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{symptom.symptom_name}</h4>
                      <p className="text-sm text-gray-600">
                        Severity: {symptom.severity}/10
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(symptom.recorded_at), 'PPp')}
                      </p>
                      {symptom.notes && (
                        <p className="text-sm mt-2">{symptom.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No symptoms logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
