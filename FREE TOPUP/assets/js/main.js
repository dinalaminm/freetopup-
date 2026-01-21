// Firebase SDK ইম্পোর্ট (CDN থেকে)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createApp, ref, onMounted } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// --- আপনার ফায়ারবেস কনফিগারেশন নিচে বসান ---
// Firebase Console থেকে কপি করা কোড এখানে দিন
const firebaseConfig = {
    apiKey: "AIzaSyAE0FjYQaXulDHjI09dbS8-bY9mkG_H3i8",
    authDomain: "cash-battle-99474.firebaseapp.com",
    projectId: "cash-battle-99474",
    storageBucket: "cash-battle-99474.firebasestorage.app",
    messagingSenderId: "369800470969",
    appId: "1:369800470969:web:98829a18481fcac8aa5668"
};

// Firebase কানেক্ট করা
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

createApp({
    setup() {
        // লোডিং স্টেট (ডাটা না আসা পর্যন্ত দেখাবে)
        const loading = ref(true);
        
        // ডাটা ভেরিয়েবল (সব ফাঁকা, ডাটাবেস থেকে পূরণ হবে)
        const noticeMessage = ref("লোড হচ্ছে...");
        const banners = ref([]);
        const mysteryBoxes = ref([]);
        const specialOffers = ref([]);
        const freeFireItems = ref([]);
        const ingameItems = ref([]);
        const subscriptions = ref([]);
        
        // ফেইক লাইভ অর্ডার (এটা ডাটাবেস থেকে না আনলেও চলে, রিয়েলিস্টিক দেখায়)
        const latestOrders = ref([
            { id: 1, name: 'Abir', avatar: 'A', bgColor: 'bg-green-600', item: 'Level Up Pass', time: 'Just now', verified: true },
            { id: 2, name: 'Sajid', avatar: 'S', bgColor: 'bg-purple-500', item: '115 Diamonds', time: '2 min ago', verified: true }
        ]);
        
        // ১. ডাটাবেস থেকে ডাটা আনার ফাংশন
        const fetchData = async () => {
            try {
                // নোটিশ আনা
                const noticeSnap = await getDocs(collection(db, "settings"));
                noticeSnap.forEach((doc) => {
                    if (doc.id === "notice") noticeMessage.value = doc.data().text;
                });
                
                // ব্যানার আনা
                const bannerSnap = await getDocs(collection(db, "banners"));
                banners.value = bannerSnap.docs.map(doc => doc.data().image);
                
                // সব প্রোডাক্ট আনা এবং ক্যাটাগরি অনুযায়ী ভাগ করা
                const productsSnap = await getDocs(collection(db, "products"));
                productsSnap.forEach((doc) => {
                    const item = doc.data();
                    if (item.category === 'mystery') mysteryBoxes.value.push(item);
                    else if (item.category === 'special') specialOffers.value.push(item);
                    else if (item.category === 'freefire') freeFireItems.value.push(item);
                    else if (item.category === 'ingame') ingameItems.value.push(item);
                    else if (item.category === 'subscription') subscriptions.value.push(item);
                });
                
                // যদি ডাটাবেস খালি থাকে (প্রথমবার), তবে ডিফল্ট ডাটা আপলোড করার অপশন (নিচে দেখুন)
                if (productsSnap.empty) {
                    console.log("Database empty! Please upload data.");
                    // uploadDefaultData(); // এই লাইনটি একবার আনকমেন্ট করে রান করলে ডাটা আপলোড হবে
                }
                
                loading.value = false;
                
                // স্লাইডার চালু করা (ডাটা আসার পর)
                setTimeout(() => {
                    new Swiper(".mySwiper", {
                        loop: true,
                        autoplay: { delay: 3000, disableOnInteraction: false },
                        pagination: { el: ".swiper-pagination", clickable: true },
                    });
                }, 500);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                noticeMessage.value = "ডাটা লোড করতে সমস্যা হয়েছে। ইন্টারনেট কানেকশন চেক করুন।";
            }
        };
        
        // ২. ডাটা আপলোড ফাংশন (Admin Panel ছাড়া ডাটা ঢোকানোর জন্য)
        // প্রথমবার রান করার জন্য এটি ব্যবহার করতে পারেন
        const uploadDefaultData = async () => {
            // নোটিশ
            await addDoc(collection(db, "settings"), { text: "আমাদের সাইটে ১০% ক্যাশব্যাক চলছে!" });
            
            // প্রোডাক্ট উদাহরণ
            const dummyProducts = [
                { name: 'Mystery 1', image: 'https://i.pinimg.com/736x/8f/c9/b3/8fc9b38029373972a9e223c34a26e792.jpg', category: 'mystery', price: 100 },
                { name: 'Level Up', image: 'https://cdn-icons-png.flaticon.com/512/5278/5278658.png', category: 'freefire', price: 180 },
                { name: 'Netflix', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', category: 'subscription', price: 250 },
            ];
            
            dummyProducts.forEach(async (p) => {
                await addDoc(collection(db, "products"), p);
            });
            alert("ডাটা আপলোড হয়েছে!");
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