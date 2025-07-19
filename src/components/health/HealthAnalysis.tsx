
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, TrendingUp, Calendar, Activity } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

export function HealthAnalysis() {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['health-analysis'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const thirtyDaysAgo = subDays(new Date(), 30);

      const [symptomsRes, moodsRes, mealsRes, medicationsRes] = await Promise.all([
        supabase
          .from('symptoms')
          .select('*')
          .gte('recorded_at', thirtyDaysAgo.toISOString())
          .order('recorded_at', { ascending: false }),
        supabase
          .from('moods')
          .select('*')
          .gte('recorded_at', thirtyDaysAgo.toISOString())
          .order('recorded_at', { ascending: false }),
        supabase
          .from('meals')
          .select('*')
          .gte('recorded_at', thirtyDaysAgo.toISOString())
          .order('recorded_at', { ascending: false }),
        supabase
          .from('medications')
          .select('*')
          .gte('taken_at', thirtyDaysAgo.toISOString())
          .order('taken_at', { ascending: false }),
      ]);

      return {
        symptoms: symptomsRes.data || [],
        moods: moodsRes.data || [],
        meals: mealsRes.data || [],
        medications: medicationsRes.data || [],
      };
    },
  });

  const generateInsights = () => {
    if (!healthData) return [];

    const insights = [];

    // Mood analysis
    if (healthData.moods.length > 0) {
      const avgMood = healthData.moods.reduce((sum, mood) => sum + (mood.mood_value || 0), 0) / healthData.moods.length;
      insights.push({
        title: 'Mood Trend',
        content: `Your average mood rating over the last 30 days is ${avgMood.toFixed(1)}/10.`,
        icon: TrendingUp,
      });
    }

    // Symptom frequency
    if (healthData.symptoms.length > 0) {
      const symptomCounts = healthData.symptoms.reduce((acc, symptom) => {
        acc[symptom.symptom_name] = (acc[symptom.symptom_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonSymptom = Object.entries(symptomCounts).sort(([,a], [,b]) => b - a)[0];
      insights.push({
        title: 'Most Common Symptom',
        content: `${mostCommonSymptom[0]} occurred ${mostCommonSymptom[1]} times in the last 30 days.`,
        icon: Activity,
      });
    }

    // Meal patterns
    if (healthData.meals.length > 0) {
      const mealTypes = healthData.meals.reduce((acc, meal) => {
        acc[meal.meal_type] = (acc[meal.meal_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      insights.push({
        title: 'Eating Patterns',
        content: `You've logged ${healthData.meals.length} meals this month. Most common: ${Object.entries(mealTypes).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}.`,
        icon: Calendar,
      });
    }

    return insights;
  };

  const exportToPDF = () => {
    // This would typically generate a PDF report
    // For now, we'll show a success message
    alert('PDF export feature coming soon! This would generate a comprehensive health report for your doctor.');
  };

  if (isLoading) {
    return <div className="p-6">Loading health analysis...</div>;
  }

  const insights = generateInsights();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Health Insights (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <insight.icon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Start logging your health data to see personalized insights!</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{healthData?.symptoms.length || 0}</div>
              <div className="text-sm text-gray-600">Symptoms Logged</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{healthData?.moods.length || 0}</div>
              <div className="text-sm text-gray-600">Mood Entries</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{healthData?.meals.length || 0}</div>
              <div className="text-sm text-gray-600">Meals Tracked</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{healthData?.medications.length || 0}</div>
              <div className="text-sm text-gray-600">Medications</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Health Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Generate a comprehensive PDF report of your health data to share with your healthcare provider.
          </p>
          <Button onClick={exportToPDF} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export PDF Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
