import { Category, Fabric } from "@/types/product";

export const categories: { name: Category; slug: string; icon: string }[] = [
    { name: "Sarees", slug: "sarees", icon: "🥻" },
    { name: "Ready-to-Wear Sarees", slug: "ready-to-wear-sarees", icon: "✨" },
    { name: "Kurtis", slug: "kurtis", icon: "👘" },
    { name: "Kurta Sets", slug: "kurta-sets", icon: "👗" },
    { name: "Lehengas", slug: "lehengas", icon: "💃" },
    { name: "Palazzos", slug: "palazzos", icon: "🌸" },
    { name: "Dupattas", slug: "dupattas", icon: "🎀" },
];

export const fabrics: { name: Fabric; description: string }[] = [
    { name: "Silk", description: "Lustrous and luxurious" },
    { name: "Cotton", description: "Breathable artisan comfort" },
    { name: "Organza", description: "Sheer delicate elegance" },
    { name: "Georgette", description: "Flowing festive grace" },
    { name: "Chiffon", description: "Lightweight ethereal beauty" },
    { name: "Velvet", description: "Rich regal opulence" },
    { name: "Linen", description: "Relaxed refined ease" },
    { name: "Crepe", description: "Structured smooth drape" },
];
