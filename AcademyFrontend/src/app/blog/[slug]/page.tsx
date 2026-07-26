"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Check, ArrowRight } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useState } from "react";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  // Simulation d'une base de données locale
  const post = {
    title: "L'Avenir des LLMs (Large Language Models) en Afrique",
    category: "IA Générative",
    author: "Amina Diallo",
    authorRole: "Data Scientist Senior",
    readTime: "5 min",
    date: "14 Juil 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    content: `
      <h2>L'essor de l'IA Générative sur le continent</h2>
      <p>L'intelligence artificielle générative a pris le monde d'assaut, et l'Afrique n'est pas en reste. Avec des modèles open-source puissants comme LLaMA de Meta ou Mistral, les développeurs africains n'ont plus besoin d'accès à des APIs coûteuses pour innover.</p>
      
      <h3>Pourquoi l'open source change la donne ?</h3>
      <p>La souveraineté des données est un enjeu majeur. L'utilisation de modèles propriétaires oblige à envoyer des données sensibles sur des serveurs étrangers. L'open-source permet :</p>
      <ul>
        <li>D'héberger les modèles localement.</li>
        <li>De fine-tuner les algorithmes sur des langues locales (Wolof, Swahili, Amharique).</li>
        <li>De réduire drastiquement les coûts d'inférence.</li>
      </ul>

      <blockquote>
        "Le véritable pouvoir de l'IA en Afrique réside dans notre capacité à adapter ces technologies à nos réalités socio-économiques et linguistiques."
      </blockquote>

      <h3>Les défis à relever</h3>
      <p>Bien que prometteur, ce domaine fait face à des obstacles. Le manque de puissance de calcul (GPUs) et le coût de l'infrastructure cloud restent des freins. Cependant, des initiatives communautaires et des investissements accrus dans des data centers locaux commencent à combler ce fossé.</p>
      
      <h2>Conclusion</h2>
      <p>Le développement des LLMs en Afrique n'en est qu'à ses balbutiements. Pour rester compétitifs, il est crucial que les professionnels de la tech s'emparent de ces outils. Chez MLAcademy, nous préparons déjà la prochaine génération de bâtisseurs d'IA.</p>
    `
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16 pb-0">
      
      {/* Article Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-default)] pt-12 pb-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-tertiary)] hover:text-[var(--brand-500)] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="badge badge-brand shadow-sm">{post.category}</span>
            <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-100)] text-[var(--brand-500)] flex items-center justify-center font-bold text-lg">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-base font-bold text-[var(--text-primary)]">{post.author}</p>
              <p className="text-sm text-[var(--text-tertiary)]">{post.authorRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-8 relative z-10">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-default)]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Main Content */}
          <article 
            className="flex-1 prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--brand-500)] prose-blockquote:border-l-[var(--brand-500)] prose-blockquote:bg-[var(--brand-50)] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-[var(--brand-600)] max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Sidebar / Share */}
          <aside className="md:w-16 flex md:flex-col gap-4 items-center md:items-start md:pt-4">
            <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 md:block hidden">Partager</span>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors">
              <FaTwitter className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors">
              <FaLinkedin className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[#1877F2] hover:border-[#1877F2] transition-colors">
              <FaFacebook className="w-4 h-4" />
            </button>
            <button onClick={copyLink} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${copied ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success-light)]' : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--brand-500)] hover:border-[var(--brand-500)]'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>
          </aside>
        </div>
      </div>

      {/* Articles Similaires */}
      <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-default)] py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Articles similaires</h3>
            <Link href="/blog" className="text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors inline-flex items-center gap-1">
              Voir tout le blog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                slug: "guide-pratique-mlops-debutant",
                title: "Le Guide Ultime du MLOps pour les Débutants",
                category: "MLOps",
                image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
                date: "10 Juil 2026"
              },
              {
                slug: "pourquoi-apprendre-python-en-2026",
                title: "Pourquoi Python reste le Roi de la Data en 2026",
                category: "Carrière",
                image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=800",
                date: "05 Juil 2026"
              }
            ].map((related) => (
              <Link href={`/blog/${related.slug}`} key={related.slug} className="group flex gap-4 card-flat p-4 hover:border-[var(--brand-300)] transition-colors">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-tertiary)]">
                  <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-[var(--brand-500)] uppercase tracking-wider mb-1">{related.category}</span>
                  <h4 className="text-base font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--brand-500)] transition-colors line-clamp-2 mb-2">
                    {related.title}
                  </h4>
                  <span className="text-xs font-medium text-[var(--text-tertiary)] flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {related.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
