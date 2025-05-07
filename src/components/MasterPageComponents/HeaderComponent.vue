<template>
    <header class="fixed-header">
        <nav>
            <ul style="float:right;">
                <!-- Testing -->
                <li><a href="/artist" type="button">ArtistDetails</a></li>
                <li><a href="/event" type="button">EventDetails</a></li>
                <li><a href="/search" type="button">EventsSearch</a></li>
                <li><a href="/following" type="button">FollowingLists</a></li>
                <!-- Testing -->

                <li><a href="#" v-if="!authState.isLoggedIn" @click="openLoginModal()" type="button">Login</a></li>
                <li><a href="#" v-if="!authState.isLoggedIn" @click="openRegisterModal()" type="button">Register</a></li>
                <li v-if="authState.isLoggedIn" class="perfil-dropdown">
                    <a href="#" @click.prevent="toggleDropdown">Perfil ▼</a>
                    <ul v-if="showDropdown" class="dropdown-menu" ref="perfilDropdown">
                        <li><a href="#">Editar Perfil</a></li>
                        <li><a href="#">Mudar Password</a></li>
                        <li><a href="#" @click.prevent="logout">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
</template>


<script>
    import { ref, onMounted, onBeforeUnmount } from 'vue';
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
                isLoggedIn: false,
                showDropdown: false
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
                this.showDropdown = false;
            },
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            }
        }
    }
</script>

<style scoped>
    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #293241;
        border: 1px solid #ddd;
        min-width: 160px;
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 10; 
        display: block; 
        visibility: visible; 
        opacity: 1; 
    }

        .dropdown-menu[style*="display: none"] {
            display: none !important;
        }

        .dropdown-menu li {
            padding: 6px 12px; 
            font-size: 14px;
        }

            .dropdown-menu li:last-child {
                border-bottom: none; 
            }

            .dropdown-menu li a {
                display: block;
                color: #333; 
                text-decoration: none;
                transition: background-color 0.2s ease; 
            }

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
                    .fixed-header nav ul li a:hover {
                        color: #ee6c4d; /* Lighter background on hover */
                    }
</style>