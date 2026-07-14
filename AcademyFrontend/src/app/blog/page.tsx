"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";

const BLOG_POSTS = [
  {
    id: 1,
    slug: "l-avenir-des-llms-en-afrique",
    title: "L'Avenir des LLMs (Large Language Models) en Afrique",
    excerpt: "Comment les modèles de langage ouverts comme LLaMA ou Mistral transforment l'écosystème technologique africain et ouvrent de nouvelles opportunités pour les startups locales.",
    category: "IA Générative",
    author: "Amina Diallo",
    readTime: "5 min",
    date: "14 Juil 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    isFeatured: true
  },
  {
    id: 2,
    slug: "guide-pratique-mlops-debutant",
    title: "Le Guide Ultime du MLOps pour les Débutants",
    excerpt: "Découvrez les bases pour passer vos modèles de Jupyter Notebook à une API en production robuste avec Docker et FastAPI.",
    category: "MLOps",
    author: "Mamadou Sy",
    readTime: "8 min",
    date: "10 Juil 2026",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    isFeatured: false
  },
  {
    id: 3,
    slug: "pourquoi-apprendre-python-en-2026",
    title: "Pourquoi Python reste le Roi de la Data en 2026",
    excerpt: "Malgré l'essor de Mojo ou Julia, Python domine toujours l'écosystème IA. Analyse des frameworks qui maintiennent ce langage au sommet.",
    category: "Carrière",
    author: "Dr. Konaté",
    readTime: "4 min",
    date: "05 Juil 2026",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=1000",
    isFeatured: false
  },
  {
    id: 4,
    slug: "optimisation-modeles-edge-computing",
    title: "Optimiser ses modèles pour l'Edge Computing",
    excerpt: "Tutoriel complet sur la quantification (Quantization) et le pruning pour faire tourner vos réseaux de neurones sur des smartphones.",
    category: "Tutoriel",
    author: "Sarah Ndiaye",
    readTime: "12 min",
    date: "28 Juin 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    isFeatured: false
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  
  const featuredPost = BLOG_POSTS.find(p => p.isFeatured) || BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.filter(p => !p.isFeatured && (activeCategory === "Tous" || p.category.includes(activeCategory)));

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-24 pb-0">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full max-w-2xl h-[400px] bg-[var(--brand-50)] rounded-b-full blur-[100px] opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-50)] text-[var(--brand-500)] text-sm font-bold uppercase tracking-wider shadow-sm border border-[var(--brand-100)]">
            <Sparkles className="w-4 h-4" />
            <span>Blog Tech MLAcademy</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Explorez le futur de <span className="text-[var(--brand-500)]">l'IA & de la Data</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Actualités, tutoriels pratiques, et retours d'expérience pour accélérer votre carrière dans la tech.
          </p>
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-20 relative rounded-3xl overflow-hidden shadow-xl border border-[var(--border-default)] bg-[var(--bg-primary)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-video lg:aspect-auto h-full overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
            </div>
            
            <div className="p-8 lg:p-12 flex flex-col justify-center relative">
              {/* Badge for mobile readability over image */}
              <div className="absolute top-4 left-4 lg:relative lg:top-0 lg:left-0 lg:mb-4">
                <span className="badge badge-brand shadow-sm">{featuredPost.category}</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4 group-hover:text-[var(--brand-500)] transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {featuredPost.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-bold text-[var(--brand-500)]">
                  <span>Lire l'article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid Posts */}
        <div className="mb-12 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Derniers articles</h3>
          <div className="hidden sm:flex gap-2">
            {["Tous", "Tutoriel", "Carrière", "MLOps", "IA Générative"].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-[var(--brand-50)] text-[var(--brand-500)] shadow-sm border border-[var(--brand-100)]" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {regularPosts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="card group flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[11px] bg-[var(--bg-tertiary)]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge badge-secondary shadow-sm backdrop-blur-md bg-opacity-90">{post.category}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-[var(--text-primary)] leading-tight mb-3 group-hover:text-[var(--brand-500)] transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                    <div className="w-6 h-6 rounded-full bg-[var(--brand-100)] text-[var(--brand-500)] flex items-center justify-center font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-tertiary)]">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
