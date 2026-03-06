import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface HeroSlide {
    id: string;
    imageUrl: string;
    label: string;
    subtitle: string;
    ctaLabel: string;
    ctaLink: string;
}

export interface CategorySetting {
    name: string;
    slug: string;
    icon: string;
    imageUrl: string;
}

export interface StoreInfo {
    address: string;
    whatsapp: string;
    phone: string;
    instagram: string;
}

export interface SiteSettings {
    heroSlides: HeroSlide[];
    categories: CategorySetting[];
    storeInfo: StoreInfo;
}

export const defaultSettings: SiteSettings = {
    heroSlides: [
        {
            id: "1",
            imageUrl: "",
            label: "New Collection 2026",
            subtitle: "Handcrafted ethnic wear celebrating the artistry of Indian textiles.",
            ctaLabel: "Explore Collection",
            ctaLink: "/category/sarees",
        },
    ],
    categories: [
        { name: "Sarees", slug: "sarees", icon: "🥻", imageUrl: "" },
        { name: "Ready-to-Wear Sarees", slug: "ready-to-wear-sarees", icon: "✨", imageUrl: "" },
        { name: "Kurtis", slug: "kurtis", icon: "👘", imageUrl: "" },
        { name: "Kurta Sets", slug: "kurta-sets", icon: "👗", imageUrl: "" },
        { name: "Lehengas", slug: "lehengas", icon: "💃", imageUrl: "" },
        { name: "Palazzos", slug: "palazzos", icon: "🌸", imageUrl: "" },
        { name: "Dupattas", slug: "dupattas", icon: "🎀", imageUrl: "" },
    ],
    storeInfo: {
        address: "Fashion Street, Mumbai, Maharashtra",
        whatsapp: "+91 7044627776",
        phone: "+91 7044627776",
        instagram: "priyas_collection02",
    },
};

const SETTINGS_DOC = "settings/site";

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, "settings", "site"));
                if (!cancelled && snap.exists()) {
                    setSettings({ ...defaultSettings, ...snap.data() as SiteSettings });
                }
            } catch (err) {
                console.warn("Could not load settings, using defaults:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetch();
        return () => { cancelled = true; };
    }, []);

    return { settings, loading };
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
    await setDoc(doc(db, "settings", "site"), settings, { merge: true });
}
