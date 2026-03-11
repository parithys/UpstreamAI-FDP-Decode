import React, { useState } from 'react';
import { Send, MessageSquare, User, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

interface CommentsProps {
  contextId?: string; // ID of the page or element these comments belong to
  className?: string;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    role: 'Reservoir Engineer',
    content: 'The production forecast for Well-04 seems slightly optimistic given the recent pressure drop data. Should we re-run the simulation with updated permeability values?',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    author: 'James Wilson',
    role: 'Asset Manager',
    content: 'Agreed. Let\'s coordinate with the geology team to verify the fault transmissibility multipliers before running the next batch.',
    timestamp: '1 hour ago',
  }
];

export function Comments({ contextId, className }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Demo User',
      role: 'Executive',
      content: newComment,
      timestamp: 'Just now',
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment posted successfully');
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
    toast.success('Comment deleted');
  };

  return (
    <div className={cn("flex flex-col h-full bg-card/50 backdrop-blur-sm border border-card-border rounded-xl overflow-hidden", className)}>
      <div className="p-4 border-b border-card-border flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-text-primary">Comments</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
            {comments.length}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <Avatar className="w-8 h-8 border border-card-border">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{comment.author}</span>
                    <span className="text-xs text-text-tertiary">• {comment.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">{comment.timestamp}</span>
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-danger/10 text-danger rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-background-secondary/50 rounded-lg text-sm text-text-secondary leading-relaxed">
                  {comment.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-card-border bg-card/50">
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[80px] bg-background-secondary border-card-border focus:border-primary resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            onClick={handleSubmit}
            size="icon" 
            className="h-[80px] w-12 shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-text-tertiary mt-2 text-right">
          Press Enter to post
        </p>
      </div>
    </div>
  );
}
