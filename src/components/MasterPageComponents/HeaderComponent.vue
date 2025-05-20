<template>
    <header class="fixed-header">
        <nav>
            <ul style="float:left;">
                <li v-if="authState.isLoggedIn && authState.role === 'user'">
                    <a href="/" type="button">StageScout</a>
                </li>
                <li v-else-if="authState.isLoggedIn && authState.role === 'admin'">
                    <a href="/admin" type="button">StageScout</a>
                </li>
                <li v-else-if="authState.isLoggedIn && authState.role === 'promoter'">
                    <a href="/backoffice" type="button">StageScout</a>
                </li>
            </ul>
            <ul style="float:right;">
                <li>
                    <a v-if="authState.isLoggedIn && authState.role === 'user'" @click="GoToEventSearch" type="button">
                        Pesquisar Eventos
                    </a>
                </li>
                <li>
                    <a v-if="authState.isLoggedIn && authState.role === 'user'" @click="GoToPerformerSearch" type="button">
                        Pesquisar Performers
                    </a>
                </li>
                <li>
                    <a href="#" v-if="!authState.isLoggedIn" @click="openLoginModal" type="button">Login</a>
                </li>
                <li>
                    <a href="#" v-if="!authState.isLoggedIn" @click="openRegisterModal" type="button">Register</a>
                </li>
                <li v-if="authState.isLoggedIn" class="perfil-dropdown">
                    <a href="#" @click.prevent="toggleDropdown">A Sua Conta ▼</a>
                    <ul v-if="showDropdown" class="dropdown-menu" ref="perfilDropdown">
                        <li>
                            <a v-if="authState.role === 'user'" href="#" @click="openProfileModal" type="button">Editar Perfil</a>
                        </li>
                        <li><a href="#" @click="openChangePassModal">Mudar Password</a></li>
                        <li><a href="#" @click.prevent="logout">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
    import { authState } from '../../auth';
    import Swal from 'sweetalert2';

    export default {
        name: 'HeaderComponent',

        data() {
            return {
                showDropdown: false,
            };
        },

        computed: {
            authState() {
                return authState;
            }
        },

        mounted() {
            // Optionally update state on page refresh
            authState.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            authState.role = localStorage.getItem('role') || null;
            authState.profileId = localStorage.getItem('profileId') || null;
        },

        methods: {
            GoToEventSearch() {
                this.$router.push({ name: 'EventSearch' });
            },
            GoToPerformerSearch() {
                this.$router.push({ name: 'PerformerSearch' });
            },
            openLoginModal() {
                this.$emit('openLoginModal');
            },
            openRegisterModal() {
                this.$emit('openRegisterModal');
            },
            openProfileModal() {
                this.$emit('openProfileModal');
            },
            openChangePassModal() {
                this.$emit('openChangePassModal');
            },
            logout() {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('profileId');
                localStorage.removeItem('role');

                authState.profileId = null;
                authState.isLoggedIn = false;
                authState.role = null;

                this.showDropdown = false;

                Swal.fire('Sucesso', 'Logout efectuado com sucesso!', 'success');
                this.$router.push({ name: 'home' });
            },
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            }
        }
    };
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