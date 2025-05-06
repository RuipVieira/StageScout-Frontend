<template>
    <HeaderComponent @openLoginModal="toggleLoginModal" @openRegisterModal="toggleRegisterModal"></HeaderComponent>
    <div class="container-fluid">
        <ModalLogin @closeLoginModal="toggleLoginModal" :loginModalActive="modalLoginActive">
        </ModalLogin>
        <ModalRegister @closeRegisterModal="toggleRegisterModal" :registerModalActive="modalRegisterActive">
        </ModalRegister>
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

    import { ref } from 'vue';
    export default {
        components: {
            ModalLogin,ModalRegister,
            HeaderComponent,
            FooterComponent
        },
        setup() {
            let modalLoginActive = ref(false);
            let modalRegisterActive = ref(false);

            return {
                modalLoginActive, modalRegisterActive
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
        }
    }
</script>

<style scoped>
</style>