
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

export function MedicationTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('taken_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addMedication = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          medication_name: medicationName,
          dosage,
          frequency,
          notes: notes || null,
          taken_at: selectedDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      setMedicationName('');
      setDosage('');
      setFrequency('');
      setNotes('');
      toast.success('Medication logged successfully!');
    },
    onError: (error) => {
      toast.error(`Error logging medication: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim() || !dosage.trim() || !frequency.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    addMedication.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Medication</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date Taken</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medication">Medication Name</Label>
                  <Input
                    id="medication"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    placeholder="e.g., Ibuprofen, Aspirin"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 200mg, 1 tablet"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g., Once daily, Twice daily"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any side effects or observations..."
                  />
                </div>

                <Button type="submit" disabled={addMedication.isPending}>
                  {addMedication.isPending ? 'Logging...' : 'Log Medication'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading medications...</p>
          ) : medications && medications.length > 0 ? (
            <div className="space-y-4">
              {medications.slice(0, 10).map((medication) => (
                <div key={medication.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{medication.medication_name}</h4>
                      <p className="text-sm text-gray-600">
                        Dosage: {medication.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        Frequency: {medication.frequency}
                      </p>
                      <p className="text-sm text-gray-500">
                        Taken: {format(new Date(medication.taken_at), 'PPp')}
                      </p>
                      {medication.notes && (
                        <p className="text-sm mt-2">{medication.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medications logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
