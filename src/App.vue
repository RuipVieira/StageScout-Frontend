<template>
    <HeaderComponent @openLoginModal="toggleLoginModal"
                     @openRegisterModal="toggleRegisterModal"
                     @openProfileModal="toggleProfileModal"
                     @openChangePassModal="toggleChangePassModal"></HeaderComponent>
    <div class="container-fluid">
        <ModalLogin @closeLoginModal="toggleLoginModal" :loginModalActive="modalLoginActive"></ModalLogin>
        <ModalRegister @closeRegisterModal="toggleRegisterModal" :registerModalActive="modalRegisterActive"></ModalRegister>
        <ModalProfile @closeProfileModal="toggleProfileModal" :profileModalActive="modalProfileActive"></ModalProfile>
        <ModalChangePass @closeChangePassModal="toggleChangePassModal" :changePassModalActive="modalChangePassActive"></ModalChangePass>
        <div class="row">
            <div class="sidebar col-1"></div>
            <div class="col-10">
                <router-view></router-view>
            </div>
            <div class="sidebar col-1"></div>
        </div>
    </div>
    <FooterComponent></FooterComponent>
</template>

<script>
    import HeaderComponent from '@/components/MasterPageComponents/HeaderComponent.vue'
    import FooterComponent from '@/components/MasterPageComponents/FooterComponent.vue'
    import ModalLogin from '@/components/MasterPageComponents/SubComponents/modalLogin.vue'
    import ModalRegister from '@/components/MasterPageComponents/SubComponents/modalRegister.vue'
    import ModalProfile from '@/components/MasterPageComponents/SubComponents/modalProfileEditor.vue'
    import ModalChangePass from '@/components/MasterPageComponents/SubComponents/modalChangePass.vue'

    export default {
        components: {
            HeaderComponent,
            FooterComponent,
            ModalLogin,
            ModalRegister,
            ModalProfile,
            ModalChangePass
        },
        data() {
            return {
                modalLoginActive: false,
                modalRegisterActive: false,
                modalProfileActive: false,
                modalChangePassActive: false,
            };
        },
        methods: {
            toggleLoginModal() {
                this.modalLoginActive = !this.modalLoginActive;
                return this.modalLoginActive;
            },
            toggleRegisterModal() {
                this.modalRegisterActive = !this.modalRegisterActive;
                return this.modalRegisterActive;
            },
            toggleProfileModal() {
                this.modalProfileActive = !this.modalProfileActive;
                return this.modalProfileActive;
            },
            toggleChangePassModal() {
                this.modalChangePassActive = !this.modalChangePassActive;
                return this.modalChangePassActive;
            },
        }
    }
</script>

<style scoped>
</style>