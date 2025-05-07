<template>
    <transition name="modal-animation">
        <div v-show="loginModalActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="loginModalActive" class="modal-inner">
                    <i @click="closeLoginModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Login</h2>
                        <form @submit.prevent="login">
                            <div class="form-control form-container text-center">
                                <label for="loginEmail" class="form-label">Endereço E-mail</label>
                                <input v-model="loginEmail" type="email" id="loginEmail" class="form-control" required />

                                <label for="loginPassword" class="form-label">Palavra Passe</label>
                                <input v-model="loginPassword" type="password" id="loginPassword" class="form-control" required />
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeLoginModal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import { authState } from '../../../auth';

    export default {
        data() {
            return {
                loginEmail: '',
                loginPassword: '',
            };
        },

        props: ['loginModalActive'],
        setup(props, { emit }) {
            const closeLoginModal = () => {
                emit('closeLoginModal');
            }

            return { closeLoginModal }
        },
        methods: {
            isValidEmail(email) {
                //regex validação de email
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },
            isValidPassword(password) {
                //Regex valida password com os seguintes parametros: pelo menos 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo especial.
                const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return re.test(password);
            },
            async login() {
                // Validações
                if (!this.isValidEmail(this.loginEmail)) {
                    Swal.fire('Erro', 'Por favor insira um e-mail válido.', 'error');
                    return;
                }

                if (!this.isValidPassword(this.loginPassword)) {
                    Swal.fire('Erro', 'A palavra passe deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um símbolo.', 'error');
                    return;
                }

                try {
                    await axios.post('https://localhost:7216/api/account/login', {
                        email: this.loginEmail,
                        password: this.loginPassword,
                    });

                    authState.isLoggedIn = true;
                    localStorage.setItem('isLoggedIn', 'true');

                    Swal.fire('Sucesso', 'Login efectuado com sucesso!', 'success');
                    this.closeLoginModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de login. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            }
        }
    }
</script>

<style scoped>
    .modal-animation-enter-active,
    .modal-animation-leave-active {
        transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-enter-from,
    .modal-animation-leave-to {
        opacity: 0;
    }

    .modal-animation-inner-enter-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
    }

    .modal-animation-inner-leave-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-inner-enter-from {
        opacity: 0;
        transform: scale(0.8);
    }

    .modal-animation-inner-leave-to {
        transform: scale(0.8);
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
        .modal-inner

    {
        position: relative;
        max-width: 300px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        padding: 50px 10px 10px 10px;
        i

    {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
        &:hover

    {
        color: crimson;
    }

    }
    }
    }
</style>