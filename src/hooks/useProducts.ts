import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as Product)
                );
                setProducts(productsData);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError(err.message || "Failed to fetch products");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Product)
            );
            setProducts(productsData);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, error, refetch };
};
