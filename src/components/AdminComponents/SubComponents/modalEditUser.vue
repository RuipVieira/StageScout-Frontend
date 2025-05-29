<template>
    <transition name="modal-animation">
        <div v-show="editUserModalActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="editUserModalActive" class="modal-inner">
                    <i @click="closeEditUserModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Utilizador</h2>
                        <form @submit.prevent="edit">
                            <div class="form-control form-container text-center">
                                <label for="newUserEmail" class="form-label">E-mail</label>
                                <input v-model="internalEmail" type="email" id="selectedUserEmail" class="form-control" required />

                                <label for="selectedUserPassword" class="form-label">Palavra Passe</label>
                                <input v-model="selectedUserPassword" type="password" id="selectedUserPassword" class="form-control" required />
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeEditUserModal">Cancelar</button>
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

    export default {
        props: ['editUserModalActive', 'selectedUserEmail'],

        data() {
            return {
                internalEmail: '',
                selectedUserPassword: '',
            };
        },

        watch: {
            selectedUserEmail(newVal) {
                this.internalEmail = newVal;
            },

            editUserModalActive(newVal) {
                if (newVal) {
                    this.selectedUserPassword = '';
                }
            }
        },

        methods: {
            closeEditUserModal() {
                this.internalEmail = '';
                this.selectedUserPassword = '';
                this.$emit('closeEditUserModal');
            },

            isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },

            isValidPassword(password) {
                const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return re.test(password);
            },

            async edit() {
                if (!this.isValidEmail(this.internalEmail)) {
                    Swal.fire('Erro', 'Por favor insira um e-mail válido.', 'error');
                    return;
                }

                if (!this.isValidPassword(this.selectedUserPassword)) {
                    Swal.fire(
                        'Erro',
                        'A palavra passe deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um símbolo.',
                        'error'
                    );
                    return;
                }

                try {
                    await axios.post('https://localhost:7216/api/Admin/EditUser', {
                        OldEmail: this.selectedUserEmail,
                        Email: this.internalEmail,
                        Password: this.selectedUserPassword,
                    });

                    Swal.fire('Sucesso', 'Utilizador editado com sucesso!', 'success');
                    this.closeEditUserModal();
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro ao editar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            }
        }
    };
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