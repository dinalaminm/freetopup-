const { createApp, ref } = Vue;

createApp({
    setup() {
        const currentPage = ref('home');
        const loginForm = ref({ email: '', password: '' });
        const noticeMessage = ref("নোটিশ: আমাদের সাইটে বিকাশ, নগদ এবং রকেটের মাধ্যমে পেমেন্ট করতে পারবেন।");

        // গেমের তালিকা (API ছাড়াই ডেমো ডাটা)
        const games = ref([
            { id: 1, name: 'Free Fire ID Code', image: 'https://i.pinimg.com/736x/2c/3e/26/2c3e26463999e4367964720993077732.jpg' },
            { id: 2, name: 'PUBG Mobile UC', image: 'https://i.pinimg.com/736x/5d/79/f9/5d79f97607730242d992e4299b666a70.jpg' },
            { id: 3, name: 'Mobile Legends', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR07jQ72QzP0KkM2l2QyRz8QzP0KkM2l2QyRz&s' },
            { id: 4, name: 'Clash of Clans', image: 'https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHIfHbF9TAT51mgHm' }
        ]);

        const openGame = (game) => {
            alert(game.name + ' selected! (Details page coming soon)');
        };

        const handleLogin = () => {
            alert('Login data submitted: ' + loginForm.value.email);
        };

        return {
            currentPage,
            games,
            openGame,
            loginForm,
            handleLogin,
            noticeMessage
        };
    }
}).mount('#app');