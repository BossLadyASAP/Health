import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Activity, 
  Stethoscope, 
  Plus, 
  Edit3, 
  Trash2,
  Save,
  X
} from 'lucide-react';

interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'general' | 'mental_health' | 'physical_health' | 'nutrition' | 'fitness';
  isActive: boolean;
  isCustom: boolean;
}

interface SystemPromptsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromptSelect: (prompt: SystemPrompt) => void;
}

const defaultPrompts: SystemPrompt[] = [
  {
    id: 'general_health',
    name: 'General Health Assistant',
    description: 'Provides general health guidance and wellness advice',
    prompt: 'You are a knowledgeable health assistant. Provide helpful, accurate health information while always recommending users consult healthcare professionals for medical concerns. Focus on wellness, prevention, and general health education.',
    category: 'general',
    isActive: false,
    isCustom: false
  },
  {
    id: 'mental_health',
    name: 'Mental Health Support',
    description: 'Offers mental health support and mindfulness guidance',
    prompt: 'You are a compassionate mental health support assistant. Provide emotional support, stress management techniques, and mindfulness practices. Always encourage professional help for serious mental health concerns and be empathetic in your responses.',
    category: 'mental_health',
    isActive: false,
    isCustom: false
  },
  {
    id: 'nutrition_coach',
    name: 'Nutrition Coach',
    description: 'Provides nutritional advice and meal planning guidance',
    prompt: 'You are a certified nutrition coach. Help users with meal planning, nutritional advice, dietary recommendations, and healthy eating habits. Consider individual dietary restrictions and health goals while providing evidence-based nutrition information.',
    category: 'nutrition',
    isActive: false,
    isCustom: false
  },
  {
    id: 'fitness_trainer',
    name: 'Fitness Trainer',
    description: 'Offers workout plans and fitness guidance',
    prompt: 'You are a personal fitness trainer. Provide workout routines, exercise guidance, fitness tips, and motivation. Adapt recommendations based on fitness levels and goals while emphasizing proper form and safety.',
    category: 'fitness',
    isActive: false,
    isCustom: false
  }
];

export function SystemPromptsDialog({ open, onOpenChange, onPromptSelect }: SystemPromptsDialogProps) {
  const [prompts, setPrompts] = useState<SystemPrompt[]>(defaultPrompts);
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  const getCategoryIcon = (category: SystemPrompt['category']) => {
    switch (category) {
      case 'mental_health': return <Brain className="h-4 w-4" />;
      case 'physical_health': return <Stethoscope className="h-4 w-4" />;
      case 'nutrition': return <Heart className="h-4 w-4" />;
      case 'fitness': return <Activity className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: SystemPrompt['category']) => {
    switch (category) {
      case 'mental_health': return 'bg-purple-100 text-purple-800';
      case 'physical_health': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'fitness': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateNew = () => {
    const newPrompt: SystemPrompt = {
      id: `custom_${Date.now()}`,
      name: '',
      description: '',
      prompt: '',
      category: 'general',
      isActive: false,
      isCustom: true
    };
    setEditingPrompt(newPrompt);
    setIsCreating(true);
    setActiveTab('create');
  };

  const handleSavePrompt = () => {
    if (!editingPrompt || !editingPrompt.name.trim() || !editingPrompt.prompt.trim()) return;

    if (isCreating) {
      setPrompts(prev => [...prev, editingPrompt]);
    } else {
      setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? editingPrompt : p));
    }

    setEditingPrompt(null);
    setIsCreating(false);
    setActiveTab('browse');
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleSelectPrompt = (prompt: SystemPrompt) => {
    setPrompts(prev => prev.map(p => ({ ...p, isActive: p.id === prompt.id })));
    onPromptSelect(prompt);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Health AI System Prompts</DialogTitle>
          <DialogDescription>
            Choose or create custom system prompts to personalize your health AI assistant
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Prompts</TabsTrigger>
            <TabsTrigger value="create">Create Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available System Prompts</h3>
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </div>

            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className={`cursor-pointer transition-all ${prompt.isActive ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(prompt.category)}
                        <CardTitle className="text-base">{prompt.name}</CardTitle>
                        <Badge className={getCategoryColor(prompt.category)}>
                          {prompt.category.replace('_', ' ')}
                        </Badge>
                        {prompt.isCustom && (
                          <Badge variant="outline">Custom</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {prompt.isCustom && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPrompt(prompt);
                                setIsCreating(false);
                                setActiveTab('create');
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePrompt(prompt.id);
                              }}
                              className="hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={() => handleSelectPrompt(prompt)}
                          variant={prompt.isActive ? "default" : "outline"}
                        >
                          {prompt.isActive ? 'Active' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{prompt.description}</p>
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded line-clamp-3">
                      {prompt.prompt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            {editingPrompt && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {isCreating ? 'Create New System Prompt' : 'Edit System Prompt'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSavePrompt}
                      disabled={!editingPrompt.name.trim() || !editingPrompt.prompt.trim()}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPrompt(null);
                        setIsCreating(false);
                        setActiveTab('browse');
                      }}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Prompt Name</Label>
                    <Input
                      id="name"
                      value={editingPrompt.name}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                      placeholder="Enter a name for your system prompt"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={editingPrompt.description}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                      placeholder="Brief description of what this prompt does"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={editingPrompt.category}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, category: e.target.value as SystemPrompt['category'] })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">General Health</option>
                      <option value="mental_health">Mental Health</option>
                      <option value="physical_health">Physical Health</option>
                      <option value="nutrition">Nutrition</option>
                      <option value="fitness">Fitness</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="prompt">System Prompt</Label>
                    <Textarea
                      id="prompt"
                      value={editingPrompt.prompt}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt: e.target.value })}
                      placeholder="Enter the system prompt that will guide the AI's behavior..."
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
