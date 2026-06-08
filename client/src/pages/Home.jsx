import { useEffect } from 'react';
import { useAppStore } from '../stores/index.js';
import Navbar from '../components/Navbar.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import AppCard from '../components/AppCard.jsx';
import Footer from '../components/Footer.jsx';
import Calendar from '../components/Calendar.jsx';
import TokenPlan from '../components/TokenPlan.jsx';
import LinksBar from '../components/LinksBar.jsx';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const {
    apps,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    fetchApps,
    fetchCategories,
    setSearchQuery,
    setSelectedCategory,
    getFilteredApps,
  } = useAppStore();

  useEffect(() => {
    fetchApps();
    fetchCategories();
  }, [fetchApps, fetchCategories]);

  const filteredApps = getFilteredApps();

  return (
    <div className="min-h-screen">
      <Navbar apps={apps} onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <section className="flex flex-col md:flex-row items-center justify-between mb-12 animate-fade-in gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-accent-primary font-medium">
                探索无限可能
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              发现你的{' '}
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                应用工具箱
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto md:mx-0">
              汇聚各类 AI 工具、开发资源、生产力应用，一个页面掌控所有效率神器
            </p>
          </div>

          <div className="flex-shrink-0 flex gap-4">
            <TokenPlan />
            <Calendar />
          </div>
        </section>

        <section className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedCategory
                ? '没有找到匹配的应用'
                : '暂无应用'}
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app, index) => (
              <AppCard key={app._id} app={app} index={index} />
            ))}
          </section>
        )}

        <LinksBar />
      </main>

      <Footer />
    </div>
  );
}