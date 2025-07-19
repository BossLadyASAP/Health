
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SymptomTracker } from '@/components/health/SymptomTracker';
import { MoodTracker } from '@/components/health/MoodTracker';
import { MealTracker } from '@/components/health/MealTracker';
import { MedicationTracker } from '@/components/health/MedicationTracker';
import { HealthAnalysis } from '@/components/health/HealthAnalysis';
import { Activity, Heart, Utensils, Pill, TrendingUp } from 'lucide-react';

export function HealthTracker() {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Health Tracker</h1>
          <p className="text-gray-600 mt-2">
            Track your daily symptoms, moods, meals, and medications to identify patterns and insights.
          </p>
        </div>

        <Tabs defaultValue="symptoms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="moods" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Moods  
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms">
            <SymptomTracker />
          </TabsContent>

          <TabsContent value="moods">
            <MoodTracker />
          </TabsContent>

          <TabsContent value="meals">
            <MealTracker />
          </TabsContent>

          <TabsContent value="medications">
            <MedicationTracker />
          </TabsContent>

          <TabsContent value="analysis">
            <HealthAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
