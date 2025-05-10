<template>
    <HeaderComponent @openLoginModal="toggleLoginModal" @openRegisterModal="toggleRegisterModal" @openProfileModal="toggleProfileModal"></HeaderComponent>
    <div class="container-fluid">
        <ModalLogin @closeLoginModal="toggleLoginModal" :loginModalActive="modalLoginActive">
        </ModalLogin>
        <ModalRegister @closeRegisterModal="toggleRegisterModal" :registerModalActive="modalRegisterActive">
        </ModalRegister>
        <ModalProfile @closeProfileModal="toggleProfileModal" :profileModalActive="modalProfileActive">
        </ModalProfile>
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

    import { ref } from 'vue';
    export default {
        components: {
            ModalLogin,
            ModalRegister,
            HeaderComponent,
            FooterComponent,
            ModalProfile
        },
        setup() {
            let modalLoginActive = ref(false);
            let modalRegisterActive = ref(false);
            let modalProfileActive = ref(false);

            return {
                modalLoginActive, modalRegisterActive,modalProfileActive
            }
        },
        methods: {
            toggleLoginModal() {
                this.modalLoginActive = !this.modalLoginActive;
                return this.modalLoginActive
            },
            toggleRegisterModal() {
                this.modalRegisterActive = !this.modalRegisterActive;
                return this.modalRegisterActive
            },
            toggleProfileModal() {
                this.modalProfileActive = !this.modalProfileActive;
                return this.modalProfileActive
            },
        }
    }
</script>

<style scoped>
</style>