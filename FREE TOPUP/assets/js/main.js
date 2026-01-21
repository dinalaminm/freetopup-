const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const mysteryBoxes = ref([
            { name: 'MYSTERY BOX- 1', image: 'https://i.pinimg.com/736x/8f/c9/b3/8fc9b38029373972a9e223c34a26e792.jpg' },
            { name: 'MYSTERY BOX- 2', image: 'https://i.pinimg.com/736x/2c/3e/26/2c3e26463999e4367964720993077732.jpg' }
        ]);

        const specialOffers = ref([
            { id: 1, name: 'Weekly Offer', image: 'https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHIfHbF9TAT51mgHm' },
            { id: 2, name: 'Level Up Pass', image: 'https://wallpapers.com/images/hd/garena-free-fire-loading-screen-w7883997.jpg' }
        ]);

        const freeFireItems = ref([
            { id: 1, name: 'Free Fire ID', image: 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png' },
            { id: 2, name: 'Weekly', image: 'https://cdn-icons-png.flaticon.com/512/744/744922.png' },
            { id: 3, name: 'Level Up', image: 'https://cdn-icons-png.flaticon.com/512/5278/5278658.png' },
            { id: 4, name: 'Airdrop', image: 'https://cdn-icons-png.flaticon.com/512/1170/1170611.png' },
            { id: 5, name: 'Monthly', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
            { id: 6, name: 'Promo', image: 'https://cdn-icons-png.flaticon.com/512/879/879859.png' },
        ]);

        const ingameItems = ref([
            { id: 1, name: 'Free Fire', image: 'https://wallpapers.com/images/hd/free-fire-max-pictures-bj37292209307222.jpg' },
            { id: 2, name: 'Clash of Clans', image: 'https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHIfHbF9TAT51mgHm' },
            { id: 3, name: 'Call of Duty', image: 'https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_CallofDutyWarzone20_ActivisionPublishingInc_S2_1200x1600-51c074d280b2c525d8e7472c2d667201' }
        ]);

        const subscriptions = ref([
            { id: 1, name: 'Netflix', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
            { id: 2, name: 'Spotify', image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
            { id: 3, name: 'Canva', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg' }
        ]);

        const latestOrders = ref([
            { id: 1, name: 'Md Solim', avatar: 'MS', bgColor: 'bg-purple-500', item: '115 Diamonds', time: '1 min ago', verified: true },
            { id: 2, name: 'Rakibul', avatar: 'R', bgColor: 'bg-orange-500', item: 'Weekly Plus', time: '3 min ago', verified: true },
            { id: 3, name: 'Nimai Das', avatar: 'ND', bgColor: 'bg-blue-500', item: 'Level Up Pass', time: '5 min ago', verified: false },
            { id: 4, name: 'Chayan Ff', avatar: 'C', bgColor: 'bg-red-500', item: 'Monthly', time: '7 min ago', verified: true },
            { id: 5, name: 'Sojib Khan', avatar: 'SK', bgColor: 'bg-green-600', item: '610 Diamonds', time: '10 min ago', verified: true },
        ]);

        onMounted(() => {
            new Swiper(".mySwiper", {
                loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                pagination: { el: ".swiper-pagination", clickable: true },
            });
        });

        return {
            mysteryBoxes, specialOffers, freeFireItems, ingameItems, subscriptions, latestOrders
        };
    }
}).mount('#app');