import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  MoreVertical,
  ThumbsUp,
  MessageCircle,
  Share2,
  Tag
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Comments } from '../components/collaboration/Comments';
import { cn } from '../components/ui/utils';

interface Thread {
  id: string;
  title: string;
  author: string;
  role: string;
  preview: string;
  category: 'General' | 'Data Quality' | 'Simulation' | 'Production';
  likes: number;
  replies: number;
  lastActive: string;
  isUnread?: boolean;
}

const MOCK_THREADS: Thread[] = [
  {
    id: '1',
    title: 'Discrepancy in Field-B Permeability Models',
    author: 'Dr. Al-Fayed',
    role: 'Principal Geologist',
    preview: 'I\'ve noticed a significant variance between the static model permeability and the dynamic model history matching results in Sector 4...',
    category: 'Simulation',
    likes: 12,
    replies: 5,
    lastActive: '10m ago',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Q2 Production Forecast Adjustments',
    author: 'Sarah Chen',
    role: 'Reservoir Engineer',
    preview: 'Based on the latest well test data from W-102 and W-105, we might need to revise our Q2 decline curve assumptions.',
    category: 'Production',
    likes: 8,
    replies: 3,
    lastActive: '2h ago',
  },
  {
    id: '3',
    title: 'Data Quality Issues in Legacy Logs',
    author: 'James Wilson',
    role: 'Data Scientist',
    preview: 'The digitization of the 1995-2000 log sets shows some inconsistent gamma ray readings. Has anyone else validated this batch?',
    category: 'Data Quality',
    likes: 5,
    replies: 8,
    lastActive: '1d ago',
  }
];

export function DiscussionForum() {
  const [activeThreadId, setActiveThreadId] = useState<string>(MOCK_THREADS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeThread = MOCK_THREADS.find(t => t.id === activeThreadId);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 p-6">
      {/* Left Sidebar - Thread List */}
      <div className="w-[400px] flex flex-col gap-4 bg-card border border-card-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-card-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Discussions</h2>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background-secondary border-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 whitespace-nowrap">All Topics</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 whitespace-nowrap">Simulation</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 whitespace-nowrap">Production</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 whitespace-nowrap">Data Quality</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-card-border">
            {MOCK_THREADS.map((thread) => (
              <div 
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-card-hover transition-colors",
                  activeThreadId === thread.id ? "bg-primary/5 border-l-4 border-primary" : "border-l-4 border-transparent"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn(
                    "text-[10px] px-1.5 py-0",
                    thread.category === 'Simulation' && "text-blue-500 border-blue-500/20 bg-blue-500/10",
                    thread.category === 'Production' && "text-green-500 border-green-500/20 bg-green-500/10",
                    thread.category === 'Data Quality' && "text-amber-500 border-amber-500/20 bg-amber-500/10",
                  )}>
                    {thread.category}
                  </Badge>
                  <span className="text-xs text-text-tertiary">{thread.lastActive}</span>
                </div>
                <h3 className={cn("text-sm font-medium mb-1 line-clamp-1", thread.isUnread ? "text-text-primary" : "text-text-secondary")}>
                  {thread.title}
                </h3>
                <p className="text-xs text-text-tertiary line-clamp-2 mb-3">
                  {thread.preview}
                </p>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.author}`} />
                      <AvatarFallback>{thread.author[0]}</AvatarFallback>
                    </Avatar>
                    <span>{thread.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {thread.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {thread.replies}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content - Active Thread */}
      <div className="flex-1 flex flex-col bg-card border border-card-border rounded-xl overflow-hidden shadow-sm">
        {activeThread ? (
          <>
            <div className="p-6 border-b border-card-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
                      {activeThread.category}
                    </Badge>
                    <span className="text-xs text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last active {activeThread.lastActive}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-text-primary mb-2">{activeThread.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-card-border">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeThread.author}`} />
                  <AvatarFallback>{activeThread.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-text-primary">{activeThread.author}</div>
                  <div className="text-xs text-text-secondary">{activeThread.role}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-6 text-text-secondary leading-relaxed border-b border-card-border">
                {activeThread.preview} 
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              
              <div className="flex-1 bg-background-secondary/30">
                 <Comments contextId={activeThread.id} className="h-full border-none bg-transparent rounded-none" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-tertiary">
            Select a discussion to view details
          </div>
        )}
      </div>
    </div>
  );
}
