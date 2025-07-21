
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, TrendingUp, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileDropdownProps {
  onSettingsClick: () => void;
}

export function UserProfileDropdown({ onSettingsClick }: UserProfileDropdownProps) {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleHelp = () => {
    window.open('https://help.example.com', '_blank');
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 px-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-xs bg-blue-600 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={onSettingsClick}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleHelp}>
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
