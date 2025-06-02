<template>
    <transition name="modal-animation">
        <div v-show="modalCreateUserActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalCreateUserActive" class="modal-inner">
                    <i @click="closeCreateUserModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Novo Utilizador</h2>
                        <form @submit.prevent="create">
                            <div class="form-control form-container text-center">
                                <label for="userEmail" class="form-label">Email</label>
                                <input type="text" v-model="userEmail" id="userEmail" class="form-control" required>

                                <label for="userPassword" class="form-label">Palavra Passe</label>
                                <input type="password" v-model="userPassword" id="userPassword" class="form-control" required>

                                <label for="userType" class="form-label">Tipo de Conta</label>
                                <select id="userType" v-model="userType" class="form-control">
                                    <option v-for="type in accountTypes" :key="type.id" :value="type.id">
                                        {{ type.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeCreateUserModal()">Cancelar</button>
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
        name: 'CreateUserModal',
        props: ['modalCreateUserActive'],
        data() {
            return {
                accountTypes: [],
                userEmail: '',
                userPassword: '',
                userType:''
            };
        },
        watch: {
            modalCreateUserActive(val) {
                if (val) {
                    this.GetUserTypes();
                }
            }
        },
        methods: {
            isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },
            isValidPassword(password) {
                const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return re.test(password);
            },
            async GetUserTypes() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllUserTypes');
                    this.accountTypes = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async create() {
                if (!this.isValidEmail(this.userEmail)) {
                    Swal.fire('Erro', 'Por favor insira um e-mail válido.', 'error');
                    return;
                }

                if (!this.isValidPassword(this.userPassword)) {
                    Swal.fire('Erro', 'A palavra passe deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um símbolo.', 'error');
                    return;
                }

                try {
                    await axios.post('https://localhost:7216/api/Admin/CreateUser', {
                        Email: this.userEmail,
                        Password: this.userPassword,
                        AccountTypeId: this.userType
                    });

                    Swal.fire('Sucesso', 'Utilizador criado com sucesso!', 'success');
                    this.closeCreateUserModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeCreateUserModal() {
                this.userEmail = '';
                this.userPassword = '';
                this.$emit('closeCreateUserModal');
            },
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
