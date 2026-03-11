import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import upstreamaiLogo from 'figma:asset/9beb0d38a15a59ea10724901fda4b02c359da990.png';
import bgImage from 'figma:asset/8b2cc91da33f72db8d02701227e09bc4360bb3e5.png';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const handleForgotPassword = () => {
    toast.info('Password reset link sent to your email', {
      description: 'Please check your inbox and spam folder'
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left Half */}
      <div 
        className="w-[60%] flex items-center justify-center relative overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `
            linear-gradient(to bottom, rgba(8, 12, 24, 0.4), rgba(8, 12, 24, 0.5)),
            url(${bgImage})
          `
        }}
      >
        
        <div className="relative z-10 flex flex-col gap-6 items-center w-full max-w-[520px] mx-8 p-12 rounded-[32px] bg-[rgba(255,255,255,0.1)] border-[2px] border-solid border-[rgba(255,255,255,0.2)] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] bg-[#0000004d]">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <img src={upstreamaiLogo} alt="UpstreamAI Logo" className="w-16 h-16" />
            </div>
          </div>
          
          {/* Platform Name */}
          <h1 style={{fontSize: 'calc(var(--text-h1) * 1.55)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-family-primary)'}} className="text-center leading-tight tracking-tight mb-1">
            <span className="text-white drop-shadow-lg">UpstreamAI</span>
            <br />
            <span style={{color: 'var(--primary)'}} className="drop-shadow-lg">FDP</span>
          </h1>
          
          {/* Tagline */}
          <p style={{color: 'var(--accent)'}} className="text-center text-h4 tracking-wide mb-4">
            AI-Enabled Field Development Planning
          </p>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2"></div>
          
          {/* Feature Pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap max-w-md">
            <div className="border border-accent/40 bg-accent/8 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md hover:bg-accent/15 transition-all">
              <p style={{color: 'var(--accent)'}} className="text-body">✨ 12 AI Agents</p>
            </div>
            <div className="border border-accent/40 bg-accent/8 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md hover:bg-accent/15 transition-all">
              <p style={{color: 'var(--accent)'}} className="text-body">⚡ Real-time Analytics</p>
            </div>
            <div className="border border-accent/40 bg-accent/8 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md hover:bg-accent/15 transition-all">
              <p style={{color: 'var(--accent)'}} className="text-body">🔒 Domain-Fenced SLM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half */}
      <div className="w-[40%] flex items-center justify-center">
        <div className="w-[400px] space-y-6">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-text-primary">Sign In</h2>
            <p className="text-sm text-text-secondary">Access your asset's AI Assistant</p>
          </div>

          {/* SSO Button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            Sign in with Corporate SSO
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-text-secondary">or</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="user@upstreamai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Sign In Button */}
          <Button 
            onClick={handleLogin}
            variant="primary"
            className="w-full"
          >
            Sign In
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <button className="text-sm text-accent hover:underline" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}