import { motion } from 'framer-motion'
import { Search, Sparkles, MapPin, TrendingUp, Heart, Coffee, Mountain, Music, Camera, Star, Users, Award, ArrowRight } from 'lucide-react'

function App() {
  const vibes = [
    { icon: Coffee, label: 'Lowkey', color: 'from-amber-500 to-orange-600', bgGlow: 'group-hover:shadow-orange-500/50' },
    { icon: Mountain, label: 'Adventure', color: 'from-emerald-500 to-teal-600', bgGlow: 'group-hover:shadow-emerald-500/50' },
    { icon: Heart, label: 'Romantic', color: 'from-rose-500 to-pink-600', bgGlow: 'group-hover:shadow-rose-500/50' },
    { icon: Music, label: 'Nightlife', color: 'from-violet-500 to-purple-600', bgGlow: 'group-hover:shadow-violet-500/50' },
    { icon: Camera, label: 'Photogenic', color: 'from-sky-500 to-blue-600', bgGlow: 'group-hover:shadow-sky-500/50' },
    { icon: TrendingUp, label: 'Trending', color: 'from-red-500 to-rose-600', bgGlow: 'group-hover:shadow-red-500/50' },
  ]

  const features = [
    {
      icon: Users,
      title: 'Local Experts',
      description: 'Connect with verified locals who know the hidden gems',
      stat: '10,000+'
    },
    {
      icon: Star,
      title: 'Recommendations',
      description: 'Curated suggestions tailored to your unique vibe',
      stat: '50,000+'
    },
    {
      icon: Award,
      title: 'Cities Covered',
      description: 'Explore destinations across the globe',
      stat: '100+'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden relative">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/50 group-hover:shadow-xl group-hover:shadow-primary-500/60 transition-all">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                BuyaReco
              </span>
            </motion.div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-white/80 hover:text-white font-medium transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/50 transition-all"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Hero Text */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block mb-6"
              >
                <span className="px-6 py-3 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-full text-primary-300 font-medium text-sm backdrop-blur-xl">
                  ✨ Discover Your Perfect Destination
                </span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="text-white block mb-2">Find Places That</span>
                <span className="text-gradient block animate-gradient-x bg-[length:200%_auto]">
                  Match Your Vibe
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get personalized recommendations from <span className="text-primary-400 font-semibold">local experts</span> who know the hidden gems.
                Find your perfect spot based on your <span className="text-accent-400 font-semibold">mood and vibe</span>.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-16"
            >
              <div className="glass-strong rounded-3xl p-3 max-w-4xl mx-auto shadow-2xl hover:shadow-primary-500/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-4 bg-neutral-900/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/50">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <input
                      type="text"
                      placeholder="Where do you want to explore?"
                      className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-lg font-medium"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white font-semibold shadow-lg shadow-primary-500/50 transition-all flex items-center justify-center gap-3"
                  >
                    <Search className="w-5 h-5" />
                    <span>Explore Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Vibe Selector */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mb-24"
            >
              <p className="text-center text-neutral-500 mb-8 text-sm uppercase tracking-wider font-semibold">
                Select Your Vibe
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {vibes.map((vibe, index) => {
                  const Icon = vibe.icon
                  return (
                    <motion.button
                      key={vibe.label}
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.08, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group glass rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl ${vibe.bgGlow}`}
                    >
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${vibe.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">{vibe.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1 + index * 0.15, type: 'spring' }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 group cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-primary-400" />
                      </div>
                      <div className="text-5xl font-bold text-gradient mb-3">{feature.stat}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
