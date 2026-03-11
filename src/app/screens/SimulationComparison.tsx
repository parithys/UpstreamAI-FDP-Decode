import { SimulationPathwayComparison } from '../components/SimulationPathwayComparison';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Generate Traditional simulation data (tight cluster)
const traditionalData = Array.from({ length: 150 }, (_, i) => ({
  rf: 38 + Math.random() * 6,
  npv: 1.8 + Math.random() * 0.5,
  size: 8
}));

// Generate AI Led simulation data (dense, wider exploration)
const aiLedData = Array.from({ length: 500 }, (_, i) => ({
  rf: 32 + Math.random() * 20,
  npv: 1.2 + Math.random() * 1.5,
  size: 4
}));

export function SimulationComparison() {
  const navigate = useNavigate();

  const handleExploreScenarios = () => {
    toast.info('Loading top scenarios', {
      description: 'Preparing detailed analysis of top 20 optimal scenarios...'
    });
    // Could navigate to a detailed scenarios view
  };

  const handleGenerateInsights = () => {
    toast.success('Navigating to Insights module', {
      description: 'AI Led Simulation results will be analyzed for key insights.'
    });
    setTimeout(() => navigate('/insights'), 800);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header with Tabs */}
        <div className="mb-6">
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList>
              <TabsTrigger value="traditional" className="data-[state=active]:bg-blue-500">
                Traditional Simulation
              </TabsTrigger>
              <TabsTrigger value="aiLed" className="data-[state=active]:bg-purple-600">
                AI Led Simulation
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-primary">
                Comparison View ✓
              </TabsTrigger>
            </TabsList>

            {/* Traditional Simulation Tab Content */}
            <TabsContent value="traditional" className="mt-6">
              <div className="bg-card rounded-lg border border-card-border shadow-glow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xl">
                    E
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary">Traditional Simulation (Eclipse)</h2>
                    <p className="text-sm text-text-secondary">Conventional reservoir simulation approach</p>
                  </div>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                    <div className="text-xs text-text-tertiary mb-1">Total Scenarios</div>
                    <div className="text-2xl font-bold text-text-primary">3,847</div>
                  </div>
                  <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                    <div className="text-xs text-text-tertiary mb-1">Compute Time</div>
                    <div className="text-2xl font-bold text-text-primary">28 days</div>
                  </div>
                  <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                    <div className="text-xs text-text-tertiary mb-1">Best NPV</div>
                    <div className="text-2xl font-bold text-success">$2.1B</div>
                  </div>
                  <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                    <div className="text-xs text-text-tertiary mb-1">Best RF</div>
                    <div className="text-2xl font-bold text-success">42%</div>
                  </div>
                </div>

                {/* Scatter Plot */}
                <div className="bg-background-secondary rounded-lg p-3 border border-card-border mb-4">
                  <div className="h-64 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis 
                          type="number" 
                          dataKey="rf" 
                          name="Recovery Factor" 
                          unit="%"
                          stroke="#7B8CA8"
                          tick={{ fill: '#7B8CA8', fontSize: 11 }}
                          label={{ value: 'Recovery Factor (%)', position: 'insideBottom', offset: -5, fill: '#7B8CA8' }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="npv" 
                          name="NPV" 
                          unit="B"
                          stroke="#7B8CA8"
                          tick={{ fill: '#7B8CA8', fontSize: 11 }}
                          label={{ value: 'NPV ($B)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                        />
                        <ZAxis range={[60, 60]} />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(13, 25, 50, 0.95)', 
                            border: '1px solid rgba(0, 200, 200, 0.15)',
                            borderRadius: '8px',
                            color: '#FFFFFF'
                          }}
                        />
                        <Scatter 
                          data={traditionalData} 
                          fill="#3B82F6" 
                          fillOpacity={0.4}
                        />
                        {/* Optimal point */}
                        <Scatter 
                          data={[{ rf: 42, npv: 2.1 }]} 
                          fill="#FFD700" 
                          shape="star"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-blue-500/10 rounded-lg p-5 border border-blue-500/30">
                  <h4 className="text-text-primary font-semibold mb-3">Traditional Approach Analysis</h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Limited exploration space with 3,847 scenarios evaluated over 28 days of compute time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Best scenario identified: $2.1B NPV with 42% recovery factor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>3 local optima discovered in constrained parameter space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Manual parameter tuning and sequential sensitivity analysis approach</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* AI Led Simulation Tab Content */}
            <TabsContent value="aiLed" className="mt-6">
              <div className="bg-card rounded-lg border-2 border-purple-500 shadow-glow-hover p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xl">
                    P
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary">AI Led Simulation</h2>
                    <p className="text-sm text-purple-400">Advanced AI-powered optimization and exploration</p>
                  </div>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-xs text-purple-400 mb-1">Total Scenarios</div>
                    <div className="text-2xl font-bold text-text-primary">12.4M</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-xs text-purple-400 mb-1">Compute Time</div>
                    <div className="text-2xl font-bold text-text-primary">4 days</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-xs text-purple-400 mb-1">Best NPV</div>
                    <div className="text-2xl font-bold text-success">$2.4B</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-xs text-purple-400 mb-1">Best RF</div>
                    <div className="text-2xl font-bold text-success">47%</div>
                  </div>
                </div>

                {/* Scatter Plot */}
                <div className="bg-background-secondary rounded-lg p-3 border border-card-border mb-4">
                  <div className="h-64 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis 
                          type="number" 
                          dataKey="rf" 
                          name="Recovery Factor" 
                          unit="%"
                          stroke="#7B8CA8"
                          tick={{ fill: '#7B8CA8', fontSize: 11 }}
                          label={{ value: 'Recovery Factor (%)', position: 'insideBottom', offset: -5, fill: '#7B8CA8' }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="npv" 
                          name="NPV" 
                          unit="B"
                          stroke="#7B8CA8"
                          tick={{ fill: '#7B8CA8', fontSize: 11 }}
                          label={{ value: 'NPV ($B)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                        />
                        <ZAxis range={[30, 30]} />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(13, 25, 50, 0.95)', 
                            border: '1px solid rgba(0, 200, 200, 0.15)',
                            borderRadius: '8px',
                            color: '#FFFFFF'
                          }}
                        />
                        <Scatter 
                          data={aiLedData} 
                          fill="#8B5CF6" 
                          fillOpacity={0.2}
                        />
                        {/* Global optimal point */}
                        <Scatter 
                          data={[{ rf: 47, npv: 2.4 }]} 
                          fill="#FFD700" 
                          shape="star"
                        />
                        {/* Additional local optima */}
                        <Scatter 
                          data={[
                            { rf: 44, npv: 2.3 },
                            { rf: 45, npv: 2.25 },
                            { rf: 43, npv: 2.35 }
                          ]} 
                          fill="#C0C0C0" 
                          shape="star"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Advantages */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-success/10 rounded-lg p-4 border border-success/30">
                    <h4 className="text-success font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="success">+14%</Badge>
                      NPV Improvement
                    </h4>
                    <p className="text-xs text-text-secondary">
                      AI-led approach identified superior scenarios with $2.4B NPV vs $2.1B in traditional method
                    </p>
                  </div>
                  <div className="bg-success/10 rounded-lg p-4 border border-success/30">
                    <h4 className="text-success font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="success">7x Faster</Badge>
                      Time Efficiency
                    </h4>
                    <p className="text-xs text-text-secondary">
                      Completed 3,200x more scenarios in just 4 days compared to 28 days for traditional approach
                    </p>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-purple-500/10 rounded-lg p-5 border border-purple-500/30">
                  <h4 className="text-text-primary font-semibold mb-3">AI-Led Approach Benefits</h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Comprehensive parameter space exploration with 12.4M scenarios evaluated intelligently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Discovered global optimum: $2.4B NPV at 47% recovery factor (+14% improvement)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Identified 12 local optima plus 1 global optimum across diverse operational strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Autonomous parameter tuning with parallel uncertainty quantification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Real-time optimization with adaptive learning from simulation results</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              {/* Split Panel Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Traditional Panel */}
                <div className="bg-card rounded-lg border border-card-border shadow-glow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                      E
                    </div>
                    <div>
                      <h3 className="text-text-primary font-semibold">Traditional Simulation (Eclipse)</h3>
                      <p className="text-sm text-text-secondary">3,847 Scenarios</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">Completed in 28 days | Limited optimization space</p>

                  {/* Traditional Scatter Plot */}
                  <div className="bg-background-secondary rounded-lg p-3 border border-card-border mb-4">
                    <div className="h-64 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis 
                            type="number" 
                            dataKey="rf" 
                            name="Recovery Factor" 
                            unit="%"
                            stroke="#7B8CA8"
                            tick={{ fill: '#7B8CA8', fontSize: 11 }}
                            label={{ value: 'Recovery Factor (%)', position: 'insideBottom', offset: -5, fill: '#7B8CA8' }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="npv" 
                            name="NPV" 
                            unit="B"
                            stroke="#7B8CA8"
                            tick={{ fill: '#7B8CA8', fontSize: 11 }}
                            label={{ value: 'NPV ($B)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                          />
                          <ZAxis range={[60, 60]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ 
                              backgroundColor: 'rgba(13, 25, 50, 0.95)', 
                              border: '1px solid rgba(0, 200, 200, 0.15)',
                              borderRadius: '8px',
                              color: '#FFFFFF'
                            }}
                          />
                          <Scatter 
                            data={traditionalData} 
                            fill="#3B82F6" 
                            fillOpacity={0.4}
                          />
                          {/* Optimal point */}
                          <Scatter 
                            data={[{ rf: 42, npv: 2.1 }]} 
                            fill="#FFD700" 
                            shape="star"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-background-secondary rounded p-2 border border-card-border">
                      <div className="text-text-secondary">Best NPV</div>
                      <div className="text-text-primary font-semibold">$2.1B</div>
                    </div>
                    <div className="bg-background-secondary rounded p-2 border border-card-border">
                      <div className="text-text-secondary">Best RF</div>
                      <div className="text-text-primary font-semibold">42%</div>
                    </div>
                    <div className="bg-background-secondary rounded p-2 border border-card-border">
                      <div className="text-text-secondary">Scenarios</div>
                      <div className="text-text-primary font-semibold">3,847</div>
                    </div>
                    <div className="bg-background-secondary rounded p-2 border border-card-border">
                      <div className="text-text-secondary">Time</div>
                      <div className="text-text-primary font-semibold">28 days</div>
                    </div>
                    <div className="bg-background-secondary rounded p-2 col-span-2 border border-card-border">
                      <div className="text-text-secondary">Optima Found</div>
                      <div className="text-text-primary font-semibold">3 local</div>
                    </div>
                  </div>
                </div>

                {/* AI Led Panel */}
                <div className="bg-card rounded-lg border-2 border-purple-500 shadow-glow-hover p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    <div>
                      <h3 className="text-text-primary font-semibold">AI Led Simulation</h3>
                      <p className="text-sm text-purple-600">12.4M Scenarios</p>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 mb-4">Completed in 4 days | Comprehensive exploration</p>

                  {/* AI Led Scatter Plot */}
                  <div className="bg-background-secondary rounded-lg p-3 border border-card-border mb-4">
                    <div className="h-64 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis 
                            type="number" 
                            dataKey="rf" 
                            name="Recovery Factor" 
                            unit="%"
                            stroke="#7B8CA8"
                            tick={{ fill: '#7B8CA8', fontSize: 11 }}
                            label={{ value: 'Recovery Factor (%)', position: 'insideBottom', offset: -5, fill: '#7B8CA8' }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="npv" 
                            name="NPV" 
                            unit="B"
                            stroke="#7B8CA8"
                            tick={{ fill: '#7B8CA8', fontSize: 11 }}
                            label={{ value: 'NPV ($B)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                          />
                          <ZAxis range={[30, 30]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ 
                              backgroundColor: 'rgba(13, 25, 50, 0.95)', 
                              border: '1px solid rgba(0, 200, 200, 0.15)',
                              borderRadius: '8px',
                              color: '#FFFFFF'
                            }}
                          />
                          <Scatter 
                            data={aiLedData} 
                            fill="#8B5CF6" 
                            fillOpacity={0.2}
                          />
                          {/* Global optimal point */}
                          <Scatter 
                            data={[{ rf: 47, npv: 2.4 }]} 
                            fill="#FFD700" 
                            shape="star"
                          />
                          {/* Additional local optima */}
                          <Scatter 
                            data={[
                              { rf: 44, npv: 2.3 },
                              { rf: 45, npv: 2.25 },
                              { rf: 43, npv: 2.35 }
                            ]} 
                            fill="#C0C0C0" 
                            shape="star"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-purple-500/10 rounded p-2 border border-purple-500/30">
                      <div className="text-purple-400">Best NPV</div>
                      <div className="text-text-primary font-semibold">$2.4B</div>
                    </div>
                    <div className="bg-purple-500/10 rounded p-2 border border-purple-500/30">
                      <div className="text-purple-400">Best RF</div>
                      <div className="text-text-primary font-semibold">47%</div>
                    </div>
                    <div className="bg-purple-500/10 rounded p-2 border border-purple-500/30">
                      <div className="text-purple-400">Scenarios</div>
                      <div className="text-text-primary font-semibold">12.4M</div>
                    </div>
                    <div className="bg-purple-500/10 rounded p-2 border border-purple-500/30">
                      <div className="text-purple-400">Time</div>
                      <div className="text-text-primary font-semibold">4 days</div>
                    </div>
                    <div className="bg-purple-500/10 rounded p-2 border border-purple-500/30 col-span-2">
                      <div className="text-purple-400">Optima Found</div>
                      <div className="text-text-primary font-semibold">12 local + 1 global</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Bar */}
              <div className="bg-primary/10 rounded-lg p-5 border-l-4 border-primary">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-text-primary font-medium">✨ Comparison Agent Analysis:</span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant="success" className="text-sm py-2 px-4">
                    +14% NPV improvement identified by AI Led
                  </Badge>
                  <Badge variant="success" className="text-sm py-2 px-4">
                    +5% recovery factor vs. traditional optimal
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-sm py-2 px-4">
                    3,200× more scenarios explored in 7× less time
                  </Badge>
                  <div className="ml-auto flex gap-3">
                    <Button variant="outline" onClick={handleExploreScenarios}>
                      Explore Top 20 Scenarios →
                    </Button>
                    <Link to="/insights">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleGenerateInsights}>
                        Generate Insights →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pathway Comparison Component */}
              <div className="mt-6">
                <SimulationPathwayComparison variant="full" showHeader={true} />
              </div>

              {/* AI Led Integration Link */}
              <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      View AI Led Integration Architecture
                    </h3>
                    <p className="text-sm text-text-secondary">
                      See how AI Led simulation integrates with Eclipse, Petrel, and other traditional tools
                    </p>
                  </div>
                  <Link to="/insights/ai-led-integration">
                    <Button variant="primary">
                      View Integration Details →
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}