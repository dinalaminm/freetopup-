import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createApp, ref, onMounted, nextTick } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// আপনার কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyACUK207BRvtR5yc1UhYLS9FlMitVVlrrE",
  authDomain: "freetopup-fd263.firebaseapp.com",
  projectId: "freetopup-fd263",
  storageBucket: "freetopup-fd263.firebasestorage.app",
  messagingSenderId: "756173302110",
  appId: "1:756173302110:web:14227664f6b5d14d9047cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

createApp({
    setup() {
        const loading = ref(true);
        const noticeMessage = ref("লোড হচ্ছে...");
        const banners = ref([]);
        const mysteryBoxes = ref([]);
        const specialOffers = ref([]);
        const freeFireItems = ref([]);
        const ingameItems = ref([]);
        const subscriptions = ref([]);
        
        const latestOrders = ref([
            { id: 1, name: 'Md Solim', avatar: 'MS', bgColor: 'bg-purple-500', item: '115 Diamonds', time: '1 min ago', verified: true },
            { id: 2, name: 'Rakibul', avatar: 'R', bgColor: 'bg-orange-500', item: 'Weekly Plus', time: '3 min ago', verified: true }
        ]);

        // 🔥 নতুন ক্লিক ফাংশন (লিংক ওপেন করার জন্য)
        const goToDetails = (id) => {
            console.log("Clicking ID:", id);
            if (id) {
                window.location.href = `details.html?id=${id}`;
            } else {
                alert("Product ID not found!");
            }
        };

        // ব্রোকেন ইমেজ হ্যান্ডলার
        const handleImageError = (e) => {
            e.target.src = "https://placehold.co/400x400?text=No+Image";
        };

        const fetchData = async () => {
            try {
                // নোটিশ
                noticeMessage.value = "আসসালামু আলাইকুম। আমাদের সাইটে বিকাশ, নগদ এবং রকেটের মাধ্যমে পেমেন্ট করতে পারবেন।";

                // প্রোডাক্টস
                const productsSnap = await getDocs(collection(db, "products"));
                
                // ডাটা ক্লিয়ার করা (ডুপ্লিকেট এড়াতে)
                mysteryBoxes.value = [];
                specialOffers.value = [];
                freeFireItems.value = [];
                ingameItems.value = [];
                subscriptions.value = [];

                productsSnap.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    
                    if (item.category === 'mystery') mysteryBoxes.value.push(item);
                    else if (item.category === 'special') specialOffers.value.push(item);
                    else if (item.category === 'freefire') freeFireItems.value.push(item);
                    else if (item.category === 'ingame') ingameItems.value.push(item);
                    else if (item.category === 'subscription') subscriptions.value.push(item);
                });

                // ব্যানার
                const bannerSnap = await getDocs(collection(db, "banners"));
                banners.value = bannerSnap.docs.map(doc => doc.data().image);

                loading.value = false;

                // স্লাইডার
                await nextTick();
                new Swiper(".mySwiper", {
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    pagination: { el: ".swiper-pagination", clickable: true },
                });

            } catch (error) {
                console.error("Error:", error);
                noticeMessage.value = "ডাটা লোড সমস্যা! (চেক কনসোল)";
            }
        };

        onMounted(() => {
            fetchData();
        });

        return {
            loading, noticeMessage, banners,
            mysteryBoxes, specialOffers, freeFireItems, ingameItems, subscriptions,
            latestOrders, 
            goToDetails, // 🔥 এই ফাংশনটি রিটার্ন করা হয়েছে
            handleImageError
        };
    }
}).mount('#app');