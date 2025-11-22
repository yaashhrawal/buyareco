/**
 * Feed Page - Twitter-like Interface
 * Vertical scroll of recommendations and requests
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  User,
  Search,
  Image as ImageIcon,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { MOCK_TRENDING_REQUESTS } from '../data/mockData';

export default function FeedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialVibes = searchParams.get('vibes')?.split(',') || [];

  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');

  // Mock posts data (combining requests and recommendations)
  const posts = MOCK_TRENDING_REQUESTS.map(req => ({
    id: req.id,
    type: 'request',
    user: {
      name: req.requester.name,
      username: req.requester.username,
      avatar: req.requester.avatar,
      isVerified: true
    },
    content: {
      text: req.description,
      image: req.image,
      location: `${req.city}, ${req.area}`,
      vibes: req.vibes,
      title: req.title
    },
    stats: {
      likes: Math.floor(Math.random() * 100),
      comments: req.suggestionsCount,
      shares: Math.floor(Math.random() * 20)
    },
    createdAt: req.createdAt
  }));

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      {/* Left Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-screen border-r border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <MapPin className="w-8 h-8 text-accent-500" />
          <span className="text-xl font-bold">buyareco</span>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { icon: Search, label: 'Explore', active: true },
            { icon: MessageCircle, label: 'Messages' },
            { icon: User, label: 'Profile' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => item.label === 'Profile' ? navigate('/profile') : null}
              className={`flex items-center gap-4 p-3 rounded-full transition-colors ${item.active ? 'font-bold' : 'hover:bg-gray-900'
                }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg">{item.label}</span>
            </button>
          ))}

          <button
            onClick={() => navigate('/swipe')}
            className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-900 transition-colors"
          >
            <div className="w-6 h-6 rounded border-2 border-white flex items-center justify-center text-[10px] font-bold">S</div>
            <span className="text-lg">Swipe Mode</span>
          </button>
        </nav>

        <button
          onClick={() => navigate('/requests/new')}
          className="mt-8 w-full py-3 bg-accent-500 rounded-full font-bold text-lg hover:bg-accent-600 transition-colors"
        >
          Post Request
        </button>
      </div>

      {/* Main Feed */}
      <div className="w-full md:w-[600px] md:ml-64 border-x border-gray-800 min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('for-you')}
              className={`flex-1 py-4 text-center font-bold hover:bg-gray-900/50 transition-colors relative ${activeTab === 'for-you' ? 'text-white' : 'text-gray-500'
                }`}
            >
              For You
              {activeTab === 'for-you' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-accent-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 text-center font-bold hover:bg-gray-900/50 transition-colors relative ${activeTab === 'following' ? 'text-white' : 'text-gray-500'
                }`}
            >
              Following
              {activeTab === 'following' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-accent-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Filter Bar (if vibes selected) */}
        {initialVibes.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap">Filtered by:</span>
            {initialVibes.map(vibe => (
              <span key={vibe} className="px-3 py-1 bg-accent-500/20 text-accent-400 text-sm rounded-full font-medium whitespace-nowrap">
                #{vibe}
              </span>
            ))}
          </div>
        )}

        {/* Create Post Input (Simplified) */}
        <div className="p-4 border-b border-gray-800 flex gap-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <input
              type="text"
              placeholder="What's your vibe today?"
              className="w-full bg-transparent text-xl placeholder-gray-500 focus:outline-none mb-4"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-accent-500">
                <ImageIcon className="w-5 h-5 cursor-pointer" />
                <MapPin className="w-5 h-5 cursor-pointer" />
              </div>
              <button
                onClick={() => navigate('/requests/new')}
                className="px-4 py-1.5 bg-accent-500 rounded-full font-bold text-sm hover:bg-accent-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="divide-y divide-gray-800">
          {posts.map((post) => (
            <article key={post.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                    {post.user.avatar && <img src={post.user.avatar} alt="" className="w-full h-full object-cover" />}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* User Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-bold truncate">{post.user.name}</span>
                      {post.user.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
                      )}
                      <span className="text-gray-500 truncate">@{post.user.username}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500 text-sm">{post.createdAt}</span>
                    </div>
                    <button className="text-gray-500 hover:text-accent-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Text */}
                  <p className="text-white text-[15px] leading-normal mb-3">
                    <span className="font-bold block mb-1">{post.content.title}</span>
                    {post.content.text}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-accent-400 text-sm">📍 {post.content.location}</span>
                    {post.content.vibes.map(vibe => (
                      <span key={vibe} className="text-accent-400 text-sm">#{vibe}</span>
                    ))}
                  </div>

                  {/* Image Attachment */}
                  {post.content.image && (
                    <div className="rounded-2xl overflow-hidden border border-gray-800 mb-3">
                      <img src={post.content.image} alt="" className="w-full h-auto max-h-[400px] object-cover" />
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between text-gray-500 max-w-md">
                    <button className="flex items-center gap-2 group hover:text-accent-500">
                      <div className="p-2 rounded-full group-hover:bg-accent-500/10">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-xs">{post.stats.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 group hover:text-green-500">
                      <div className="p-2 rounded-full group-hover:bg-green-500/10">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs">{post.stats.shares}</span>
                    </button>
                    <button className="flex items-center gap-2 group hover:text-pink-500">
                      <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="text-xs">{post.stats.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right Sidebar (Desktop) - Trending */}
      <div className="hidden lg:block w-80 p-4 pl-8">
        <div className="sticky top-4">
          <div className="bg-gray-900 rounded-2xl p-4 mb-4">
            <h2 className="font-bold text-xl mb-4">Trending Vibes</h2>
            <div className="space-y-4">
              {['Adventure', 'Cozy Cafe', 'Nightlife', 'Hidden Gems'].map(topic => (
                <div key={topic} className="cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                  <div className="text-sm text-gray-500">Trending in India</div>
                  <div className="font-bold">{topic}</div>
                  <div className="text-sm text-gray-500">12.5K posts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-6 py-3 flex justify-between items-center z-50">
        <button className="text-white"><Search className="w-6 h-6" /></button>
        <button onClick={() => navigate('/swipe')} className="text-gray-500"><div className="w-6 h-6 border-2 border-current rounded flex items-center justify-center text-[10px] font-bold">S</div></button>
        <button onClick={() => navigate('/requests/new')} className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center -mt-8 border-4 border-black">
          <Plus className="w-6 h-6 text-white" />
        </button>
        <button className="text-gray-500"><MessageCircle className="w-6 h-6" /></button>
        <button onClick={() => navigate('/profile')} className="text-gray-500"><User className="w-6 h-6" /></button>
      </nav>
    </div>
  );
}
