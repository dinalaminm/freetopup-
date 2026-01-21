import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createApp, ref, onMounted, nextTick } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 🔥 আপনার ফায়ারবেস কনফিগারেশন নিচে বসান (আগেরটাই থাকবে)
authDomain

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

createApp({
    setup() {
        const loading = ref(true);
        const noticeMessage = ref("লোড হচ্ছে...");
        const banners = ref([]); // ব্যানার লিস্ট
        const mysteryBoxes = ref([]);
        const specialOffers = ref([]);
        const freeFireItems = ref([]);
        const ingameItems = ref([]);
        const subscriptions = ref([]);
        
        // ফেইক অর্ডার ডাটা (চাইলে ডাটাবেস থেকেও আনতে পারেন)
        const latestOrders = ref([
            { id: 1, name: 'Md Solim', avatar: 'MS', bgColor: 'bg-purple-500', item: '115 Diamonds', time: '1 min ago', verified: true },
            { id: 2, name: 'Rakibul', avatar: 'R', bgColor: 'bg-orange-500', item: 'Weekly Plus', time: '3 min ago', verified: true }
        ]);
        
        const fetchData = async () => {
            try {
                // ১. নোটিশ আনা
                const noticeSnap = await getDocs(collection(db, "settings"));
                noticeSnap.forEach((doc) => {
                    if (doc.id === "notice") noticeMessage.value = doc.data().text;
                });
                
                // ২. প্রোডাক্টস আনা
                const productsSnap = await getDocs(collection(db, "products"));
                productsSnap.forEach((doc) => {
                    const item = doc.data();
                    // ডাটা ক্যাটাগরি অনুযায়ী সাজানো
                    if (item.category === 'mystery') mysteryBoxes.value.push(item);
                    else if (item.category === 'special') specialOffers.value.push(item);
                    else if (item.category === 'freefire') freeFireItems.value.push(item);
                    else if (item.category === 'ingame') ingameItems.value.push(item);
                    else if (item.category === 'subscription') subscriptions.value.push(item);
                });
                
                // ৩. ব্যানার আনা (সবার শেষে)
                const bannerSnap = await getDocs(collection(db, "banners"));
                // ব্যানারের শুধু ইমেজ লিংকগুলো নিচ্ছি
                banners.value = bannerSnap.docs.map(doc => doc.data().image);
                
                loading.value = false;
                
                // 🔥 ফিক্স: ডাটা আসার পর DOM আপডেট হওয়ার জন্য অপেক্ষা করা
                await nextTick();
                
                // এরপর স্লাইডার চালু করা
                new Swiper(".mySwiper", {
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                });
                
            } catch (error) {
                console.error("Error fetching data:", error);
                // যদি পারমিশন এরর হয়
                if (error.code === 'permission-denied') {
                    noticeMessage.value = "ডাটাবেস রুলস ঠিক করুন (Test Mode অন করুন)";
                }
            }
        };
        
        onMounted(() => {
            fetchData();
        });
        
        return {
            loading,
            noticeMessage,
            banners,
            mysteryBoxes,
            specialOffers,
            freeFireItems,
            ingameItems,
            subscriptions,
            latestOrders
        };
    }
}).mount('#app');