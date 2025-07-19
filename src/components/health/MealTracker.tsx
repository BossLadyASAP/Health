
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function MealTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mealType, setMealType] = useState('');
  const [foodItems, setFoodItems] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: meals, isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addMeal = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          meal_type: mealType,
          food_items: foodItems,
          calories: calories ? parseInt(calories) : null,
          notes: notes || null,
          recorded_at: selectedDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setMealType('');
      setFoodItems('');
      setCalories('');
      setNotes('');
      toast.success('Meal logged successfully!');
    },
    onError: (error) => {
      toast.error(`Error logging meal: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealType || !foodItems.trim()) {
      toast.error('Please fill in meal type and food items');
      return;
    }
    addMeal.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Meal</CardTitle>
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
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="food-items">Food Items</Label>
                  <Textarea
                    id="food-items"
                    value={foodItems}
                    onChange={(e) => setFoodItems(e.target.value)}
                    placeholder="e.g., Grilled chicken, brown rice, steamed broccoli"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="calories">Calories (Optional)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Estimated calories"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did you feel after eating? Any reactions?"
                  />
                </div>

                <Button type="submit" disabled={addMeal.isPending}>
                  {addMeal.isPending ? 'Logging...' : 'Log Meal'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading meals...</p>
          ) : meals && meals.length > 0 ? (
            <div className="space-y-4">
              {meals.slice(0, 10).map((meal) => (
                <div key={meal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium capitalize">{meal.meal_type}</h4>
                      <p className="text-sm text-gray-600">{meal.food_items}</p>
                      {meal.calories && (
                        <p className="text-sm text-gray-600">
                          Calories: {meal.calories}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {format(new Date(meal.recorded_at), 'PPp')}
                      </p>
                      {meal.notes && (
                        <p className="text-sm mt-2">{meal.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No meals logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
