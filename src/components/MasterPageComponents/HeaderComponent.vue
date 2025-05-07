<template>
    <header class="fixed-header">
        <nav>
            <ul style="float:right;">
                <li><a href="/artist" type="button">ArtistDetails</a></li>
                <li><a href="/event" type="button">EventDetails</a></li>
                <li><a href="/search" type="button">EventsSearch</a></li>
                <li><a href="/following" type="button">FollowingLists</a></li>
                <li><a href="#" v-if="!authState.isLoggedIn" @click="openLoginModal()" type="button">Login</a></li>
                <li><a href="#" v-if="!authState.isLoggedIn" @click="openRegisterModal()" type="button">Register</a></li>
                <li><a href="#" v-if="authState.isLoggedIn" @click="logout()" type="button">Logout</a></li>
            </ul>
        </nav>
    </header>
</template>


<script>
    import { ref } from 'vue';
    import { authState } from '../../auth';
    import Swal from 'sweetalert2';

    export default {
        name: 'HeaderComponent',
        components: {
        },
        setup() {
            let loginModalActive = ref(false);
            let registerModalActive = ref(false);

            return {
                loginModalActive, registerModalActive, authState
            }
        },

        data() {
            return {
                isLoggedIn: false
            };
        },

        mounted() {
            this.checkLoginStatus();
        },

        methods: {
            openLoginModal() {
                this.$emit('openLoginModal');
            },
            openRegisterModal() {
                this.$emit('openRegisterModal');
            },
            checkLoginStatus() {
                this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            },
            logout() {
                localStorage.removeItem('isLoggedIn');
                authState.isLoggedIn = false;
                Swal.fire('Sucesso', 'Logout efectuado com sucesso!', 'success');
            }
        }
    }
</script>

<style scoped>
    .fixed-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #293241;
        color: white;
        padding: 10px 0;
        z-index: 1000;
    }

        .fixed-header nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            text-align: center;
        }

            .fixed-header nav ul li {
                display: inline;
                margin: 0 15px;
            }

                .fixed-header nav ul li a {
                    color: white;
                    text-decoration: none;
                    font-size: 18px;
                }
</style>