import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, Shield, Zap, Code2, Cpu, ChevronRight, Command, Menu, X } from 'lucide-react';

// 模拟终端打字效果组件
const TypewriterTerminal = () => {
  const [lines, setLines] = useState([
    { type: 'command', text: 'claude code "refactor auth logic to use JWT"' },
    { type: 'output', text: 'Analyzing project structure...' },
    { type: 'output', text: 'Found 3 files related to authentication.' },
    { type: 'output', text: 'Drafting plan to migrate session-based auth to JWT...' },
    { type: 'success', text: '✓ Plan created. Reviewing implementation details.' },
    { type: 'input', text: 'Proceed with changes? [Y/n] ' },
  ]);

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-2xl border border-stone-800/50 bg-[#1e1e1e] font-mono text-sm leading-relaxed">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-stone-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-stone-400 text-xs">user@dev-machine: ~/project</div>
        <div className="w-8"></div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 space-y-3 min-h-[320px] text-stone-300">
        {lines.map((line, index) => (
          <div key={index} className="flex flex-col animate-fadeIn">
            {line.type === 'command' && (
              <div className="flex items-center text-stone-100">
                <span className="text-[#d97757] mr-2">❯</span>
                <span>{line.text}</span>
              </div>
            )}
            {line.type === 'output' && (
              <div className="text-stone-400 ml-4">{line.text}</div>
            )}
            {line.type === 'success' && (
              <div className="text-green-400 ml-4 font-semibold">{line.text}</div>
            )}
            {line.type === 'input' && (
              <div className="flex items-center ml-4 text-stone-100 mt-2">
                 <span className="text-blue-400 mr-2">?</span>
                 {line.text}
                 <span className="w-2 h-4 bg-stone-400 animate-pulse ml-1"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="w-12 h-12 rounded-xl bg-[#f0eee6] flex items-center justify-center text-[#d97757] mb-4">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-600 leading-relaxed text-sm md:text-base">{description}</p>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f4f3ef]/90 backdrop-blur-md border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
             <span className="text-white font-serif font-bold text-lg">C</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-stone-900">Claude</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
          <a href="#" className="hover:text-[#d97757] transition-colors">Research</a>
          <a href="#" className="hover:text-[#d97757] transition-colors">Product</a>
          <a href="#" className="hover:text-[#d97757] transition-colors">Safety</a>
          <a href="#" className="hover:text-[#d97757] transition-colors">Company</a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button className="text-stone-900 font-medium text-sm hover:opacity-70 transition-opacity">Log in</button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
            Try Claude Code
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-stone-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#f4f3ef] border-b border-stone-200 p-6 space-y-4 shadow-xl">
           <a href="#" className="block text-stone-900 font-medium">Research</a>
           <a href="#" className="block text-stone-900 font-medium">Product</a>
           <a href="#" className="block text-stone-900 font-medium">Safety</a>
           <button className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-medium">Try Claude Code</button>
        </div>
      )}
    </nav>
  );
};

export default function ClaudeCodePage() {
  return (
    <div className="min-h-screen bg-[#f4f3ef] text-stone-900 font-sans selection:bg-[#d97757] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 animate-fadeInUp">
            <div className="inline-flex items-center space-x-2 bg-white border border-stone-200 rounded-full px-3 py-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#d97757]"></span>
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">New Release</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] text-[#1a1a1a]">
              The agentic coding tool that lives in your <span className="italic text-stone-500 font-serif">terminal</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-stone-600 max-w-lg leading-relaxed">
              Claude Code works directly alongside you in your command line, understanding your entire codebase to help you refactor, debug, and ship faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex items-center justify-center px-8 py-4 bg-[#1a1a1a] text-white rounded-xl font-medium text-lg hover:bg-stone-800 transition-transform hover:-translate-y-1 shadow-lg shadow-stone-900/10 group">
                Download Technical Preview
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center px-8 py-4 bg-white border border-stone-300 text-stone-800 rounded-xl font-medium text-lg hover:bg-stone-50 transition-colors">
                Read the Documentation
              </button>
            </div>
            
            <p className="text-xs text-stone-500 flex items-center">
              <Shield size={12} className="mr-1" />
              SOC2 Compliant & Enterprise Ready
            </p>
          </div>

          {/* Right Side - Terminal Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#d97757]/20 to-stone-400/20 rounded-[2rem] blur-2xl opacity-50"></div>
            <TypewriterTerminal />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-stone-200/60 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-8">Trusted by engineering teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale mix-blend-multiply">
            {/* Simple Text Placeholders for Logos to maintain single file simplicity */}
            <span className="font-serif text-xl font-bold">GitLab</span>
            <span className="font-sans text-xl font-black tracking-tighter">stripe</span>
            <span className="font-mono text-xl font-bold">Notion</span>
            <span className="font-serif text-xl italic">The Guardian</span>
            <span className="font-sans text-xl font-bold">Quora</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-6">Deeply integrated into your workflow.</h2>
            <p className="text-xl text-stone-600">
              Unlike chat interfaces, Claude Code runs where you work. It has direct access to your file system, git history, and test outputs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Terminal}
              title="Native Terminal Integration"
              description="Claude runs as a CLI tool. Pipe output from other commands, navigate directories, and edit files directly without context switching."
            />
            <FeatureCard 
              icon={Cpu}
              title="Deep Context Awareness"
              description="Claude indexes your local repository to understand dependency graphs, type definitions, and architectural patterns automatically."
            />
            <FeatureCard 
              icon={Zap}
              title="Agentic Execution"
              description="Give Claude a high-level goal like 'Fix the failing tests in the auth module' and watch it run tests, edit code, and verify fixes."
            />
            <FeatureCard 
              icon={Code2}
              title="Semantic Refactoring"
              description="Perform complex refactors that require understanding the intent of the code, not just syntax matching."
            />
            <FeatureCard 
              icon={Command}
              title="Git Aware"
              description="Claude can read your git diffs, write commit messages, and even help resolve merge conflicts intelligently."
            />
            <FeatureCard 
              icon={Shield}
              title="Enterprise Grade Security"
              description="Your code stays local. Only the necessary context is sent to the API, with strict data retention policies for enterprise users."
            />
          </div>
        </div>
      </section>

      {/* Interactive Code Demo Section */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800 to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
           <div>
             <h2 className="font-serif text-4xl md:text-5xl mb-6">From instruction to pull request in minutes.</h2>
             <div className="space-y-8">
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                 <div>
                   <h4 className="font-bold text-lg mb-2">Describe your intent</h4>
                   <p className="text-stone-400">Simply tell Claude what you want to achieve using natural language in your terminal.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                 <div>
                   <h4 className="font-bold text-lg mb-2">Claude plans and executes</h4>
                   <p className="text-stone-400">Claude breaks down the task, reads necessary files, and proposes edits.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                 <div>
                   <h4 className="font-bold text-lg mb-2">Review and verify</h4>
                   <p className="text-stone-400">See the diffs, run the tests, and confirm the changes before they are committed.</p>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="bg-[#0d0d0d] rounded-xl border border-stone-800 p-2 shadow-2xl">
             <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
               <div className="flex items-center px-4 py-2 bg-[#252525] border-b border-stone-800 gap-2">
                 <span className="text-xs text-stone-500">diff --git a/src/auth.ts b/src/auth.ts</span>
               </div>
               <div className="p-4 font-mono text-sm leading-6 overflow-x-auto">
                 <div className="text-stone-500">@@ -12,7 +12,7 @@</div>
                 <div className="text-stone-400">{' function validateSession(token: string) {'}</div>
                 <div className="text-red-400 bg-red-900/20">-   const session = db.sessions.find(token);</div>
                 <div className="text-red-400 bg-red-900/20">-   if (!session || session.expired) return false;</div>
                 <div className="text-green-400 bg-green-900/20">+   try {'{'}</div>
                 <div className="text-green-400 bg-green-900/20">+     const payload = jwt.verify(token, process.env.JWT_SECRET);</div>
                 <div className="text-green-400 bg-green-900/20">+     return payload;</div>
                 <div className="text-green-400 bg-green-900/20">+   {'}'} catch (e) {'{'}</div>
                 <div className="text-green-400 bg-green-900/20">+     return false;</div>
                 <div className="text-green-400 bg-green-900/20">+   {'}'}</div>
                 <div className="text-stone-400">{' }'}</div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">Ready to code at the speed of thought?</h2>
          <p className="text-xl text-stone-600">Join thousands of developers using Claude Code to amplify their productivity.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button className="px-10 py-4 bg-[#d97757] text-white rounded-xl font-medium text-lg hover:bg-[#c06040] transition-colors shadow-lg">
                Get Started for Free
              </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
             <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-stone-900 rounded-md flex items-center justify-center">
                 <span className="text-white font-serif font-bold text-xs">C</span>
              </div>
              <span className="font-serif text-lg font-semibold text-stone-900">Anthropic</span>
            </div>
            <p className="text-stone-500 text-sm">© 2024 Anthropic, PBC.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="#" className="hover:text-[#d97757]">Claude Code</a></li>
              <li><a href="#" className="hover:text-[#d97757]">API</a></li>
              <li><a href="#" className="hover:text-[#d97757]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#d97757]">Claude for Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">Research</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="#" className="hover:text-[#d97757]">Overview</a></li>
              <li><a href="#" className="hover:text-[#d97757]">Interpretability</a></li>
              <li><a href="#" className="hover:text-[#d97757]">Societal Impact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="#" className="hover:text-[#d97757]">About</a></li>
              <li><a href="#" className="hover:text-[#d97757]">Careers</a></li>
              <li><a href="#" className="hover:text-[#d97757]">News</a></li>
              <li><a href="#" className="hover:text-[#d97757]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}